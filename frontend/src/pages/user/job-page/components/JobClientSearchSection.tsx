import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx";

interface JobClientSearchSectionProps {
    searchName: string;
    searchCompanyName: string;
    searchLevel: string;
    searchLocation: string;
    isExpanded: boolean;
    onReset: () => void;
    onExpandToggle: () => void;
    onChange: {
        name: (val: string) => void;
        company: (val: string) => void;
        level: (val: string) => void;
        location: (val: string) => void;
    };
}

export function JobClientSearchSection({
    searchName,
    searchCompanyName,
    searchLevel,
    searchLocation,
    isExpanded,
    onReset,
    onExpandToggle,
    onChange,
}: JobClientSearchSectionProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md">
            {/* Thanh tìm kiếm chính gọn gàng */}
            <div className="flex items-center gap-2 p-2">
                <div className="flex-1 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="Tìm kiếm theo tên công việc..."
                        value={searchName}
                        onChange={(e) => onChange.name(e.target.value)}
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none text-base bg-transparent"
                    />
                </div>
                <div className="flex items-center gap-2 pr-1 border-l pl-3">
                    <Button 
                        variant="ghost" 
                        onClick={onExpandToggle}
                        className={`text-gray-600 hover:text-green-600 hover:bg-green-50 ${isExpanded ? 'bg-green-50 text-green-600' : ''}`}
                    >
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        Lọc thêm
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={onReset}
                        className="border-gray-200 text-gray-600 hover:bg-gray-100"
                    >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Làm lại
                    </Button>
                </div>
            </div>

            {/* Phần bộ lọc mở rộng */}
            {isExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Công ty</label>
                        <Input
                            placeholder="Tên công ty..."
                            value={searchCompanyName}
                            onChange={(e) => onChange.company(e.target.value)}
                            className="bg-white"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Cấp bậc</label>
                        <Select value={searchLevel} onValueChange={onChange.level}>
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Chọn cấp bậc..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả cấp bậc</SelectItem>
                                <SelectItem value="INTERN">Thực tập sinh (Intern)</SelectItem>
                                <SelectItem value="FRESHER">Mới tốt nghiệp (Fresher)</SelectItem>
                                <SelectItem value="MIDDLE">Nhân viên (Middle)</SelectItem>
                                <SelectItem value="SENIOR">Chuyên viên (Senior)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Địa điểm</label>
                        <Input
                            placeholder="Nhập địa điểm (VD: Hà Nội, Hồ Chí Minh)..."
                            value={searchLocation}
                            onChange={(e) => onChange.location(e.target.value)}
                            className="bg-white"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
