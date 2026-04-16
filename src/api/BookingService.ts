import type {
    BookingResponseDto,
    CreateBookingRequestDto
} from "../types/dtos";
import api from "./axios";

export const bookingService = {
  create: async (
    payload: CreateBookingRequestDto,
  ): Promise<BookingResponseDto> => {
    const response = await api.post<BookingResponseDto>("/bookings", payload);
    return response.data;
  },
};
