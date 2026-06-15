import { useEffect, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { X, Search, Loader2, ChevronDown } from "lucide-react";
import { findAllSkillsNoPaging } from "@/services/skillApi";
import type { SkillSummary } from "@/types/job.type";

interface SkillSelectionProps {
    selectedSkills: SkillSummary[];
    onAddSkill: (skill: SkillSummary) => void;
    onRemoveSkill: (skill: SkillSummary) => void;
}

export default function SkillSelection({
    selectedSkills,
    onAddSkill,
    onRemoveSkill,
}: SkillSelectionProps) {
    const [allSkills, setAllSkills] = useState<SkillSummary[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSkills = async () => {
            setIsLoading(true);
            try {
                const res = await findAllSkillsNoPaging();
                setAllSkills(
                    res.data.result.map((s) => ({ id: s.id, name: s.name })),
                );
            } catch (err) {
                console.error("Không thể tải danh sách kỹ năng", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSkills();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const availableSkills = allSkills.filter(
        (skill) =>
            !selectedSkills.some((s) => s.id === skill.id) &&
            skill.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <div className="space-y-3" ref={dropdownRef}>
            <Label>
                Kỹ năng yêu cầu <span className="text-red-500">*</span>
            </Label>

            {/* Selected Skills as Badges */}
            {selectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((skill) => (
                        <Badge
                            key={skill.id}
                            variant="secondary"
                            className="gap-1 px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                        >
                            {skill.name}
                            <button
                                type="button"
                                onClick={() => onRemoveSkill(skill)}
                                className="ml-1 rounded-full p-0.5 hover:bg-blue-200 transition-colors"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}

            {/* Search Input + Dropdown */}
            <div className="relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Tìm kiếm kỹ năng..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsDropdownOpen(true);
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        className="pl-9 pr-9"
                    />
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <ChevronDown
                                className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                            />
                        )}
                    </button>
                </div>

                {/* Dropdown List */}
                {isDropdownOpen && (
                    <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border bg-white shadow-lg">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                                <span className="ml-2 text-sm text-gray-500">
                                    Đang tải...
                                </span>
                            </div>
                        ) : availableSkills.length === 0 ? (
                            <div className="py-4 text-center text-sm text-gray-500">
                                {searchTerm
                                    ? "Không tìm thấy kỹ năng phù hợp"
                                    : "Tất cả kỹ năng đã được chọn"}
                            </div>
                        ) : (
                            availableSkills.map((skill) => (
                                <button
                                    key={skill.id}
                                    type="button"
                                    onClick={() => {
                                        onAddSkill(skill);
                                        setSearchTerm("");
                                    }}
                                    className="flex w-full items-center px-3 py-2 text-left text-sm hover:bg-blue-50 transition-colors"
                                >
                                    <span className="flex-1">
                                        {skill.name}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        + Thêm
                                    </span>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>

            {selectedSkills.length === 0 && (
                <p className="text-xs text-gray-500">
                    Chưa có kỹ năng nào được chọn
                </p>
            )}
        </div>
    );
}
