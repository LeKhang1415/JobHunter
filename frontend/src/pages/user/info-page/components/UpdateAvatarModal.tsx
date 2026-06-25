import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState, useRef } from "react";
import { Camera, Image as ImageIcon, Upload, X } from "lucide-react";

interface UpdateAvatarModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentAvatarUrl: string | null;
    onSave: (file: File) => void;
    isSubmitting: boolean;
}

export default function UpdateAvatarModal({ isOpen, onClose, currentAvatarUrl, onSave, isSubmitting }: UpdateAvatarModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClose = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        onClose();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSave = () => {
        if (selectedFile) {
            onSave(selectedFile);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-xl">
                <DialogHeader className="px-6 py-4 border-b border-gray-100 flex flex-row items-center gap-2">
                    <Camera className="text-green-700" size={20} />
                    <DialogTitle className="text-xl text-green-800 font-bold m-0 p-0">Cập nhật ảnh đại diện</DialogTitle>
                </DialogHeader>

                <div className="px-6 py-6 bg-white flex flex-col items-center">
                    {/* Avatar Preview */}
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-50 mb-4 bg-gray-100 shadow-sm relative">
                        <img
                            src={previewUrl || currentAvatarUrl || "https://i.pravatar.cc/150"}
                            alt="avatar preview"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <p className="text-gray-500 font-medium text-sm mb-6">
                        {previewUrl ? "Ảnh mới được chọn" : "Ảnh hiện tại"}
                    </p>

                    <div className="w-full space-y-3">
                        <label className="text-sm font-semibold text-gray-700">
                            Chọn ảnh mới <span className="text-red-500">*</span>
                        </label>

                        <input
                            type="file"
                            ref={fileInputRef}
                            hidden
                            accept="image/*"
                            onChange={handleFileSelect}
                        />

                        {/* Upload Box */}
                        {!selectedFile && (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full border-2 border-dashed border-green-200 bg-green-50/50 hover:bg-green-50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors"
                            >
                                <ImageIcon className="text-green-600 mb-3" size={32} />
                                <p className="text-gray-600 mb-3 text-sm font-medium">Kéo thả ảnh vào đây hoặc</p>
                                <button className="px-5 py-2 bg-white border border-green-200 text-green-700 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-50 transition-colors shadow-sm text-sm">
                                    <Upload size={16} />
                                    Chọn file
                                </button>
                            </div>
                        )}

                        {/* Selected File Info */}
                        {selectedFile && (
                            <div className="w-full bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <ImageIcon className="text-green-600 flex-shrink-0" size={20} />
                                    <div className="overflow-hidden">
                                        <p className="text-green-800 font-medium text-sm truncate max-w-[280px]">
                                            {selectedFile.name}
                                        </p>
                                        <p className="text-green-600 text-xs mt-0.5">
                                            {formatFileSize(selectedFile.size)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleRemoveFile}
                                    className="p-1.5 hover:bg-green-100 rounded-full text-green-700 transition-colors flex-shrink-0"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t border-gray-100 flex gap-3 sm:justify-start">
                    <button
                        onClick={handleSave}
                        disabled={isSubmitting || !selectedFile}
                        className="flex-1 sm:flex-none px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? "Đang tải ảnh lên..." : "Cập nhật ảnh"}
                    </button>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                        Hủy bỏ
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
