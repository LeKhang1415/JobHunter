import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Search } from "lucide-react";

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
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Tìm kiếm</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="search-name">Tên công ty</Label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <Input
                                    id="search-name"
                                    placeholder="Nhập tên công ty..."
                                    value={searchName}
                                    onChange={(e) =>
                                        setSearchName(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={onReset}
                            className="flex items-center gap-2"
                        >
                            <RotateCcw size={16} />
                            Đặt lại
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
