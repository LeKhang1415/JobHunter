import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";

interface CompanySearchProps {
    nameSearch: string;
    setNameSearch: (val: string) => void;
    addressSearch: string;
    setAddressSearch: (val: string) => void;
    onSearch: () => void;
    onReset: () => void;
}

export default function CompanySearch({
    nameSearch,
    setNameSearch,
    addressSearch,
    setAddressSearch,
    onSearch,
    onReset
}: CompanySearchProps) {
    return (
        <div className="mb-8 p-6 bg-white rounded-xl border shadow-sm flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
                <label className="text-sm font-medium mb-1 block text-muted-foreground">Tên công ty</label>
                <Input
                    placeholder="Tìm kiếm công ty theo tên..."
                    value={nameSearch}
                    onChange={(e) => setNameSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onSearch()}
                    className="bg-gray-50/50"
                />
            </div>
            <div className="flex-1 w-full">
                <label className="text-sm font-medium mb-1 block text-muted-foreground">Địa chỉ</label>
                <Input
                    placeholder="Tìm kiếm theo địa chỉ..."
                    value={addressSearch}
                    onChange={(e) => setAddressSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onSearch()}
                    className="bg-gray-50/50"
                />
            </div>
            <div className="flex w-full md:w-auto gap-2">

                <Button
                    onClick={onSearch}
                    className="flex-1 md:flex-none h-10 px-8 bg-green-500 hover:bg-green-600 text-white"
                >
                    <Search className="w-3 h-3 mr-2" />
                    Tìm kiếm
                </Button>

                <Button
                    variant="outline"
                    onClick={onReset}
                    className="flex-1 md:flex-none h-10 px-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                    <RotateCcw className="w-3 h-3 mr-2" />
                    Làm mới
                </Button>
            </div>
        </div>
    );
}
