// components/utils/cropImage.ts
export const getCroppedImg = (
  imageSrc: string,
  pixelCrop: any,
  fileName: string,
  outputWidth: number = 370,
  outputHeight: number = 760
): Promise<{ file: File, previewUrl: string }> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas 2D context not available'));

      // Draw cropped area scaled to 370x760
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        outputWidth,
        outputHeight
      );

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Canvas is empty'));
        const file = new File([blob], fileName, { type: blob.type });
        const previewUrl = URL.createObjectURL(blob);
        resolve({ file, previewUrl });
      }, 'image/jpeg');
    };

    image.onerror = (e) => reject(e);
  });
};
