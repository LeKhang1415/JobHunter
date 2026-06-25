import { useAppSelector } from "@/features/hooks";
import { User, Mail, Calendar, MapPin, Edit, Lock, Shield, Clock } from "lucide-react";

export default function ProfilePage() {
    const { user } = useAppSelector((state) => state.auth);

    if (!user) return null;

    // Format date utility
    const formatDate = (dateString?: Date | string) => {
        if (!dateString) return "Chưa cập nhật";
        const date = new Date(dateString);
        return `lúc ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} ${date.getDate()} tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-5xl">
            {/* Left Card */}
            <div className="w-full lg:w-[320px] bg-white rounded-xl shadow-sm p-6 flex flex-col items-center flex-shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-50 mb-4 bg-gray-100">
                    <img
                        src={user.userImgUrl || "https://i.pravatar.cc/150"}
                        alt="avatar"
                        className="w-full h-full object-cover"
                    />
                </div>
                <h2 className="text-xl font-bold text-gray-800 uppercase">{user.name}</h2>
                <div className="bg-green-100 text-green-700 px-4 py-1 rounded-lg text-sm font-medium mb-6">
                    {user.gender === 'male' ? 'Nam' : user.gender === 'female' ? 'Nữ' : 'Nam'}
                </div>

                <div className="w-full space-y-3 mt-2">
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium text-sm">
                        <Edit size={18} />
                        Cập nhật thông tin
                    </button>
                    <button className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-green-600 hover:border-green-600 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium text-sm">
                        <Lock size={18} />
                        Đổi mật khẩu
                    </button>
                </div>
            </div>

            {/* Right Card */}
            <div className="flex-1 bg-white rounded-xl shadow-sm p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {/* Personal Info Column */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <User className="text-green-700" size={20} />
                            <h3 className="font-semibold text-green-800 text-lg">Thông tin cá nhân</h3>
                        </div>

                        <div className="space-y-4">
                            {/* Email */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-gray-50">
                                <div className="flex items-center gap-2 text-green-600 mb-1">
                                    <Mail size={16} />
                                    <span className="text-sm font-medium">Email</span>
                                </div>
                                <p className="font-medium text-gray-800 ml-6">{user.email}</p>
                            </div>

                            {/* Ngày sinh */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-gray-50">
                                <div className="flex items-center gap-2 text-green-600 mb-1">
                                    <Calendar size={16} />
                                    <span className="text-sm font-medium">Ngày sinh</span>
                                </div>
                                <p className="font-medium text-gray-800 ml-6">25 tháng 2, 2003</p>
                            </div>

                            {/* Địa chỉ */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-gray-50">
                                <div className="flex items-center gap-2 text-green-600 mb-1">
                                    <MapPin size={16} />
                                    <span className="text-sm font-medium">Địa chỉ</span>
                                </div>
                                <p className="font-medium text-gray-800 ml-6">{user.address || 'TalentBridge'}</p>
                            </div>

                            {/* Giới tính */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-gray-50">
                                <div className="flex items-center gap-2 text-green-600 mb-1">
                                    <User size={16} />
                                    <span className="text-sm font-medium">Giới tính</span>
                                </div>
                                <p className="font-medium text-gray-800 ml-6">
                                    {user.gender === 'male' ? 'Nam' : user.gender === 'female' ? 'Nữ' : 'Nam'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* System Info Column */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <Shield className="text-green-700" size={20} />
                            <h3 className="font-semibold text-green-800 text-lg">Thông tin hệ thống</h3>
                        </div>

                        <div className="space-y-4">
                            {/* Ngày tạo */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-gray-50">
                                <div className="flex items-center gap-2 text-green-600 mb-1">
                                    <Calendar size={16} />
                                    <span className="text-sm font-medium">Ngày tạo tài khoản</span>
                                </div>
                                <p className="font-medium text-gray-800 ml-6">
                                    {formatDate(user.createdAt)}
                                </p>
                            </div>

                            {/* Cập nhật lần cuối */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-gray-50">
                                <div className="flex items-center gap-2 text-green-600 mb-1">
                                    <Clock size={16} />
                                    <span className="text-sm font-medium">Cập nhật lần cuối</span>
                                </div>
                                <p className="font-medium text-gray-800 ml-6">
                                    {formatDate(user.updatedAt)}
                                </p>
                            </div>

                            {/* Trạng thái */}
                            <div className="bg-green-50 p-4 rounded-xl border border-green-100 mt-6">
                                <div className="flex items-center gap-2 text-green-800 mb-2">
                                    <Shield size={16} />
                                    <span className="text-sm font-semibold">Trạng thái tài khoản</span>
                                </div>
                                <div className="flex items-center gap-2 ml-6">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <p className="font-medium text-green-800 text-sm">Tài khoản đang hoạt động</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
