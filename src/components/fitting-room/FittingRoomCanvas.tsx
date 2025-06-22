import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import AvatarAsset from './AvatarAsset'
import { useFittingRoom } from '../../context/FittingRoomContext'
import ClothesAsset from './ClothesAsset'
import { BASE_URL } from '../../constants/BaseUrl'

interface FittingRoomCanvasProps {
    modelPath: string
}

const FittingRoomCanvas: React.FC<FittingRoomCanvasProps> = ({ modelPath }) => {
    const {selectedClothesBottom, selectedClothesTop} = useFittingRoom();

    return (
        <>
            <Canvas
                shadows
                gl={{
                    toneMapping: THREE.ACESFilmicToneMapping,
                    outputColorSpace: THREE.SRGBColorSpace,
                    antialias: true,
                }}
                camera={{ position: [2, 0.5, 3], fov: 35 }}
                style={{ width: '100%', height: '500px' }}
            >
                <Suspense fallback={<Html center><div className="text-gray-600">Loading model...</div></Html>}>

                    
                    {/* Key Light - Main illumination with warm tone */}
                    <directionalLight
                        castShadow
                        intensity={2.5}
                        position={[3, 3, 5]}
                        color="#fff5e6"
                        shadow-mapSize-width={2048}
                        shadow-mapSize-height={2048}
                        shadow-camera-far={50}
                        shadow-camera-left={-10}
                        shadow-camera-right={10}
                        shadow-camera-top={10}
                        shadow-camera-bottom={-10}
                    />
                    
                    {/* Fill Light - Soft purple/pink from left */}
                    <directionalLight
                        intensity={1.8}
                        position={[-4, 1, 3]}
                        color="#e8d5ff"
                    />
                    
                    {/* Rim Light - Purple/blue from behind */}
                    <directionalLight
                        intensity={2.0}
                        position={[-2, 0, -4]}
                        color="#c8b5ff"
                    />
                    
                    {/* Ambient Light - Very soft overall illumination */}
                    <ambientLight intensity={0.7} color="#ffddb7" />
                    
                    {/* Point lights for additional color gradients */}
                    <pointLight
                        intensity={1.2}
                        position={[2, 2, 2]}
                        color="#ffd9b3"
                        distance={8}
                        decay={2}
                    />
                    
                    <pointLight
                        intensity={1.0}
                        position={[-3, 1, 1]}
                        color="#d9b3ff"
                        distance={6}
                        decay={2}
                    />
                    
                    {/* Soft top light for additional volume */}
                    <pointLight
                        intensity={0.8}
                        position={[0, 4, 0]}
                        color="#ffffff"
                        distance={10}
                        decay={1.5}
                    />
                    
                    {/* OrbitControls with smooth interaction - target centered on model */}
                    <OrbitControls
                        enableDamping
                        dampingFactor={0.05}
                        minDistance={1.5}
                        maxDistance={6}
                        target={[0, 0, 0]}
                        autoRotate
                        autoRotateSpeed={0.5}
                        enablePan={false}
                        maxPolarAngle={Math.PI * 0.75}
                        minPolarAngle={Math.PI * 0.25}
                    />

                    {/* Model container group for Blender coordinate system */}
                    <group rotation={[0, 0, 0]} position={[0, 0, 0]}>
                        <AvatarAsset modelPath={modelPath} />
                        {selectedClothesBottom && (
                            <ClothesAsset 
                                modelPath={`${BASE_URL}/api/files/${selectedClothesBottom.collectionId}/${selectedClothesBottom.id}/${selectedClothesBottom.model_glb}`} 
                            />
                        )}
                        {selectedClothesTop && (
                            <ClothesAsset 
                                modelPath={`${BASE_URL}/api/files/${selectedClothesTop.collectionId}/${selectedClothesTop.id}/${selectedClothesTop.model_glb}`} 
                            />
                        )}
                    </group>

                </Suspense>
            </Canvas>
        </>
    )
}

export default FittingRoomCanvas;