import PocketBase from 'pocketbase';
import { usePocketBase } from '../context/PocketBaseContext';
import { useQuery } from '@tanstack/react-query';
import { CollectionNames } from '../enums/CollectionNames';
import type { Avatar } from '../types/Avatar';

const fetch_avatars = async (
    pb: PocketBase,
    page: number,
    perPage: number
): Promise<{ items: Avatar[]; totalItems: number }> => {
    const result = await pb.collection(CollectionNames.AVATARS).getList(page, perPage, {
        sort: '-created',
    });

    return {
        items: result.items.map((record) => ({
            id: record.id,
            collectionId: record.collectionId,
            collectionName: record.collectionName,
            front_view: record.front_view,
            side_view: record.side_view,
            height: record.height,
            shoulder: record.shoulder,
            torso: record.torso,
            side_depth: record.side_depth,
            unrigged_glb: record.unrigged_glb,
            rigged_glb: record.rigged_glb,
            status: record.status,
            created: record.created,
            updated: record.updated

        })),
        totalItems: result.totalItems,
    };
};

const fetch_avatar_by_id = async (pb: PocketBase, id: string): Promise<Avatar | null> => {
    try {
        const record = await pb.collection(CollectionNames.AVATARS).getOne(id);

        return {
            id: record.id,
            collectionId: record.collectionId,
            collectionName: record.collectionName,
            front_view: record.front_view,
            side_view: record.side_view,
            height: record.height,
            shoulder: record.shoulder,
            torso: record.torso,
            side_depth: record.side_depth,
            unrigged_glb: record.unrigged_glb,
            rigged_glb: record.rigged_glb,
            status: record.status,
            created: record.created,
            updated: record.updated
        };
    } catch (error) {
        // If not found or any error, return null
        return null;
    }
};


export const useAvatars = (page: number, perPage: number) => {
    const pb = usePocketBase();

    return useQuery({
        queryKey: ['avatars', page, perPage],
        queryFn: () => fetch_avatars(pb, page, perPage),
        placeholderData: (previousData) => previousData
    });
};

export const useAvatar = (id: string | undefined) => {
    const pb = usePocketBase();

    return useQuery({
        queryKey: ['avatar', id],
        queryFn: () => {
            if (!id) return Promise.resolve(null);
            return fetch_avatar_by_id(pb, id);
        },
        enabled: !!id, // only run query if id is truthy
    });
};

