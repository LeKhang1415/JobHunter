import UserMenu from "@/components/custom/UserMenu";
import { useAppSelector } from "@/features/hooks";
import { Home, Code, Building2 } from "lucide-react";

import { Link, NavLink } from "react-router-dom";

function Header() {
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    const navItems = [
        { href: "/home", label: "Trang chủ", Icon: Home },
        { href: "/companies", label: "Công ty", Icon: Building2 },
        { href: "/jobs", label: "Việc làm ", Icon: Code },
    ];
    return (
        <header className="sticky top-0 z-50 w-full border-b border-blue-100 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 items-center justify-between px-30">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white px-4 shadow"
                >
                    <img
                        src="/web-logo.png"
                        alt="TalentBridge"
                        className="size-12 rounded-lg object-contain"
                    />
                </Link>
                {/* Desktop Nav */}
                <nav className="hidden lg:block">
                    <ul className="flex space-x-2 items-center">
                        {navItems.map(({ href, label, Icon }) => (
                            <li key={href}>
                                <NavLink
                                    to={href}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 px-4 py-2 font-medium duration-300 ease-in-out hover:-translate-y-0.5 rounded-xl ${isActive ? "bg-green-500 text-white" : "bg-white text-green-500 border border-green-500"}`
                                    }
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
                {/* Auth */}
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <UserMenu />
                    ) : (
                        <Link
                            to="/login"
                            className="flex px-4 py-2 items-center font-medium duration-300 ease-in-out hover:-translate-y-0.5 rounded-xl bg-green-500 text-white"
                        >
                            Đăng nhập
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
