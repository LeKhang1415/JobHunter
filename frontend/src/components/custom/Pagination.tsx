import {
    Pagination as ShadPagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Props {
    currentPage: number;
    totalPages: number;
    totalElements: number;

    itemsPerPage: number;
    setItemsPerPage: (value: number) => void;

    setCurrentPage: (page: number) => void;

    showItemsPerPageSelect?: boolean;
    theme?: "blue" | "purple";
}

const Pagination = ({
    currentPage,
    totalPages,
    totalElements,
    itemsPerPage,
    setItemsPerPage,
    setCurrentPage,
    showItemsPerPageSelect = true,
    theme = "blue",
}: Props) => {
    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };
    const generatePages = () => {
        const pages: number[] = [];

        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, currentPage + 2);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    const pages = generatePages();

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
                Tổng: <strong>{totalElements}</strong> kết quả
            </div>

            <div className="flex items-center gap-4">
                {showItemsPerPageSelect && (
                    <Select
                        value={String(itemsPerPage)}
                        onValueChange={(val) => {
                            setItemsPerPage(Number(val));
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Page size" />
                        </SelectTrigger>
                        <SelectContent
                            className="bg-white"
                            side="bottom"
                            align="start"
                        >
                            {[5, 10, 20].map((size) => (
                                <SelectItem key={size} value={String(size)}>
                                    {size} trang
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
                <ShadPagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => goToPage(currentPage - 1)}
                                className={
                                    currentPage === 1
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                }
                            />
                        </PaginationItem>

                        {pages[0] > 1 && (
                            <>
                                <PaginationItem>
                                    <PaginationLink onClick={() => goToPage(1)}>
                                        1
                                    </PaginationLink>
                                </PaginationItem>
                                {pages[0] > 2 && (
                                    <span className="px-2">...</span>
                                )}
                            </>
                        )}

                        {pages.map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    isActive={page === currentPage}
                                    onClick={() => goToPage(page)}
                                    className={
                                        page === currentPage
                                            ? theme === "blue"
                                                ? "bg-blue-600 text-white"
                                                : "bg-purple-600 text-white"
                                            : ""
                                    }
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        {pages[pages.length - 1] < totalPages && (
                            <>
                                {pages[pages.length - 1] < totalPages - 1 && (
                                    <span className="px-2">...</span>
                                )}
                                <PaginationItem>
                                    <PaginationLink
                                        onClick={() => goToPage(totalPages)}
                                    >
                                        {totalPages}
                                    </PaginationLink>
                                </PaginationItem>
                            </>
                        )}

                        {/* NEXT */}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => goToPage(currentPage + 1)}
                                className={
                                    currentPage === totalPages
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </ShadPagination>
            </div>
        </div>
    );
};

export default Pagination;
