import { ArrowLeft, User, Image, Ruler, ImageIcon } from "lucide-react";
import Header from "../components/core/Header";
import Page from "../components/core/Page";
import Spacer from "../components/core/Spacer";
import { useNavigate, useParams } from "react-router";
import { RoutePath } from "../enums/RoutePath";
import AvatarCanvas from "../components/avatar/AvatarCanvas";
import { useAvatar } from "../hooks/useAvatars";
import { getFileURLFromAvatar } from "../utils/UtilityFunctions";
import StatusSection from "../components/avatar/StatusSection";

const AvatarInfoPage = () => {
    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();
    const { data: avatar, isLoading, isError } = useAvatar(id);

    if (isLoading) return <p>Loading avatar...</p>;
    if (isError || !avatar) return <p>Avatar not found.</p>;

    const front_view_image = getFileURLFromAvatar(avatar, avatar.front_view);
    const side_view_image = getFileURLFromAvatar(avatar, avatar.side_view);
    const back_view_image = getFileURLFromAvatar(avatar, avatar.back_view);
    const avatar_file_path = getFileURLFromAvatar(avatar, avatar.unrigged_glb);


    return (
        <Page>
            <Header>
                <ArrowLeft
                    className="absolute left-8 cursor-pointer text-gray-600 hover:text-black transition-colors p-1 hover:bg-gray-100 rounded-full"
                    onClick={() => { navigate(RoutePath.HOME) }}
                    size={28}
                />
                <h1 className="text-xl font-semibold">Avatar Info</h1>
            </Header>
            <Spacer />

            <div className="py-6 space-y-8">
                {/* ID Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-300">
                    <div className="flex items-center gap-3">
                        <User className="text-gray-700" size={20} />
                        <p className="text-gray-800 font-medium">
                            ID: {avatar.id}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-300">
                    <div className="flex items-center gap-3 mb-6">
                        <User className="text-gray-700" size={20} />
                        <h2 className="text-lg font-semibold text-gray-800">3D Avatar (3D Scan)</h2>
                    </div>

                    {avatar_file_path ? <AvatarCanvas modelPath={avatar_file_path} /> : "Avatar not available"}


                    {/* Instructions */}
                    <div className="mt-3 text-xs text-gray-500 text-center">
                        Click and drag to rotate • Scroll to zoom • Auto-rotates when idle
                    </div>
                </div>




                {/* Sources Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-300">
                    <div className="flex items-center gap-3 mb-6">
                        <Image className="text-gray-700" size={20} />
                        <h2 className="text-lg font-semibold text-gray-800">Source Images</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-6 justify-center">
                        
                        <div className="group">
                            <div className="w-36 h-28 border-2 border-gray-300 rounded-xl bg-gray-100 flex items-center justify-center group-hover:shadow-md transition">
                                {front_view_image ? <img
                                    src={front_view_image}
                                    alt={`Avatar ${avatar.id}`}
                                    className="w-full h-full object-cover"
                                /> : <ImageIcon />}
                            </div>
                            <p className="text-xs text-gray-600 text-center mt-2">Front</p>
                        </div>

                        <div className="group">
                            <div className="w-36 h-28 border-2 border-gray-300 rounded-xl bg-gray-100 flex items-center justify-center group-hover:shadow-md transition">
                                {side_view_image ? <img
                                    src={side_view_image}
                                    alt={`Avatar ${avatar.id}`}
                                    className="w-full h-full object-cover"
                                /> : <ImageIcon />}
                            </div>
                            <p className="text-xs text-gray-600 text-center mt-2">Side</p>
                        </div>


                        <div className="group">
                            <div className="w-36 h-28 border-2 border-gray-300 rounded-xl bg-gray-100 flex items-center justify-center group-hover:shadow-md transition">
                                {back_view_image ? <img
                                    src={back_view_image}
                                    alt={`Avatar ${avatar.id}`}
                                    className="w-full h-full object-cover"
                                /> : <ImageIcon />}
                            </div>
                            <p className="text-xs text-gray-600 text-center mt-2">Back</p>
                        </div>

                    </div>
                </div>

                {/* Measurements Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-300">
                    <div className="flex items-center gap-3 mb-6">
                        <Ruler className="text-gray-700" size={20} />
                        <h2 className="text-lg font-semibold text-gray-800">Source Info</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { label: "Height", value: avatar.height ? avatar.height : "--" }
                        ].map(({ label, value }) => (
                            <div key={label} className="bg-gray-100 rounded-xl p-4 border border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">{label}</p>
                                <p className="text-2xl font-bold text-black">
                                    {value} <span className="text-sm font-normal text-gray-500">cm</span>
                                </p>
                            </div>
                        ))}

                        <div className="bg-gray-100 rounded-xl p-4 border border-gray-200">
                            <p className="text-sm text-gray-600 mb-1">Gender</p>
                            <p className="text-2xl font-bold text-black">
                                {avatar.gender ? avatar.gender : "--"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Status Section */}
                <StatusSection status={avatar.status} />

                {/* Go To Fitting Room Button */}
                {avatar.status == 'ready' && <div className="flex justify-center pt-4">
                    <button
                        className="group relative px-12 py-4 bg-black text-white rounded-2xl font-semibold hover:bg-gray-900 transition-all duration-300 shadow hover:shadow-md transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        onClick={() => navigate(`${RoutePath.FITTING_ROOM_BASE}/${avatar.id}`)}
                    >
                        <span className="flex items-center gap-3">
                            Go To Fitting Room
                            <ArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" size={20} />
                        </span>
                    </button>
                </div>}
            </div>
        </Page>
    );
};

export default AvatarInfoPage;