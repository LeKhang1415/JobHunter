import axiosClient from "@/lib/axiosClient";
import type { ApiResponse } from "@/types/apiResponse.type";
import type {
    CreateSubscriberRequestDto,
    UpdateSubscriberRequestDto,
    DefaultSubscriberResponseDto,
} from "@/types/subscriber.type";

export const findSelfSubscriber = () => {
    return axiosClient.get<ApiResponse<DefaultSubscriberResponseDto>>(
        "/subscribers/me",
    );
};

export const createSelfSubscriber = (data: CreateSubscriberRequestDto) => {
    return axiosClient.post<ApiResponse<DefaultSubscriberResponseDto>>(
        "/subscribers",
        data,
    );
};

export const updateSelfSubscriber = (data: UpdateSubscriberRequestDto) => {
    return axiosClient.patch<ApiResponse<DefaultSubscriberResponseDto>>(
        "/subscribers/me",
        data,
    );
};

export const deleteSelfSubscriber = () => {
    return axiosClient.delete<ApiResponse<null>>("/subscribers/me");
};
