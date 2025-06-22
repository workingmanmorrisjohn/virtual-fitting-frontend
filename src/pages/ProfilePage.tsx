import { LogOutIcon, User as UserIcon } from "lucide-react";
import Header from "../components/core/Header";
import Page from "../components/core/Page";
import Spacer from "../components/core/Spacer";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../hooks/useUser";
import { useRef } from "react";

const ProfilePage = () => {
    const { logout } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data: user, isLoading } = useUser();
    // const { mutate: updateUser } = useUpdateUser();

    // const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (file) {
    //         try {
    //             updateUser({ data: { avatar: file } });
    //         } catch (err) {
    //             console.error("Avatar upload failed:", err);
    //             alert("Failed to upload avatar.");
    //         }
    //     }
    // };

    if (isLoading || !user) {
        return (
            <Page>
                <Header>
                    <h1 className="text-xl font-semibold">Profile</h1>
                </Header>
                <Spacer />
                <div className="w-full flex items-center justify-center py-10">
                    <p className="text-gray-500">Loading profile...</p>
                </div>
            </Page>
        );
    }

    return (
        <Page>
            <Header>
                <h1 className="text-xl font-semibold">Profile</h1>
                <LogOutIcon
                    className="absolute text-red-500 right-8 cursor-pointer"
                    size={25}
                    onClick={logout}
                />
            </Header>

            <Spacer />

            <div className="w-full flex items-center justify-center">
                <div className="w-80 bg-white rounded-lg shadow-md p-6 text-center">
                    <div
                        className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-6 border border-gray-300 cursor-pointer group relative"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {user.avatar ? (
                            <img
                                src={`${import.meta.env.VITE_PB_URL}/api/files/${user.collectionId}/${user.id}/${user.avatar}?thumb=100x100`}
                                alt={user.email || "User Avatar"}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <UserIcon className="w-12 h-12 text-gray-600" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <span className="text-white text-xs font-semibold">Change</span>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                        />
                    </div>

                    <div className="text-left space-y-3 mb-6">
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium break-all">{user.email || "Not available"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Password</p>
                            <p className="font-medium">••••••••</p>
                        </div>
                    </div>

                    <button className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-900 transition">
                        EDIT
                    </button>
                </div>
            </div>
        </Page>
    );
};

export default ProfilePage;
