import type { AuthState } from "@/types/auth.type";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { login, logout, register } from "./authThunk";
import type { UserResponseDto } from "@/types/user.type";

const initialState: AuthState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        updateTokenManually(
            state,
            action: PayloadAction<{
                accessToken: string;
                user?: UserResponseDto;
            }>,
        ) {
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
            if (action.payload.user) {
                state.user = action.payload.user;
            }
        },

        clearAuth(state) {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
        },

        updateUserLocally(state, action: PayloadAction<Partial<UserResponseDto>>) {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
    },

    // ================= EXTRA REDUCERS =================
    extraReducers: (builder) => {
        // -------- LOGIN --------
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;

                localStorage.setItem(
                    "access_token",
                    action.payload.accessToken,
                );
            })
            .addCase(login.rejected, (state) => {
                state.isLoading = false;
            });

        // -------- REGISTER --------
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;

                localStorage.setItem(
                    "access_token",
                    action.payload.accessToken,
                );
            })
            .addCase(register.rejected, (state) => {
                state.isLoading = false;
            });

        // -------- LOGOUT --------
        builder.addCase(logout.fulfilled, (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.isLoading = false;

            localStorage.removeItem("access_token");
        });
    },
});

export const { updateTokenManually, clearAuth, updateUserLocally } = authSlice.actions;
export default authSlice.reducer;
