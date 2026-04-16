import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { propertyService } from "../api/propertyService";
import type { PropertyResponseDto } from "../types/dtos";
import { MapPin, Users, Loader2, ArrowLeft, SearchX } from "lucide-react";
import { toast } from "sonner";

export const PropertyPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<PropertyResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await propertyService.getById(id!);
        setProperty(data);
      } catch (error) {
        console.error("Error fetching property:", error);
        toast.error("Failed to load property");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-fade-in">
        <Loader2 className="w-8 h-8 text-stone-400 animate-spin" />
        <p className="text-stone-500 font-light tracking-wide">
          Loading property details...
        </p>
      </div>
    );
  }
  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-5 animate-fade-in">
        <div className="p-4 bg-stone-100 rounded-full">
          <SearchX className="w-8 h-8 text-stone-400" />
        </div>

        <div className="text-center space-y-1">
          <h3
            className="text-2xl font-medium text-stone-900"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Property not found
          </h3>
          <p className="text-sm text-stone-500 font-light max-w-sm mx-auto">
            The property you're looking for doesn't exist, has been removed, or
            the link is incorrect.
          </p>
        </div>

        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-2.5 mt-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to HomePage
        </Link>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-fade-in">
      {/* IMAGE GALLERY */}
      <div className="mb-10">
        {/* Main Image */}
        <div className="w-full aspect-video md:aspect-21/9 rounded-2xl overflow-hidden bg-stone-100">
          <img
            src={property.imageUrls[selectedImage] || ""}
            alt={property.title}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        </div>

        {/* Thumbnail Strip */}
        {property.imageUrls.length > 1 && (
          <div className="flex items-center gap-3 mt-4 overflow-x-auto p-2">
            {property.imageUrls.map((url, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  selectedImage === i
                    ? "border-stone-900 opacity-100 scale-105"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* PROPERTY INFO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-6">
          <h1
            className="text-3xl font-medium text-stone-900"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {property.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-stone-500 font-light">
            <span className="flex items-center gap-1">
              <MapPin size={16} /> {property.location}
            </span>
            <span className="flex items-center gap-1">
              <Users size={16} /> Up to {property.capacity} guests
            </span>
          </div>
          <div className="pt-6 border-t border-stone-100">
            <h2 className="text-lg font-medium text-stone-900 mb-3">
              About this place
            </h2>
            <p className="text-stone-600 font-light leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>
        </div>
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm h-fit sticky top-24 space-y-4">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-medium text-stone-900">
              ${property.pricePerNight}
            </span>
            <span className="text-stone-400 font-light text-sm">/ night</span>
          </div>
          <div className="pt-4 border-t border-stone-100 text-sm text-stone-400 font-light text-center">
            Booking coming soon...
          </div>
        </div>
      </div>
    </div>
  );
};
