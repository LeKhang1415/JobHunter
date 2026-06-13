import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { getAllCompanies, deleteCompany } from "@/services/companyApi";
import type { DefaultCompanyResponseDto } from "@/types/company.type";
import Pagination from "@/components/custom/Pagination";
import { getErrorMessage } from "@/features/slices/auth/authThunk";
import CompanyFormDialog from "./CompanyFormDialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import CompanySearch from "./CompanySearch";
import { CompanyTable } from "./CompanyTable";

const CompanyManagerPage = () => {
    const [companies, setCompanies] = useState<DefaultCompanyResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [searchName, setSearchName] = useState<string>("");

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(5);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalElements, setTotalElements] = useState<number>(0);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Fetch companies
    const fetchCompanies = async (
        page: number,
        limit: number,
        name?: string,
    ) => {
        setIsLoading(true);
        try {
            const params = {
                page: Number(page) > 0 ? Number(page) : 1,
                limit: Number(limit) > 0 ? Number(limit) : 5,
                searchName: name?.trim() || undefined,
            };

            const res = (await getAllCompanies(params)).data.result;

            setCompanies(res.data);
            setTotalElements(res.meta.totalItems);
            setTotalPages(res.meta.totalPages);
        } catch (err) {
            toast.error(
                getErrorMessage(err, "Không thể lấy danh sách công ty."),
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchCompanies(currentPage, itemsPerPage, searchName);
        }, 300);

        return () => clearTimeout(timeout);
    }, [currentPage, itemsPerPage, searchName]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchName]);

    const handleReset = () => {
        setSearchName("");
        setCurrentPage(1);
    };

    const handleDeleteCompany = async (id: string) => {
        try {
            await deleteCompany(id);
            toast.success("Xóa công ty thành công.");
            fetchCompanies(currentPage, itemsPerPage, searchName);
        } catch (err) {
            toast.error(getErrorMessage(err, "Xóa công ty thất bại."));
        }
    };

    const handleRefresh = () => {
        fetchCompanies(currentPage, itemsPerPage, searchName);
    };

    return (
        <div className="space-y-6">
            <CompanySearch
                searchName={searchName}
                setSearchName={setSearchName}
                onReset={handleReset}
            />

            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Danh sách Công ty</h2>
                <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="flex items-center gap-2"
                >
                    <Plus size={18} />
                    Thêm công ty
                </Button>
            </div>

            <CompanyTable
                companies={companies}
                isLoading={isLoading}
                onDelete={handleDeleteCompany}
                onRefresh={handleRefresh}
                theme="blue"
            />

            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                totalElements={totalElements}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                showItemsPerPageSelect={true}
                theme="blue"
            />

            <CompanyFormDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={() => {
                    setIsDialogOpen(false);
                    fetchCompanies(currentPage, itemsPerPage, searchName);
                }}
            />
        </div>
    );
};

export default CompanyManagerPage;
