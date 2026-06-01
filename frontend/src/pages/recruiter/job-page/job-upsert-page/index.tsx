import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getErrorMessage } from "@/features/slices/auth/authThunk.ts";
import {
    findJobById,
    createJobForRecruiter,
    updateJobByIdForRecruiter,
} from "@/services/jobApi.ts";
import { formatISOToYMD } from "@/utils/convertHelper.ts";
import { useAppSelector } from "@/features/hooks.ts";
import type { DefaultJobRequestDto, SkillSummary } from "@/types/job.type";
import RichTextEditor from "@/components/custom/RichText/RichTextEditor";

const levels = [
    { value: "INTERN", label: "Intern" },
    { value: "FRESHER", label: "Fresher" },
    { value: "MIDDLE", label: "Middle" },
    { value: "SENIOR", label: "Senior" },
];

export default function JobUpsertRecruiterPage() {
    const { permissions, companyId } = useAppSelector(
        (state) => state.auth.user,
    );

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const id = searchParams.get("id");
    const isEdit = !!id;

    const [formData, setFormData] = useState<DefaultJobRequestDto>({
        name: "",
        location: "",
        salary: 0,
        quantity: 1,
        level: "INTERN",
        description: "",
        startDate: "",
        endDate: "",
        active: true,
        company: { id: companyId },
        skills: [],
    });

    const [selectedSkills, setSelectedSkills] = useState<SkillSummary[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const res = await findJobById(id);
                    const job = res.data.result;
                    job.startDate = formatISOToYMD(job.startDate);
                    job.endDate = formatISOToYMD(job.endDate);

                    setFormData(job);
                    setSelectedSkills(job.skills || []);
                } catch (err) {
                    console.error(
                        getErrorMessage(err, "Không tìm thấy công việc này"),
                    );
                    setSearchParams({});
                } finally {
                    setIsLoading(false);
                }
            };

            fetchData();
        }
    }, [id, setSearchParams]);

    const addSkill = (skill: SkillSummary) => {
        const exists = selectedSkills.some((s) => s.id === skill.id);
        if (exists) return;

        setSelectedSkills([...selectedSkills, skill]);
    };

    const removeSkill = (skill: SkillSummary) => {
        setSelectedSkills(selectedSkills.filter((s) => s.id !== skill.id));
    };

    const handleInputChange = (
        field: keyof DefaultJobRequestDto,
        value: string | number | boolean,
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const toISODate = (dateStr: string): string => {
        return new Date(dateStr).toISOString();
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const startDateISO = toISODate(formData.startDate);
            const endDateISO = toISODate(formData.endDate);

            const payload: any = {
                name: formData.name,
                location: formData.location,
                salary: formData.salary,
                quantity: formData.quantity,
                level: formData.level,
                description: formData.description,
                startDate: startDateISO,
                endDate: endDateISO,
                active: formData.active,
                skillIds: selectedSkills.map((s) => s.id),
            };

            // 3. Gọi API
            if (isEdit) {
                await updateJobByIdForRecruiter(id as string, payload);
            } else {
                await createJobForRecruiter(payload);
            }

            console.log(
                isEdit
                    ? "Cập nhật công việc thành công"
                    : "Tạo công việc mới thành công",
            );
            handleBack();
        } catch (err) {
            console.error(getErrorMessage(err, "Thao tác thất bại"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        navigate("/recruiter/jobs");
    };

    useEffect(() => {
        if (isEdit && !permissions.includes("PATCH /jobs/recruiter/:id"))
            navigate("/recruiter/job-manager");
        else if (!isEdit && !permissions.includes("POST /jobs/recruiter"))
            navigate("/recruiter/job-manager");
    }, [isEdit, navigate, permissions]);

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            onClick={handleBack}
                            className="cursor-pointer"
                        >
                            Quản lý việc làm
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            {isEdit ? "Cập nhật" : "Tạo mới"} việc làm
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">
                        {isEdit ? "Chỉnh sửa Job" : "Thêm Job mới"}
                    </h1>
                    <p className="text-muted-foreground">
                        {isEdit
                            ? "Cập nhật thông tin job"
                            : "Tạo job mới trong hệ thống"}
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Thông tin Job</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6" onSubmit={handleFormSubmit}>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Tên Job{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Nhập tên công việc..."
                                    value={formData.name}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "name",
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">
                                    Địa điểm{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="location"
                                    placeholder="Nhập địa điểm làm việc..."
                                    value={formData.location}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "location",
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="salary">
                                    Mức lương{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="salary"
                                        placeholder="Nhập mức lương"
                                        type="number"
                                        value={formData.salary}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "salary",
                                                Number(e.target.value),
                                            )
                                        }
                                        required
                                        className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    />
                                    <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2">
                                        VND
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quantity">
                                    Số lượng{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="quantity"
                                    placeholder="Nhập số lượng"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "quantity",
                                            Number(e.target.value),
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="level">
                                    Trình độ{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.level}
                                    onValueChange={(value) =>
                                        handleInputChange(
                                            "level",
                                            value as DefaultJobRequestDto["level"],
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn cấp độ" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {levels.map((level) => (
                                            <SelectItem
                                                key={level.value}
                                                value={level.value}
                                            >
                                                {level.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Row 3 */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">
                                    Ngày bắt đầu{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "startDate",
                                            e.target.value,
                                        )
                                    }
                                    required
                                    className="w-fit"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">
                                    Ngày kết thúc{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "endDate",
                                            e.target.value,
                                        )
                                    }
                                    required
                                    className="w-fit"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Trạng thái</Label>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="status"
                                        checked={formData.active}
                                        onCheckedChange={(checked) =>
                                            handleInputChange("active", checked)
                                        }
                                    />
                                    <Label
                                        htmlFor="status"
                                        className="text-sm font-medium"
                                    >
                                        {formData.active
                                            ? "ACTIVE"
                                            : "INACTIVE"}
                                    </Label>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">
                                Miêu tả job{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <RichTextEditor
                                value={formData.description}
                                onChange={(value) =>
                                    handleInputChange("description", value)
                                }
                                placeholder="Nhập mô tả chi tiết về job..."
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Skills */}
                            <SkillSelection
                                selectedSkills={selectedSkills}
                                onAddSkill={addSkill}
                                onRemoveSkill={removeSkill}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleBack}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {isLoading
                                    ? "Đang xử lý..."
                                    : isEdit
                                      ? "Cập nhật"
                                      : "Thêm mới"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
