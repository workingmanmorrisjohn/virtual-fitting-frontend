import { ArrowLeft } from "lucide-react";
import Header from "../components/core/Header";
import Page from "../components/core/Page";
import Spacer from "../components/core/Spacer";
import { useNavigate } from "react-router";
import { RoutePath } from "../enums/RoutePath";

const AddAvatarPage = () => {
    const navigate = useNavigate();

    return (
        <>
        <Page>
            <Header>
                <ArrowLeft className="absolute left-8" onClick={() => {navigate(RoutePath.HOME)}} />
                <h1 className="text-xl font-semibold">Add Avatar</h1>
            </Header>

            <Spacer />
            
        </Page>
            
        </>
    )
}

export default AddAvatarPage;