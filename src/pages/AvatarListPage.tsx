import { useState } from "react";
import { useNavigate } from "react-router";
import { LogOutIcon, Plus } from "lucide-react";
import { Paginator } from "primereact/paginator";

import { useAuth } from "../context/AuthContext";
import { RoutePath } from "../enums/RoutePath";
import Header from "../components/core/Header";
import Page from "../components/core/Page";
import Spacer from "../components/core/Spacer";
import { useAvatars } from "../hooks/useAvatars";
import AvatarListItem from "../components/avatar/AvatarListItem";

const AvatarListPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const currentPage = Math.floor(first / rows) + 1;

    const { data, isLoading, isError } = useAvatars(currentPage, rows);

    const onPageChange = (e: any) => {
        setFirst(e.first);
        setRows(e.rows);
    };

    return (
        <Page>
            <Header>
                <h1 className="text-xl font-semibold">Avatars</h1>
                <LogOutIcon
                    className="absolute text-red-500 right-8 cursor-pointer hover:text-red-600 transition-colors"
                    size={25}
                    onClick={logout}
                />
            </Header>

            <Spacer />

            {/* Top Paginator */}
            <div className="w-full flex justify-end">
                <Paginator
                    first={first}
                    rows={rows}
                    totalRecords={data?.totalItems ?? 0}
                    onPageChange={onPageChange}
                    rowsPerPageOptions={[5, 10, 20, 50]}
                    className="[&_.p-paginator]:justify-end"
                    template={{
                        layout: "PrevPageLink NextPageLink RowsPerPageDropdown JumpToPageInput",
                    }}
                />
            </div>

            {/* Avatars */}
            <div className="w-full space-y-4">
                {isLoading && (
                    <div className="text-center mt-4">Loading avatars...</div>
                )}
                {isError && (
                    <div className="text-center mt-4 text-red-500">
                        Failed to load avatars.
                    </div>
                )}
                {!isLoading && data?.items.length === 0 && (
                    <div className="text-center mt-4">No avatars available.</div>
                )}
                {data?.items.map((avatar) => (
                    <AvatarListItem key={avatar.id} avatar={avatar} />
                ))}
            </div>

            {/* Floating Action Button */}
            <div
                className="absolute right-8 bottom-8 w-[50px] h-[50px] flex items-center justify-center rounded-full bg-primary text-white cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
                onClick={() => navigate(RoutePath.ADD_AVATAR)}
            >
                <Plus size={35} />
            </div>
        </Page>
    );
};

export default AvatarListPage;
