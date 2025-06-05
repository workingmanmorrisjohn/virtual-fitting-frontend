import { LogOutIcon, Plus } from "lucide-react";
import Header from "../components/core/Header";
import Page from "../components/core/Page";
import Spacer from "../components/core/Spacer";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { RoutePath } from "../enums/RoutePath";

const AvatarListPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    return (
        <>
            <Page>
                <Header>
                    <h1 className="text-xl font-semibold">Avatars</h1>
                    <LogOutIcon className="absolute text-red-500 right-8" size={25} onClick={logout} />
                </Header>

                <Spacer />

                <div className="btn btn-ghost" onClick={() => navigate(RoutePath.AVATAR_INFO)}>Avatar Info</div>
                <div
                    className="absolute right-8 bottom-8 w-[50px] h-[50px] flex items-center justify-center rounded-full bg-primary text-white"
                    onClick={() => navigate(RoutePath.ADD_AVATAR)}
                >
                    <Plus size={35} />
                </div>


            </Page>

        </>
    )
}

export default AvatarListPage;