import { useEffect, useState } from "react";
import Pagination from "@/components/custom/Pagination";
import { getErrorMessage } from "@/features/slices/auth/authThunk";
import {
    findAllResumesForRecruiterCompany,
    updateStatusResumeForRecruiter,
} from "@/services/resumeApi";
import type { ResumeDisplayDto } from "@/types/resume.type";
import { toast } from "sonner";
import { ResumeTable } from "./ResumeTable";
import { UpdateStatusDialog } from "./UpdateStatusDialog";

const ResumeManageRecruiterPage = () => {
    const [resumes, setResumes] = useState<ResumeDisplayDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [selectedResume, setSelectedResume] = useState<ResumeDisplayDto | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchResumes = async (page: number, limit: number) => {
        setIsLoading(true);
        try {
            const response = await findAllResumesForRecruiterCompany({
                page,
                limit,
            });
            const paginatedResult = response.data.result;

            setResumes(paginatedResult.data);
            setTotalElements(paginatedResult.meta.totalItems);
            setTotalPages(paginatedResult.meta.totalPages);
        } catch (err) {
            console.error(getErrorMessage(err, "Không thể lấy danh sách hồ sơ"));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResumes(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage]);

    const handleEditClick = (resume: ResumeDisplayDto) => {
        setSelectedResume(resume);
        setIsDialogOpen(true);
    };

    const handleSaveStatus = async (id: string, status: string) => {
        setIsUpdating(true);
        try {
            await updateStatusResumeForRecruiter(id, status);
            toast.success("Cập nhật trạng thái thành công");
            
            setResumes((prev) =>
                prev.map((resume) =>
                    resume.id === id ? { ...resume, status: status as any, updateAt: new Date() as any } : resume
                )
            );
            setIsDialogOpen(false);
        } catch (error) {
            toast.error(getErrorMessage(error, "Cập nhật trạng thái thất bại"));
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Danh sách hồ sơ ứng tuyển</h2>
            </div>

            <ResumeTable
                resumes={resumes}
                isLoading={isLoading}
                onEdit={handleEditClick}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
            />

            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                totalElements={totalElements}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                showItemsPerPageSelect={true}
                theme="purple"
            />

            <UpdateStatusDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                resume={selectedResume}
                onSave={handleSaveStatus}
                isLoading={isUpdating}
            />
        </div>
    );
};

export default ResumeManageRecruiterPage;
