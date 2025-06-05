export interface Post {
    id: string
    collectionName: string
    created: Date
    modified: Date
    title: string
    text: string
    image: string | null
}

export interface AddPostParams {
    title: string;
    text: string;
    image: File | null;
}

export interface UpdatePostWithImageParams {
    id: string;
    title: string;
    text: string;
    image: File | null;
}

export interface UpdatePostWithNoImageParams {
    id: string;
    title: string;
    text: string;
}