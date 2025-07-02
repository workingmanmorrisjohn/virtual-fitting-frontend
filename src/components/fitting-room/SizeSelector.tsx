import { useEffect } from "react";
import { useFittingRoom } from "../../context/FittingRoomContext";
import { useSMPLClothesByAvatarId } from "../../hooks/useSMPLClothes";
import ClotheSelectorItem from "./ClotheSelectorItem";

interface SizeSelectorProps {
    avatarId: string;
}

const SizeSelector = ({ avatarId }: SizeSelectorProps) => {
    const { data, isLoading, isError } = useSMPLClothesByAvatarId(avatarId);
    const { selectedClothesTop, selectedClothesBottom, setSelectedClothes } = useFittingRoom();

    // Automatically select the first available top if none selected
    useEffect(() => {
        if ((!selectedClothesTop || !selectedClothesBottom)  && data?.top.length) {
            setSelectedClothes(data.top[0]);
            setSelectedClothes(data.bottom[0]);
        }
    }, [data]);

    return (
        <>
            <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Tops</h3>
                {isLoading && <div className="text-center mt-4">Loading tops...</div>}
                {isError && <div className="text-center mt-4 text-red-500">Failed to load clothes.</div>}
                {!isLoading && data?.top.length === 0 && (
                    <div className="text-center mt-4">No tops available.</div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                    {data?.top.map((clothes) => (
                        <ClotheSelectorItem key={clothes.id} clothes={clothes} />
                    ))}
                </div>
            </div>

            {/* <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Bottoms</h3>
                {isLoading && <div className="text-center mt-4">Loading bottoms...</div>}
                {!isLoading && data?.bottom.length === 0 && (
                    <div className="text-center mt-4">No bottoms available.</div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                    {data?.bottom.map((clothes) => (
                        <ClotheSelectorItem key={clothes.id} clothes={clothes} />
                    ))}
                </div>
            </div> */}
        </>
    );
};

export default SizeSelector;
