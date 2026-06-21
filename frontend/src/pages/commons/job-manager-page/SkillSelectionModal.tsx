import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { findAllSkillsNoPaging } from "@/services/skillApi";
import type { SkillSummary } from "@/types/job.type";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface SkillSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialSelectedSkills: SkillSummary[];
    onApply: (skills: SkillSummary[]) => void;
}

export default function SkillSelectionModal({
    isOpen,
    onClose,
    initialSelectedSkills,
    onApply,
}: SkillSelectionModalProps) {
    const [allSkills, setAllSkills] = useState<SkillSummary[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMap, setSelectedMap] = useState<Record<string, SkillSummary>>({});

    useEffect(() => {
        if (isOpen) {
            const map: Record<string, SkillSummary> = {};
            initialSelectedSkills.forEach((s) => {
                map[s.id] = s;
            });
            setSelectedMap(map);
            setSearchTerm("");
        }
    }, [isOpen, initialSelectedSkills]);

    useEffect(() => {
        const fetchSkills = async () => {
            setIsLoading(true);
            try {
                const res = await findAllSkillsNoPaging();
                setAllSkills(res.data.result.map((s) => ({ id: s.id, name: s.name })));
            } catch (err) {
                toast.error("Không thể tải danh sách kỹ năng");
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen && allSkills.length === 0) {
            fetchSkills();
        }
    }, [isOpen, allSkills.length]);

    const filteredSkills = allSkills.filter((skill) =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSkill = (skill: SkillSummary, checked: boolean) => {
        setSelectedMap((prev) => {
            const newMap = { ...prev };
            if (checked) {
                newMap[skill.id] = skill;
            } else {
                delete newMap[skill.id];
            }
            return newMap;
        });
    };

    const handleApply = () => {
        onApply(Object.values(selectedMap));
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Chọn kỹ năng</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Tìm kiếm kỹ năng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    
                    <div className="h-[300px] overflow-y-auto rounded-md border p-4 space-y-2">
                        {isLoading ? (
                            <div className="flex h-full items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            </div>
                        ) : filteredSkills.length === 0 ? (
                            <div className="flex h-full items-center justify-center text-sm text-gray-500">
                                Không tìm thấy kỹ năng phù hợp
                            </div>
                        ) : (
                            filteredSkills.map((skill) => (
                                <div key={skill.id} className="flex items-center space-x-3 py-2 border-b last:border-0 hover:bg-gray-50 px-2 rounded-md transition-colors cursor-pointer" onClick={() => toggleSkill(skill, !selectedMap[skill.id])}>
                                    <Checkbox
                                        id={skill.id}
                                        checked={!!selectedMap[skill.id]}
                                        onCheckedChange={(checked) => toggleSkill(skill, checked as boolean)}
                                    />
                                    <label
                                        htmlFor={skill.id}
                                        className="flex-1 text-sm font-medium leading-none cursor-pointer"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        {skill.name}
                                    </label>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="text-sm text-gray-500">
                        Đã chọn: <span className="font-bold text-black">{Object.keys(selectedMap).length}</span> kỹ năng
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button onClick={handleApply}>Lưu</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
