import { Link } from "react-router-dom";
import type { PropertyResponseDto } from "../../types/dtos";

interface PropertyCardProps {
  property: PropertyResponseDto;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link to={`/property/${property.id}`} className="bg-white border flex flex-col items-start border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 text-left cursor-pointer group">
      {/* 2. IMAGE BOX: check if the backend gave an image. If not, show a fallback. */}
      <div className="w-full h-56 bg-stone-200 relative overflow-hidden">
        {property.imageUrls && property.imageUrls.length > 0 ? (
          <img
            src={property.imageUrls[0]} // first image for the card preview
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-stone-400 text-sm bg-stone-100">
            No Image Provided
          </div>
        )}
      </div>

      {/* 3. INFO BOX: Displaying the Domain data */}
      <div className="p-5 w-full">
        <div className="flex justify-between items-start mb-1 gap-4">
          <h3 className="text-lg font-medium text-stone-900 truncate">
            {property.title}
          </h3>
          <span className="text-stone-900 font-medium shrink-0">
            ${property.pricePerNight}
          </span>
        </div>
        <p className="text-sm text-stone-500 mb-3 truncate font-light">
          {property.location}
        </p>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-stone-100">
          <span className="text-stone-500 text-xs font-light">
            Up to {property.capacity} guests
          </span>
          <span className="text-stone-500 text-xs font-light">per night</span>
        </div>
      </div>
    </Link>
  );
}
