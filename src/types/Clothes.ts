import type { Avatar } from "primereact/avatar";

export type ClothesSize = {
    id: string;
    collectionId: string;
    collectionName: string;
    name: string;
    chest: number;
    torso: number;
    arms: number;
    unrigged_glb: string;
    rigged_glb: string;
    created: string;
    updated: string;
};

export type Clothes = {
    id: string;
    collectionId: string;
    collectionName: string;
    thumbnail: string;
    thumbnail_glb: string;
    sizes: ClothesSize[]; // unexpanded relation
    created: string;
    updated: string;
};


export type SMPL_Clothes = {
    id: string;
    collectionId: string;
    collectionName: string;
    avatar: Avatar;
    clothes_thumbnail: ClothesThumbnail;
    type: ClothesType;
    model_glb: string
}

export enum ClothesType {
    TOP = "Top",
    BOTTOM = "Bottom"
}


export type ClothesThumbnail = {
    id: string;
    collectionId: string;
    collectionName: string;
    image: string;
    model:string
}