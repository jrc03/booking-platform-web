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
  getMyBookings: async (): Promise<BookingResponseDto[]> => {
    const response = await api.get<BookingResponseDto[]>("/bookings/guest");
    return response.data;
  },
  cancel: async (id: string): Promise<void> => {
    await api.post(`/bookings/${id}/cancel`, { bookingId: id });
  },
  complete: async (id: string): Promise<void> => {
    await api.post(`/bookings/${id}/complete`, { bookingId: id });
  },
};
