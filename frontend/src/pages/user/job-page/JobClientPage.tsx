import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/features/slices/auth/authThunk";
import { findAllJobsForClient } from "@/services/jobApi";
import type { JobResponseDto, JobPaginationQuery } from "@/types/job.type";
import { JobClientSearchSection } from "./components/JobClientSearchSection";
import JobCard from "@/pages/user/job-page/components/JobCard";
import Pagination from "@/components/custom/Pagination";
import { Loader2 } from "lucide-react";

export default function JobClientPage() {
    const [jobs, setJobs] = useState<JobResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [isExpandedSearch, setIsExpandedSearch] = useState(false);

    const [searchName, setSearchName] = useState("");
    const [searchCompanyName, setSearchCompanyName] = useState("");
    const [searchLevel, setSearchLevel] = useState("all");
    const [searchLocation, setSearchLocation] = useState("");

    const fetchJobs = async (
        page: number,
        size: number,
        name: string,
        companyName: string,
        level: string,
        location: string,
    ) => {
        setIsLoading(true);
        try {
            const params: JobPaginationQuery = {
                page: page,
                limit: size,
            };

            if (name) params.name = name;
            if (companyName) params.companyName = companyName;
            if (level && level !== "all") params.level = level;
            if (location) params.location = location;

            const response = await findAllJobsForClient(params);
            const paginatedResult = response.data.result;

            setJobs(paginatedResult.data);
            setTotalElements(paginatedResult.meta.totalItems);
            setTotalPages(paginatedResult.meta.totalPages);
        } catch (err) {
            toast.error(getErrorMessage(err, "Không thể lấy danh sách công việc"));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchJobs(
                currentPage,
                itemsPerPage,
                searchName,
                searchCompanyName,
                searchLevel,
                searchLocation,
            );
        }, 300);

        return () => clearTimeout(timeout);
    }, [
        currentPage,
        itemsPerPage,
        searchName,
        searchCompanyName,
        searchLevel,
        searchLocation,
    ]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchName, searchCompanyName, searchLevel, searchLocation]);

    const handleReset = () => {
        setSearchName("");
        setSearchCompanyName("");
        setSearchLevel("all");
        setSearchLocation("");
        setIsExpandedSearch(false);
    };

    return (
        <div className="container mx-auto py-8 space-y-8 px-4 md:px-6">
            <div className="text-center space-y-4 mb-8">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Tìm kiếm việc làm</h1>
                <p className="text-gray-500 text-lg">Khám phá hàng ngàn cơ hội việc làm phù hợp với bạn</p>
            </div>

            <JobClientSearchSection
                searchName={searchName}
                searchCompanyName={searchCompanyName}
                searchLevel={searchLevel}
                searchLocation={searchLocation}
                isExpanded={isExpandedSearch}
                onReset={handleReset}
                onExpandToggle={() => setIsExpandedSearch(!isExpandedSearch)}
                onChange={{
                    name: setSearchName,
                    company: setSearchCompanyName,
                    level: setSearchLevel,
                    location: setSearchLocation,
                }}
            />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {totalElements > 0 ? `Tìm thấy ${totalElements} việc làm` : "Danh sách việc làm"}
                    </h2>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                    </div>
                ) : jobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-gray-500 text-lg">Không tìm thấy công việc nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
                        <button onClick={handleReset} className="mt-4 text-green-600 hover:text-green-700 font-medium transition-colors">Xóa bộ lọc</button>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="pt-6">
                        <Pagination
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                            totalElements={totalElements}
                            itemsPerPage={itemsPerPage}
                            setItemsPerPage={setItemsPerPage}
                            showItemsPerPageSelect={true}
                            theme={"blue"}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
