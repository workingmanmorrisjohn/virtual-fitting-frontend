import { User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

interface AvatarCanvasProps {
    modelPath: string | null;
}

const AvatarCanvas: React.FC<AvatarCanvasProps> = ({ modelPath }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationIdRef = useRef<number | null>(null);
    const avatarMeshRef = useRef<THREE.Group | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);

    const [isInteracting, setIsInteracting] = useState(false);
    const [avatarLoaded, setAvatarLoaded] = useState(false);
    const [loadingError, setLoadingError] = useState<string | null>(null);

    if (!modelPath) return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-300">
            <div className="flex items-center gap-3 mb-6">
                <User className="text-gray-700" size={20} />
                <h2 className="text-lg font-semibold text-gray-800">3D Avatar</h2>
            </div>
            <p>Avatar not available</p>
        </div>
    );


    // Load avatar GLB file
    const loadAvatar = async () => {
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

            // Remove existing avatar if any
            if (avatarMeshRef.current) {
                sceneRef.current.remove(avatarMeshRef.current);
            }

            const avatar = gltf.scene;

            // Calculate bounding box to position avatar correctly
            const box = new THREE.Box3().setFromObject(avatar);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            // Scale the avatar appropriately for the viewer
            const maxDimension = Math.max(size.x, size.y, size.z);
            const scaleFactor = 3 / maxDimension;
            avatar.scale.setScalar(scaleFactor);

            // Center the avatar and position it on the ground
            const scaledCenter = center.multiplyScalar(scaleFactor);
            const scaledSize = size.multiplyScalar(scaleFactor);
            avatar.position.set(0, -scaledCenter.y + scaledSize.y / 2 - 1.5, 0);

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

            // Create a fallback representation
            const fallbackGeometry = new THREE.CapsuleGeometry(0.4, 1.6, 4, 8);
            const material = new THREE.MeshLambertMaterial({
                color: 0x8B9DC3,
                transparent: true,
                opacity: 0.8
            });
            const fallbackMesh = new THREE.Mesh(fallbackGeometry, material);
            fallbackMesh.castShadow = true;
            fallbackMesh.receiveShadow = true;
            fallbackMesh.position.set(0, 0, 0);

            if (avatarMeshRef.current) {
                sceneRef.current.remove(avatarMeshRef.current);
            }
            sceneRef.current.add(fallbackMesh);
            avatarMeshRef.current = fallbackMesh as any;
            setAvatarLoaded(true);
        }
    };

    useEffect(() => {
        if (!canvasRef.current) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf8f9fa);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(
            50,
            400 / 400, // Square aspect ratio
            0.1,
            1000
        );
        camera.position.set(2, 2, 4);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true
        });
        renderer.setSize(400, 400);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.target.set(0, 0.5, 0);
        controls.enableZoom = true;
        controls.enablePan = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.8;

        // Limit vertical rotation to keep avatar in view
        controls.minPolarAngle = Math.PI / 6;
        controls.maxPolarAngle = Math.PI - Math.PI / 6;

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
            }, 3000);
            if (canvasContainerRef.current) {
                canvasContainerRef.current.style.touchAction = 'pan-y';
            }
        };

        controls.addEventListener('start', onInteractionStart);
        controls.addEventListener('end', onInteractionEnd);

        // Lighting setup optimized for avatar viewing
        const ambientLight = new THREE.AmbientLight(0x404040, 0.7);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(3, 8, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 30;
        directionalLight.shadow.camera.left = -8;
        directionalLight.shadow.camera.right = 8;
        directionalLight.shadow.camera.top = 8;
        directionalLight.shadow.camera.bottom = -8;
        scene.add(directionalLight);

        // Add fill lights for better avatar illumination
        const fillLight1 = new THREE.DirectionalLight(0xffffff, 0.4);
        fillLight1.position.set(-3, 5, 3);
        scene.add(fillLight1);

        const fillLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight2.position.set(0, 3, -5);
        scene.add(fillLight2);

        // Ground plane with subtle shadow
        const groundGeometry = new THREE.PlaneGeometry(15, 15);
        const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.15 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1.5;
        ground.receiveShadow = true;
        scene.add(ground);

        // Load the avatar
        loadAvatar();

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
            {/* 3D Avatar Viewer */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-300">
                <div className="flex items-center gap-3 mb-6">
                    <User className="text-gray-700" size={20} />
                    <h2 className="text-lg font-semibold text-gray-800">3D Avatar</h2>
                </div>
                <div
                    ref={canvasContainerRef}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl overflow-hidden relative flex justify-center"
                    style={{
                        touchAction: 'pan-y'
                    }}
                >
                    <canvas
                        ref={canvasRef}
                        className="block"
                        width={400}
                        height={400}
                        style={{
                            touchAction: 'none',
                            cursor: isInteracting ? 'grabbing' : 'grab'
                        }}
                    />

                    {/* Loading indicator */}
                    {!avatarLoaded && !loadingError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                                <p className="text-gray-600">Loading avatar...</p>
                            </div>
                        </div>
                    )}

                    {/* Error message */}
                    {loadingError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75">
                            <div className="text-center text-red-600">
                                <p className="text-sm">{loadingError}</p>
                                <button
                                    onClick={loadAvatar}
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div className="mt-3 text-xs text-gray-500 text-center">
                    Click and drag to rotate • Scroll to zoom • Auto-rotates when idle
                </div>
            </div>
        </>
    )


}

export default AvatarCanvas;