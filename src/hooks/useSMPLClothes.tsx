import { useQuery } from '@tanstack/react-query';
import { usePocketBase } from '../context/PocketBaseContext';
import { CollectionNames } from '../enums/CollectionNames';
import type PocketBase from 'pocketbase';
import { ClothesType, type ClothesThumbnail, type SMPL_Clothes } from '../types/Clothes';
import type { Avatar as AvatarData } from '../types/Avatar';


const fetch_smpl_clothes_by_avatar = async (
    pb: PocketBase,
    avatarId: string
): Promise<{ top: SMPL_Clothes[]; bottom: SMPL_Clothes[] }> => {
    const result = await pb.collection(CollectionNames.CLOTHES_SMPL).getFullList({
        filter: `avatar="${avatarId}"`,
        sort: '-created',
        expand: 'avatar, clothes_thumbnail'
    });

    // @ts-ignore
    const clothes: SMPL_Clothes[] = result.map((record) => ({
        id: record.id,
        collectionId: record.collectionId,
        collectionName: record.collectionName,
        avatar: record.expand?.avatar as AvatarData,
        clothes_thumbnail: record.expand?.clothes_thumbnail as ClothesThumbnail,
        type: record.type,
        model_glb: record.model_glb,
    }));

    const top = clothes.filter((c) => c.type === ClothesType.TOP);
    const bottom = clothes.filter((c) => c.type === ClothesType.BOTTOM);

    console.log(clothes);

    return { top, bottom };
};

export const useSMPLClothesByAvatarId = (avatarId: string | undefined) => {
    const pb = usePocketBase();

    return useQuery({
        queryKey: ['smpl-clothes', avatarId],
        queryFn: () => {
            if (!avatarId) return Promise.resolve({ top: [], bottom: [] });
            return fetch_smpl_clothes_by_avatar(pb, avatarId);
        },
        enabled: !!avatarId,
    });
};
