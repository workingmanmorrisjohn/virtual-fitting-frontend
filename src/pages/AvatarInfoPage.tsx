import { ArrowLeft, User, Image, Ruler, CheckCircle } from "lucide-react";
import Header from "../components/core/Header";
import Page from "../components/core/Page";
import Spacer from "../components/core/Spacer";
import { useNavigate } from "react-router";
import { RoutePath } from "../enums/RoutePath";
import { BASE_URL } from "../constants/BaseUrl";
import AvatarCanvas from "../components/avatar/AvatarCanvas";

const AvatarInfoPage = () => {
    const navigate = useNavigate();

    const avatarFilePath = `${BASE_URL}/api/files/Avatars/4l4p4ds375mxk23/body_j9fceguxjh.glb`;
    const avatar = {
        id: "dinSDgin",
        status: "ready",
        front: `${BASE_URL}/api/files/Avatars/4l4p4ds375mxk23/front_ki4r0xpcln.png`,
        side: `${BASE_URL}/api/files/Avatars/4l4p4ds375mxk23/side_46p8j6emgb.png`
    }

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
                            ID: <span className="text-black font-mono">conspioms</span>
                        </p>
                    </div>
                </div>

                <AvatarCanvas modelPath={avatarFilePath} />

                {/* Sources Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-300">
                    <div className="flex items-center gap-3 mb-6">
                        <Image className="text-gray-700" size={20} />
                        <h2 className="text-lg font-semibold text-gray-800">Source Images</h2>
                    </div>
                    <div className="flex gap-6 justify-center">
                        {/* {["Front View", "Side View"].map((label) => (
                            <div className="group" key={label}>
                                <div className="w-36 h-28 border-2 border-gray-300 rounded-xl bg-gray-100 flex items-center justify-center group-hover:shadow-md transition">
                                    <Image className="text-gray-500 group-hover:text-black transition-colors" size={24} />
                                    <img
                                            src={avatar.front}
                                            alt={`Avatar ${avatar.id}`}
                                            className="w-full h-full object-cover"
                                        />
                                </div>
                                <p className="text-xs text-gray-600 text-center mt-2">{label}</p>
                            </div>
                        ))} */}

                        <div className="group">
                            <div className="w-36 h-28 border-2 border-gray-300 rounded-xl bg-gray-100 flex items-center justify-center group-hover:shadow-md transition">
                                <img
                                    src={avatar.front}
                                    alt={`Avatar ${avatar.id}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-xs text-gray-600 text-center mt-2">Front</p>
                        </div>

                        <div className="group">
                            <div className="w-36 h-28 border-2 border-gray-300 rounded-xl bg-gray-100 flex items-center justify-center group-hover:shadow-md transition">

                                <img
                                    src={avatar.side}
                                    alt={`Avatar ${avatar.id}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-xs text-gray-600 text-center mt-2">Side</p>
                        </div>

                    </div>
                </div>

                {/* Measurements Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-300">
                    <div className="flex items-center gap-3 mb-6">
                        <Ruler className="text-gray-700" size={20} />
                        <h2 className="text-lg font-semibold text-gray-800">Extracted Measurements</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { label: "Height", value: "--" },
                            { label: "Shoulder Width", value: "--" },
                            { label: "Torso heigt", value: "--" },
                            { label: "Side Depth", value: "--" }
                        ].map(({ label, value }) => (
                            <div key={label} className="bg-gray-100 rounded-xl p-4 border border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">{label}</p>
                                <p className="text-2xl font-bold text-black">
                                    {value} <span className="text-sm font-normal text-gray-500">cm</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Section */}
                <div className="bg-gray-100 rounded-2xl p-6 shadow-sm border border-gray-300">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="text-gray-700" size={24} />
                        <div>
                            <p className="text-gray-900 font-semibold">Processing Complete</p>
                            <p className="text-gray-700 text-sm">Your avatar is ready for fitting</p>
                        </div>
                    </div>
                </div>

                {/* Go To Fitting Room Button */}
                <div className="flex justify-center pt-4">
                    <button
                        className="group relative px-12 py-4 bg-black text-white rounded-2xl font-semibold hover:bg-gray-900 transition-all duration-300 shadow hover:shadow-md transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        onClick={() => navigate(RoutePath.FITTING_ROOM)}
                    >
                        <span className="flex items-center gap-3">
                            Go To Fitting Room
                            <ArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" size={20} />
                        </span>
                    </button>
                </div>
            </div>
        </Page>
    );
};

export default AvatarInfoPage;