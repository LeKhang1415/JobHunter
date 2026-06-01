import {
    Building2,
    Wrench,
    Briefcase,
    Settings,
    FileText,
    User,
    ShieldCheck,
    KeyRound,
    UserCog,
    BarChart3,
} from "lucide-react";

import FeatureCard from "./FeatureCard";
import QuickActions from "./QuickActions";

export default function DashboardPage() {
    const functionalities = [
        {
            category: "Quản lý Công ty",
            icon: Building2,
            color: "bg-blue-50 border-blue-200",
            iconColor: "text-blue-600",
            description: "Quản lý thông tin các công ty trong hệ thống",
            features: [
                "Xem danh sách tất cả các công ty",
                "Thêm, sửa, xóa thông tin công ty",
            ],
        },
        {
            category: "Tuyển dụng",
            icon: Wrench,
            color: "bg-green-50 border-green-200",
            iconColor: "text-green-600",
            description: "Hệ thống quản lý toàn bộ quy trình tuyển dụng",
            features: [
                "Quản lý việc làm: Tạo, chỉnh sửa và theo dõi các tin tuyển dụng",
                "Quản lý kỹ năng: Danh mục các kỹ năng cần thiết cho từng vị trí",
                "Hồ sơ ứng tuyển: Xem và quản lý CV của các ứng viên",
            ],
            subItems: [
                {
                    name: "Quản lý việc làm",
                    icon: Briefcase,
                    description: "Tạo và quản lý các tin tuyển dụng",
                },
                {
                    name: "Quản lý kỹ năng",
                    icon: Settings,
                    description: "Danh mục kỹ năng cho các vị trí công việc",
                },
                {
                    name: "Hồ sơ ứng tuyển",
                    icon: FileText,
                    description: "Quản lý CV và hồ sơ ứng viên",
                },
            ],
        },
        {
            category: "Quản lý Tài khoản",
            icon: User,
            color: "bg-orange-50 border-orange-200",
            iconColor: "text-orange-600",
            description: "Quản lý người dùng trong hệ thống",
            features: [
                "Xem danh sách tất cả người dùng",
                "Tạo tài khoản mới cho người dùng",
                "Chỉnh sửa thông tin cá nhân",
                "Quản lý trạng thái tài khoản (kích hoạt/vô hiệu hóa)",
            ],
        },
        {
            category: "Phân quyền",
            icon: ShieldCheck,
            color: "bg-purple-50 border-purple-200",
            iconColor: "text-purple-600",
            description: "Hệ thống phân quyền và bảo mật",
            features: [
                "Quyền hạn: Định nghĩa các quyền truy cập trong hệ thống",
                "Chức vụ: Tạo và quản lý các vai trò người dùng",
                "Gán quyền cho từng chức vụ",
                "Kiểm soát truy cập theo cấp độ",
            ],
            subItems: [
                {
                    name: "Quyền hạn",
                    icon: KeyRound,
                    description: "Quản lý các quyền truy cập hệ thống",
                },
                {
                    name: "Chức vụ",
                    icon: UserCog,
                    description: "Tạo và quản lý vai trò người dùng",
                },
            ],
        },
    ];

    return (
        <div className="space-y-6 p-6">
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">
                        Chức năng hệ thống
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {functionalities.map((func, index) => (
                        <FeatureCard key={index} {...func} />
                    ))}
                </div>
            </div>

            <QuickActions />
        </div>
    );
}
