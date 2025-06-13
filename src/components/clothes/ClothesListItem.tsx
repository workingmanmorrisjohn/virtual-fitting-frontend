import { useNavigate } from "react-router";
import { RoutePath } from "../../enums/RoutePath";
import type { Clothes, ClothesSize } from "../../types/Clothes";
import { BASE_URL } from "../../constants/BaseUrl";
import { useEffect } from "react";

interface Props {
    clothes: Clothes;
}

const ClothesListItem = ({ clothes }: Props) => {
    const navigate = useNavigate();

    useEffect(() => {
        console.log(clothes);
    }, []);

    return (
        <div
            className="w-full rounded-lg shadow-lg border border-gray-200 bg-white p-4 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => navigate(`${RoutePath.CLOTHES_INFO_BASE}/${clothes.id}`)}
        >
            <div className="flex items-center gap-4">
                <div className="w-24 h-20 bg-gray-100 rounded border border-gray-300 overflow-hidden">
                    <img
                        src={`${BASE_URL}/api/files/${clothes.collectionId}/${clothes.id}/${clothes.thumbnail}`}
                        alt={`Clothes ${clothes.id}`}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 ml-4">
                    <div className="text-lg font-medium text-gray-800 mb-1">
                        ID: {clothes.id}
                    </div>
                    <div className="text-base text-gray-600">
                        Available sizes: {clothes.sizes.map((size: ClothesSize) => (<>{size.name} </>))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClothesListItem;