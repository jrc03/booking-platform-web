import axios from "axios";
import { toast } from "sonner";

const CLOUD_NAME = "do6gzsvvm";
const UPLOAD_PRESET = "PropertiesImgs";

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData,
    );

    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    toast.error("Error uploading image", {
      description: "Please try again later.",
    });
    throw new Error("Failed to upload image. Please try again.");
  }
};
