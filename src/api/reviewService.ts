import api from "./axios";
import type { CreateReviewRequestDto, PropertyReviewSummaryDto, ReviewResponseDto } from "../types/dtos";

export const reviewService = {
  getByProperty: async (propertyId: string): Promise<PropertyReviewSummaryDto> => {
    const response = await api.get<PropertyReviewSummaryDto>(`/reviews/property/${propertyId}`);
    return response.data;
  },

  create: async (payload: CreateReviewRequestDto): Promise<ReviewResponseDto> => {
    const response = await api.post<ReviewResponseDto>("/reviews", payload);
    return response.data;
  },
};
