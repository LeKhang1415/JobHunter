import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import {
    createSkill,
    deleteSkill,
    findAllSkills,
    updateSkill,
} from "@/services/skillApi";

import type {
    CreateSkillRequestDto,
    DefaultSkillResponseDto,
    UpdateSkillRequestDto,
} from "@/types/skill.type";

import Pagination from "@/components/custom/Pagination";
import { getErrorMessage } from "@/features/slices/auth/authThunk";

import { SkillForm } from "./SkillForm";
import { SkillTable } from "./SkillTable";
import SkillSearch from "./SkillSearch";
import HasPermission from "@/components/custom/HasPermission";

interface SkillManagerProps {
    theme?: "blue" | "purple";
}

const SkillManagerPage = ({ theme = "purple" }: SkillManagerProps) => {
    const [skills, setSkills] = useState<DefaultSkillResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [searchName, setSearchName] = useState<string>("");

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(5);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalElements, setTotalElements] = useState<number>(0);

    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [editingSkill, setEditingSkill] =
        useState<DefaultSkillResponseDto | null>(null);

    const fetchSkills = async (
        page: number,
        limit: number,
        searchName?: string,
    ) => {
        setIsLoading(true);
        try {
            const params = {
                page: Number(page) > 0 ? Number(page) : 1,
                limit: Number(limit) > 0 ? Number(limit) : 5,
                searchName: searchName?.trim() || undefined,
            };

            console.log("page:", page, "limit:", limit);

            const res = (await findAllSkills(params)).data.result;

            setSkills(res.data);
            setTotalElements(res.meta.totalItems);
            setTotalPages(res.meta.totalPages);
        } catch (err) {
            console.log(
                getErrorMessage(err, "Không thể lấy danh sách kỹ năng."),
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchSkills(currentPage, itemsPerPage, searchName);
        }, 300);

        return () => clearTimeout(timeout);
    }, [currentPage, itemsPerPage, searchName]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchName]);

    const openEditForm = (skill: DefaultSkillResponseDto) => {
        setEditingSkill(skill);
        setIsFormOpen(true);
    };

    const openCreateForm = () => {
        setEditingSkill(null);
        setIsFormOpen(true);
    };

    const handleReset = () => {
        setSearchName("");
        setCurrentPage(1);
        setIsFormOpen(false);
        setEditingSkill(null);
    };

    const handleAddOrUpdateSkill = async (
        data: CreateSkillRequestDto | UpdateSkillRequestDto,
    ) => {
        if (!data) return;

        try {
            if (editingSkill) {
                await updateSkill(editingSkill.id, data);
                console.log("Cập nhật kỹ năng thành công.");
            } else {
                await createSkill(data);
                console.log("Tạo kỹ năng thành công.");
            }

            handleReset();

            fetchSkills(currentPage, itemsPerPage, searchName);
        } catch (err) {
            console.log(getErrorMessage(err, "Thao tác thất bại."));
        }
    };

    const handleDeleteSkill = async (id: string) => {
        try {
            await deleteSkill(id);
            console.log("Xóa kỹ năng thành công.");
            handleReset();
            fetchSkills(currentPage, itemsPerPage, searchName);
        } catch (err) {
            console.log(getErrorMessage(err, "Xóa kỹ năng thất bại."));
        }
    };

    return (
        <div className="space-y-6">
            <SkillSearch
                searchName={searchName}
                setSearchName={setSearchName}
                onReset={handleReset}
            />

            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Danh sách Kỹ năng</h2>

                <HasPermission perm={"POST /skills"}>
                    <Button
                        className={`${
                            theme === "blue"
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-purple-600 hover:bg-purple-700"
                        }`}
                        onClick={openCreateForm}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm kỹ năng
                    </Button>
                </HasPermission>
            </div>

            <SkillTable
                skills={skills}
                isLoading={isLoading}
                onEdit={openEditForm}
                onDelete={handleDeleteSkill}
                theme={theme}
            />

            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                totalElements={totalElements}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                showItemsPerPageSelect={true}
                theme={theme}
            />

            <SkillForm
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                onSubmit={handleAddOrUpdateSkill}
                initialData={editingSkill}
                onCloseForm={() => setEditingSkill(null)}
                theme={theme}
            />
        </div>
    );
};

export default SkillManagerPage;
