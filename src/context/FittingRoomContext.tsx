import { createContext, useContext, useState, type ReactNode } from "react"
import { ClothesType, type SMPL_Clothes } from "../types/Clothes";

interface FittingRoomContextTypes {
    selectedClothesTop: SMPL_Clothes | null,
    selectedClothesBottom: SMPL_Clothes | null,
    setSelectedClothes: (clothes: SMPL_Clothes | null) => void
}

const FittingRoomContext = createContext<FittingRoomContextTypes | undefined>(undefined);


export const FittingRoomProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedClothesTop, setSelectedClothesTop] = useState<SMPL_Clothes | null>(null);
    const [selectedClothesBottom, setSelectedClothesBottom] = useState<SMPL_Clothes | null>(null);

    const setSelectedClothes = (clothes: SMPL_Clothes | null) => {
        if (clothes?.type == ClothesType.BOTTOM) {
            setSelectedClothesBottom(clothes);
        }

        if (clothes?.type == ClothesType.TOP) {
            setSelectedClothesTop(clothes);
        }
    }

    return (
        <FittingRoomContext.Provider value={{
            selectedClothesTop,
            selectedClothesBottom,
            setSelectedClothes
        }}>
            {children}
        </FittingRoomContext.Provider>
    );
}


export const useFittingRoom = () => {
    const context = useContext(FittingRoomContext);
    if (!context) {
        throw new Error('useFittingRoom must be used within an FittingRoomProvider');
    }
    return context;
};