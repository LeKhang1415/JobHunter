import { loginApi, logoutApi, registerApi } from "@/services/authApi";
import type {
    UserLoginRequestDto,
    UserRegisterRequestDto,
} from "@/types/user.type";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { clearAuth } from "./authSlice";

export const login = createAsyncThunk(
    "auth/login",
    async (data: UserLoginRequestDto, thunkAPI) => {
        try {
            const res = await loginApi(data);
            return res.data.result;
        } catch (err: unknown) {
            const message = getErrorMessage(err, "Đăng nhập thất bại");
            return thunkAPI.rejectWithValue(message);
        }
    },
);

export const register = createAsyncThunk(
    "auth/register",
    async (data: UserRegisterRequestDto, thunkAPI) => {
        try {
            const res = await registerApi(data);
            return res.data.result;
        } catch (err: unknown) {
            const message = getErrorMessage(err, "Đăng ký thất bại");
            return thunkAPI.rejectWithValue(message);
        }
    },
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
    try {
        await logoutApi();
    } finally {
        thunkAPI.dispatch(clearAuth());
        // Cho redux-persist thời gian lưu state trước khi chuyển trang
        setTimeout(() => {
            window.location.href = "/login";
        }, 100);
    }
});

export const getErrorMessage = (error: unknown, message: string): string => {
    let resMessage = message;

    if (axios.isAxiosError(error)) {
        resMessage = error.response?.data.message || message;
    }

    return resMessage;
};
