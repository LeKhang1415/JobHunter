import Pagination from "@/components/custom/Pagination";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/features/slices/auth/authThunk";
import { JobDetailsSidebar } from "@/pages/commons/job-manager-components/JobDetailsSidebar";
import { JobSearchSection } from "@/pages/commons/job-manager-components/JobSearchSection";
import { JobTable } from "@/pages/commons/job-manager-components/JobTable.tsx";
import {
    deleteJobForRecruiter,
    findAllJobsForRecruiterCompany,
} from "@/services/jobApi";
import type { Job, JobPaginationQuery } from "@/types/job.type";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const JobManagerRecruiterPage = () => {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [isExpandedSearch, setIsExpandedSearch] = useState(false);

    const [searchName, setSearchName] = useState("");
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
        searchName: string,
        searchLevel: string,
        searchLocation: string,
    ) => {
        setIsLoading(true);
        try {
            const params: JobPaginationQuery = {
                page: page,
                limit: size,
            };

            if (searchName) params.name = searchName;
            if (searchLevel && searchLevel !== "all")
                params.level = searchLevel;
            if (searchLocation) params.location = searchLocation;

            const response = await findAllJobsForRecruiterCompany(params);

            const paginatedResult = response.data.result;

            setJobs(paginatedResult.data);
            setTotalElements(paginatedResult.meta.totalItems);
            setTotalPages(paginatedResult.meta.totalPages);
        } catch (err) {
            console.error(
                getErrorMessage(err, "Không thể lấy danh sách công việc"),
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs(
            currentPage,
            itemsPerPage,
            searchName,
            searchLevel,
            searchLocation,
        );
    }, [currentPage, itemsPerPage, searchName, searchLevel, searchLocation]);

    const handleReset = () => {
        setSearchName("");
        setSearchLevel("all");
        setSearchLocation("");
        setIsExpandedSearch(false);

        fetchJobs(
            currentPage,
            itemsPerPage,
            searchName,
            searchLevel,
            searchLocation,
        );
    };

    const handleDelete = async (id: string) => {
        setIsLoading(true);
        try {
            await deleteJobForRecruiter(id);
            console.log("Xóa công ty thành công");

            if (hoveredJob?.id === id) handleCloseDetails();
            handleReset();
        } catch (err) {
            console.log(getErrorMessage(err, "Xóa công ty thất bại"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenUpdatePage = async (id: string) => {
        navigate(`/recruiter/jobs/upsert?id=${id}`);
    };

    return (
        <div className="space-y-6">
            <JobSearchSection
                searchName={searchName}
                searchLevel={searchLevel}
                searchLocation={searchLocation}
                isExpanded={isExpandedSearch}
                onReset={handleReset}
                onExpandToggle={() => setIsExpandedSearch(!isExpandedSearch)}
                onChange={{
                    name: setSearchName,
                    level: setSearchLevel,
                    location: setSearchLocation,
                }}
            />

            {/* Header Section */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Danh sách công việc</h2>
                <Button
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => navigate("/recruiter/jobs/upsert")}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm mới
                </Button>
            </div>

            <JobTable
                jobs={jobs}
                isLoading={isLoading}
                onEdit={handleOpenUpdatePage}
                onDelete={handleDelete}
                onView={(job) => handleOpenDetails(job)}
                theme={"purple"}
            />

            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                totalElements={totalElements}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                showItemsPerPageSelect={true}
                theme={"purple"}
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

export default JobManagerRecruiterPage;
