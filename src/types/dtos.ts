// Shared primitive aliases for API contracts
export type Guid = string;
export type ISODate = string; // Format: YYYY-MM-DD
export type ISODateTime = string; // Format: ISO-8601

// Useful for endpoints that intentionally send no body
export type EmptyRequestDto = Record<string, never>;

// 1) Users & Auth
// Requests
export interface RegisterRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isHost: boolean;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface ResendConfirmationRequestDto {
  email: string;
}

// Responses
export interface UserResponseDto {
  id: Guid;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthenticationResponseDto {
  id: Guid;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
}

// Generic message response (e.g. resend confirmation)
export interface MessageResponseDto {
  message: string;
}

// 2) Properties
// Request used by POST /api/properties and PUT /api/properties/{id}
export interface UpsertPropertyRequestDto {
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  capacity: number;
  imageUrls: string[];
}

export interface PropertyResponseDto {
  id: Guid;
  title: string;
  description: string;
  location: string;
  capacity: number;
  pricePerNight: number;
  imageUrls: string[];
}

// 3) Bookings
export interface CreateBookingRequestDto {
  propertyId: Guid;
  startDate: ISODate;
  endDate: ISODate;
}

// PUT /api/bookings/{id}/cancel and /complete do not need body
export type CancelBookingRequestDto = EmptyRequestDto;
export type CompleteBookingRequestDto = EmptyRequestDto;

export type BookingStatus = "Confirmed" | "Cancelled" | "Completed";

export interface BookingResponseDto {
  id: Guid;
  propertyId: Guid;
  guestId: Guid;
  startDate: ISODate;
  endDate: ISODate;
  totalPrice: number;
  status: BookingStatus;
}

// 4) Reviews
export interface CreateReviewRequestDto {
  bookingId: Guid;
  rating: number; // 1-5 (validated in backend)
  comment: string;
}

export interface ReviewResponseDto {
  id: Guid;
  bookingId: Guid;
  guestId: Guid;
  propertyId: Guid;
  rating: number;
  comment: string;
  createdAt: ISODateTime;
}

export interface PropertyReviewSummaryDto {
  averageRating: number;
  totalReviews: number;
  reviews: ReviewResponseDto[];
}

// 5) Notifications
// PUT /api/notifications/{id}/read does not need body
export type MarkNotificationAsReadRequestDto = EmptyRequestDto;

export interface NotificationResponseDto {
  id: Guid;
  userId: Guid;
  message: string;
  isRead: boolean;
  createdAt: ISODateTime;
}
