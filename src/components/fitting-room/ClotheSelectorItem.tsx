import { BASE_URL } from "../../constants/BaseUrl"
import type { SMPL_Clothes } from "../../types/Clothes"
import { useFittingRoom } from "../../context/FittingRoomContext"

interface ClotheSelectorItemProps {
    clothes: SMPL_Clothes
}

const ClotheSelectorItem = ({ clothes }: ClotheSelectorItemProps) => {
    const { selectedClothesBottom, selectedClothesTop, setSelectedClothes } = useFittingRoom();


    const handleClick = () => {
        setSelectedClothes(clothes);
    }



    return (
        <div
            className={"w-full aspect-[4/3] bg-gray-100 rounded border border-gray-300 overflow-hidden " + ( ((selectedClothesBottom?.id == clothes.id) || (selectedClothesTop?.id == clothes.id) ) && "border-2 border-orange-300 ")}
            onClick={handleClick}
        >
            <img
                src={`${BASE_URL}/api/files/${clothes.clothes_thumbnail.collectionId}/${clothes.clothes_thumbnail.id}/${clothes.clothes_thumbnail.image}`}
                alt={`Clothes ${clothes.id}`}
                className="w-full h-full object-cover"
            />
        </div>
    )
}

export default ClotheSelectorItem;
