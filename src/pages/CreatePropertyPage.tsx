import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { uploadImageToCloudinary } from "../utils/cloudinary";
import { propertyService } from "../api/propertyService";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";
import Button from "../components/ui/Button";
import { DollarSign, Home, MapPin, UploadCloud, Users } from "lucide-react";
import Input from "../components/ui/Input";
import TextArea from "../components/ui/TextArea";
import {
  validatePropertyField,
  validatePropertyForm,
  type PropertyField,
} from "../utils/propertyValidation";
import { PageHeader } from "../components/layout/PageHeader";
import { AvailabilityCalendar } from "../components/properties/AvailabilityCalendar";
import { BlockDatesModal } from "../components/properties/BlockDatesModal";

export const CreatePropertyPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isSubmittingBlock, setIsSubmittingBlock] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    pricePerNight: "",
    capacity: "",
  });

  // Fetch existing property data if in edit mode
  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      try {
        const data = await propertyService.getById(id);
        setFormData({
          title: data.title,
          description: data.description,
          location: data.location,
          pricePerNight: String(data.pricePerNight),
          capacity: String(data.capacity),
        });
        setPreviewUrls(data.imageUrls);
        setExistingImageUrls(data.imageUrls);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load property.");
      }
    };

    fetchProperty();
  }, [id]);

  const handleBlur = (field: PropertyField, value: string) => {
    const message = validatePropertyField(field, value);
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);

      const objectUrls = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls(objectUrls);
    }
  };

  const handleBlockDates = async (start: Date, end: Date) => {
    if (!id) return;
    setIsSubmittingBlock(true);
    try {
      await propertyService.blockDates(id, {
        startDate: start.toISOString(),
        endDate: end.toISOString()
      });
      toast.success("Dates blocked successfully!");
      setRefreshTrigger(prev => prev + 1);
      setIsBlockModalOpen(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to block dates"));
    } finally {
      setIsSubmittingBlock(false);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const validationErrors = validatePropertyForm({
      title: formData.title,
      description: formData.description,
      location: formData.location,
      pricePerNight: formData.pricePerNight,
      capacity: formData.capacity,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (files.length === 0 && existingImageUrls.length === 0) {
      toast.error("You must upload at least one photo of your property.");
      return;
    }
    try {
      setIsLoading(true);

      // Upload new files to Cloudinary (if any were selected)
      let imageUrls = existingImageUrls;
      if (files.length > 0) {
        toast.loading(`Uploading ${files.length} images...`, {
          id: "upload-toast",
        });
        const uploadPromises = files.map((file) => uploadImageToCloudinary(file));
        imageUrls = await Promise.all(uploadPromises);
      }

      toast.loading("Saving property...", { id: "upload-toast" });

      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        pricePerNight: Number(formData.pricePerNight),
        capacity: Number(formData.capacity),
        imageUrls: imageUrls,
      };

      if (isEditMode) {
        await propertyService.update(id!, payload);
        toast.success("Property updated!", { id: "upload-toast" });
      } else {
        await propertyService.create(payload);
        toast.success("Property created!", { id: "upload-toast" });
      }
      navigate("/host/dashboard");
    } catch (error) {
      console.error("Property creation error:", error);
      toast.error(getApiErrorMessage(error, "Failed to save property."), { id: "upload-toast" });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 animate-fade-in">
      <PageHeader
        title={isEditMode ? "Edit property" : "Host a new property"}
        subtitle={
          isEditMode
            ? "Update your listing details."
            : "Fill out the details below to start renting out your space."
        }
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white p-8 rounded-3xl border border-stone-100 shadow-sm"
      >
        {/* --- Text Inputs --- */}
        <div className="space-y-5">
          <Input
            id="title"
            label="Property Title"
            placeholder="e.g. Sunny Loft in Downtown"
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              setErrors((prev) => ({ ...prev, title: "" }));
            }}
            onBlur={(e) => handleBlur("title", e.target.value)}
            error={errors.title}
            required
          />

          <TextArea
            id="description"
            label="Description"
            required
            rows={4}
            placeholder="Tell guests what makes your place special..."
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              setErrors((prev) => ({ ...prev, description: "" }));
            }}
            onBlur={(e) => handleBlur("description", e.target.value)}
            error={errors.description}
          />
          <Input
            id="location"
            label="Location (City, Country)"
            placeholder="e.g. New York City, USA"
            value={formData.location}
            onChange={(e) => {
              setFormData({ ...formData, location: e.target.value });
              setErrors((prev) => ({ ...prev, location: "" }));
            }}
            onBlur={(e) => handleBlur("location", e.target.value)}
            error={errors.location}
            required
            icon={<MapPin size={18} className="text-stone-400" />}
          />
          <div className="grid grid-cols-2 gap-5">
            <Input
              id="price"
              type="number"
              min="1"
              label="Price per night ($)"
              placeholder="150"
              value={formData.pricePerNight}
              onChange={(e) => {
                setFormData({ ...formData, pricePerNight: e.target.value });
                setErrors((prev) => ({ ...prev, pricePerNight: "" }));
              }}
              onBlur={(e) => handleBlur("pricePerNight", e.target.value)}
              error={errors.pricePerNight}
              required
              icon={<DollarSign size={18} className="text-stone-400" />}
            />
            <Input
              id="capacity"
              type="number"
              min="1"
              label="Maximum capacity"
              placeholder="4"
              value={formData.capacity}
              onChange={(e) => {
                setFormData({ ...formData, capacity: e.target.value });
                setErrors((prev) => ({ ...prev, capacity: "" }));
              }}
              onBlur={(e) => handleBlur("capacity", e.target.value)}
              error={errors.capacity}
              required
              icon={<Users size={18} className="text-stone-400" />}
            />
          </div>
        </div>
        {/* --- Image Upload (Cloudinary) --- */}
        <div className="pt-4 border-t border-stone-100">
          <h3 className="text-lg font-medium text-stone-900 mb-4">
            Property Photos
          </h3>

          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-stone-200 border-dashed rounded-2xl cursor-pointer bg-stone-50 hover:bg-stone-100 transition-colors group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud
                size={32}
                className="text-stone-400 group-hover:text-stone-600 mb-2 transition-colors"
              />
              <p className="text-sm font-medium text-stone-600">
                Click to upload photos
              </p>
              <p className="text-xs text-stone-400 font-light mt-1">
                PNG, JPG, WEBP
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
          {/* Live Image Previews */}
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {previewUrls.map((url, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200"
                >
                  <img
                    src={url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* --- Manage Availability --- */}
        {isEditMode && (
          <div className="pt-4 border-t border-stone-100">
            <h3 className="text-lg font-medium text-stone-900 mb-4">
              Manage Availability
            </h3>
            <p className="text-sm text-stone-500 font-light mb-4">
              Review your availability below. All booked and blocked dates appear in <span className="text-red-400 font-medium">red</span>.
            </p>
            
            <div className="flex flex-col md:flex-row gap-8 items-start bg-stone-50 p-6 border border-stone-200 rounded-2xl">
              <div className="bg-white p-2 rounded-xl shadow-sm border border-stone-200">
                <AvailabilityCalendar propertyId={id!} refreshTrigger={refreshTrigger} />
              </div>
              
              <div className="flex-1 space-y-4 w-full">
                <div className="p-4 bg-white border border-stone-200 rounded-xl mt-12 md:mt-0">
                  <h4 className="font-medium text-stone-900 mb-2">Block New Dates</h4>
                  <p className="text-xs text-stone-500 font-light mb-4 leading-relaxed">
                    Manually mark dates as unavailable. This will immediately prevent any guests from booking your property during this set period. We will register them in red directly on this calendar to let you know they are securely blocked.
                  </p>
                  <Button type="button" onClick={() => setIsBlockModalOpen(true)} className="w-full">
                    Select Dates to Block
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-6">
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full flex items-center justify-center gap-2"
          >
            <Home size={18} />
            {isEditMode ? "Save Changes" : "Publish Property"}
          </Button>
        </div>
      </form>
      
      <BlockDatesModal 
        isOpen={isBlockModalOpen}
        isSubmitting={isSubmittingBlock}
        onConfirm={handleBlockDates}
        onCancel={() => setIsBlockModalOpen(false)}
      />
    </div>
  );
};
