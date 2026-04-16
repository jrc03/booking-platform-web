import { useEffect, useState } from "react";
import { propertyService } from "../api/propertyService";
import type { PropertyResponseDto } from "../types/dtos";
import { toast } from "sonner";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

export const useProperty = (id: string | undefined) => {
  const [property, setProperty] = useState<PropertyResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      try {
        const data = await propertyService.getById(id);
        setProperty(data);
      } catch (error) {
        console.error("Failed to fetch property:", error);
        toast.error(getApiErrorMessage(error, "Failed to load property."));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  return { property, isLoading };
};
