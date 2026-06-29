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
import { Edit, Eye, FileText } from "lucide-react";
import { format } from "date-fns";
import type { ResumeDisplayDto } from "@/types/resume.type";
import { EmptyState } from "@/components/custom/EmptyState";
import HasPermission from "@/components/custom/HasPermission";

interface ResumeTableProps {
    resumes: ResumeDisplayDto[];
    isLoading: boolean;
    onEdit: (resume: ResumeDisplayDto) => void;
    currentPage: number;
    itemsPerPage: number;
}

export const statusColors: Record<string, string> = {
    PENDING: "bg-gray-300 text-gray-700",
    REVIEWING: "bg-blue-300 text-blue-700",
    APPROVED: "bg-green-300 text-green-700",
    REJECTED: "bg-red-300 text-red-700",
};

export function ResumeTable({
    resumes,
    isLoading,
    onEdit,
    currentPage,
    itemsPerPage,
}: ResumeTableProps) {
    return (
        <div className="overflow-hidden rounded-lg border border-blue-600">
            <Table>
                <TableHeader className="bg-purple-600">
                    <TableRow>
                        <TableHead className="w-16 text-white font-bold">STT</TableHead>
                        <TableHead className="min-w-[250px] text-white font-bold text-center">Tên Công việc</TableHead>
                        <TableHead className="text-center text-white font-bold">Người nộp</TableHead>
                        <TableHead className="text-center whitespace-nowrap text-white font-bold">Ngày nộp</TableHead>
                        <TableHead className="text-center whitespace-nowrap text-white font-bold">Ngày cập nhật</TableHead>
                        <TableHead className="text-center text-white font-bold">Trạng thái</TableHead>
                        <TableHead className="text-center w-24 text-white font-bold">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && (
                        <TableRow>
                            <TableCell colSpan={7}>
                                <div className="flex items-center justify-center py-8">
                                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}

                    {!isLoading && resumes.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7}>
                                <EmptyState
                                    title="Không tìm thấy hồ sơ nào"
                                    description="Chưa có ứng viên nào nộp hồ sơ vào công ty."
                                    icon={<FileText className="text-muted-foreground h-12 w-12" />}
                                />
                            </TableCell>
                        </TableRow>
                    )}

                    {!isLoading &&
                        resumes.map((resume, index) => {
                            const stt = (currentPage - 1) * itemsPerPage + index + 1;
                            return (
                                <TableRow key={resume.id}>
                                    <TableCell className="text-center text-sm font-medium px-4">{stt}</TableCell>
                                    <TableCell className="text-center text-sm">
                                        <span className="font-medium text-gray-900">{resume.job?.name}</span>
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
                                                title="Xem chi tiết"
                                                onClick={() => onEdit(resume)}
                                            >
                                                <Eye className="h-4 w-4 text-purple-600" />
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
