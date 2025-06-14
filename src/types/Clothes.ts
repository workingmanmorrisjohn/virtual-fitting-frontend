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