export type PropertyField = "title" | "description" | "location" | "pricePerNight" | "capacity";

export const validatePropertyField = (field: PropertyField, value: string): string => {
  if (field === "title") {
    if (!value.trim()) return "Title is required.";
    if (value.trim().length < 5) return "Title must be at least 5 characters.";
    if (value.trim().length > 100) return "Title must not exceed 100 characters.";
  }

  if (field === "description") {
    if (!value.trim()) return "Description is required.";
    if (value.trim().length < 20) return "Please provide a more detailed description (at least 20 characters).";
    if (value.trim().length > 1000) return "Description is too long (maximum 1000 characters).";
  }

  if (field === "location") {
    if (!value.trim()) return "Location is required.";
    if (value.trim().length > 200) return "Location must not exceed 200 characters.";
  }

  if (field === "pricePerNight") {
    const price = Number(value);
    if (!value || price <= 0) return "Price per night must be greater than zero.";
    if (price >= 10000) return "Price per night exceeds the maximum allowed limit ($10,000).";
  }

  if (field === "capacity") {
    const cap = Number(value);
    if (!value || cap <= 0) return "Capacity must be at least 1 person.";
    if (cap > 30) return "Capacity cannot exceed 30 people for a single property.";
  }

  return "";
};

export const validatePropertyForm = (
  data: Record<PropertyField, string>
): Record<string, string> => {
  const errors: Record<string, string> = {};
  const fields: PropertyField[] = ["title", "description", "location", "pricePerNight", "capacity"];

  fields.forEach((field) => {
    const error = validatePropertyField(field, data[field]);
    if (error) errors[field] = error;
  });

  return errors;
};
