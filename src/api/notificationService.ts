import api from "./axios";
import type { NotificationResponseDto, Guid } from "../types/dtos";

export const notificationService = {
  getUnread: async (): Promise<NotificationResponseDto[]> => {
    const response = await api.get<NotificationResponseDto[]>(
      "/notifications/unread",
    );
    return response.data;
  },
  markAsRead: async (id: Guid): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
  },
  markAllAsRead: async (): Promise<void> => {
    await api.patch("/notifications/read-all");
  },
};
