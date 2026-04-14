import api from "./axios";
import type {
  LoginRequestDto,
  RegisterRequestDto,
  AuthenticationResponseDto,
} from "../types/dtos";

export const authService = {
  login: async (
    payload: LoginRequestDto,
  ): Promise<AuthenticationResponseDto> => {
    const response = await api.post<AuthenticationResponseDto>(
      "/users/login",
      payload,
    );
    return response.data;
  },

  register: async (
    payload: RegisterRequestDto,
  ): Promise<AuthenticationResponseDto> => {
    const response = await api.post<AuthenticationResponseDto>(
      "users/register",
      payload,
    );

    return response.data;
  },
  becomeHost: async (): Promise<void> => {
    await api.post("users/become-host");
  },
};
