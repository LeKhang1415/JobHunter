import React, { useState } from "react";
import { X, Lock, Eye, EyeOff } from "lucide-react";
import { updateSelfPassword } from "@/services/userApi";
import { toast } from "sonner";

interface UpdatePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UpdatePasswordModal({ isOpen, onClose }: UpdatePasswordModalProps) {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu mới không khớp");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
            return;
        }

        try {
            setIsSubmitting(true);
            const res = await updateSelfPassword({
                oldPassword,
                newPassword
            });
            if (res.data.result) {
                toast.success("Cập nhật mật khẩu thành công");
                handleClose();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Cập nhật mật khẩu thất bại");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowOldPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Lock className="text-green-600" size={24} />
                        <h2 className="text-xl font-bold text-gray-800">Đổi mật khẩu</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
                        <div className="relative">
                            <input
                                type={showOldPassword ? "text" : "password"}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pr-10"
                                placeholder="Nhập mật khẩu hiện tại"
                            />
                            <button 
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                            >
                                {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Mật khẩu mới</label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pr-10"
                                placeholder="Nhập mật khẩu mới"
                            />
                            <button 
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pr-10"
                                placeholder="Nhập lại mật khẩu mới"
                            />
                            <button 
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50/50">
                    <button
                        onClick={handleClose}
                        className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={isSubmitting}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting ? "Đang lưu..." : "Cập nhật mật khẩu"}
                    </button>
                </div>
            </div>
        </div>
    );
}
