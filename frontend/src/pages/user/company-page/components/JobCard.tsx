import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import type { JobResponseDto } from "@/types/job.type";

interface JobCardProps {
    job: JobResponseDto;
}

export default function JobCard({ job }: JobCardProps) {
    const navigate = useNavigate();

    const formatCurrency = (val: number) => {
        if (!val || val === 0) return "Thương lượng";
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const d = new Date(dateString);
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    };

    return (
        <Card
            className="hover:border-green-500/50 cursor-pointer transition-all hover:shadow-md group"
            onClick={() => navigate(`/jobs/${job.id}`)}
        >
            <CardContent className="p-5">
                <h3 className="font-bold text-red-600 group-hover:text-red-700 transition-colors mb-3 line-clamp-2 leading-tight">
                    {job.name}
                </h3>
                <div className="text-sm text-gray-600 space-y-1.5 mb-5">
                    <p><span className="font-medium text-gray-700">Địa điểm:</span> {job.location}</p>
                    <p>
                        <span className="font-medium text-gray-700">Lương:</span> {formatCurrency(job.salary)}
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="font-medium text-gray-700">Số lượng:</span> {job.quantity}
                    </p>
                    <p><span className="font-medium text-gray-700">Cấp bậc:</span> {job.level}</p>
                    <p><span className="font-medium text-gray-700">Thời gian:</span> {formatDate(job.startDate)} — {formatDate(job.endDate)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {job.skills?.map(skill => (
                        <span
                            key={skill.id}
                            className="bg-orange-50 border border-orange-100 text-orange-800 text-xs px-2.5 py-1 rounded-md font-medium"
                        >
                            {skill.name}
                        </span>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
