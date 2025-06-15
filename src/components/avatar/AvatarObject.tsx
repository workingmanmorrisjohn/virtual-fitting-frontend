import { useGLTF } from '@react-three/drei';
import { Mesh } from 'three';

interface AvatarObjectProps {
  modelPath: string
}

const AvatarObject = ({modelPath} : AvatarObjectProps) => {
    const { nodes, materials } = useGLTF(modelPath);
    useGLTF.preload(modelPath);

    const mesh = nodes.mesh as Mesh;

    return (
        <group dispose={null}>
          <mesh
            castShadow
            receiveShadow
            geometry={mesh.geometry}
            material={materials.mat0}
            rotation={[Math.PI / 2, 0, 0]}
          />
        </group>
    )
}

export default AvatarObject;