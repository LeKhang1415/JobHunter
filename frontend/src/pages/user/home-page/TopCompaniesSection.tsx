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
        <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                <div className="text-center mb-14">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl md:text-5xl tracking-tight">
                        Công Ty Hàng Đầu
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-gray-500 dark:text-gray-400">
                        Khám phá cơ hội nghề nghiệp từ các nhà tuyển dụng hàng đầu.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-wrap justify-center gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse bg-white dark:bg-gray-800 h-32 rounded-xl border border-gray-200 dark:border-gray-700 w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1.5rem)] max-w-sm"></div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-8">
                        {companies.map((company) => (
                            <Link key={company.id} to={`/companies/${company.id}`} className="block group w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1.5rem)] max-w-sm">
                                <Card className="hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-full group-hover:border-green-500/40 relative overflow-hidden">
                                    {/* Subtle gradient background on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    <CardContent className="p-6 flex flex-row items-center gap-5 relative z-10">
                                        <div className="w-20 h-20 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-700 shrink-0 p-2 shadow-sm group-hover:shadow-md transition-shadow">
                                            {company.logoUrl ? (
                                                <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                                            ) : (
                                                <Building2 className="w-10 h-10 text-gray-400 group-hover:text-green-600 transition-colors" />
                                            )}
                                        </div>
                                        <div className="overflow-hidden flex-1">
                                            <h3 className="text-lg md:text-xl font-bold line-clamp-2 text-gray-900 dark:text-gray-100 group-hover:text-green-600 transition-colors duration-300" title={company.name}>
                                                {company.name}
                                            </h3>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="text-center mt-14">
                    <Button asChild size="lg" className="rounded-full px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-green-500 hover:bg-green-600 text-white">
                        <Link to="/companies">Xem Tất Cả Công Ty</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default TopCompaniesSection;
