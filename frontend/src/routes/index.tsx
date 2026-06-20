import { createBrowserRouter, Navigate } from "react-router-dom";

import UserLayout from "@/layouts/UserLayout";
import HomePage from "@/pages/user/home-page";
import LoginPage from "@/pages/user/auth-page/LoginPage";
import RegisterPage from "@/pages/user/auth-page/RegisterPage";
import CompanyClientPage from "@/pages/user/company-page/CompanyClientPage";
import CompanyDetailsClientPage from "@/pages/user/company-detail-page/CompanyDetailsClientPage";
import JobClientPage from "@/pages/user/job-page/JobClientPage";
import JobDetailsClientPage from "@/pages/user/job-page/JobDetailsClientPage";
import RecruiterPage from "@/pages/recruiter";
import CompanyManagerRecruiterPage from "@/pages/recruiter/self-company-page";
import MemberManagePage from "@/pages/recruiter/member-page";
import AdminPage from "@/pages/admin";
import DashboardPage from "@/pages/admin/dashboard-page";
import SkillManagerAdminPage from "@/pages/admin/skill-page";
import SkillManagerRecruiterPage from "@/pages/recruiter/skill-page";
import PermissionManagerPage from "@/pages/admin/access-control-page/permission-page";
import RoleManagerPage from "@/pages/admin/access-control-page/role-page";
import JobManageRecruiterPage from "@/pages/recruiter/job-page";
import JobUpsertRecruiterPage from "@/pages/recruiter/job-page/job-upsert-page";
import UserManagerPage from "@/pages/admin/user-manager-page";
import UserUpsertPage from "@/pages/admin/user-manager-page/UserUpsertPage";
import CompanyManagerPage from "@/pages/admin/company-page";
import JobManagerAdminPage from "@/pages/admin/job-manager-page";
import JobUpsertAdminPage from "@/pages/admin/job-manager-page/job-upsert-page";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <UserLayout />,
        children: [
            { index: true, element: <Navigate to={"/home"} /> },
            { path: "home", element: <HomePage /> },
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },
            { path: "companies", element: <CompanyClientPage /> },
            { path: "companies/:id", element: <CompanyDetailsClientPage /> },
            { path: "jobs", element: <JobClientPage /> },
            { path: "jobs/:id", element: <JobDetailsClientPage /> },
        ],
    },

    {
        path: "/recruiter",
        element: <RecruiterPage />,
        children: [
            { index: true, element: <Navigate to={"/recruiter/company"} /> },
            { path: "company", element: <CompanyManagerRecruiterPage /> },
            { path: "members", element: <MemberManagePage /> },
            { path: "skills", element: <SkillManagerRecruiterPage /> },
            { path: "jobs", element: <JobManageRecruiterPage /> },
            { path: "jobs/upsert", element: <JobUpsertRecruiterPage /> },
        ],
    },

    {
        path: "/admin",
        element: <AdminPage />,
        children: [
            { index: true, element: <Navigate to={"/admin/dashboard"} /> },
            { path: "dashboard", element: <DashboardPage /> },
            { path: "company", element: <CompanyManagerPage /> },
            { path: "skill-manager", element: <SkillManagerAdminPage /> },
            { path: "user-manager", element: <UserManagerPage /> },
            { path: "user-manager/upsert", element: <UserUpsertPage /> },
            { path: "job-manager", element: <JobManagerAdminPage /> },
            { path: "job-manager/upsert", element: <JobUpsertAdminPage /> },
            {
                path: "access-control/permission",
                element: <PermissionManagerPage />,
            },
            {
                path: "access-control/role",
                element: <RoleManagerPage />,
            },
        ],
    },
]);
