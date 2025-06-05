import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Post } from "../types/Post";
import { getFileURL, openModal } from "../utils/UtilityFunctions";
import { ModalNames } from "../enums/ModalNames";

interface PostContextType {
    id: string,
    title: string,
    text: string,
    image: File | null,
    imagePreview: string | null,
    previousImage: string | null

    setTitle: (newTitle: string) => void,
    setText: (newText: string) => void,
    setImage: (newImage: File | null) => void,
    setImagePreview: (newImagePreview: string | null) => void,
    newPost: () => void,
    editPost: (post: Post) => void
    uploadedSuccessfully: () => void
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [id, setId] = useState("");
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploaded, setUploaded] = useState(false);
    const [previousImage, setPreviousImage] = useState<string | null>(null);

    const newPost = () => {
        if (uploaded) {
            resetPost();
        }

    }

    const resetPost = () => {
        const today = new Date();
        const formattedDate = today.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });

        setId("");
        setTitle(formattedDate);
        setText("");
        setImage(null);
        setImagePreview(null);
    }

    const editPost = (post: Post) => {
        setUploaded(true);
        setTitle(post.title);
        setId(post.id);
        setText(post.text);
        setImagePreview(getFileURL(post));
        setPreviousImage(getFileURL(post));

        openModal(ModalNames.ADD_POST);
    }

    const uploadedSuccessfully = () => {
        setUploaded(true);
    }

    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });

        setTitle(formattedDate);
    }, []);



    return (
        <PostContext.Provider value={{
            id,
            title,
            text,
            image,
            imagePreview,
            previousImage,
            setTitle,
            setText,
            setImage,
            setImagePreview,
            newPost,
            editPost,
            uploadedSuccessfully
        }}>
            {children}
        </PostContext.Provider>
    );
}

export const usePost = () => {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error('usePost must be used within an PostProvider');
    }
    return context;
};