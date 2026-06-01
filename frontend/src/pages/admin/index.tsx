import { SidebarProvider } from "@/components/ui/sidebar";
import { useAppSelector } from "@/features/hooks";
import { Navigate, Outlet } from "react-router-dom";
import { AdminSidebar } from "./Sidebar";
import { AdminTopBar } from "./TopBar";

const AdminPage = () => {
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    if (!isAuthenticated) return <Navigate to={"/home"} replace />;

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <AdminSidebar />
                <div className="flex flex-1 flex-col">
                    <AdminTopBar />
                    <div className="flex-1 p-4">
                        <Outlet />
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default AdminPage;
