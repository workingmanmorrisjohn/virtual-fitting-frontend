import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import { Mesh } from 'three';

interface AvatarAssetProps {
  modelPath: string
}

const AvatarAsset = ({ modelPath }: AvatarAssetProps) => {
  const { nodes, materials } = useGLTF(modelPath);
  useGLTF.preload(modelPath);

  const mesh = nodes.mesh as Mesh;

  useEffect(() => {
    console.log("The nodes:", nodes)

    const leftShoulder = nodes.mixamorigLeftShoulder
    if (leftShoulder) {
      // Rotate slightly on X-axis
      leftShoulder.rotation.x = 0.3
      console.log('Rotated mixamorigLeftShoulder')
    } else {
      console.warn('mixamorigLeftShoulder not found')
    }
  }, [nodes]);



  return (
    <group dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={1.415}>
          <skinnedMesh
            name="mesh"
            geometry={mesh.geometry}
            material={mesh.material}
            skeleton={mesh.skeleton}
          />
          <primitive object={nodes.mixamorigHips} />
        </group>
      </group>
    </group>
  )
}

export default AvatarAsset;