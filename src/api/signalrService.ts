import * as signalR from "@microsoft/signalr";
import { useAuthStore } from "../store/authStore";
import type { NotificationResponseDto } from "../types/dtos";

const getBaseUrl = () => {
  const apiBaseUrl =
    import.meta.env.VITE_API_URL || "http://localhost:5053/api";
  // The C# backend maps the hub outside the /api prefix
  return apiBaseUrl.replace("/api", "");
};

class SignalRNotificationService {
  private connection: signalR.HubConnection | null = null;
  private isConnecting = false;

  public async startConnection() {
    if (
      this.connection?.state === signalR.HubConnectionState.Connected ||
      this.isConnecting
    ) {
      return;
    }

    const token = useAuthStore.getState().token;
    if (!token) return; // Cannot connect without auth

    this.isConnecting = true;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${getBaseUrl()}/hubs/notifications`, {
        // Send access_token in query string for WebSockets
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    try {
      await this.connection.start();
      console.log("SignalR Notification Hub Connected.");
    } catch (error) {
      console.error("SignalR Connection Error: ", error);
    } finally {
      this.isConnecting = false;
    }
  }

  public async stopConnection() {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      console.log("SignalR Notification Hub Disconnected.");
    }
  }

  public onReceiveNotification(
    callback: (notification: NotificationResponseDto) => void,
  ) {
    if (!this.connection) return;

    // Prevent duplicate listeners on React fast refresh
    this.connection.off("ReceiveNotification");
    this.connection.on("ReceiveNotification", callback);
  }
}

export const signalRNotificationService = new SignalRNotificationService();
