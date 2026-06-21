import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building2, X, Building } from "lucide-react";
import CompanySelectionModal from "./CompanySelectionModal";
import type { DefaultCompanyResponseDto } from "@/types/company.type";
import { getCompanyById } from "@/services/companyApi";

interface CompanySelectionProps {
    selectedCompanyId: string;
    onCompanyChange: (companyId: string) => void;
    error?: string;
}

export default function CompanySelection({
    selectedCompanyId,
    onCompanyChange,
    error
}: CompanySelectionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<DefaultCompanyResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (selectedCompanyId && (!selectedCompany || selectedCompany.id !== selectedCompanyId)) {
            const fetchCompanyInfo = async () => {
                setIsLoading(true);
                try {
                    const res = await getCompanyById(selectedCompanyId);
                    setSelectedCompany(res.data.result);
                } catch (err) {
                    console.error("Lỗi khi tải thông tin công ty:", err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchCompanyInfo();
        } else if (!selectedCompanyId) {
            setSelectedCompany(null);
        }
    }, [selectedCompanyId]);

    const handleSelectCompany = (company: DefaultCompanyResponseDto) => {
        setSelectedCompany(company);
        onCompanyChange(company.id);
    };

    const handleClearCompany = () => {
        setSelectedCompany(null);
        onCompanyChange("");
    };

    return (
        <div className="space-y-3 flex flex-col h-full">
            <Label htmlFor="company">
                Công ty <span className="text-red-500">*</span>
            </Label>
            
            <div className={`rounded-md border p-4 flex flex-col bg-white flex-1 ${error ? "border-red-500" : ""}`}>
                {!selectedCompany ? (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 flex-1 mb-4">
                        <Building className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="text-sm font-medium">Chưa chọn công ty</p>
                    </div>
                ) : (
                    <div className="flex items-center justify-between border rounded-lg p-3 hover:border-gray-300 transition-colors flex-1 mb-4">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-12 h-12 shrink-0 border rounded-md overflow-hidden flex items-center justify-center bg-white">
                                {selectedCompany.logoUrl ? (
                                    <img src={selectedCompany.logoUrl} alt={selectedCompany.name} className="w-full h-full object-contain p-1" />
                                ) : (
                                    <Building2 className="w-6 h-6 text-gray-400" />
                                )}
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-bold text-gray-900 truncate">{selectedCompany.name}</p>
                                <p className="text-xs text-gray-500 truncate">{selectedCompany.address}</p>
                            </div>
                        </div>
                        <button 
                            type="button" 
                            onClick={handleClearCompany}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700 shrink-0 ml-2"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                <Button 
                    variant="secondary" 
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 mt-auto"
                    onClick={() => setIsModalOpen(true)}
                    type="button"
                >
                    <Building className="w-4 h-4 mr-2" />
                    {selectedCompany ? "Đổi công ty" : "Chọn công ty"}
                </Button>
            </div>

            {error && (
                <span className="text-xs text-red-500">
                    {error}
                </span>
            )}

            <CompanySelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelectCompany={handleSelectCompany}
            />
        </div>
    );
}
