import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "../components/core/Header";
import Page from "../components/core/Page";
import Spacer from "../components/core/Spacer";
import { useNavigate } from "react-router";
import { RoutePath } from "../enums/RoutePath";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { BASE_URL } from "../constants/BaseUrl";

type SizeOption = "S" | "M" | "L" | "XL";

type ClothingItem = {
    id: string;
    name: string;
    filePath: string;
    thumbnail?: string;
    scale: number;
    position: [number, number, number];
};

type ClothingSize = {
    size: SizeOption;
    scale: number;
    color: number;
    filePath?: string; // For when sizes have different files
};

const FittingRoomPage: React.FC = () => {
    const navigate = useNavigate();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationIdRef = useRef<number | null>(null);
    const clothingMeshRef = useRef<THREE.Mesh | null>(null);
    const avatarMeshRef = useRef<THREE.Group | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const gltfLoaderRef = useRef<GLTFLoader>(new GLTFLoader());

    const [selectedSize, setSelectedSize] = useState<SizeOption>("M");
    const [currentClothingIndex, setCurrentClothingIndex] = useState<number>(0);
    const [isInteracting, setIsInteracting] = useState(false);
    const [avatarLoaded, setAvatarLoaded] = useState(false);
    const [clothingLoaded, setClothingLoaded] = useState(false);
    const [loadingError, setLoadingError] = useState<string | null>(null);
    const [isLoadingClothing, setIsLoadingClothing] = useState(false);

    const avatarFilePath = `${BASE_URL}/api/files/Avatars/4l4p4ds375mxk23/body_j9fceguxjh.glb`;

    // Define clothing items
    const clothingItems: ClothingItem[] = [
        {
            id: "tshirt_basic",
            name: "Basic T-Shirt",
            filePath: `${BASE_URL}/api/files/Clothes/2a1ru54lv9j4hsv/tshirt_4ptutrgxxb.glb`,
            scale: 2,
            position: [0, -1.5, 0]
        },
        {
            id: "denim_jacket",
            name: "Denim Jacket",
            filePath: `${BASE_URL}/api/files/Clothes/0eh6554rim3kl6q/denim_jacket_sleeveless_with_white_t_shirt_p21po5ioay.glb`,
            scale: 2,
            position: [0, -1.5, 0]
        },
        {
            id: "hyde_jacket",
            name: "Hyde Jacket",
            filePath: `${BASE_URL}/api/files/Clothes/877g8yxn46zismd/hyde_jacket_wadpak4azb.glb`,
            scale: 2,
            position: [0, -1.5, 0]
        }
    ];

    // Define size configurations
    const sizeConfigurations: Record<SizeOption, ClothingSize> = {
        S: { size: "S", scale: 0.8, color: 0xff6b6b },
        M: { size: "M", scale: 0.9, color: 0x4ecdc4 },
        L: { size: "L", scale: 0.95, color: 0x45b7d1 },
        XL: { size: "XL", scale: 1.0, color: 0x96ceb4 }
    };

    // Get current clothing item
    const currentClothingItem = clothingItems[currentClothingIndex];
    const currentSizeConfig = sizeConfigurations[selectedSize];

    // Load clothing GLB file
    const loadClothing = async (clothingItem: ClothingItem, sizeConfig: ClothingSize) => {
        if (!sceneRef.current) return;

        setIsLoadingClothing(true);
        setClothingLoaded(false);

        try {
            // Determine which file to load (size-specific or default)
            const fileToLoad = sizeConfig.filePath || clothingItem.filePath;

            const gltf = await new Promise<any>((resolve, reject) => {
                gltfLoaderRef.current.load(
                    fileToLoad,
                    resolve,
                    (progress) => {
                        // Optional: Handle loading progress
                        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
                    },
                    reject
                );
            });

            // Remove existing clothing if any
            if (clothingMeshRef.current) {
                sceneRef.current.remove(clothingMeshRef.current);
                clothingMeshRef.current = null;
            }

            const clothing = gltf.scene.clone();
            
            // Apply base scale from clothing item
            clothing.scale.setScalar(clothingItem.scale);
            
            // Apply position from clothing item
            clothing.position.set(...clothingItem.position);
            
            // Configure clothing materials and apply size/color
            clothing.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    // Apply size scaling to individual mesh
                    const sizeScale = sizeConfig.scale;
                    child.scale.setScalar(sizeScale);
                    
                    // Apply color if the material supports it
                    if (child.material) {
                        // Clone material to avoid affecting other instances
                        const material = child.material.clone();
                        
                        // Apply color based on size
                        if (material.color) {
                            material.color = new THREE.Color(sizeConfig.color);
                        }
                        
                        // Ensure material properties for better rendering
                        if (material.map) {
                            // If there's a texture, blend it with the size color
                            material.color = new THREE.Color(sizeConfig.color);
                        }
                        
                        child.material = material;
                    }
                }
            });

            sceneRef.current.add(clothing);
            clothingMeshRef.current = clothing;
            setClothingLoaded(true);
            setLoadingError(null);

        } catch (error) {
            console.error('Error loading clothing:', error);
            setLoadingError(`Failed to load ${clothingItem.name}`);
            
            // Create fallback geometry
            createFallbackClothing(clothingItem, sizeConfig);
        } finally {
            setIsLoadingClothing(false);
        }
    };

    // Create fallback clothing when GLB fails to load
    const createFallbackClothing = (clothingItem: ClothingItem, sizeConfig: ClothingSize) => {
        if (!sceneRef.current) return;

        const fallbackGeometry = new THREE.BoxGeometry(1.8, 2.2, 0.8);
        const material = new THREE.MeshLambertMaterial({ 
            color: sizeConfig.color,
            transparent: true,
            opacity: 0.8
        });
        
        const fallbackMesh = new THREE.Mesh(fallbackGeometry, material);
        fallbackMesh.castShadow = true;
        fallbackMesh.receiveShadow = true;
        fallbackMesh.position.set(...clothingItem.position);
        fallbackMesh.scale.setScalar(clothingItem.scale * sizeConfig.scale);
        
        if (clothingMeshRef.current) {
            sceneRef.current.remove(clothingMeshRef.current);
        }
        
        sceneRef.current.add(fallbackMesh);
        clothingMeshRef.current = fallbackMesh;
        setClothingLoaded(true);
    };

    // Load avatar GLB file
    const loadAvatar = async () => {
        if (!sceneRef.current) return;

        try {
            const gltf = await new Promise<any>((resolve, reject) => {
                gltfLoaderRef.current.load(
                    avatarFilePath,
                    resolve,
                    (progress) => {
                        console.log('Avatar loading progress:', (progress.loaded / progress.total * 100) + '%');
                    },
                    reject
                );
            });

            // Remove existing avatar if any
            if (avatarMeshRef.current) {
                sceneRef.current.remove(avatarMeshRef.current);
            }

            const avatar = gltf.scene;
            
            // Calculate bounding box to position avatar correctly on floor
            const box = new THREE.Box3().setFromObject(avatar);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            
            // Scale the avatar
            avatar.scale.setScalar(2);
            
            // Position avatar so its bottom touches the floor
            const avatarBottom = (center.y - size.y / 2) * 2;
            avatar.position.set(0, -2 - avatarBottom, 0);
            
            // Enable shadows for avatar
            avatar.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            sceneRef.current.add(avatar);
            avatarMeshRef.current = avatar;
            setAvatarLoaded(true);
            setLoadingError(null);

        } catch (error) {
            console.error('Error loading avatar:', error);
            setLoadingError('Failed to load avatar model');
            setAvatarLoaded(false);
        }
    };

    // Initialize Three.js scene
    useEffect(() => {
        if (!canvasRef.current) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / (window.innerHeight * 0.6),
            0.1,
            1000
        );
        camera.position.set(0, 2, 6);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight * 0.6);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.target.set(0, 0, 0);
        controls.enableZoom = true;
        controls.enablePan = false;
        controls.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
        };
        controlsRef.current = controls;

        // Interaction tracking
        const onInteractionStart = () => {
            setIsInteracting(true);
            if (canvasContainerRef.current) {
                canvasContainerRef.current.style.touchAction = 'none';
            }
        };

        const onInteractionEnd = () => {
            setIsInteracting(false);
            if (canvasContainerRef.current) {
                canvasContainerRef.current.style.touchAction = 'pan-y';
            }
        };

        controls.addEventListener('start', onInteractionStart);
        controls.addEventListener('end', onInteractionEnd);

        // Lighting setup
        const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        scene.add(directionalLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
        fillLight.position.set(-5, 5, 5);
        scene.add(fillLight);

        // Floor
        const floorGeometry = new THREE.PlaneGeometry(20, 20);
        const floorMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -2;
        floor.receiveShadow = true;
        scene.add(floor);

        // Load initial content
        loadAvatar();

        // Animation loop
        const animate = () => {
            animationIdRef.current = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Resize handler
        const handleResize = () => {
            if (!canvasRef.current || !renderer) return;
            const width = window.innerWidth;
            const height = window.innerHeight * 0.6;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            controls.removeEventListener('start', onInteractionStart);
            controls.removeEventListener('end', onInteractionEnd);
            if (animationIdRef.current !== null) {
                cancelAnimationFrame(animationIdRef.current);
            }
            renderer.dispose();
            controls.dispose();
        };
    }, []);

    // Load clothing when avatar is ready
    useEffect(() => {
        if (avatarLoaded && currentClothingItem) {
            loadClothing(currentClothingItem, currentSizeConfig);
        }
    }, [avatarLoaded, currentClothingIndex, selectedSize]);

    // Event handlers
    const handleSizeChange = (size: SizeOption) => {
        setSelectedSize(size);
    };

    const handlePreviousClothing = () => {
        setCurrentClothingIndex((prev) =>
            prev === 0 ? clothingItems.length - 1 : prev - 1
        );
    };

    const handleNextClothing = () => {
        setCurrentClothingIndex((prev) =>
            prev === clothingItems.length - 1 ? 0 : prev + 1
        );
    };

    const handleClothingSelect = (index: number) => {
        setCurrentClothingIndex(index);
    };

    const handleRetryLoad = () => {
        if (!avatarLoaded) {
            loadAvatar();
        } else if (currentClothingItem) {
            loadClothing(currentClothingItem, currentSizeConfig);
        }
    };

    return (
        <Page>
            <Header>
                <ArrowLeft
                    className="absolute left-8 cursor-pointer hover:text-gray-600 transition-colors"
                    onClick={() => navigate(RoutePath.HOME)}
                />
                <h1 className="text-xl font-semibold">Fitting Room</h1>
            </Header>
            <Spacer />

            <div className="flex-1 flex flex-col">
                <div 
                    ref={canvasContainerRef}
                    className="w-full bg-gray-100 border-2 border-gray-300 rounded-lg overflow-hidden relative"
                    style={{ touchAction: 'pan-y' }}
                >
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full block"
                        style={{
                            minHeight: "60vh",
                            touchAction: 'none',
                            cursor: isInteracting ? 'grabbing' : 'grab'
                        }}
                    />
                    
                    {/* Loading indicators */}
                    {(!avatarLoaded || isLoadingClothing) && !loadingError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                                <p className="text-gray-600">
                                    {!avatarLoaded ? 'Loading avatar...' : 'Loading clothing...'}
                                </p>
                            </div>
                        </div>
                    )}
                    
                    {/* Error message */}
                    {loadingError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                            <div className="text-center text-red-600">
                                <p>{loadingError}</p>
                                <button 
                                    onClick={handleRetryLoad}
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile instructions */}
                <div className="mt-2 text-sm text-gray-600 text-center md:hidden">
                    Use one finger to rotate • Use two fingers to zoom
                </div>

                {/* Size selection */}
                <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Size</h3>
                    <div className="flex gap-3">
                        {Object.keys(sizeConfigurations).map((size) => (
                            <button
                                key={size}
                                onClick={() => handleSizeChange(size as SizeOption)}
                                disabled={isLoadingClothing}
                                className={`
                                    px-4 py-2 rounded-lg border-2 font-medium transition-all
                                    ${selectedSize === size
                                        ? "bg-blue-500 text-white border-blue-500"
                                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                                    }
                                    ${isLoadingClothing ? "opacity-50 cursor-not-allowed" : ""}
                                `}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Clothing selection */}
                <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Clothes</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {clothingItems.map((item, index) => (
                            <div
                                key={item.id}
                                className={`
                                    min-w-32 h-32 rounded-lg border-2 flex items-center justify-center 
                                    transition-all cursor-pointer flex-shrink-0
                                    ${index === currentClothingIndex
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-300 bg-white hover:border-gray-400'
                                    }
                                    ${isLoadingClothing ? "opacity-50 cursor-not-allowed" : ""}
                                `}
                                onClick={() => !isLoadingClothing && handleClothingSelect(index)}
                            >
                                <div className="text-center p-2">
                                    <span className="text-sm font-medium text-gray-700 block">
                                        {item.name}
                                    </span>
                                    {index === currentClothingIndex && isLoadingClothing && (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto mt-1"></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center gap-4 mt-4">
                        <button
                            onClick={handlePreviousClothing}
                            disabled={isLoadingClothing}
                            className="btn btn-circle bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={handleNextClothing}
                            disabled={isLoadingClothing}
                            className="btn btn-circle bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Status info */}
                <div className="mt-4 text-sm text-gray-500 text-center">
                    {avatarLoaded && clothingLoaded ? (
                        <>{currentClothingItem.name} • Size {selectedSize}</>
                    ) : loadingError ? (
                        "Failed to load content"
                    ) : (
                        "Loading..."
                    )}
                </div>
            </div>
        </Page>
    );
};

export default FittingRoomPage;