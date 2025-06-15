import { BASE_URL } from "../../constants/BaseUrl"
import type { Clothes } from "../../types/Clothes"
import { useFittingRoom } from "../../context/FittingRoomContext"

interface ClotheSelectorItemProps {
    clothes: Clothes
}

const ClotheSelectorItem = ({ clothes }: ClotheSelectorItemProps) => {
    const { selectedClothes, setSelectedClothes } = useFittingRoom();


    const handleClick = () => {
        setSelectedClothes(clothes);
    }



    return (
        <div
            className={"w-full aspect-[4/3] bg-gray-100 rounded border border-gray-300 overflow-hidden " + (selectedClothes?.id == clothes.id && "border-2 border-orange-300 ")}
            onClick={handleClick}
        >
            <img
                src={`${BASE_URL}/api/files/${clothes.collectionId}/${clothes.id}/${clothes.thumbnail}`}
                alt={`Clothes ${clothes.id}`}
                className="w-full h-full object-cover"
            />
        </div>
    )
}

export default ClotheSelectorItem;
