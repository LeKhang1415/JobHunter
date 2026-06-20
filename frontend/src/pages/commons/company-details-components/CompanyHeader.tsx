import { Building2, MapPin } from "lucide-react";
import type { DefaultCompanyResponseDto } from "@/types/company.type";

type CompanyHeaderProps = {
    company: DefaultCompanyResponseDto;
    isRecruiter?: boolean;
};

const CompanyHeader = ({ company, isRecruiter = false }: CompanyHeaderProps) => {
    return (
        <div className="flex items-center gap-6 mb-8">
            {company.logoUrl ? (
                <div className="rounded-full border-4 border-gray-100 shadow-sm bg-white p-2">
                    <img
                        src={company.logoUrl}
                        alt={company.name}
                        className="h-24 w-24 object-contain rounded-full"
                    />
                </div>
            ) : (
                <div
                    className={`flex h-28 w-28 items-center justify-center rounded-full border shadow-sm bg-white ${isRecruiter ? "text-purple-600" : "text-orange-600"}`}
                >
                    <Building2 className="h-12 w-12" />
                </div>
            )}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {company.name}
                </h1>
                <p className="flex items-start md:items-center text-sm md:text-base text-gray-600">
                    <MapPin className="mr-1.5 h-5 w-5 shrink-0" />
                    {company.address}
                </p>
            </div>
        </div>
    );
};

export default CompanyHeader;
