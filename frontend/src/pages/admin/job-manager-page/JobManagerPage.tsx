import Pagination from "@/components/custom/Pagination";
import { getErrorMessage } from "@/features/slices/auth/authThunk";
import { JobDetailsSidebar } from "@/pages/commons/job-manager-page/JobDetailsSidebar";
import { JobSearchSection } from "@/pages/commons/job-manager-page/JobSearchSection";
import { JobTable } from "@/pages/commons/job-manager-page/JobTable";
import { findAllJobs, deleteJobById } from "@/services/jobApi";
import type { Job, JobPaginationQuery } from "@/types/job.type";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const JobManagerAdminPage = () => {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [isExpandedSearch, setIsExpandedSearch] = useState(false);

    const [searchName, setSearchName] = useState("");
    const [searchCompanyName, setSearchCompanyName] = useState("");
    const [searchLevel, setSearchLevel] = useState("all");
    const [searchLocation, setSearchLocation] = useState("");

    const [hoveredJob, setHoveredJob] = useState<Job | null>(null);
    const [showDetailsSidebar, setShowDetailsSidebar] = useState(false);

    const handleOpenDetails = (job: Job) => {
        setHoveredJob(job);
        setShowDetailsSidebar(true);
    };

    const handleCloseDetails = () => {
        setHoveredJob(null);
        setShowDetailsSidebar(false);
    };

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

            const response = await findAllJobs(params);
            const paginatedResult = response.data.result;

            setJobs(paginatedResult.data);
            setTotalElements(paginatedResult.meta.totalItems);
            setTotalPages(paginatedResult.meta.totalPages);
        } catch (err) {
            toast.error(
                getErrorMessage(err, "Không thể lấy danh sách công việc"),
            );
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

    const handleDelete = async (id: string) => {
        try {
            await deleteJobById(id);
            toast.success("Xóa công việc thành công");

            if (hoveredJob?.id === id) handleCloseDetails();
            fetchJobs(
                currentPage,
                itemsPerPage,
                searchName,
                searchCompanyName,
                searchLevel,
                searchLocation,
            );
        } catch (err) {
            toast.error(getErrorMessage(err, "Xóa công việc thất bại"));
        }
    };

    const handleOpenUpdatePage = (id: string) => {
        navigate(`/admin/job-manager/upsert?id=${id}`);
    };

    return (
        <div className="space-y-6">
            <JobSearchSection
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

            {/* Header Section */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                    Danh sách công việc
                </h2>
            </div>

            <JobTable
                jobs={jobs}
                isLoading={isLoading}
                onEdit={handleOpenUpdatePage}
                onDelete={handleDelete}
                onView={(job) => handleOpenDetails(job)}
                theme={"blue"}
            />

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

            {hoveredJob && (
                <JobDetailsSidebar
                    job={hoveredJob}
                    isOpen={showDetailsSidebar}
                    onClose={handleCloseDetails}
                    onEdit={(job) => handleOpenUpdatePage(job.id)}
                    onDelete={(id) => handleDelete(id)}
                />
            )}
        </div>
    );
};

export default JobManagerAdminPage;
