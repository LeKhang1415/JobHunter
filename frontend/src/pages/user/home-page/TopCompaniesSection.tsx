import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPublicCompanies } from "@/services/companyApi";
import type { DefaultCompanyResponseDto } from "@/types/company.type";
import { Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function TopCompaniesSection() {
    const [companies, setCompanies] = useState<DefaultCompanyResponseDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await getAllPublicCompanies({ limit: 3 });
                // @ts-ignore - fix type issue
                const data = res.data?.result?.data || res.data?.data;
                if (data && Array.isArray(data)) {
                    setCompanies(data.slice(0, 3));
                }
            } catch (error) {
                console.error("Failed to fetch companies:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                        Công Ty Hàng Đầu
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
                        Khám phá cơ hội nghề nghiệp từ các nhà tuyển dụng hàng đầu.
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse bg-white dark:bg-gray-800 h-24 rounded-xl border border-gray-200 dark:border-gray-700"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {companies.map((company) => (
                            <Link key={company.id} to={`/companies/${company.id}`} className="block group">
                                <Card className="hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-full">
                                    <CardContent className="p-4 flex flex-row items-center gap-4">
                                        <div className="w-16 h-16 rounded-md bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-700 shrink-0 p-1 shadow-sm">
                                            {company.logoUrl ? (
                                                <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <Building2 className="w-8 h-8 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="overflow-hidden flex-1">
                                            <h3 className="text-base font-semibold line-clamp-2 text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors duration-200" title={company.name}>
                                                {company.name}
                                            </h3>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="text-center mt-10">
                    <Button asChild size="lg" className="rounded-full px-8">
                        <Link to="/companies">Xem Tất Cả Công Ty</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default TopCompaniesSection;
