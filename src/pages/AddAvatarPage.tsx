import { ArrowLeft } from "lucide-react";
import Header from "../components/core/Header";
import Page from "../components/core/Page";
import Spacer from "../components/core/Spacer";
import { useNavigate } from "react-router";
import { RoutePath } from "../enums/RoutePath";
import { useState } from "react";

const AddAvatarPage: React.FC = () => {
    const navigate = useNavigate();
    const [frontImage, setFrontImage] = useState<string | null>(null);
    const [sideImage, setSideImage] = useState<string | null>(null);
    const [height, setHeight] = useState<string>("");

    const handleImageUpload = (
        event: React.ChangeEvent<HTMLInputElement>, 
        setImage: React.Dispatch<React.SetStateAction<string | null>>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target?.result) {
                    setImage(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = (): void => {
        // Handle the upload logic here
        console.log("Front Image:", frontImage);
        console.log("Side Image:", sideImage);
        console.log("Height:", height);
        // Navigate back or show success message
        navigate(RoutePath.HOME);
    };

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
                            onClick={() => document.getElementById('front-upload')?.click()}
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
                                </>
                            )}
                        </div>
                        <input
                            id="front-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleImageUpload(e, setFrontImage)}
                        />
                    </div>

                    {/* Side View Section */}
                    <div>
                        <h2 className="text-lg font-medium mb-4">Side View</h2>
                        <div 
                            className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-100 transition-colors"
                            onClick={() => document.getElementById('side-upload')?.click()}
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
                                </>
                            )}
                        </div>
                        <input
                            id="side-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleImageUpload(e, setSideImage)}
                        />
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
                                placeholder="Enter height (e.g., 5'8 or 173cm)"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    {/* Upload Button */}
                    <div className="flex justify-end pt-6">
                        <button
                            onClick={handleUpload}
                            disabled={!frontImage || !sideImage || !height.trim()}
                            className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Upload
                        </button>
                    </div>
                </div>
            </Page>
        </>
    )
}

export default AddAvatarPage;