import { useEffect, useState } from "react";
import Pagination from "@/components/custom/Pagination";
import { getErrorMessage } from "@/features/slices/auth/authThunk";
import {
    findAllResumesAdmin,
    updateStatusResumeAdmin,
} from "@/services/resumeApi";
import type { ResumeDisplayDto } from "@/types/resume.type";
import { toast } from "sonner";
import { ResumeTableAdmin } from "./ResumeTableAdmin";
import { UpdateStatusDialog } from "@/pages/recruiter/resume-page/UpdateStatusDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export default function ResumeManagerAdminPage() {
    const [resumes, setResumes] = useState<ResumeDisplayDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const [companyName, setCompanyName] = useState("");
    const [jobName, setJobName] = useState("");

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedResume, setSelectedResume] = useState<ResumeDisplayDto | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchResumes = async () => {
        try {
            setIsLoading(true);
            const response = await findAllResumesAdmin({
                page: currentPage,
                limit: itemsPerPage,
                companyName: companyName || undefined,
                jobName: jobName || undefined,
            });

            if (response.data.result) {
                setResumes(response.data.result.data);
                setTotalPages(response.data.result.meta.totalPages);
                setTotalItems(response.data.result.meta.totalItems);
            }
        } catch (error) {
            toast.error(getErrorMessage(error, "Lỗi khi lấy danh sách hồ sơ"));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchResumes();
        }, 500);

        return () => clearTimeout(debounce);
    }, [currentPage, itemsPerPage, companyName, jobName]);

    const handleReset = () => {
        setCompanyName("");
        setJobName("");
        setCurrentPage(1);
    };

    const handleEditClick = (resume: ResumeDisplayDto) => {
        setSelectedResume(resume);
        setIsDialogOpen(true);
    };

    const handleSaveStatus = async (id: string, status: string) => {
        try {
            setIsUpdating(true);
            await updateStatusResumeAdmin(id, status);
            toast.success("Cập nhật trạng thái thành công!");
            setIsDialogOpen(false);
            fetchResumes(); // Refresh data
        } catch (error) {
            toast.error(getErrorMessage(error, "Cập nhật trạng thái thất bại"));
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Filter Section */}
            <div className="bg-white p-4 rounded-lg border flex gap-4 items-end mb-6">
                <div className="flex-1">
                    <label className="text-sm font-medium mb-1.5 block">Tên công ty:</label>
                    <Input
                        placeholder="Nhập tên công ty..."
                        value={companyName}
                        onChange={(e) => {
                            setCompanyName(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                <div className="flex-1">
                    <label className="text-sm font-medium mb-1.5 block">Tên công việc:</label>
                    <Input
                        placeholder="Nhập tên công việc..."
                        value={jobName}
                        onChange={(e) => {
                            setJobName(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Làm lại
                </Button>
            </div>

            <ResumeTableAdmin
                resumes={resumes}
                isLoading={isLoading}
                onEdit={handleEditClick}
            />

            {!isLoading && totalPages > 0 && (
                <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                    totalElements={totalItems}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    showItemsPerPageSelect={true}
                    theme="blue"
                />
            )}

            <UpdateStatusDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                resume={selectedResume}
                onSave={handleSaveStatus}
                isLoading={isUpdating}
            />
        </div>
    );
}
