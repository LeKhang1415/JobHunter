import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getErrorMessage } from "@/features/slices/auth/authThunk";
import { findJobById } from "@/services/jobApi";
import type { JobResponseDto } from "@/types/job.type";
import JobSection from "./components/JobSection";
import { Loader2, ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

export default function JobDetailsClientPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [job, setJob] = useState<JobResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchJob = async () => {
            setIsLoading(true);
            try {
                const response = await findJobById(id);
                setJob(response.data.result);
            } catch (err) {
                toast.error(getErrorMessage(err, "Không thể tải thông tin công việc"));
            } finally {
                setIsLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-32">
                <Loader2 className="h-10 w-10 animate-spin text-green-600" />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="container mx-auto py-16 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy công việc</h2>
                <p className="text-gray-500 mb-8">Công việc này có thể đã bị xóa hoặc không còn tồn tại.</p>
                <Button onClick={() => navigate("/jobs")} className="bg-green-600 hover:bg-green-700">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại danh sách công việc
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 py-8">
            <div className="container mx-auto px-4 md:px-6">

                {/* Breadcrumb Navigation */}
                <div className="mb-6 flex items-center text-sm text-gray-500">
                    <span
                        className="hover:text-green-600 cursor-pointer transition-colors"
                        onClick={() => navigate("/jobs")}
                    >
                        Danh sách việc làm
                    </span>
                    <ChevronRight className="mx-2 h-4 w-4" />
                    <span className="text-gray-900 font-medium truncate">
                        {job.name}
                    </span>
                </div>

                <div className="max-w-4xl mx-auto w-full">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                        <JobSection job={job} />
                    </div>
                </div>
            </div>
        </div>
    );
}
