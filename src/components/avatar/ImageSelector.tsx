import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useState } from 'react';
import CropperModal from './CropperModal';


interface ImageSelectorProps {
    header: string
    setImage: React.Dispatch<React.SetStateAction<string | null>>
    setFile: React.Dispatch<React.SetStateAction<File | null>>
    image: string | null
}

const ImageSelector = ({ header, image, setImage, setFile }: ImageSelectorProps) => {
    const isNative = Capacitor.isNativePlatform();
    const [showCropper, setShowCropper] = useState(false);
    const [tempImage, setTempImage] = useState<string | null>(null);



    // const base64ToFile = (base64: string, filename: string): File => {
    //     const arr = base64.split(',');
    //     const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    //     const bstr = atob(arr[1]);
    //     let n = bstr.length;
    //     const u8arr = new Uint8Array(n);
    //     while (n--) {
    //         u8arr[n] = bstr.charCodeAt(n);
    //     }
    //     return new File([u8arr], filename, { type: mime });
    // };


    const selectImage = async () => {
        try {
            if (Capacitor.isNativePlatform()) {
                // Use Capacitor Camera for native platforms
                const image = await Camera.getPhoto({
                    quality: 90,
                    allowEditing: false,
                    resultType: CameraResultType.DataUrl,
                    source: CameraSource.Prompt, // Shows selection dialog
                });

                if (image.dataUrl) {
                    setTempImage(image.dataUrl);  // 👈 Show cropper
                    setShowCropper(true);
                }

            } else {
                // Fallback for web - trigger file input
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e: Event) => {
                    const target = e.target as HTMLInputElement;
                    const file = target.files?.[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event: ProgressEvent<FileReader>) => {
                            if (event.target?.result) {
                                setTempImage(event.target.result as string);  // 👈 Show cropper
                                setShowCropper(true);                         // 👈 This opens the modal
                            }
                        };
                        reader.readAsDataURL(file);
                    }
                };
                input.click();
            }
        } catch (error) {
            console.error('Error selecting image:', error);
        }


    };

    // // Handle direct camera capture
    // const takePhoto = async (
    //     setImage: React.Dispatch<React.SetStateAction<string | null>>,
    //     setFile: React.Dispatch<React.SetStateAction<File | null>>,
    //     filename: string
    // ) => {
    //     try {
    //         if (Capacitor.isNativePlatform()) {
    //             const image = await Camera.getPhoto({
    //                 quality: 90,
    //                 allowEditing: false,
    //                 resultType: CameraResultType.DataUrl,
    //                 source: CameraSource.Camera, // Direct camera
    //             });

    //             if (image.dataUrl) {
    //                 setImage(image.dataUrl);
    //                 const file = base64ToFile(image.dataUrl, filename);
    //                 setFile(file);
    //             }
    //         } else {
    //             // Fallback for web
    //             selectImage();
    //         }
    //     } catch (error) {
    //         console.error('Error taking photo:', error);
    //     }
    // };

    // // Handle gallery selection
    // const selectFromGallery = async (
    //     setImage: React.Dispatch<React.SetStateAction<string | null>>,
    //     setFile: React.Dispatch<React.SetStateAction<File | null>>,
    //     filename: string
    // ) => {
    //     try {
    //         if (Capacitor.isNativePlatform()) {
    //             const image = await Camera.getPhoto({
    //                 quality: 90,
    //                 allowEditing: false,
    //                 resultType: CameraResultType.DataUrl,
    //                 source: CameraSource.Photos, // Direct gallery
    //             });

    //             if (image.dataUrl) {
    //                 setImage(image.dataUrl);
    //                 const file = base64ToFile(image.dataUrl, filename);
    //                 setFile(file);
    //             }
    //         } else {
    //             // Fallback for web
    //             selectImage();
    //         }
    //     } catch (error) {
    //         console.error('Error selecting from gallery:', error);
    //     }
    // };

    return (
        <>
            <div>
                <h2 className="text-lg font-medium mb-4">{header}</h2>
                <div
                    className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-100 transition-colors"
                    onClick={() => selectImage()}
                >
                    {image ? (
                        <img
                            src={image}
                            alt="Front view"
                            className="max-w-full max-h-full object-contain rounded-lg"
                        />
                    ) : (
                        <>
                            <div className="text-6xl text-gray-400 mb-2">+</div>
                            <p className="text-gray-500">Click to upload {header.toLowerCase()} image</p>
                            {isNative && (
                                <p className="text-xs text-gray-400 mt-1">Choose Camera or Gallery</p>
                            )}
                        </>
                    )}
                </div>

                {/* Additional buttons for native platforms
                {isNative && (
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={() => takePhoto(setImage, setFile, 'front-view.jpg')}
                            className="flex-1 py-2 px-4 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                        >
                            Camera
                        </button>
                        <button
                            onClick={() => selectFromGallery(setImage, setFile, 'front-view.jpg')}
                            className="flex-1 py-2 px-4 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                        >
                            Gallery
                        </button>
                    </div>
                )} */}
            </div>

            {showCropper && tempImage && (
                <CropperModal
                    imageSrc={tempImage}
                    onCancel={() => setShowCropper(false)}
                    onCropComplete={(croppedFile, previewUrl) => {
                        setFile(croppedFile);
                        setImage(previewUrl);
                        setShowCropper(false);
                    }}
                />
            )}

        </>
    )
}

export default ImageSelector;