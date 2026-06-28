import { useState, useEffect } from "react";
import { getMyResumes, removeResume } from "@/services/resumeApi";
import type { ResumeDisplayDto } from "@/types/resume.type";
import { MapPin, Settings2, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import UpdateResumeModal from "./components/UpdateResumeModal";
import PdfViewer from "../../../components/custom/PdfViewer";

export default function JobApplicationsPage() {
    const [resumes, setResumes] = useState<ResumeDisplayDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedResume, setSelectedResume] = useState<ResumeDisplayDto | null>(null);

    const fetchResumes = async () => {
        try {
            setLoading(true);
            const res = await getMyResumes("page=1&limit=50");
            const resData = res.data.result;
            if (resData?.data) {
                setResumes(resData.data);
                setTotal(resData.meta.totalItems);
            }
        } catch (error) {
            toast.error("Không thể tải danh sách hồ sơ");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResumes();
    }, []);

    const handleWithdraw = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn rút hồ sơ này không?")) return;
        try {
            await removeResume(id);
            toast.success("Rút hồ sơ thành công");
            fetchResumes();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Rút hồ sơ thất bại");
        }
    };

    const handleUpdate = (resume: ResumeDisplayDto) => {
        setSelectedResume(resume);
        setIsUpdateModalOpen(true);
    };

    if (loading) {
        return <div className="p-4 text-gray-500">Đang tải hồ sơ...</div>;
    }


    return (
        <div className="max-w-5xl mx-auto pb-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Hồ sơ tuyển dụng ({total})
            </h1>

            <div className="space-y-6">
                {resumes.map((resume) => (
                    <div key={resume.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center p-2 flex-shrink-0">
                                    <img
                                        src={resume.company.logo || "https://res.cloudinary.com/dwyx97zla/image/upload/v1714552467/default-company-logo_f0tihy.png"}
                                        alt={resume.company.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {resume.job.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1">{resume.company.name}</p>
                                </div>
                            </div>

                            <div className="space-y-3 mt-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                                    <div>
                                        <span className="text-gray-500 text-sm block mb-1">Địa điểm làm việc</span>
                                        <p className="text-gray-700 text-sm">{resume.job.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Settings2 className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                                    <div>
                                        <span className="text-gray-500 text-sm block mb-1">Kỹ năng yêu cầu</span>
                                        <div className="flex flex-wrap gap-2">
                                            {resume.job.skills?.length > 0 ? (
                                                resume.job.skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-green-50 text-green-600 rounded text-xs font-medium"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 text-sm italic">Không có yêu cầu kỹ năng</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timestamps */}
                        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center text-xs text-gray-500">
                            <span>Nộp: {new Date(resume.createAt).toLocaleString("vi-VN")}</span>
                            <span>Cập nhật: {new Date(resume.updateAt).toLocaleString("vi-VN")}</span>
                        </div>

                        {/* PDF Viewer */}
                        <div className="p-6">
                            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-500" />
                                CV đã nộp
                            </h4>


                            <PdfViewer url={resume.fileUrl} className="w-full h-[500px]" />
                        </div>

                        {/* Actions */}
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <Link
                                to={`/jobs/${resume.job.id}`}
                                className="px-4 py-2 border border-green-200 text-green-600 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
                            >
                                Xem mô tả công việc
                            </Link>

                            {resume.status === "PENDING" && (
                                <>
                                    <button
                                        onClick={() => handleUpdate(resume)}
                                        className="px-4 py-2 border border-green-200 text-green-600 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors flex items-center gap-2"
                                    >
                                        <FileText className="w-4 h-4" />
                                        Cập nhật hồ sơ
                                    </button>
                                    <button
                                        onClick={() => handleWithdraw(resume.id)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                    >
                                        Rút hồ sơ
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}

                {resumes.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có hồ sơ nào</h3>
                        <p className="text-gray-500 text-sm">Bạn chưa ứng tuyển công việc nào. Hãy tìm kiếm việc làm ngay nhé!</p>
                        <Link
                            to="/jobs"
                            className="mt-4 inline-block px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                        >
                            Khám phá việc làm
                        </Link>
                    </div>
                )}
            </div>

            {selectedResume && (
                <UpdateResumeModal
                    isOpen={isUpdateModalOpen}
                    onClose={() => {
                        setIsUpdateModalOpen(false);
                        setSelectedResume(null);
                    }}
                    resume={selectedResume}
                    onSuccess={fetchResumes}
                />
            )}
        </div>
    );
}
