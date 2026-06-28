import { useState, useRef } from "react";
import { X, Upload, FileText, Loader2 } from "lucide-react";
import { updateResume } from "@/services/resumeApi";
import type { ResumeDisplayDto } from "@/types/resume.type";
import { toast } from "sonner";

interface UpdateResumeModalProps {
    isOpen: boolean;
    onClose: () => void;
    resume: ResumeDisplayDto;
    onSuccess: () => void;
}

export default function UpdateResumeModal({ isOpen, onClose, resume, onSuccess }: UpdateResumeModalProps) {
    const [email, setEmail] = useState(resume.email);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== "application/pdf") {
                toast.error("Vui lòng tải lên file PDF");
                return;
            }
            if (selectedFile.size > 5 * 1024 * 1024) {
                toast.error("Kích thước file không được vượt quá 5MB");
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email.trim()) {
            toast.error("Vui lòng nhập email");
            return;
        }

        try {
            setLoading(true);
            await updateResume(resume.id, email, file || undefined);
            toast.success("Cập nhật hồ sơ thành công");
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Cập nhật hồ sơ thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Cập nhật hồ sơ</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                        disabled={loading}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email liên hệ <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
                                placeholder="Nhập email của bạn"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Thay đổi CV (PDF)
                            </label>
                            
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".pdf"
                                className="hidden"
                            />

                            {!file ? (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full flex flex-col items-center justify-center gap-2 py-8 px-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-colors"
                                >
                                    <Upload className="w-8 h-8 text-gray-400" />
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-gray-700">Nhấn để tải lên CV mới</p>
                                        <p className="text-xs text-gray-500 mt-1">Định dạng PDF, tối đa 5MB</p>
                                    </div>
                                </button>
                            ) : (
                                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <FileText className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-green-800 line-clamp-1">{file.name}</p>
                                            <p className="text-xs text-green-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFile(null)}
                                        className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                            disabled={loading}
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
