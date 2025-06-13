import { useState } from "react";
import { LogOutIcon } from "lucide-react";
import { Paginator } from "primereact/paginator";

import { useAuth } from "../context/AuthContext";
import Header from "../components/core/Header";
import Page from "../components/core/Page";
import Spacer from "../components/core/Spacer";
import { useClothes } from "../hooks/useClothes"; // <--- New clothes hook
import ClothesListItem from "../components/clothes/ClothesListItem"; // <--- You’ll need to create this component

const ClothesPage = () => {
    const { logout } = useAuth();

    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const currentPage = Math.floor(first / rows) + 1;

    const { data, isLoading, isError } = useClothes(currentPage, rows);

    const onPageChange = (e: any) => {
        setFirst(e.first);
        setRows(e.rows);
    };

    return (
        <Page>
            <Header>
                <h1 className="text-xl font-semibold">Clothes</h1>
                <LogOutIcon
                    className="absolute text-red-500 right-8 cursor-pointer hover:text-red-600 transition-colors"
                    size={25}
                    onClick={logout}
                />
            </Header>

            <Spacer />

            {/* Paginator */}
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

            {/* Clothes List */}
            <div className="w-full space-y-4">
                {isLoading && (
                    <div className="text-center mt-4">Loading clothes...</div>
                )}
                {isError && (
                    <div className="text-center mt-4 text-red-500">
                        Failed to load clothes.
                    </div>
                )}
                {!isLoading && data?.items.length === 0 && (
                    <div className="text-center mt-4">No clothes available.</div>
                )}
                {data?.items.map((clothes) => (
                    <ClothesListItem key={clothes.id} clothes={clothes} />
                ))}
            </div>
        </Page>
    );
};

export default ClothesPage;
