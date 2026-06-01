import Footer from "@/pages/user/Footer";
import Header from "@/pages/user/Header";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
