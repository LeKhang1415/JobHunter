import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RotateCcw } from "lucide-react";

interface CompanySearchProps {
    searchName: string;
    setSearchName: (value: string) => void;
    onReset: () => void;
}

export default function CompanySearch({
    searchName,
    setSearchName,
    onReset,
}: CompanySearchProps) {
    return (
        <div className="bg-card rounded-lg border p-4">
            <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-3">
                <div className="space-y-2">
                    <Label htmlFor="search-company-name">Tên công ty:</Label>
                    <Input
                        id="search-company-name"
                        placeholder="Nhập tên công ty..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={onReset}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Làm lại
                    </Button>
                </div>
            </div>
        </div>
    );
}
