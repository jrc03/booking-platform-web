import { useEffect, useState } from "react";
import {
  propertyService,
  type SearchPropertyQuery,
} from "../api/propertyService";
import type { PropertyResponseDto } from "../types/dtos";
import PropertyCard from "../components/properties/PropertyCard";
import PropertySearch from "../components/properties/PropertySearch";

export const HomePage = () => {
  const [properties, setProperties] = useState<PropertyResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchInitialProperties = async () => {
      try {
        const data = await propertyService.search();
        setProperties(data);
      } catch (error) {
        console.error("Failed to fetch initial properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialProperties();
  }, []);

  const handleSearch = async (criteria: SearchPropertyQuery) => {
    setIsSearching(true);
    try {
      const data = await propertyService.search(criteria);
      setProperties(data);
    } catch (error) {
      console.error("Failed to search properties:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      {/* HERO / SEARCH SECTION */}
      <section className="bg-stone-900 text-center py-20 px-4">
        <h1
          className="text-4xl text-white font-light mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Find your next getaway
        </h1>
        <p className="text-stone-400 font-light max-w-lg mx-auto mb-8">
          Discover unique homes, apartments, and rooms for your perfect trip.
        </p>

        <div className="relative -bottom-12 z-10 w-full max-w-4xl mx-auto">
          <PropertySearch onSearch={handleSearch} isLoading={isSearching} />
        </div>
      </section>

      {/* PROPERTIES GRID */}
      <main className="max-w-7xl mx-auto py-24 px-6 relative z-0">
        <h2
          className="text-2xl font-medium text-stone-900 mb-8"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {properties.length > 0 ? "Featured Properties" : "Properties"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {isLoading ? (
            <div className="col-span-full text-center text-stone-500 py-10 font-light">
              Loading properties...
            </div>
          ) : properties.length === 0 ? (
            <div className="col-span-full text-center text-stone-500 py-20 border-2 border-dashed border-stone-200 rounded-xl font-light">
              No properties found matching your search.
            </div>
          ) : (
            properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          )}
        </div>
      </main>
    </>
  );
};
