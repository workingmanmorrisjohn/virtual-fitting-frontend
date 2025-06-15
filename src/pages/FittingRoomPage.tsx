import { ArrowLeft } from "lucide-react";
import Header from "../components/core/Header";
import Page from "../components/core/Page";
import Spacer from "../components/core/Spacer";
import { useNavigate, useParams } from "react-router";
import { RoutePath } from "../enums/RoutePath";
import { useAvatar } from "../hooks/useAvatars";
import { getFileURLFromAvatar } from "../utils/UtilityFunctions";
import { FittingRoomProvider } from "../context/FittingRoomContext";
import FittingRoomCanvas from "../components/fitting-room/FittingRoomCanvas";
import SizeSelector from "../components/fitting-room/SizeSelector";

const FittingRoomPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { data: avatar, isLoading, isError } = useAvatar(id);

    if (isLoading) return <p>Loading avatar...</p>;
    if (isError || !avatar) return <p>Avatar not found.</p>;

    const avatar_file_path = getFileURLFromAvatar(avatar, avatar.rigged_glb);

    return (
        <FittingRoomProvider>
            <Page>
                <Header>
                    <ArrowLeft
                        className="absolute left-8 cursor-pointer hover:text-gray-600 transition-colors"
                        onClick={() => navigate(RoutePath.HOME)}
                    />
                    <h1 className="text-xl font-semibold">Fitting Room</h1>
                </Header>
                <Spacer />

                <div className="flex-1 flex flex-col">

                    {avatar_file_path ? <FittingRoomCanvas modelPath={avatar_file_path} /> : "Avatar not available"}

                    {/* Mobile instructions */}
                    <div className="mt-2 text-sm text-gray-600 text-center md:hidden">
                        Use one finger to rotate • Use two fingers to zoom
                    </div>

                    {/* Desktop instructions */}
                    <div className="mt-2 text-sm text-gray-600 text-center hidden md:block">
                        Click and drag to rotate • Scroll to zoom
                    </div>

                    {/* Size selection */}
                    <SizeSelector />
                </div>
            </Page>
        </FittingRoomProvider>
    );
};

export default FittingRoomPage;