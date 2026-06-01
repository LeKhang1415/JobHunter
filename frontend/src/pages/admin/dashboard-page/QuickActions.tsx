import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function QuickActions() {
    const steps = [
        {
            title: "Quản lý Công ty",
            desc: "Thêm và quản lý thông tin các công ty",
            color: "bg-blue-600",
        },
        {
            title: "Tạo việc làm",
            desc: "Đăng tin tuyển dụng và quản lý kỹ năng",
            color: "bg-green-600",
        },
        {
            title: "Quản lý User",
            desc: "Tạo tài khoản và phân quyền người dùng",
            color: "bg-orange-600",
        },
        {
            title: "Theo dõi",
            desc: "Xem báo cáo và thống kê hệ thống",
            color: "bg-purple-600",
        },
    ];

    return (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
                <CardTitle className="text-lg text-gray-900">
                    Hướng dẫn sử dụng
                </CardTitle>
                <CardDescription>Các bước cơ bản để bắt đầu</CardDescription>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => (
                        <div key={index} className="text-center space-y-2">
                            <div
                                className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${step.color}`}
                            >
                                {index + 1}
                            </div>
                            <h4 className="font-medium text-gray-800">
                                {step.title}
                            </h4>
                            <p className="text-xs text-gray-600">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
