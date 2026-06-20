import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DefaultCompanyResponseDto } from "@/types/company.type";

interface CompanyDescriptionProps {
    company: DefaultCompanyResponseDto;
}

export default function CompanyDescription({ company }: CompanyDescriptionProps) {
    return (
        <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-gray-50 border-b border-gray-100 rounded-t-xl">
                <CardTitle className="text-xl">Mô tả công ty</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                {company.description ? (
                    <div
                        className="prose prose-sm sm:prose-base max-w-none text-gray-700 prose-a:text-green-600 whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: company.description }}
                    />
                ) : (
                    <p className="text-gray-500 italic">Công ty chưa cập nhật mô tả.</p>
                )}
            </CardContent>
        </Card>
    );
}
