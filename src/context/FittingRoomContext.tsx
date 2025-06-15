import { createContext, useContext, useState, type ReactNode } from "react"
import { type Clothes } from "../types/Clothes";

interface FittingRoomContextTypes {
    selectedClothes: Clothes | null,
    setSelectedClothes: (clothes: Clothes | null) => void
}

const FittingRoomContext = createContext<FittingRoomContextTypes | undefined>(undefined);


export const FittingRoomProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedClothes, setSelectedClothes] = useState<Clothes | null>(null);

    return (
        <FittingRoomContext.Provider value={{
            selectedClothes,
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