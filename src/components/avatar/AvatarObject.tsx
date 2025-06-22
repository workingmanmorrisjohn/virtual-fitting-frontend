import { useGLTF } from '@react-three/drei';
import { Mesh } from 'three';

interface AvatarObjectProps {
  modelPath: string
}

const AvatarObject = ({ modelPath }: AvatarObjectProps) => {
  const { nodes } = useGLTF(modelPath)
  useGLTF.preload(modelPath);

  return (
    <group>
      {Object.entries(nodes).map(([key, node]) => {
        if (node instanceof Mesh) {
          return <primitive key={key} object={node} />;
        }
        return null;
      })}
    </group>
  );
}

export default AvatarObject;