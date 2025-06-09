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

type ClothingShape = {
    name: string;
    geometry: () => THREE.BufferGeometry;
    scale: number;
    position: [number, number, number];
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

    const [selectedSize, setSelectedSize] = useState<SizeOption>("M");
    const [currentClothingIndex, setCurrentClothingIndex] = useState<number>(0);
    const [isInteracting, setIsInteracting] = useState(false);
    const [avatarLoaded, setAvatarLoaded] = useState(false);
    const [loadingError, setLoadingError] = useState<string | null>(null);

    const avatarFilePath = `${BASE_URL}/api/files/Avatars/4l4p4ds375mxk23/body_j9fceguxjh.glb`;
    const shirtFilePath = `${BASE_URL}/api/files/Clothes/2a1ru54lv9j4hsv/tshirt_4ptutrgxxb.glb`;

    const sizeColors: Record<SizeOption, number> = {
        S: 0xff6b6b,
        M: 0x4ecdc4,
        L: 0x45b7d1,
        XL: 0x96ceb4
    };

    const sizeScales: Record<SizeOption, number> = {
        S: 0.8,
        M: 0.9,
        L: 0.95,
        XL: 1.0
    };

    // Clothing shapes positioned relative to avatar
    const clothingShapes: ClothingShape[] = [
        { 
            name: "T-Shirt GLB", 
            geometry: () => new THREE.BoxGeometry(0, 0, 0), // Placeholder, will be replaced by GLB
            scale: 1,
            position: [0, 0, 0]
        }
    ];

    // Load shirt GLB file
    const loadShirt = async () => {
        if (!sceneRef.current) return;

        const loader = new GLTFLoader();
        
        try {
            const gltf = await new Promise<any>((resolve, reject) => {
                loader.load(
                    shirtFilePath,
                    resolve,
                    undefined,
                    reject
                );
            });

            // Remove existing clothing if any
            if (clothingMeshRef.current) {
                sceneRef.current.remove(clothingMeshRef.current);
            }

            const shirt = gltf.scene;
            
            // Scale the shirt to match avatar
            shirt.scale.setScalar(2);
            
            // Position shirt on avatar (adjust as needed)
            shirt.position.set(0, -1.5, 0);
            
            // Apply size and color modifications
            shirt.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    // Apply size scaling
                    child.scale.setScalar(sizeScales[selectedSize]);
                    
                    // Apply color if the material supports it
                    if (child.material) {
                        // Create a new material with the selected color
                        const material = child.material.clone();
                        material.color = new THREE.Color(sizeColors[selectedSize]);
                        child.material = material;
                    }
                }
            });

            sceneRef.current.add(shirt);
            clothingMeshRef.current = shirt;

        } catch (error) {
            console.error('Error loading shirt:', error);
            // Fallback to basic geometry if GLB fails
            const fallbackGeometry = new THREE.BoxGeometry(1.8, 2.2, 0.8);
            const material = new THREE.MeshLambertMaterial({ 
                color: sizeColors[selectedSize],
                transparent: true,
                opacity: 0.8
            });
            const fallbackMesh = new THREE.Mesh(fallbackGeometry, material);
            fallbackMesh.castShadow = true;
            fallbackMesh.receiveShadow = true;
            fallbackMesh.position.set(0, 0.5, 0);
            fallbackMesh.scale.setScalar(sizeScales[selectedSize]);
            
            if (clothingMeshRef.current) {
                sceneRef.current.remove(clothingMeshRef.current);
            }
            sceneRef.current.add(fallbackMesh);
            clothingMeshRef.current = fallbackMesh;
        }
    };

    // Load avatar GLB file
    const loadAvatar = async () => {
        if (!sceneRef.current) return;

        const loader = new GLTFLoader();
        
        try {
            const gltf = await new Promise<any>((resolve, reject) => {
                loader.load(
                    avatarFilePath,
                    resolve,
                    undefined,
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
            // The floor is at y = -2, so we need to adjust for the avatar's bottom
            const avatarBottom = (center.y - size.y / 2) * 2; // multiply by scale
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
        
        // Configure OrbitControls for better mobile behavior
        controls.enableZoom = true;
        controls.enablePan = false;
        controls.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
        };
        
        controlsRef.current = controls;

        // Add event listeners to track interaction state
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

        // Add a fill light from the other side
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

        // Load avatar
        loadAvatar();

        // Load shirt GLB instead of creating basic geometry
        loadShirt();

        const animate = () => {
            animationIdRef.current = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

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

    // Update clothing color and size when size changes
    useEffect(() => {
        if (clothingMeshRef.current) {
            // For GLB models, traverse and update materials
            clothingMeshRef.current.traverse((child: any) => {
                if (child.isMesh && child.material) {
                    child.material.color = new THREE.Color(sizeColors[selectedSize]);
                    child.scale.setScalar(sizeScales[selectedSize]);
                }
            });
            
            // Also update the overall scale
            clothingMeshRef.current.scale.setScalar(sizeScales[selectedSize]);
        }
    }, [selectedSize]);

    // Update clothing shape when clothing index changes (simplified since we only have one shirt)
    useEffect(() => {
        // Since we only have one clothing item (the GLB shirt), we can reload it when needed
        if (currentClothingIndex === 0) {
            loadShirt();
        }
    }, [currentClothingIndex, selectedSize]);

    const handleSizeChange = (size: SizeOption) => {
        setSelectedSize(size);
    };

    const handlePreviousClothing = () => {
        setCurrentClothingIndex((prev) =>
            prev === 0 ? clothingShapes.length - 1 : prev - 1
        );
    };

    const handleNextClothing = () => {
        setCurrentClothingIndex((prev) =>
            prev === clothingShapes.length - 1 ? 0 : prev + 1
        );
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
                    style={{
                        touchAction: 'pan-y'
                    }}
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
                    
                    {/* Loading indicator */}
                    {!avatarLoaded && !loadingError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                                <p className="text-gray-600">Loading avatar...</p>
                            </div>
                        </div>
                    )}
                    
                    {/* Error message */}
                    {loadingError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                            <div className="text-center text-red-600">
                                <p>{loadingError}</p>
                                <button 
                                    onClick={loadAvatar}
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Instructions for mobile users */}
                <div className="mt-2 text-sm text-gray-600 text-center md:hidden">
                    Use one finger to rotate • Use two fingers to zoom
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Size</h3>
                    <div className="flex gap-3">
                        {(Object.keys(sizeColors) as SizeOption[]).map((size) => (
                            <button
                                key={size}
                                onClick={() => handleSizeChange(size)}
                                className={`
                                    px-4 py-2 rounded-lg border-2 font-medium transition-all
                                    ${selectedSize === size
                                        ? "bg-blue-500 text-white border-blue-500"
                                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                                    }
                                `}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Clothes</h3>
                    <div className="carousel w-full rounded-box">
                        {clothingShapes.map((shape, index) => (
                            <div
                                key={index}
                                className="carousel-item w-40 flex justify-center"
                            >
                                <div
                                    className={`w-32 h-32 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer
                        ${index === currentClothingIndex
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-300 bg-white hover:border-gray-400'
                                        }`}
                                    onClick={() => setCurrentClothingIndex(index)}
                                >
                                    <span className="text-sm font-medium text-gray-700">{shape.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center gap-4 mt-4">
                        <button
                            onClick={handlePreviousClothing}
                            className="btn btn-circle bg-gray-200 hover:bg-gray-300"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={handleNextClothing}
                            className="btn btn-circle bg-gray-200 hover:bg-gray-300"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Status info */}
                <div className="mt-4 text-sm text-gray-500 text-center">
                    {avatarLoaded ? (
                        <>Avatar loaded • T-Shirt GLB (Size {selectedSize})</>
                    ) : loadingError ? (
                        "Avatar failed to load"
                    ) : (
                        "Loading avatar model..."
                    )}
                </div>
            </div>
        </Page>
    );
};

export default FittingRoomPage;