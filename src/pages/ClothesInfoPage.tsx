import { ArrowLeft } from "lucide-react";
import Header from "../components/core/Header";
import Page from "../components/core/Page";
import Spacer from "../components/core/Spacer";
import { RoutePath } from "../enums/RoutePath";
import { useNavigate, useParams } from "react-router";
import ClothesCanvas from "../components/clothes/ClothesCanvas";
import { useClothesItem } from "../hooks/useClothes";
import { getFileURLFromClothes } from "../utils/UtilityFunctions";

const ClothesInfoPage = () => {
    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();

    const { data: clothes, isLoading, isError } = useClothesItem(id);

    if (isLoading) return <p>Loading clothes...</p>;
    if (isError || !clothes) return <p>Clothes not found.</p>;

    const clothes_file_path = getFileURLFromClothes(clothes, clothes.thumbnail_glb);

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
                                key={size.id}
                                className="px-3 py-1 bg-gray-100 text-sm rounded-full border border-gray-300"
                            >
                                {size.name} 
                            </span>
                        ))}
                    </div>
                </div>

                {/* 3D Model Viewer */}
                <ClothesCanvas modelPath={clothes_file_path} />
            </div>
        </Page>
    );
};

export default ClothesInfoPage;