import PocketBase from 'pocketbase';
import { usePocketBase } from '../context/PocketBaseContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { CollectionNames } from '../enums/CollectionNames';
import type { Avatar } from '../types/Avatar';
import { Endpoints } from '../enums/Endpoints';
import { useEffect } from 'react';

interface AddAvatarParams {
    frontView: File;
    sideView: File;
    backView: File;
    height: number;
    gender: string;
}

const uploadAvatar = async ({ frontView, sideView, backView, height, gender }: AddAvatarParams): Promise<void> => {
    const formData = new FormData();
    formData.append('front_view', frontView);
    formData.append('side_view', sideView);
    formData.append('back_view', backView);
    formData.append('height', height.toString());
    formData.append('gender', gender);

    const response = await fetch(Endpoints.NEW_AVATAR, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload avatar');
    }
};

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
            back_view: record.back_view,
            gender: record.gender,
            size_reco: record.size_reco,
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
            back_view: record.back_view,
            gender: record.gender,
            size_reco: record.size_reco,
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
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['avatars', page, perPage],
        queryFn: () => fetch_avatars(pb, page, perPage),
        placeholderData: (previousData) => previousData,
    });

    useEffect(() => {
        const handleChange = () => {
            // Refetch the avatars list when any change occurs
            queryClient.invalidateQueries({ queryKey: ['avatars', page, perPage] });
        };

        pb.collection(CollectionNames.AVATARS).subscribe('*', handleChange);

        return () => {
            pb.collection(CollectionNames.AVATARS).unsubscribe('*');
        };
    }, [pb, page, perPage, queryClient]);

    return query;
};

export const useAvatar = (id: string | undefined) => {
    const pb = usePocketBase();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['avatar', id],
        queryFn: () => {
            if (!id) return Promise.resolve(null);
            return fetch_avatar_by_id(pb, id);
        },
        enabled: !!id,
    });

    useEffect(() => {
        if (!id) return;

        const handleChange = (e: any) => {
            // Manually update the cache with the new record
            queryClient.setQueryData(['avatar', id], e.record);
        };

        pb.collection(CollectionNames.AVATARS).subscribe(id, handleChange);

        return () => {
            pb.collection(CollectionNames.AVATARS).unsubscribe(id);
        };
    }, [pb, id, queryClient]);

    return query;
};

export const useAddAvatar = () => {
    return useMutation({
        mutationFn: uploadAvatar,
    });
};