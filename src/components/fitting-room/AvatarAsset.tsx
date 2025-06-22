import { useGLTF } from '@react-three/drei';
import { Mesh } from 'three';

interface AvatarAssetProps {
  modelPath: string
}

const AvatarAsset = ({ modelPath }: AvatarAssetProps) => {
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

export default AvatarAsset;