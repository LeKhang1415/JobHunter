import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import type { UserResponseDto } from "@/types/user.type";
import { User } from "lucide-react";

interface UpdateProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserResponseDto | null;
    onSave: (data: any) => void;
    isSubmitting: boolean;
}

export default function UpdateProfileModal({ isOpen, onClose, user, onSave, isSubmitting }: UpdateProfileModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        gender: "male",
        dob: "2004-07-18"
    });

    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                name: user.name || "",
                address: user.address || "",
                gender: user.gender || "male",
                dob: "2004-07-18"
            });
        }
    }, [user, isOpen]);

    const handleSave = () => {
        onSave({
            name: formData.name,
            address: formData.address,
            gender: formData.gender,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden rounded-xl">
                <DialogHeader className="px-6 py-4 border-b border-gray-100 flex flex-row items-center gap-2">
                    <User className="text-green-700" size={20} />
                    <DialogTitle className="text-xl text-green-800 font-bold m-0 p-0">Cập nhật thông tin cá nhân</DialogTitle>
                </DialogHeader>

                <div className="px-6 py-6 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Họ và tên */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Họ và tên <span className="text-red-500">*</span>
                            </label>
                            <input
                                className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-gray-800 font-medium"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Nhập họ và tên"
                            />
                        </div>

                        {/* Ngày sinh */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Ngày sinh <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-gray-800 font-medium bg-white"
                                value={formData.dob}
                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            />
                        </div>

                        {/* Giới tính */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Giới tính <span className="text-red-500">*</span>
                            </label>
                            <select
                                className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-gray-800 font-medium bg-white"
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            >
                                <option value="male">Nam</option>
                                <option value="female">Nữ</option>
                                <option value="other">Khác</option>
                            </select>
                        </div>

                        {/* Địa chỉ */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Địa chỉ <span className="text-red-500">*</span>
                            </label>
                            <input
                                className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-gray-800 font-medium"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Nhập địa chỉ"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t border-gray-100 flex gap-3 sm:justify-end">
                    <button
                        onClick={onClose}
                        className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold transition-colors flex items-center justify-center"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-none px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? "Đang lưu..." : "Cập nhật thông tin"}
                    </button>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
