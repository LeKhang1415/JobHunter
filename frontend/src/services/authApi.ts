import axiosClient from "@/lib/axiosClient";
import axios from "axios";
import type { ApiResponse } from "@/types/apiResponse.type";
import type {
    UserLoginRequestDto,
    UserRegisterRequestDto,
} from "@/types/user.type";
import type { AuthTokenResponseDto } from "@/types/auth.type";

export const loginApi = (data: UserLoginRequestDto) => {
    return axiosClient.post<ApiResponse<AuthTokenResponseDto>>(
        "/auth/login",
        data,
    );
};

export const registerApi = (data: UserRegisterRequestDto) => {
    return axiosClient.post<ApiResponse<AuthTokenResponseDto>>(
        "/auth/register",
        data,
    );
};

export const refreshTokenApi = () =>
    axios.post(
        "http://localhost:3000/auth/refresh",
        {},
        { withCredentials: true },
    );

export const logoutApi = () => {
    return axios.post(
        "http://localhost:3000/auth/logout",
        {},
        { withCredentials: true },
    );
};
