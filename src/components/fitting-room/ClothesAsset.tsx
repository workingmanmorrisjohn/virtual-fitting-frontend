import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import * as THREE from 'three';

interface ClothesAssetProps {
  modelPath: string;
}

const ClothesAsset = ({ modelPath }: ClothesAssetProps) => {
  const gltf = useGLTF(modelPath);
  useGLTF.preload(modelPath);

  useEffect(() => {
    console.log('Clothes GLTF nodes:', gltf.nodes);
    
    // Enhance materials for better lighting response
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Enable shadows
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Enhance material properties for better gradient lighting
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              if (mat instanceof THREE.MeshStandardMaterial) {
                // Increase roughness slightly for softer reflections
                mat.roughness = Math.max(mat.roughness, 0.4);
                // Reduce metalness for more diffuse lighting
                mat.metalness = Math.min(mat.metalness, 0.1);
                // Enable color space correction
                if (mat.map) {
                  mat.map.colorSpace = THREE.SRGBColorSpace;
                }
              }
            });
          } else if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.roughness = Math.max(child.material.roughness, 0.4);
            child.material.metalness = Math.min(child.material.metalness, 0.1);
            if (child.material.map) {
              child.material.map.colorSpace = THREE.SRGBColorSpace;
            }
          }
        }
      }
    });
  }, [gltf]);

  return (
    <group dispose={null}>
      <primitive object={gltf.scene} />
    </group>
  );
};

export default ClothesAsset;