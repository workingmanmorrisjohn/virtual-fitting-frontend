import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { usePocketBase } from "../context/PocketBaseContext";
import { CollectionNames } from "../enums/CollectionNames";
import type { RecordModel } from "pocketbase";
import type { User } from "../types/User";

export const useUser = () => {
    const pb = usePocketBase();
    const queryClient = useQueryClient();
    const userId = pb.authStore.model?.id;

    const query = useQuery({
        queryKey: ["user", userId],
        queryFn: async (): Promise<RecordModel | null> => {
            if (!userId) return null;
            return await pb.collection(CollectionNames.USERS).getOne(userId);
        },
        enabled: !!userId,
    });

    useEffect(() => {
        if (!userId) return;

        const handleChange = (e: any) => {
            queryClient.setQueryData(["user", userId], e.record);
        };

        pb.collection(CollectionNames.USERS).subscribe(userId, handleChange);

        return () => {
            pb.collection(CollectionNames.USERS).unsubscribe(userId);
        };
    }, [pb, userId, queryClient]);

    return query;
};

interface UpdateUserParams {
    data: Partial<User>;
}

export const useUpdateUser = () => {
    const pb = usePocketBase();
    const queryClient = useQueryClient();
    const userId = pb.authStore.model?.id;

    return useMutation({
        mutationFn: async ({ data }: UpdateUserParams): Promise<User> => {
            if (!userId) throw new Error("No user logged in");

            const formData = new FormData();
            for (const [key, value] of Object.entries(data)) {
                formData.append(key, value as any);
            }

            const updated = await pb.collection(CollectionNames.USERS).update(userId, formData);
            return updated as unknown as User;
        },
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(["user", updatedUser.id], updatedUser);
        },
    });
};
