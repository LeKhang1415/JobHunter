import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, FileText } from "lucide-react";
import { format } from "date-fns";
import type { ResumeDisplayDto } from "@/types/resume.type";
import { EmptyState } from "@/components/custom/EmptyState";
import HasPermission from "@/components/custom/HasPermission";

interface ResumeTableAdminProps {
    resumes: ResumeDisplayDto[];
    isLoading: boolean;
    onEdit: (resume: ResumeDisplayDto) => void;
}

export const statusColors: Record<string, string> = {
    PENDING: "bg-gray-300 text-gray-700",
    REVIEWING: "bg-blue-300 text-blue-700",
    APPROVED: "bg-green-300 text-green-700",
    REJECTED: "bg-red-300 text-red-700",
};

export function ResumeTableAdmin({
    resumes,
    isLoading,
    onEdit,
}: ResumeTableAdminProps) {
    return (
        <div className="overflow-hidden rounded-lg border border-blue-600">
            <Table>
                <TableHeader className="bg-blue-600">
                    <TableRow>
                        <TableHead className="w-16 text-white font-bold text-center">ID</TableHead>
                        <TableHead className="w-20 text-white font-bold text-center">Logo</TableHead>
                        <TableHead className="min-w-[150px] text-white font-bold text-center">Công ty</TableHead>
                        <TableHead className="min-w-[200px] text-white font-bold text-center">Công việc</TableHead>
                        <TableHead className="text-center text-white font-bold">Người nộp</TableHead>
                        <TableHead className="text-center whitespace-nowrap text-white font-bold">Ngày nộp</TableHead>
                        <TableHead className="text-center whitespace-nowrap text-white font-bold">Lần cập nhật gần nhất</TableHead>
                        <TableHead className="text-center text-white font-bold">Trạng thái</TableHead>
                        <TableHead className="text-center w-24 text-white font-bold">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && (
                        <TableRow>
                            <TableCell colSpan={9}>
                                <div className="flex items-center justify-center py-8">
                                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}

                    {!isLoading && resumes.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={9}>
                                <EmptyState
                                    title="Không tìm thấy hồ sơ nào"
                                    description="Hệ thống chưa có hồ sơ nào hoặc không có kết quả phù hợp với tìm kiếm."
                                    icon={<FileText className="text-muted-foreground h-12 w-12" />}
                                />
                            </TableCell>
                        </TableRow>
                    )}

                    {!isLoading &&
                        resumes.map((resume) => {
                            // Extracting a short ID or displaying the full UUID? The image shows "ID" like 7, 11, 16. 
                            // Usually UUID is long, so we can display a substring if it's a UUID, or the actual ID if it's auto-increment.
                            // Assuming backend returns UUID, we can just show a short substring or the full ID if it fits. 
                            // Let's use a substring for cleaner UI if it's long, or just the first 4 chars.
                            // I'll use resume.id directly since we don't know if it's numeric or UUID.
                            const displayId = typeof resume.id === 'string' && resume.id.length > 8 ? resume.id.substring(0, 8) : resume.id;
                            
                            return (
                                <TableRow key={resume.id}>
                                    <TableCell className="text-center text-sm font-medium px-4">{displayId}</TableCell>
                                    <TableCell className="text-center flex justify-center py-2">
                                        {resume.company?.logo ? (
                                            <img src={resume.company.logo} alt="Logo" className="w-10 h-10 rounded border object-contain bg-white shrink-0" />
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-400">N/A</div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center text-sm font-semibold text-gray-900">
                                        {resume.company?.name || 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-center text-sm">
                                        <span className="font-medium text-gray-600">{resume.job?.name}</span>
                                    </TableCell>
                                    <TableCell className="text-center text-sm">
                                        {resume.email}
                                    </TableCell>
                                    <TableCell className="text-center text-sm whitespace-nowrap">
                                        {format(new Date(resume.createAt), "HH:mm dd/MM/yyyy")}
                                    </TableCell>
                                    <TableCell className="text-center text-sm whitespace-nowrap">
                                        {format(new Date(resume.updateAt), "HH:mm dd/MM/yyyy")}
                                    </TableCell>
                                    <TableCell className="text-center text-sm">
                                        <Badge variant="outline" className={`${statusColors[resume.status]} uppercase border-none font-semibold px-2 py-1 text-[10px]`}>
                                            {resume.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                title="Sửa"
                                                onClick={() => onEdit(resume)}
                                            >
                                                <Edit className="h-4 w-4 text-orange-600" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                </TableBody>
            </Table>
        </div>
    );
}
