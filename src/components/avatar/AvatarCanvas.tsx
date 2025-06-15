import React, { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import AvatarObject from './AvatarObject'

interface AvatarCanvasProps {
  modelPath: string
}

const AvatarCanvas: React.FC<AvatarCanvasProps> = ({ modelPath }) => {

  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <Canvas
        shadows
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        camera={{ position: [0, 0.5, 3], fov: 35 }}
        style={{ width: '100%', height: '500px' }}
      >
        <Suspense fallback={<Html center><div>Loading model...</div></Html>}>
          {/* Ambient light for general illumination */}
          <ambientLight intensity={0.5} />
          {/* Main directional light with shadows */}
          <directionalLight
            castShadow
            intensity={1}
            position={[5, 5, 5]}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          {/* Back lighting for rim lighting effect */}
          <directionalLight
            intensity={0.8}
            position={[-3, 2, -5]}
            color="#ffffff"
          />
          {/* Additional soft back light */}
          <pointLight
            intensity={0.6}
            position={[0, 3, -4]}
            color="#ffeedd"
          />
          {/* Simple gradient background */}
          <color attach="background" args={['#f0f0f0']} />
          {/* OrbitControls with damping and zoom limits */}
          <OrbitControls
            enableDamping
            dampingFactor={0.1}
            minDistance={1.5}
            maxDistance={6}
            target={[0, 0.5, 0]}
            autoRotate
            autoRotateSpeed={0.75}
          />

          <AvatarObject modelPath={modelPath} />

        </Suspense>
      </Canvas>

    </>

  )
}

export default AvatarCanvas