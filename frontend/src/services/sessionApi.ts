import axiosClient from "@/lib/axiosClient";
import type { ApiResponse } from "@/types/apiResponse.type";
import type { SessionResponse } from "@/types/session.type";

export const getAllUserSessionsApi = () => {
    return axiosClient.get<ApiResponse<SessionResponse[]>>("/sessions");
};

export const removeSessionApi = (sessionId: string) => {
    return axiosClient.delete<ApiResponse<null>>("/sessions", {
        data: { sessionId },
    });
};
