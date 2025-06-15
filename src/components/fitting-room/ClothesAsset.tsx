import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';

interface ClothesAssetProps {
  modelPath: string;
}

const ClothesAsset = ({ modelPath }: ClothesAssetProps) => {
  const gltf = useGLTF(modelPath);
  useGLTF.preload(modelPath);

  useEffect(() => {
    console.log('Clothes GLTF nodes:', gltf.nodes);
  }, [gltf]);

  return (
    <group dispose={null}>
      {Object.entries(gltf.nodes).map(([key, node]) => {
        if ((node as any).isMesh) {
          const mesh = node as any;
          return (
            <mesh
              key={key}
              geometry={mesh.geometry}
              material={mesh.material}
              castShadow
              receiveShadow
              position={mesh.position}
              rotation={mesh.rotation}
              scale={mesh.scale}
            />
          );
        }
        return null;
      })}
    </group>
  );
};

export default ClothesAsset;
