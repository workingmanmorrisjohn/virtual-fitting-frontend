import { ArrowLeft } from "lucide-react";
import Header from "../components/core/Header";
import Page from "../components/core/Page";
import Spacer from "../components/core/Spacer";
import { RoutePath } from "../enums/RoutePath";
import { useNavigate } from "react-router";
import { BASE_URL } from "../constants/BaseUrl";
import ClothesCanvas from "../components/clothes/ClothesCanvas";

const ClothesInfoPage = () => {
    const navigate = useNavigate();

    // Mock data for demo purposes
    const clothes = {
        id: "jacket001",
        thumbnail: `${BASE_URL}/api/files/Clothes/2a1ru54lv9j4hsv/screenshot_2025_06_09_at_6_52_6s9383evzy.16PM.png`,
        sizes: ["S", "M", "L", "XL"]
    };

    const shirtFilePath = `${BASE_URL}/api/files/Clothes/2a1ru54lv9j4hsv/tshirt_4ptutrgxxb.glb`;

    return (
        <Page>
            <Header>
                <ArrowLeft
                    className="absolute left-8 cursor-pointer hover:text-gray-600 transition-colors"
                    onClick={() => navigate(RoutePath.CLOTHES_LIST)}
                />
                <h1 className="text-xl font-semibold">Clothes Info</h1>
            </Header>
            <Spacer />
            <div className="w-full max-w-xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-6">
                {/* Preview
                <div className="w-full h-64 rounded border border-gray-300 overflow-hidden">
                    <img
                        src={clothes.thumbnail}
                        alt="Clothing Preview"
                        className="w-full h-full object-cover"
                    />
                </div> */}

                {/* ID */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">ID</h2>
                    <p className="text-gray-600">{clothes.id}</p>
                </div>

                {/* Available Sizes */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">Available Sizes</h2>
                    <div className="flex flex-wrap gap-2">
                        {clothes.sizes.map((size) => (
                            <span
                                key={size}
                                className="px-3 py-1 bg-gray-100 text-sm rounded-full border border-gray-300"
                            >
                                {size}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 3D Model Viewer */}
                <ClothesCanvas modelPath={shirtFilePath} />
            </div>
        </Page>
    );
};

export default ClothesInfoPage;