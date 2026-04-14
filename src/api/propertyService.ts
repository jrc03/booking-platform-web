import type { PropertyResponseDto, UpsertPropertyRequestDto } from "../types/dtos";
import api from "./axios";

export interface SearchPropertyQuery {
  location?: string;
  startDate?: string;
  endDate?: string;
  minCapacity?: number;
  maxPrice?: number;
  pageNumber?: number;
  pageSize?: number;
}

export const propertyService = {

  search: async (query?: SearchPropertyQuery): Promise<PropertyResponseDto[]> => {
    const response = await api.get<PropertyResponseDto[]>("/properties/search", {
      params: query || {}
    });
    return response.data;
  },

  // GET: /api/properties/{id}
  getById: async (id: string): Promise<PropertyResponseDto> => {
    const response = await api.get<PropertyResponseDto>(`/properties/${id}`);
    return response.data;
  },
  create: async (payload: UpsertPropertyRequestDto): Promise<PropertyResponseDto> => {
    const response = await api.post<PropertyResponseDto>("/properties", payload);
    return response.data;
  }
};
