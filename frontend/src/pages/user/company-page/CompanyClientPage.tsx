import { useState, useEffect } from "react";
import { getAllPublicCompanies } from "@/services/companyApi";
import type { DefaultCompanyResponseDto } from "@/types/company.type";
import CompanySearch from "./components/CompanySearch";
import CompanyCard from "./components/CompanyCard";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function CompanyClientPage() {
    const [companies, setCompanies] = useState<DefaultCompanyResponseDto[]>([]);
    const [nameSearch, setNameSearch] = useState("");
    const [addressSearch, setAddressSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const limit = 9;

    const fetchCompanies = async () => {
        setIsLoading(true);
        try {
            const response = await getAllPublicCompanies({
                page,
                limit,
                name: nameSearch || undefined,
                address: addressSearch || undefined,
            });
            if (response.data) {
                setCompanies(response.data.result.data);
                setTotalPages(response.data.result.meta.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch companies", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, [page]);

    const handleSearch = () => {
        if (page === 1) {
            fetchCompanies();
        } else {
            setPage(1);
        }
    };

    const handleReset = () => {
        setNameSearch("");
        setAddressSearch("");
        setPage(1);
        
        setIsLoading(true);
        getAllPublicCompanies({
            page: 1,
            limit,
        }).then(response => {
            if (response.data) {
                setCompanies(response.data.result.data);
                setTotalPages(response.data.result.meta.totalPages);
            }
            setIsLoading(false);
        }).catch(err => {
            console.error("Failed to fetch companies", err);
            setIsLoading(false);
        });
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <h1 className="text-3xl font-bold mb-8">Danh sách công ty</h1>

            {/* Search Section */}
            <CompanySearch 
                nameSearch={nameSearch}
                setNameSearch={setNameSearch}
                addressSearch={addressSearch}
                setAddressSearch={setAddressSearch}
                onSearch={handleSearch}
                onReset={handleReset}
            />

            {/* Companies Grid */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
            ) : companies.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground bg-gray-50/50 rounded-xl border border-dashed">
                    Không tìm thấy công ty nào phù hợp với từ khóa của bạn.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {companies.map((company) => (
                        <CompanyCard key={company.id} company={company} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
                <Pagination className="mt-8">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (page > 1) setPage(p => p - 1);
                                }}
                                className={page === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>

                        {[...Array(totalPages)].map((_, i) => (
                            <PaginationItem key={i + 1}>
                                <PaginationLink
                                    href="#"
                                    isActive={page === i + 1}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setPage(i + 1);
                                    }}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (page < totalPages) setPage(p => p + 1);
                                }}
                                className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}
