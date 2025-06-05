import PocketBase from 'pocketbase';
import type { AddPostParams, Post, UpdatePostWithImageParams, UpdatePostWithNoImageParams } from '../types/Post';
import { usePocketBase } from '../context/PocketBaseContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CollectionNames } from '../enums/CollectionNames';

const fetch_posts = async (
    pb: PocketBase,
    page: number,
    perPage: number
): Promise<{ items: Post[]; totalItems: number }> => {
    const result = await pb.collection(CollectionNames.POSTS).getList(page, perPage, {
        sort: '-created',
    });

    return {
        items: result.items.map((record) => ({
            id: record.id,
            collectionName: record.collectionName,
            created: new Date(record.created),
            modified: new Date(record.updated),
            title: record.title,
            text: record.text,
            image: record.image,
        })),
        totalItems: result.totalItems,
    };
};

export const usePosts = (page: number, perPage: number) => {
    const pb = usePocketBase();

    return useQuery({
        queryKey: ['posts', page, perPage],
        queryFn: () => fetch_posts(pb, page, perPage),
        placeholderData: (previousData) => previousData
    });
};

const createPost = async ({ pb, data }: { pb: PocketBase; data: AddPostParams }): Promise<Post> => {
    const record = await pb.collection(CollectionNames.POSTS).create(data);
    return {
        id: record.id,
        collectionName: record.collectionName,
        created: new Date(record.created),
        modified: new Date(record.updated),
        title: record.title,
        text: record.text,
        image: record.image,
    };
};

const deletePost = async ({ pb, postId }: { pb: PocketBase; postId: string }) => {
    await pb.collection(CollectionNames.POSTS).delete(postId);
};

const updatePostWithImage = async ({ pb, id, ...data }: { pb: PocketBase } & UpdatePostWithImageParams): Promise<Post> => {
    const record = await pb.collection(CollectionNames.POSTS).update(id, data);

    return {
        id: record.id,
        collectionName: record.collectionName,
        created: new Date(record.created),
        modified: new Date(record.updated),
        title: record.title,
        text: record.text,
        image: record.image,
    };
}

const updatePostWithNoImage = async ({ pb, id, ...data }: { pb: PocketBase } & UpdatePostWithNoImageParams): Promise<Post> => {
    const record = await pb.collection(CollectionNames.POSTS).update(id, data);

    return {
        id: record.id,
        collectionName: record.collectionName,
        created: new Date(record.created),
        modified: new Date(record.updated),
        title: record.title,
        text: record.text,
        image: record.image,
    };
}

export const useAddPost = () => {
    const pb = usePocketBase();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AddPostParams) => createPost({ pb, data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
};


export const useDeletePost = () => {
    const pb = usePocketBase();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId: string) => deletePost({ pb, postId }),
        onSuccess: (_, postId) => {
            queryClient.setQueryData(['posts'], (oldPosts: Post[] | undefined) =>
                oldPosts?.filter((p) => p.id !== postId) || []
            );
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
};

export const useUpdatePostWithImage = () => {
    const pb = usePocketBase();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdatePostWithImageParams) => updatePostWithImage({ pb, ...data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
};

export const useUpdatePostWithNoImage = () => {
    const pb = usePocketBase();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdatePostWithNoImageParams) => updatePostWithNoImage({ pb, ...data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
    });
};