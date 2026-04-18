import api from "./axios";
import type { CreateReviewRequestDto, PropertyReviewSummaryDto } from "../types/dtos";

export const reviewService = {
  getByProperty: async (propertyId: string): Promise<PropertyReviewSummaryDto> => {
    const response = await api.get<PropertyReviewSummaryDto>(`/reviews/property/${propertyId}`);
    return response.data;
  },

  create: async (payload: CreateReviewRequestDto): Promise<void> => {
    await api.post("/reviews", payload);
  },
};
