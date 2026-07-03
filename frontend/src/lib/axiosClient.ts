import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { refreshTokenApi } from "@/services/authApi";
import { updateTokenManually } from "@/features/slices/auth/authSlice";
import { logout } from "@/features/slices/auth/authThunk";
import type { AppDispatch } from "@/features/store";
import { toast } from "sonner";

let dispatchRef: AppDispatch;

export const setupAxiosInterceptors = (dispatch: AppDispatch) => {
    dispatchRef = dispatch;
};

const axiosClient = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
    }
    return config;
});

type FailedRequest = {
    resolve: () => void;
    reject: (reason?: unknown) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown | null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve();
    });
    failedQueue = [];
};

axiosClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<any>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        const status = error.response?.status;
        const errorCode = error.response?.data?.error as string | undefined;

        const isTokenExpired = status === 401 && errorCode === "Unauthorized";
        const isLoginApi = originalRequest.url === "/auth/login";

        // Chỉ chặn lại để đi xin cấp token mới (refresh) nếu KHÔNG PHẢI là api login
        if (isTokenExpired && !originalRequest._retry && !isLoginApi) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: () => resolve(axiosClient(originalRequest)),
                        reject,
                    });
                });
            }

            isRefreshing = true;

            try {
                const res = await refreshTokenApi();
                const accessToken = res.data.result.accessToken;

                dispatchRef(
                    updateTokenManually({
                        accessToken,
                        user: res.data.result.user,
                    }),
                );

                processQueue(null);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosClient(originalRequest);
            } catch (refreshError: any) {
                processQueue(refreshError);
                dispatchRef(logout());

                const errorMsg = refreshError?.response?.data?.message || "Phiên đăng nhập đã kết thúc. Vui lòng đăng nhập lại!";
                toast.error(errorMsg);

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

export default axiosClient;
