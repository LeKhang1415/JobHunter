import type { UserResponseDto } from "./user.type";

export interface AuthState {
    user: UserResponseDto | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface AuthTokenResponseDto {
    accessToken: string;
    user: UserResponseDto;
}
