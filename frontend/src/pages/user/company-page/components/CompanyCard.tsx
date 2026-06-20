import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { DefaultCompanyResponseDto } from "@/types/company.type";

interface CompanyCardProps {
    company: DefaultCompanyResponseDto;
}

export default function CompanyCard({ company }: CompanyCardProps) {
    return (
        <Card className="hover:border-green-500/50 hover:shadow-md transition-all flex flex-col h-full group cursor-pointer">
            <CardContent className="p-6 flex flex-col h-full">
                <div className="flex gap-4 mb-4">
                    <div className="w-20 h-20 shrink-0 border rounded-lg bg-white overflow-hidden flex items-center justify-center shadow-sm">
                        {company.logoUrl ? (
                            <img
                                src={company.logoUrl}
                                alt={company.name}
                                className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform"
                            />
                        ) : (
                            <span className="text-3xl font-bold text-muted-foreground/30">
                                {company.name.charAt(0)}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                        <h3 className="font-semibold text-lg line-clamp-2 leading-tight mb-1 text-gray-800">
                            {company.name}
                        </h3>
                        <div className="flex items-start text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-1 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{company.address || "Chưa cập nhật địa chỉ"}</span>
                        </div>
                    </div>
                </div>

                <div 
                    className="text-sm text-gray-600 line-clamp-2 mb-6 flex-grow"
                    dangerouslySetInnerHTML={{ __html: company.description || "Chưa có thông tin mô tả chi tiết cho công ty này." }}
                />

                <div className="mt-auto pt-4 border-t flex items-center">
                    <span className="text-orange-600 font-semibold">
                        {company.jobsCount || 0} việc làm
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
