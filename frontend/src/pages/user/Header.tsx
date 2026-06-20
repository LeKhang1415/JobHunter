import UserMenu from "@/components/custom/UserMenu";
import { useAppSelector } from "@/features/hooks";
import { Home, Code, Building2, Menu } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function Header() {
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    const navItems = [
        { href: "/home", label: "Trang chủ", Icon: Home },
        { href: "/companies", label: "Công ty", Icon: Building2 },
        { href: "/jobs", label: "Việc làm ", Icon: Code },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-green-800 bg-gradient-to-r from-green-800 to-green-600 shadow-md">
            <div className="mx-auto flex h-16 items-center justify-between px-4 lg:px-8 max-w-7xl">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white px-3 py-1 shadow"
                >
                    <img
                        src="/web-logo.png"
                        alt="TalentBridge"
                        className="size-10 rounded-lg object-contain"
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
                                        `flex items-center gap-2 px-4 py-2 font-medium duration-300 ease-in-out hover:-translate-y-0.5 rounded-xl border border-transparent ${isActive
                                            ? "bg-green-500 text-white shadow-sm"
                                            : "bg-white text-green-800 hover:bg-green-50 shadow-sm"
                                        }`
                                    }
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Actions & Mobile Menu */}
                <div className="flex items-center gap-4">
                    {/* Auth */}
                    <div className="hidden lg:block">
                        {isAuthenticated ? (
                            <UserMenu />
                        ) : (
                            <Link
                                to="/login"
                                className="flex px-5 py-2 items-center font-medium duration-300 ease-in-out hover:-translate-y-0.5 rounded-xl bg-white text-green-800 hover:bg-green-50"
                            >
                                Đăng nhập
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Trigger */}
                    <div className="lg:hidden flex items-center gap-2">
                        {isAuthenticated && <UserMenu />}
                        <Sheet>
                            <SheetTrigger asChild>
                                <button className="p-2 text-white hover:bg-green-700 rounded-lg transition">
                                    <Menu className="w-6 h-6" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-green-800 border-green-900">
                                <nav className="flex flex-col gap-4 mt-8">
                                    {navItems.map(({ href, label, Icon }) => (
                                        <NavLink
                                            key={href}
                                            to={href}
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition border border-transparent ${isActive
                                                    ? "bg-green-500 text-white shadow-sm"
                                                    : "bg-white text-green-800 hover:bg-green-50 shadow-sm"
                                                }`
                                            }
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="text-lg">{label}</span>
                                        </NavLink>
                                    ))}

                                    {!isAuthenticated && (
                                        <div className="mt-4 pt-4 border-t border-green-700">
                                            <Link
                                                to="/login"
                                                className="flex justify-center px-4 py-3 w-full font-medium rounded-xl bg-white text-green-800 hover:bg-green-50"
                                            >
                                                Đăng nhập
                                            </Link>
                                        </div>
                                    )}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
