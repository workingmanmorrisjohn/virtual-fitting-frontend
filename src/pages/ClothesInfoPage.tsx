import { ArrowLeft } from "lucide-react";
import Header from "../components/core/Header";
import Page from "../components/core/Page";
import Spacer from "../components/core/Spacer";
import { RoutePath } from "../enums/RoutePath";
import { useNavigate } from "react-router";


const ClothesInfoPage = () => {
    const navigate = useNavigate();
    
    return (
        <>
        <Page>
            <Header>
                <ArrowLeft className="absolute left-8" onClick={() => {navigate(RoutePath.CLOTHES_LIST)}} />
                <h1 className="text-xl font-semibold">Clothes Info</h1>
            </Header>

            <Spacer />
            
        </Page>
            
        </>
    )
}

export default ClothesInfoPage;