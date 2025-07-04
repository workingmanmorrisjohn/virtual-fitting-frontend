// components/CropperModal.tsx
import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { Dialog } from '@headlessui/react';
import { getCroppedImg } from '../../utils/cropImage';

interface CropperModalProps {
  imageSrc: string;
  onCancel: () => void;
  onCropComplete: (croppedFile: File, previewUrl: string) => void;
}

const CropperModal: React.FC<CropperModalProps> = ({ imageSrc, onCancel, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropCompleteInternal = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    const { file, previewUrl } = await getCroppedImg(imageSrc, croppedAreaPixels, 'cropped.jpg', 370, 760);
    onCropComplete(file, previewUrl);
  };

  return (
    <Dialog open={true} onClose={onCancel} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" />
      <div className="relative w-full max-w-md bg-white rounded-lg p-4 z-50">
        <div className="w-full h-96 relative">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={370 / 760}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteInternal}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleDone} className="px-4 py-2 bg-blue-600 text-white rounded">Crop</button>
        </div>
      </div>
    </Dialog>
  );
};

export default CropperModal;
