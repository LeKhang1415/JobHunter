import { useAppDispatch, useAppSelector } from "@/features/hooks";
import { logout } from "@/features/slices/auth/authThunk";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import HasPermission from "./HasPermission";
import { Link } from "react-router-dom";
import { Briefcase, LogOut, Mail, Shield, User } from "lucide-react";

function UserMenu() {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={`group flex h-auto items-center gap-3 px-3 py-2 transition-colors hover:bg-green-300`}
                >
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 ring-2 ring-blue-100 transition-all group-hover:ring-green-200">
                            <AvatarImage
                                src={
                                    user?.userImgUrl
                                        ? `${user.userImgUrl}`
                                        : undefined
                                }
                                alt={user?.name || "User"}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 font-semibold text-white">
                                {user?.name
                                    ?.split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2) || "U"}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-72 p-2 bg-white z-50 shadow-lg border border-gray-200 rounded-md"
                sideOffset={5}
                alignOffset={-5}
            >
                {/* User Info Header */}
                <div className="mb-2 flex items-center gap-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-3">
                    <Avatar className="h-12 w-12 ring-2 ring-white">
                        <AvatarImage
                            src={
                                user?.userImgUrl
                                    ? `${user.userImgUrl}`
                                    : undefined
                            }
                            alt={user?.name || "User"}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 font-semibold text-white">
                            {user?.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2) || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-gray-900">
                            {user?.name || "User"}
                        </p>
                        <p className="truncate text-sm text-gray-600">
                            {user?.email || "user@gmail.com"}
                        </p>
                        <Badge>{user?.role?.name || "User"}</Badge>
                    </div>
                </div>

                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem>
                    <Link
                        to={"/user/info"}
                        className="flex cursor-pointer items-center gap-3 rounded-lg"
                    >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                            <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-medium">Thông tin người dùng</p>
                        </div>
                    </Link>
                </DropdownMenuItem>

                <HasPermission perm={"GET /subscribers/me"}>
                    <DropdownMenuItem>
                        <Link
                            to={"/user/subscriber"}
                            className="flex cursor-pointer items-center gap-3 rounded-lg"
                        >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                                <Mail className="h-4 w-4 text-gray-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-medium">Đăng ký thông báo</p>
                            </div>
                        </Link>
                    </DropdownMenuItem>
                </HasPermission>

                <HasPermission perm={"POST /resumes"}>
                    <DropdownMenuItem>
                        <Link
                            to={"/user/resumes"}
                            className="flex cursor-pointer items-center gap-3 rounded-lg"
                        >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                                <Briefcase className="h-4 w-4 text-gray-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-medium">Hồ sơ tuyển dụng</p>
                            </div>
                        </Link>
                    </DropdownMenuItem>
                </HasPermission>

                <HasPermission perm={"GET /recruiter"}>
                    <DropdownMenuItem>
                        <Link
                            to={"/recruiter"}
                            className="flex cursor-pointer items-center gap-3 rounded-lg"
                        >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500">
                                <Briefcase className="h-4 w-4 text-white" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-medium">Tuyển dụng</p>
                            </div>
                        </Link>
                    </DropdownMenuItem>
                </HasPermission>

                <HasPermission perm={"GET /admin"}>
                    <DropdownMenuItem>
                        <Link
                            to={"/admin"}
                            className="flex cursor-pointer items-center gap-3 rounded-lg"
                        >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500">
                                <Shield className="h-4 w-4 text-white" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-medium">Quản trị</p>
                            </div>
                        </Link>
                    </DropdownMenuItem>
                </HasPermission>

                <DropdownMenuSeparator className="h-px bg-gray-200" />

                <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex cursor-pointer items-center gap-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100">
                        <LogOut className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium">Đăng xuất</p>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default UserMenu;
