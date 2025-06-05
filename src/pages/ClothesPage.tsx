import { LogOutIcon } from "lucide-react";
import Header from "../components/core/Header";
import Page from "../components/core/Page";
import Spacer from "../components/core/Spacer";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { RoutePath } from "../enums/RoutePath";

const ClothesPage = () => {
    const {logout} = useAuth();
    const navigate = useNavigate();

    return (
        <>
        <Page>
            <Header>
                <h1 className="text-xl font-semibold">Clothes</h1>
                <LogOutIcon className="absolute text-red-500 right-8" size={25} onClick={logout} />
            </Header>

            <Spacer />

            <div className="btn btn-ghost" onClick={() => navigate(RoutePath.CLOTHES_INFO)}>Clothes Info</div>
            
        </Page>
            
        </>
    )
}

export default ClothesPage;