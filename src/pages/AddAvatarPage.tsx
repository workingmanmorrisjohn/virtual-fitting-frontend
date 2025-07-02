import { ArrowLeft } from "lucide-react";
import Header from "../components/core/Header";
import Page from "../components/core/Page";
import Spacer from "../components/core/Spacer";
import { useNavigate } from "react-router";
import { RoutePath } from "../enums/RoutePath";
import { useState } from "react";
import { useAddAvatar } from "../hooks/useAvatars";
import { blobToFile, resizeImage } from "../utils/UtilityFunctions";
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

const AddAvatarPage: React.FC = () => {
    const navigate = useNavigate();
    const [frontImage, setFrontImage] = useState<string | null>(null);
    const [sideImage, setSideImage] = useState<string | null>(null);
    const [frontFile, setFrontFile] = useState<File | null>(null);
    const [sideFile, setSideFile] = useState<File | null>(null);
    const [height, setHeight] = useState<string>("");
    
    const addAvatarMutation = useAddAvatar();

    // Convert base64 to File object
    const base64ToFile = (base64: string, filename: string): File => {
        const arr = base64.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    // Handle image selection with action sheet (Camera/Gallery choice)
    const selectImage = async (
        setImage: React.Dispatch<React.SetStateAction<string | null>>,
        setFile: React.Dispatch<React.SetStateAction<File | null>>,
        filename: string
    ) => {
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
                    setImage(image.dataUrl);
                    const file = base64ToFile(image.dataUrl, filename);
                    setFile(file);
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
                        setFile(file);
                        const reader = new FileReader();
                        reader.onload = (event: ProgressEvent<FileReader>) => {
                            if (event.target?.result) {
                                setImage(event.target.result as string);
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

    // Handle direct camera capture
    const takePhoto = async (
        setImage: React.Dispatch<React.SetStateAction<string | null>>,
        setFile: React.Dispatch<React.SetStateAction<File | null>>,
        filename: string
    ) => {
        try {
            if (Capacitor.isNativePlatform()) {
                const image = await Camera.getPhoto({
                    quality: 90,
                    allowEditing: false,
                    resultType: CameraResultType.DataUrl,
                    source: CameraSource.Camera, // Direct camera
                });

                if (image.dataUrl) {
                    setImage(image.dataUrl);
                    const file = base64ToFile(image.dataUrl, filename);
                    setFile(file);
                }
            } else {
                // Fallback for web
                selectImage(setImage, setFile, filename);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
        }
    };

    // Handle gallery selection
    const selectFromGallery = async (
        setImage: React.Dispatch<React.SetStateAction<string | null>>,
        setFile: React.Dispatch<React.SetStateAction<File | null>>,
        filename: string
    ) => {
        try {
            if (Capacitor.isNativePlatform()) {
                const image = await Camera.getPhoto({
                    quality: 90,
                    allowEditing: false,
                    resultType: CameraResultType.DataUrl,
                    source: CameraSource.Photos, // Direct gallery
                });

                if (image.dataUrl) {
                    setImage(image.dataUrl);
                    const file = base64ToFile(image.dataUrl, filename);
                    setFile(file);
                }
            } else {
                // Fallback for web
                selectImage(setImage, setFile, filename);
            }
        } catch (error) {
            console.error('Error selecting from gallery:', error);
        }
    };

    const handleUpload = async (): Promise<void> => {
        if (!frontFile || !sideFile || !height.trim()) {
            console.error("Missing required fields");
            return;
        }

        try {
            const heightNum = parseFloat(height);
            if (isNaN(heightNum)) {
                console.error("Invalid height value");
                return;
            }

            const frontImageBlob = await resizeImage(frontFile, 500, 500);
            const sideImageBlob = await resizeImage(sideFile, 500, 500);

            await addAvatarMutation.mutateAsync({
                frontView: blobToFile(frontImageBlob, frontFile.name),
                sideView: blobToFile(sideImageBlob, sideFile.name),
                height: heightNum
            });

            navigate(RoutePath.HOME);
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    const isNative = Capacitor.isNativePlatform();

    return (
        <>
            <Page>
                <Header>
                    <ArrowLeft 
                        className="absolute left-8 cursor-pointer hover:text-gray-600 transition-colors" 
                        onClick={() => navigate(RoutePath.HOME)} 
                    />
                    <h1 className="text-xl font-semibold">Add Avatar</h1>
                </Header>
                <Spacer />
                
                <div className="w-full max-w-2xl mx-auto space-y-8">
                    {/* Front View Section */}
                    <div>
                        <h2 className="text-lg font-medium mb-4">Front View</h2>
                        <div 
                            className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-100 transition-colors"
                            onClick={() => selectImage(setFrontImage, setFrontFile, 'front-view.jpg')}
                        >
                            {frontImage ? (
                                <img 
                                    src={frontImage} 
                                    alt="Front view" 
                                    className="max-w-full max-h-full object-contain rounded-lg"
                                />
                            ) : (
                                <>
                                    <div className="text-6xl text-gray-400 mb-2">+</div>
                                    <p className="text-gray-500">Click to upload front view image</p>
                                    {isNative && (
                                        <p className="text-xs text-gray-400 mt-1">Choose Camera or Gallery</p>
                                    )}
                                </>
                            )}
                        </div>
                        
                        {/* Additional buttons for native platforms */}
                        {isNative && (
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => takePhoto(setFrontImage, setFrontFile, 'front-view.jpg')}
                                    className="flex-1 py-2 px-4 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                                >
                                    Camera
                                </button>
                                <button
                                    onClick={() => selectFromGallery(setFrontImage, setFrontFile, 'front-view.jpg')}
                                    className="flex-1 py-2 px-4 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                                >
                                    Gallery
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Side View Section */}
                    <div>
                        <h2 className="text-lg font-medium mb-4">Side View</h2>
                        <div 
                            className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-100 transition-colors"
                            onClick={() => selectImage(setSideImage, setSideFile, 'side-view.jpg')}
                        >
                            {sideImage ? (
                                <img 
                                    src={sideImage} 
                                    alt="Side view" 
                                    className="max-w-full max-h-full object-contain rounded-lg"
                                />
                            ) : (
                                <>
                                    <div className="text-6xl text-gray-400 mb-2">+</div>
                                    <p className="text-gray-500">Click to upload side view image</p>
                                    {isNative && (
                                        <p className="text-xs text-gray-400 mt-1">Choose Camera or Gallery</p>
                                    )}
                                </>
                            )}
                        </div>
                        
                        {/* Additional buttons for native platforms */}
                        {isNative && (
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => takePhoto(setSideImage, setSideFile, 'side-view.jpg')}
                                    className="flex-1 py-2 px-4 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                                >
                                    Camera
                                </button>
                                <button
                                    onClick={() => selectFromGallery(setSideImage, setSideFile, 'side-view.jpg')}
                                    className="flex-1 py-2 px-4 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                                >
                                    Gallery
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Height Input Section */}
                    <div>
                        <div className="flex items-center gap-4">
                            <label htmlFor="height" className="text-lg font-medium">Height:</label>
                            <input
                                id="height"
                                type="text"
                                value={height}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeight(e.target.value)}
                                placeholder="Enter height in cm"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {addAvatarMutation.isError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-700">
                                Upload failed. Please try again.
                            </p>
                        </div>
                    )}

                    {/* Upload Button */}
                    <div className="flex justify-end pt-6">
                        <button
                            onClick={handleUpload}
                            disabled={!frontFile || !sideFile || !height.trim() || addAvatarMutation.isPending}
                            className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {addAvatarMutation.isPending ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                </div>
            </Page>
        </>
    )
}

export default AddAvatarPage;