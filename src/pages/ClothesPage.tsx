import { LogOutIcon } from "lucide-react";
import Header from "../components/core/Header";
import Page from "../components/core/Page";
import Spacer from "../components/core/Spacer";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { RoutePath } from "../enums/RoutePath";
import { BASE_URL } from "../constants/BaseUrl";

const ClothesPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    // Mock clothes data
    const clothes = [
        {
            id: "tshirt001",
            status: "S, M, L, XL",
            thumbnail: `${BASE_URL}/api/files/Clothes/2a1ru54lv9j4hsv/screenshot_2025_06_09_at_6_52_6s9383evzy.16PM.png`
        }
    ];

    return (
        <Page>
            <Header>
                <h1 className="text-xl font-semibold">Clothes</h1>
                <LogOutIcon 
                    className="absolute text-red-500 right-8 cursor-pointer hover:text-red-600 transition-colors" 
                    size={25} 
                    onClick={logout} 
                />
            </Header>
            <Spacer />

            <div className="w-full space-y-4">
                {clothes.map((item) => (
                    <div
                        key={item.id}
                        className="w-full rounded-lg shadow-lg border border-gray-200 bg-white p-4 hover:shadow-xl transition-shadow cursor-pointer"
                        onClick={() => navigate(RoutePath.CLOTHES_INFO)}
                    >
                        <div className="flex items-center gap-4">
                            {/* Thumbnail */}
                            <div className="w-24 h-20 bg-gray-100 rounded border border-gray-300 overflow-hidden">
                                <img
                                    src={item.thumbnail}
                                    alt={`Clothing ${item.id}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Metadata */}
                            <div className="flex-1 ml-4">
                                <div className="text-lg font-medium text-gray-800 mb-1">
                                    id: {item.id}
                                </div>
                                <div className="text-base text-gray-600">
                                    available sizes: {item.status}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Page>
    );
};

export default ClothesPage;
