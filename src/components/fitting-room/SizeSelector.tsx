import { useEffect } from "react";
import { useFittingRoom } from "../../context/FittingRoomContext";
import { useClothes } from "../../hooks/useClothes";
import ClotheSelectorItem from "./ClotheSelectorItem";

const SizeSelector = () => {
    const { data, isLoading, isError } = useClothes(0, 10);
    const { selectedClothes, setSelectedClothes } = useFittingRoom();

    useEffect(() => {
        if (selectedClothes == null && data) {
            setSelectedClothes(data.items[0]);
        }
    }, [data]);

    return (
        <>
            <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Size</h3>
                <div className="flex gap-3">
                    {/* Add size selection buttons here */}
                </div>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Clothes</h3>

                {isLoading && (
                    <div className="text-center mt-4">Loading clothes...</div>
                )}
                {isError && (
                    <div className="text-center mt-4 text-red-500">
                        Failed to load clothes.
                    </div>
                )}
                {!isLoading && data?.items.length === 0 && (
                    <div className="text-center mt-4">No clothes available.</div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                    {!isLoading && data?.items.map((clothes) => (
                        <ClotheSelectorItem key={clothes.id} clothes={clothes} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default SizeSelector;
