import PocketBase from 'pocketbase';
import { usePocketBase } from '../context/PocketBaseContext';
import { useQuery } from '@tanstack/react-query';
import { CollectionNames } from '../enums/CollectionNames';
import type { Clothes } from '../types/Clothes';

const fetch_clothes = async (
    pb: PocketBase,
    page: number,
    perPage: number
): Promise<{ items: Clothes[]; totalItems: number }> => {
    const result = await pb.collection(CollectionNames.CLOTHES).getList(page, perPage, {
        expand: 'sizes',
        sort: '-created',
    });

    return {
        items: result.items.map((record) => ({
            id: record.id,
            collectionId: record.collectionId,
            collectionName: record.collectionName,
            thumbnail: record.thumbnail,
            thumbnail_glb: record.thumbnail_glb,
            sizes: (record.expand?.sizes || []).map((size: any) => ({
                id: size.id,
                collectionId: size.collectionId,
                collectionName: size.collectionName,
                name: size.name,
                chest: size.chest,
                torso: size.torso,
                arms: size.arms,
                unrigged_glb: size.unrigged_glb,
                rigged_glb: size.rigged_glb,
                created: size.created,
                updated: size.updated,
            })), // expanded sizes
            created: record.created,
            updated: record.updated,
        })),
        totalItems: result.totalItems,
    };
};

const fetch_clothes_by_id = async (pb: PocketBase, id: string): Promise<Clothes | null> => {
    try {
        const record = await pb.collection(CollectionNames.CLOTHES).getOne(id, {
            expand: 'sizes',
        });

        return {
            id: record.id,
            collectionId: record.collectionId,
            collectionName: record.collectionName,
            thumbnail: record.thumbnail,
            thumbnail_glb: record.thumbnail_glb,
            sizes: (record.expand?.sizes || []).map((size: any) => ({
                id: size.id,
                collectionId: size.collectionId,
                collectionName: size.collectionName,
                name: size.name,
                chest: size.chest,
                torso: size.torso,
                arms: size.arms,
                unrigged_glb: size.unrigged_glb,
                rigged_glb: size.rigged_glb,
                created: size.created,
                updated: size.updated,
            })), // expanded sizes
            created: record.created,
            updated: record.updated,
        };
    } catch (error) {
        return null;
    }
};

export const useClothes = (page: number, perPage: number) => {
    const pb = usePocketBase();

    return useQuery({
        queryKey: ['clothes', page, perPage],
        queryFn: () => fetch_clothes(pb, page, perPage),
        placeholderData: (previousData) => previousData,
    });
};

export const useClothesItem = (id: string | undefined) => {
    const pb = usePocketBase();

    return useQuery({
        queryKey: ['clothes', id],
        queryFn: () => {
            if (!id) return Promise.resolve(null);
            return fetch_clothes_by_id(pb, id);
        },
        enabled: !!id,
    });
};
