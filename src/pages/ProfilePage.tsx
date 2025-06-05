import { LogOutIcon } from "lucide-react";
import Header from "../components/core/Header";
import Page from "../components/core/Page";
import Spacer from "../components/core/Spacer";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
    const {logout} = useAuth();
    return (
        <>
        <Page>
            <Header>
                <h1 className="text-xl font-semibold">Profile</h1>
                <LogOutIcon className="absolute text-red-500 right-8" size={25} onClick={logout} />
            </Header>

            <Spacer />
            
        </Page>
            
        </>
    )
}

export default ProfilePage;