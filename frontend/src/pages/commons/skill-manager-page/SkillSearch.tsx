import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RotateCcw } from "lucide-react";

interface SkillSearchProps {
    searchName: string;
    setSearchName: (value: string) => void;
    onReset: () => void;
}

function SkillSearch({ searchName, setSearchName, onReset }: SkillSearchProps) {
    return (
        <div className="rounded-lg p-4 bg-card border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div className="space-2">
                    <Label htmlFor="skill-name">Tên kỹ năng:</Label>
                    <Input
                        id="skill-name"
                        placeholder="Nhập tên kỹ năng..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={onReset}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Làm lại
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default SkillSearch;
