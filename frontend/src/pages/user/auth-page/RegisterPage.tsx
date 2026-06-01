import { useAppDispatch, useAppSelector } from "@/features/hooks";
import { register } from "@/features/slices/auth/authThunk";
import { type UserRegisterRequestDto } from "@/types/user.type";

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const [form, setForm] = useState<UserRegisterRequestDto>({
        name: "",
        email: "",
        password: "",
        gender: "male",
        address: "",
        recruiter: false,
    });

    const [error, setError] = useState<string>("");

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const isLogin = useAppSelector((state) => state.auth.isAuthenticated);

    useEffect(() => {
        if (isLogin) {
            navigate("/home", { replace: true });
        }
    }, [isLogin, navigate]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setForm({ ...form, [name]: checked });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const validateEmail = (email: string): boolean => {
        const regex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
        return regex.test(email);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.password) {
            setError("Vui lòng điền đầy đủ thông tin bắt buộc.");
            return;
        }

        if (!validateEmail(form.email)) {
            setError("Email không hợp lệ.");
            return;
        }

        setError("");

        dispatch(register(form));
    };

    return (
        <div className="min-h-screen bg-green-200 flex items-center justify-center">
            <div className="flex flex-col-reverse lg:flex-row w-11/12 max-w-6xl mx-auto my-20 shadow-xl rounded-xl overflow-hidden">
                {/* Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
                    <div className="w-full max-w-md">
                        <h2 className="text-3xl font-bold mb-6 text-center">
                            Đăng ký
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block mb-1 font-medium">
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    placeholder="Nhập họ và tên"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block mb-1 font-medium">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    placeholder="Nhập email"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block mb-1 font-medium">
                                    Mật khẩu
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    placeholder="Nhập mật khẩu"
                                />
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block mb-1 font-medium">
                                    Giới tính
                                </label>
                                <select
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                >
                                    <option value="male">Nam</option>
                                    <option value="female">Nữ</option>
                                    <option value="other">Khác</option>
                                </select>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block mb-1 font-medium">
                                    Địa chỉ
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    placeholder="Nhập địa chỉ"
                                />
                            </div>

                            {/* Recruiter */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="recruiter"
                                    checked={form.recruiter}
                                    onChange={handleChange}
                                />
                                <label>
                                    Đăng ký với vai trò nhà tuyển dụng
                                </label>
                            </div>

                            {error && (
                                <div className="text-red-600 text-sm font-semibold">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-800 transition"
                            >
                                Đăng ký
                            </button>
                        </form>

                        <div className="mt-4 text-center text-sm">
                            Đã có tài khoản?{" "}
                            <Link
                                to="/login"
                                className="text-blue-600 hover:underline"
                            >
                                Đăng nhập
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Illustration */}
                <div className="w-full lg:w-1/2 h-64 lg:h-auto">
                    <img
                        src="register-illustration.png"
                        alt="Register illustration"
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>
        </div>
    );
}
