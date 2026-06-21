import { CalendarDays } from "lucide-react";
import { formatISO } from "@/utils/convertHelper.ts";
import type { DefaultCompanyResponseDto } from "@/types/company.type";
import RichTextPreview from "@/components/custom/RichText/RichTextPreview";

type CompanySectionProps = {
    company: DefaultCompanyResponseDto;
    isRecruiter?: boolean;
    jobsCount?: number;
};

const CompanySection = ({
    company,
    isRecruiter = false,
    jobsCount = 0,
}: CompanySectionProps) => {
    const hasJobs = jobsCount > 0;

    return (
        <>
            <div className={`space-y-6 overflow-y-auto pr-2 ${hasJobs ? 'md:col-span-2' : 'md:col-span-3'}`}>
                <div className="w-full min-w-0 border bg-white p-4 shadow rounded-2xl">
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">
                        Mô tả
                    </h3>
                    <RichTextPreview content={company.description} />
                </div>


                {isRecruiter && (
                    <div className="space-y-2 rounded-2xl border bg-white p-4 text-sm text-gray-600 shadow">
                        <p className="flex items-center">
                            <CalendarDays className="mr-1 h-4 w-4" />
                            Ngày tạo: {formatISO(company.createdAt)}
                        </p>
                        <p className="flex items-center">
                            <CalendarDays className="mr-1 h-4 w-4" />
                            Cập nhật: {formatISO(company.updatedAt)}
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default CompanySection;
