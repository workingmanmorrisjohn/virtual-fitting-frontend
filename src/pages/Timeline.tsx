import { LogOutIcon } from "lucide-react";
import Header from "../components/core/Header";
import Page from "../components/core/Page";
import Spacer from "../components/core/Spacer";
import AddPostModal from "../components/timeline/AddPostModal";
import PostList from "../components/timeline/PostList";
import { useAuth } from "../context/AuthContext";

const Timeline = () => {
    const {logout} = useAuth();
    
    return (
        <>
        <Page>
            <Header>
                <h1 className="text-xl font-semibold">9:22 AM</h1>
                <LogOutIcon className="absolute text-red-500 right-8" size={25} onClick={logout} />
            </Header>

            <Spacer />
            <PostList />
            
            <AddPostModal />

        </Page>
            
        </>
    )
}

export default Timeline;