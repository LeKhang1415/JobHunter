import React, { useState, useRef } from "react";
import { X, Upload, FileText, CheckCircle2, Eye } from "lucide-react";
import { toast } from "sonner";
import { useAppSelector } from "@/features/hooks";
import { applyJob } from "@/services/resumeApi";
import { Button } from "@/components/ui/button";

interface ApplyJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobId: string;
    jobName: string;
}

export default function ApplyJobModal({ isOpen, onClose, jobId, jobName }: ApplyJobModalProps) {
    const { user } = useAppSelector((state) => state.auth);
    const [file, setFile] = useState<File | null>(null);
    const [email, setEmail] = useState(user?.email || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== "application/pdf") {
                toast.error("Vui lòng chỉ tải lên file PDF");
                return;
            }
            if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("Kích thước file không được vượt quá 5MB");
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email.trim()) {
            toast.error("Vui lòng nhập email liên hệ");
            return;
        }

        if (!file) {
            toast.error("Vui lòng chọn file CV");
            return;
        }

        try {
            setIsSubmitting(true);
            const res = await applyJob(
                { email, jobId, status: "PENDING" },
                file
            );

            if (res.data) {
                toast.success("Nộp CV thành công!");
                handleClose();
            }
        } catch (error: any) {
            console.error("Lỗi nộp CV:", error.response?.data || error.message);
            const errorMessage = Array.isArray(error.response?.data?.message)
                ? error.response.data.message[0]
                : error.response?.data?.message;
            toast.error(errorMessage || "Nộp CV thất bại, vui lòng thử lại sau.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setEmail(user?.email || "");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6">
            <div className={`bg-white w-full ${file ? 'max-w-5xl h-full max-h-[90vh] flex flex-col' : 'max-w-lg'} rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200`}>
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Nộp hồ sơ ứng tuyển</h2>
                        <p className="text-sm text-gray-500 mt-1 truncate max-w-sm" title={jobName}>
                            Vị trí: <span className="font-semibold text-green-600">{jobName}</span>
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors self-start"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className={`p-6 space-y-6 ${file ? 'overflow-y-auto flex-1' : ''}`}>
                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email liên hệ <span className="text-red-500">*</span></label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Nhập email để nhà tuyển dụng liên hệ"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>

                    {/* CV Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">CV của bạn (PDF) <span className="text-red-500">*</span></label>
                        
                        {!file ? (
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-green-50 hover:border-green-400 transition-all group"
                            >
                                <div className="p-4 bg-green-100 rounded-full group-hover:scale-110 transition-transform">
                                    <Upload className="text-green-600 w-6 h-6" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-700 group-hover:text-green-700">Nhấn để tải lên file CV</p>
                                    <p className="text-xs text-gray-500 mt-1">Hỗ trợ định dạng PDF (Tối đa 5MB)</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="p-2 bg-red-100 rounded-lg shrink-0">
                                        <FileText className="text-red-600 w-6 h-6" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <CheckCircle2 className="text-green-500 w-5 h-5 hidden sm:block" />
                                    <button
                                        type="button"
                                        onClick={handleRemoveFile}
                                        className="p-1.5 hover:bg-red-100 bg-red-50 rounded-full transition-colors text-red-600"
                                        title="Xóa file"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {/* PDF Preview Inline */}
                        {file && (
                            <div className="mt-6 w-full h-[600px] border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                                <iframe
                                    src={URL.createObjectURL(file)}
                                    title="PDF Preview"
                                    className="w-full h-full"
                                />
                            </div>
                        )}
                        
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="application/pdf"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                {/* Fixed Footer for Wide Modal */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50/50 mt-auto">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="px-6 border-gray-200 bg-white"
                    >
                        Hủy
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !file}
                        className="px-6 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? "Đang xử lý..." : "Nộp CV"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
