import LoadingSpinner from "@/components/custom/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/features/slices/auth/authThunk";
import CompanyFormDialog from "@/pages/admin/company-page/CompanyFormDialog";
import CompanySection from "@/pages/commons/company-details-components/CompanySection";
import { findSelfCompany } from "@/services/companyApi";
import type { DefaultCompanyResponseDto } from "@/types/company.type";
import { NotebookPen } from "lucide-react";
import { useEffect, useState } from "react";

import CompanyHeader from "@/pages/commons/company-details-components/CompanyHeader";

function CompanyManagerRecruiterPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [company, setCompany] = useState<
        DefaultCompanyResponseDto | undefined
    >();

    const fetchCompany = async () => {
        setIsLoading(true);
        try {
            const res = (await findSelfCompany()).data.result;
            if (res) setCompany(res);
        } catch (err) {
            console.log(
                getErrorMessage(err, "Không thể lấy thông tin công ty"),
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCompany();
    }, []);



    if (isLoading) {
        return (
            <div className="flex h-[300px] items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!company) return null;

    return (
        <>
            <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-purple-600 hover:bg-purple-700"
            >
                <NotebookPen className="mr-2 h-4 w-4" />
                Chỉnh sửa thông tin công ty
            </Button>

            <CompanyHeader company={company} isRecruiter={true} />
            <CompanySection company={company} isRecruiter={true} />

            <CompanyFormDialog
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={fetchCompany}
                initialData={company}
            />
        </>
    );
}

export default CompanyManagerRecruiterPage;
