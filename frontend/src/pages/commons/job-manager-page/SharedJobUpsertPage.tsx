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
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getErrorMessage } from "@/features/slices/auth/authThunk.ts";
import {
    findJobById,
    createJobForRecruiter,
    updateJobByIdForRecruiter,
    updateJobById,
    createJob,
} from "@/services/jobApi.ts";
import { getAllCompanies } from "@/services/companyApi.ts";
import { formatISOToYMD } from "@/utils/convertHelper.ts";
import { useAppSelector } from "@/features/hooks.ts";
import type { DefaultJobRequestDto, SkillSummary } from "@/types/job.type";
import RichTextEditor from "@/components/custom/RichText/RichTextEditor";
import SkillSelection from "@/pages/commons/job-manager-page/SkillSelection";
import CompanySelection from "@/pages/commons/job-manager-page/CompanySelection";
import HasPermission from "@/components/custom/HasPermission";
import { toast } from "sonner";

const levels = [
    { value: "INTERN", label: "Intern" },
    { value: "FRESHER", label: "Fresher" },
    { value: "MIDDLE", label: "Middle" },
    { value: "SENIOR", label: "Senior" },
];

interface CompanyOption {
    id: string;
    name: string;
}

interface SharedJobUpsertPageProps {
    role: "admin" | "recruiter";
}

export default function SharedJobUpsertPage({
    role,
}: SharedJobUpsertPageProps) {
    const user = useAppSelector((state) => state.auth.user);
    const permissions = user?.permissions || [];
    const recruiterCompanyId = user?.company?.id || "";

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const id = searchParams.get("id");
    const isEdit = !!id;

    const [companies, setCompanies] = useState<CompanyOption[]>([]);
    const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);

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
        company: role === "recruiter" ? { id: recruiterCompanyId } : null,
        skills: [],
    });

    const [selectedCompanyId, setSelectedCompanyId] = useState("");
    const [selectedSkills, setSelectedSkills] = useState<SkillSummary[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const primaryColor = role === "admin" ? "blue" : "purple";

    // Fetch companies for Admin
    useEffect(() => {
        if (role === "admin") {
            const fetchCompanies = async () => {
                setIsLoadingCompanies(true);
                try {
                    const res = await getAllCompanies({ page: 1, limit: 999 });
                    const companyList = res.data.result.data.map((c) => ({
                        id: c.id,
                        name: c.name,
                    }));
                    setCompanies(companyList);
                } catch (err) {
                    console.error(
                        getErrorMessage(err, "Không thể tải danh sách công ty"),
                    );
                } finally {
                    setIsLoadingCompanies(false);
                }
            };
            fetchCompanies();
        }
    }, [role]);

    // Fetch job data when editing
    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                setIsFetching(true);
                try {
                    const res = await findJobById(id);
                    const job = res.data.result;
                    job.startDate = formatISOToYMD(job.startDate);
                    job.endDate = formatISOToYMD(job.endDate);

                    setFormData(job);
                    setSelectedSkills(job.skills || []);
                    if (role === "admin") {
                        setSelectedCompanyId(job.company?.id || "");
                    }
                } catch (err) {
                    toast.error(
                        getErrorMessage(err, "Không tìm thấy công việc này"),
                    );
                    setSearchParams({});
                } finally {
                    setIsFetching(false);
                }
            };

            fetchData();
        }
    }, [id, setSearchParams, role]);

    // Permissions check
    useEffect(() => {
        const routePrefix = role === "admin" ? "/admin/job-manager" : "/recruiter/jobs";
        if (role === "admin") {
            if (isEdit && !permissions.includes("PATCH /jobs/:id"))
                navigate(routePrefix);
            else if (!isEdit && !permissions.includes("POST /jobs"))
                navigate(routePrefix);
        } else {
            if (isEdit && !permissions.includes("PATCH /jobs/recruiter/:id"))
                navigate(routePrefix);
            else if (!isEdit && !permissions.includes("POST /jobs/recruiter"))
                navigate(routePrefix);
        }
    }, [isEdit, navigate, permissions, role]);

    const handleApplySkills = (skills: SkillSummary[]) => {
        setSelectedSkills(skills);
    };

    const removeSkill = (skill: SkillSummary) => {
        setSelectedSkills(selectedSkills.filter((s) => s.id !== skill.id));
    };

    const handleInputChange = (
        field: keyof DefaultJobRequestDto,
        value: string | number | boolean,
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const toISODate = (dateStr: string): string => {
        return new Date(dateStr).toISOString();
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = "Tên Job là bắt buộc";
        if (!formData.location.trim())
            newErrors.location = "Địa điểm là bắt buộc";
        if (!formData.startDate)
            newErrors.startDate = "Ngày bắt đầu là bắt buộc";
        if (!formData.endDate)
            newErrors.endDate = "Ngày kết thúc là bắt buộc";
        if (!formData.description.trim())
            newErrors.description = "Mô tả là bắt buộc";

        if (role === "admin" && !selectedCompanyId) {
            newErrors.company = "Công ty là bắt buộc";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

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

            if (role === "admin") {
                payload.companyId = selectedCompanyId;
                if (isEdit) {
                    await updateJobById(id as string, payload);
                    toast.success("Cập nhật công việc thành công");
                } else {
                    await createJob(payload);
                    toast.success("Tạo công việc mới thành công");
                }
            } else {
                if (isEdit) {
                    await updateJobByIdForRecruiter(id as string, payload);
                    toast.success("Cập nhật công việc thành công");
                } else {
                    await createJobForRecruiter(payload);
                    toast.success("Tạo công việc mới thành công");
                }
            }

            handleBack();
        } catch (err) {
            toast.error(getErrorMessage(err, "Thao tác thất bại"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        if (role === "admin") {
            navigate("/admin/job-manager");
        } else {
            navigate("/recruiter/jobs");
        }
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className={`h-8 w-8 animate-spin text-${primaryColor}-600`} />
            </div>
        );
    }

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
                        {/* Row 1 - Name & Location */}
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
                                    className={
                                        errors.name ? "border-red-500" : ""
                                    }
                                    required
                                />
                                {errors.name && (
                                    <span className="text-xs text-red-500">
                                        {errors.name}
                                    </span>
                                )}
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
                                    className={
                                        errors.location ? "border-red-500" : ""
                                    }
                                    required
                                />
                                {errors.location && (
                                    <span className="text-xs text-red-500">
                                        {errors.location}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Row 2 - Salary, Quantity, Level */}
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

                        {/* Row 3 - Dates & Status */}
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
                                    className={`w-fit ${errors.startDate ? "border-red-500" : ""}`}
                                    required
                                />
                                {errors.startDate && (
                                    <span className="text-xs text-red-500">
                                        {errors.startDate}
                                    </span>
                                )}
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
                                    className={`w-fit ${errors.endDate ? "border-red-500" : ""}`}
                                    required
                                />
                                {errors.endDate && (
                                    <span className="text-xs text-red-500">
                                        {errors.endDate}
                                    </span>
                                )}
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
                            {errors.description && (
                                <span className="text-xs text-red-500">
                                    {errors.description}
                                </span>
                            )}
                        </div>

                        {/* Company and Skills */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Company Selection (Admin only) */}
                            <HasPermission perm={["POST /jobs", "PATCH /jobs/:id"]}>
                                <CompanySelection
                                    selectedCompanyId={selectedCompanyId}
                                    onCompanyChange={(id) => {
                                        setSelectedCompanyId(id);
                                        if (errors.company) {
                                            setErrors((prev) => ({ ...prev, company: "" }));
                                        }
                                    }}
                                    error={errors.company}
                                />
                            </HasPermission>

                            {/* Skills */}
                            <SkillSelection
                                selectedSkills={selectedSkills}
                                onApplySkills={handleApplySkills}
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
                                className={`bg-${primaryColor}-600 hover:bg-${primaryColor}-700 text-white`}
                            >
                                {isLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
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
