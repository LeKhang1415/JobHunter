import { useState } from "react";
import { Badge } from "@/components/ui/badge.tsx";
import { Label } from "@/components/ui/label.tsx";
import { X, Wrench } from "lucide-react";
import type { SkillSummary } from "@/types/job.type";
import SkillSelectionModal from "./job-manager-page/SkillSelectionModal";
import { Button } from "@/components/ui/button";

interface SkillSelectionProps {
    selectedSkills: SkillSummary[];
    onRemoveSkill: (skill: SkillSummary) => void;
    onApplySkills: (skills: SkillSummary[]) => void;
}

export default function SkillSelection({
    selectedSkills,
    onRemoveSkill,
    onApplySkills,
}: SkillSelectionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-3 flex flex-col h-full">
            <Label>
                Kỹ năng yêu cầu <span className="text-red-500">*</span>
            </Label>

            <div className="rounded-md border p-4 flex flex-col bg-white flex-1">
                <div className="flex min-h-[60px] flex-wrap gap-2 content-start flex-1 mb-4">
                    {selectedSkills.length === 0 ? (
                        <p className="text-sm text-gray-400 w-full text-center py-4">Chưa có kỹ năng nào được chọn</p>
                    ) : (
                        selectedSkills.map((skill) => (
                            <Badge
                                key={skill.id}
                                className="bg-black text-white hover:bg-gray-800 transition-colors pl-3 pr-2 py-1 flex items-center gap-1 rounded-md"
                            >
                                {skill.name}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onRemoveSkill(skill);
                                    }}
                                    className="ml-1 rounded-sm p-0.5 hover:bg-gray-700 transition-colors"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))
                    )}
                </div>

                <Button
                    variant="outline"
                    className="w-full bg-gray-100 hover:bg-gray-200 text-sm font-medium border-gray-200 mt-auto"
                    onClick={() => setIsModalOpen(true)}
                    type="button"
                >
                    <Wrench className="w-4 h-4 mr-2" />
                    Chỉnh sửa kỹ năng
                </Button>
            </div>

            <SkillSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialSelectedSkills={selectedSkills}
                onApply={onApplySkills}
            />
        </div>
    );
}
