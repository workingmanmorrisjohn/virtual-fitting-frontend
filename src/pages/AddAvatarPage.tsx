import { ArrowLeft } from "lucide-react";
import Header from "../components/core/Header";
import Page from "../components/core/Page";
import Spacer from "../components/core/Spacer";
import { useNavigate } from "react-router";
import { RoutePath } from "../enums/RoutePath";
import { useState } from "react";
import { useAddAvatar } from "../hooks/useAvatars";
import { blobToFile, resizeImage } from "../utils/UtilityFunctions";
import ImageSelector from "../components/avatar/ImageSelector";

const AddAvatarPage: React.FC = () => {
    const navigate = useNavigate();
    const [frontImage, setFrontImage] = useState<string | null>(null);
    const [sideImage, setSideImage] = useState<string | null>(null);
    const [frontFile, setFrontFile] = useState<File | null>(null);
    const [sideFile, setSideFile] = useState<File | null>(null);
    const [height, setHeight] = useState<string>("");

    const [backImage, setBackImage] = useState<string | null>(null);
    const [backFile, setBackFile] = useState<File | null>(null);
    const [gender, setGender] = useState<string>("");

    const addAvatarMutation = useAddAvatar();


    const handleUpload = async (): Promise<void> => {
        if (!frontFile || !sideFile || !backFile || !height.trim() || !gender) {
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
            const backImageBlob = await resizeImage(backFile, 500, 500);

            await addAvatarMutation.mutateAsync({
                frontView: blobToFile(frontImageBlob, frontFile.name),
                sideView: blobToFile(sideImageBlob, sideFile.name),
                backView: blobToFile(backImageBlob, backFile.name),
                height: heightNum,
                gender: gender
            });

            navigate(RoutePath.HOME);
        } catch (error) {
            console.error("Upload failed:", error);
        }
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
                    
                    <ImageSelector header="Front View" image={frontImage} setImage={setFrontImage} setFile={setFrontFile} />
                    <ImageSelector header="Side View" image={sideImage} setImage={setSideImage} setFile={setSideFile} />
                    <ImageSelector header="Back View" image={backImage} setImage={setBackImage} setFile={setBackFile} />


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

                    <div className="w-full flex align-middle items-center gap-4">
                        <label htmlFor="gender" className="text-lg font-medium">Gender:</label>
                        <select
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="select border border-gray-300 rounded-lg px-4 py-2"
                        >
                            <option value="" disabled>Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
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