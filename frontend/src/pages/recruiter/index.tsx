import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { findSelfCompany, saveSelfCompany } from "@/services/companyApi";
import CompanyFormDialog from "../admin/company-page/CompanyFormDialog";
import { getErrorMessage } from "@/features/slices/auth/authThunk";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import LoadingSpinner from "@/components/custom/LoadingSpinner";
import { RecruiterSidebar } from "./Sidebar";
import { RecruiterTopBar } from "./Topbar";

const RecruiterPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasCompany, setHasCompany] = useState(false);

    const fetchCompany = async () => {
        setIsChecking(true);
        try {
            const res = (await findSelfCompany()).data.result;
            if (res) setHasCompany(true);
        } catch (err) {
            console.log(
                getErrorMessage(err, "Không thể lấy thông tin công ty"),
            );
        } finally {
            setIsChecking(false);
        }
    };

    useEffect(() => {
        fetchCompany();
    }, []);

    useEffect(() => {
        fetchCompany();
    }, []);

    if (isChecking) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-purple-50 via-white to-purple-100">
                <div className="flex flex-col items-center gap-2">
                    <span className="loader mb-2 h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
                    <span className="text-lg text-purple-700">
                        Đang tải dữ liệu công ty...
                    </span>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex h-[300px] items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!hasCompany) {
        return (
            <>
                <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-purple-300 via-white to-purple-400">
                    <div className="animate-fade-in flex flex-col items-center gap-4 rounded-xl border border-purple-200 bg-white/80 px-8 py-10 shadow-2xl">
                        <Building2 className="mb-2 h-12 w-12 text-purple-500" />
                        <h1 className="text-2xl font-bold text-gray-800">
                            Bạn chưa có công ty
                        </h1>
                        <p className="mb-2 text-center text-gray-500">
                            Hãy tạo công ty để tiếp tục sử dụng các tính năng
                            dành cho nhà tuyển dụng.
                        </p>
                        <Button
                            className="rounded-lg bg-purple-600 px-8 py-2 font-semibold text-white shadow transition hover:bg-purple-700"
                            onClick={() => setIsFormOpen(true)}
                        >
                            + Tạo công ty
                        </Button>
                        <Link
                            to={"/"}
                            className="text-sm text-gray-500 hover:underline"
                        >
                            Quay về trang chủ
                        </Link>
                    </div>
                </div>

                <CompanyFormDialog
                    open={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={fetchCompany}
                />
            </>
        );
    }
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <RecruiterSidebar />

                <SidebarInset className="flex flex-1 flex-col">
                    <RecruiterTopBar />

                    <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
                        <Outlet />
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
};

export default RecruiterPage;
