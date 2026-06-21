import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { getAllCompanies } from "@/services/companyApi";
import type { DefaultCompanyResponseDto } from "@/types/company.type";
import { toast } from "sonner";

interface CompanySelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectCompany: (company: DefaultCompanyResponseDto) => void;
}

export default function CompanySelectionModal({
    isOpen,
    onClose,
    onSelectCompany,
}: CompanySelectionModalProps) {
    const [companies, setCompanies] = useState<DefaultCompanyResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Debounce search
    useEffect(() => {
        if (!isOpen) return;

        const fetchCompanies = async () => {
            setIsLoading(true);
            try {
                const res = await getAllCompanies({ page: 1, limit: 20, name: searchTerm });
                setCompanies(res.data.result.data);
            } catch (err) {
                toast.error("Không thể tải danh sách công ty");
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchCompanies();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, isOpen]);

    useEffect(() => {
        if (isOpen) {
            setSearchTerm(""); // Reset search when opened
        }
    }, [isOpen]);

    const handleSelect = (company: DefaultCompanyResponseDto) => {
        onSelectCompany(company);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Chọn công ty</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Tìm kiếm công ty theo tên..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    
                    <div className="h-[350px] overflow-y-auto rounded-md border p-2 space-y-2 bg-gray-50/50">
                        {isLoading ? (
                            <div className="flex h-full items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            </div>
                        ) : companies.length === 0 ? (
                            <div className="flex h-full items-center justify-center text-sm text-gray-500">
                                Không tìm thấy công ty phù hợp
                            </div>
                        ) : (
                            companies.map((company) => (
                                <div 
                                    key={company.id} 
                                    className="flex items-center gap-3 p-3 bg-white border rounded-lg hover:border-blue-400 hover:shadow-sm cursor-pointer transition-all"
                                    onClick={() => handleSelect(company)}
                                >
                                    <div className="w-12 h-12 shrink-0 border rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
                                        {company.logoUrl ? (
                                            <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain p-1" />
                                        ) : (
                                            <div className="text-gray-400 font-bold text-xl">{company.name.charAt(0)}</div>
                                        )}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h4 className="font-semibold text-gray-900 truncate">{company.name}</h4>
                                        <p className="text-xs text-gray-500 truncate">{company.address}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Đóng
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
