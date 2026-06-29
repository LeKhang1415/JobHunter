import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import type { ResumeDisplayDto } from "@/types/resume.type";
import { Briefcase } from "lucide-react";
import HasPermission from "@/components/custom/HasPermission";

interface UpdateStatusDialogProps {
    isOpen: boolean;
    onClose: () => void;
    resume: ResumeDisplayDto | null;
    onSave: (id: string, status: string) => void;
    isLoading: boolean;
}

const STATUS_OPTIONS = [
    { value: "PENDING", label: "Chờ duyệt" },
    { value: "REVIEWING", label: "Đang xem xét" },
    { value: "APPROVED", label: "Chấp nhận" },
    { value: "REJECTED", label: "Từ chối" },
];

export function UpdateStatusDialog({
    isOpen,
    onClose,
    resume,
    onSave,
    isLoading,
}: UpdateStatusDialogProps) {
    const [status, setStatus] = useState<string>("");

    useEffect(() => {
        if (resume) {
            setStatus(resume.status);
        }
    }, [resume]);

    const handleSave = () => {
        if (resume && status) {
            onSave(resume.id, status);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[90vw] w-[1000px] max-h-[90vh] flex flex-col p-6">
                <DialogHeader className="mb-2">
                    <DialogTitle className="text-xl font-bold text-center">Hồ sơ ứng cử viên</DialogTitle>
                    <p className="text-sm text-gray-500 text-center">Thông tin chi tiết của ứng cử viên</p>
                </DialogHeader>

                <div className="flex-1 min-h-[400px] border rounded-lg bg-gray-50 overflow-hidden relative">
                    {resume?.fileUrl ? (
                        <iframe src={resume.fileUrl} className="w-full h-full absolute inset-0" title="CV" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">Không có hồ sơ đính kèm</div>
                    )}
                </div>

                <div className="flex justify-center items-center gap-4 mt-6 border-t pt-4">
                    <HasPermission perm={["PATCH /resume/recruiter/:id"]}>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
                            onClick={handleSave}
                            disabled={isLoading || status === resume?.status}
                        >
                            {isLoading ? "Đang lưu..." : "Cập nhật"}
                        </Button>
                    </HasPermission>
                </div>
            </DialogContent>
        </Dialog>
    );
}
