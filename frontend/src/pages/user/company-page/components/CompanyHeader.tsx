import { MapPin } from "lucide-react";
import type { DefaultCompanyResponseDto } from "@/types/company.type";

interface CompanyHeaderProps {
    company: DefaultCompanyResponseDto;
}

export default function CompanyHeader({ company }: CompanyHeaderProps) {
    return (
        <div className="flex items-center gap-6 mb-10">
            <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 border rounded-full bg-white overflow-hidden flex items-center justify-center shadow-sm">
                {company.logoUrl ? (
                    <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain p-2" />
                ) : (
                    <span className="text-4xl font-bold text-gray-300">{company.name.charAt(0)}</span>
                )}
            </div>
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900">{company.name}</h1>
                <div className="flex items-start sm:items-center text-gray-600 text-sm sm:text-base">
                    <MapPin className="w-5 h-5 mr-1.5 shrink-0" />
                    <span>{company.address || "Chưa cập nhật địa chỉ"}</span>
                </div>
            </div>
        </div>
    );
}
