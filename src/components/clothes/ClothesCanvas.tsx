import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

interface ClothesCanvasProps {
    modelPath: string
}

const ClothesCanvas = ({ modelPath }: ClothesCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationIdRef = useRef<number | null>(null);
    const clothingMeshRef = useRef<THREE.Mesh | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);

    const [isInteracting, setIsInteracting] = useState(false);
    const [modelLoaded, setModelLoaded] = useState(false);
    const [loadingError, setLoadingError] = useState<string | null>(null);

    const loadModel = async () => {
        if (!sceneRef.current) return;

        const loader = new GLTFLoader();

        try {
            const gltf = await new Promise<any>((resolve, reject) => {
                loader.load(
                    modelPath,
                    resolve,
                    undefined,
                    reject
                );
            });

            // Remove existing model if any
            if (clothingMeshRef.current) {
                sceneRef.current.remove(clothingMeshRef.current);
            }

            const model = gltf.scene;

            // Calculate bounding box to center and scale the model appropriately
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            // Scale the model to fit nicely in view
            const maxDimension = Math.max(size.x, size.y, size.z);
            const scaleFactor = 2 / maxDimension;
            model.scale.setScalar(scaleFactor);

            // Center the model
            model.position.sub(center.multiplyScalar(scaleFactor));

            // Enable shadows for the model
            model.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            sceneRef.current.add(model);
            clothingMeshRef.current = model;
            setModelLoaded(true);
            setLoadingError(null);

        } catch (error) {
            console.error('Error loading 3D model:', error);
            setLoadingError('Failed to load 3D model');
            setModelLoaded(false);

            // Create a fallback geometry
            const fallbackGeometry = new THREE.BoxGeometry(1, 1.2, 0.3);
            const material = new THREE.MeshLambertMaterial({
                color: 0x4ecdc4,
                transparent: true,
                opacity: 0.8
            });
            const fallbackMesh = new THREE.Mesh(fallbackGeometry, material);
            fallbackMesh.castShadow = true;
            fallbackMesh.receiveShadow = true;

            if (clothingMeshRef.current) {
                sceneRef.current.remove(clothingMeshRef.current);
            }
            sceneRef.current.add(fallbackMesh);
            clothingMeshRef.current = fallbackMesh;
            setModelLoaded(true);
        }
    };

    useEffect(() => {
        if (!canvasRef.current) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf8f9fa);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(
            50,
            400 / 300, // Fixed aspect ratio for the canvas
            0.1,
            1000
        );
        camera.position.set(2, 1, 3);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true
        });
        renderer.setSize(400, 300);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.target.set(0, 0, 0);
        controls.enableZoom = true;
        controls.enablePan = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.0;

        // Configure OrbitControls for better interaction
        controls.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
        };

        controlsRef.current = controls;

        // Add event listeners to track interaction state
        const onInteractionStart = () => {
            setIsInteracting(true);
            controls.autoRotate = false;
            if (canvasContainerRef.current) {
                canvasContainerRef.current.style.touchAction = 'none';
            }
        };

        const onInteractionEnd = () => {
            setIsInteracting(false);
            // Resume auto-rotation after a delay
            setTimeout(() => {
                if (controlsRef.current) {
                    controlsRef.current.autoRotate = true;
                }
            }, 2000);
            if (canvasContainerRef.current) {
                canvasContainerRef.current.style.touchAction = 'pan-y';
            }
        };

        controls.addEventListener('start', onInteractionStart);
        controls.addEventListener('end', onInteractionEnd);

        // Lighting setup
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(3, 5, 3);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 20;
        directionalLight.shadow.camera.left = -5;
        directionalLight.shadow.camera.right = 5;
        directionalLight.shadow.camera.top = 5;
        directionalLight.shadow.camera.bottom = -5;
        scene.add(directionalLight);

        // Add a fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-3, 3, 3);
        scene.add(fillLight);

        // Subtle ground plane for shadows
        const groundGeometry = new THREE.PlaneGeometry(10, 10);
        const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1;
        ground.receiveShadow = true;
        scene.add(ground);

        // Load the 3D model
        loadModel();

        const animate = () => {
            animationIdRef.current = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            controls.removeEventListener('start', onInteractionStart);
            controls.removeEventListener('end', onInteractionEnd);
            if (animationIdRef.current !== null) {
                cancelAnimationFrame(animationIdRef.current);
            }
            renderer.dispose();
            controls.dispose();
        };
    }, []);


    return (
        <>
            <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">3D Model</h2>
                <div
                    ref={canvasContainerRef}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg overflow-hidden relative flex justify-center"
                    style={{
                        touchAction: 'pan-y'
                    }}
                >
                    <canvas
                        ref={canvasRef}
                        className="block"
                        width={400}
                        height={300}
                        style={{
                            touchAction: 'none',
                            cursor: isInteracting ? 'grabbing' : 'grab'
                        }}
                    />

                    {/* Loading indicator */}
                    {!modelLoaded && !loadingError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                                <p className="text-gray-600 text-sm">Loading 3D model...</p>
                            </div>
                        </div>
                    )}

                    {/* Error message */}
                    {loadingError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75">
                            <div className="text-center text-red-600">
                                <p className="text-sm">{loadingError}</p>
                                <button
                                    onClick={loadModel}
                                    className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div className="mt-2 text-xs text-gray-500 text-center">
                    Click and drag to rotate • Scroll to zoom • Auto-rotates when idle
                </div>
            </div>
        </>
    )
}

export default ClothesCanvas;