import { LogOutIcon, Plus } from "lucide-react";
import Header from "../components/core/Header";
import Page from "../components/core/Page";
import Spacer from "../components/core/Spacer";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { RoutePath } from "../enums/RoutePath";
import { BASE_URL } from "../constants/BaseUrl";

const AvatarListPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    // Mock data - replace with your actual avatar data
    const avatars = [
        {
            id: "dinSDgin",
            status: "ready",
            front: `${BASE_URL}/api/files/Avatars/4l4p4ds375mxk23/front_ki4r0xpcln.png`,
            side: `${BASE_URL}/api/files/Avatars/4l4p4ds375mxk23/side_46p8j6emgb.png`
        }
    ];

    return (
        <>
            <Page>
                <Header>
                    <h1 className="text-xl font-semibold">Avatars</h1>
                    <LogOutIcon
                        className="absolute text-red-500 right-8 cursor-pointer hover:text-red-600 transition-colors"
                        size={25}
                        onClick={logout}
                    />
                </Header>
                <Spacer />

                {/* Avatar List */}
                <div className="w-full space-y-4">
                    {avatars.map((avatar) => (
                        <div
                            key={avatar.id}
                            className="w-full rounded-lg shadow-lg border border-gray-200 bg-white p-4 hover:shadow-xl transition-shadow cursor-pointer"
                            onClick={() => navigate(RoutePath.AVATAR_INFO)}
                        >
                            <div className="flex flex-row items-center gap-4">
                                {/* Left thumbnail container */}
                                <div className="flex-shrink-0">
                                    <div className="w-18 h-24 bg-gray-100 rounded border border-gray-300 overflow-hidden">
                                        <img
                                            src={avatar.front}
                                            alt={`Avatar ${avatar.id}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Second thumbnail (optional) */}
                                <div className="flex-shrink-0">
                                    <div className="w-18 h-24 bg-gray-50 rounded border border-gray-300 flex items-center justify-center">
                                        <img
                                            src={avatar.side}
                                            alt={`Avatar ${avatar.id}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Avatar metadata */}
                                <div className="flex-1 ml-4">
                                    <div className="text-lg font-medium text-gray-800 mb-1">
                                        id: {avatar.id}
                                    </div>
                                    <div className="text-base text-gray-600">
                                        status: {avatar.status}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Avatar FAB */}
                <div
                    className="absolute right-8 bottom-8 w-[50px] h-[50px] flex items-center justify-center rounded-full bg-primary text-white cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
                    onClick={() => navigate(RoutePath.ADD_AVATAR)}
                >
                    <Plus size={35} />
                </div>
            </Page>
        </>
    )
}

export default AvatarListPage;