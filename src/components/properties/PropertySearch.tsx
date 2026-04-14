import { useState } from "react";
import { Search, MapPin, Users } from "lucide-react";
import type { SearchPropertyQuery } from "../../api/propertyService";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface PropertySearchProps {
  onSearch: (criteria: SearchPropertyQuery) => void;
  isLoading?: boolean;
}

export default function PropertySearch({
  onSearch,
  isLoading = false,
}: PropertySearchProps) {
  const [criteria, setCriteria] = useState<SearchPropertyQuery>({
    location: "",
    startDate: "",
    endDate: "",
    minCapacity: undefined,
  });

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    onSearch(criteria);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 max-w-4xl mx-auto rounded-xl shadow-lg flex flex-col md:flex-row gap-4 items-center"
    >
      {/* 1. Location */}
      <div className="flex-1 w-full">
        <Input
          id="location"
          label="Where"
          type="text"
          placeholder="e.g. Paris, Tokyo, Cabarete"
          icon={<MapPin size={16} strokeWidth={1.5} />}
          value={criteria.location || ""}
          onChange={(e) =>
            setCriteria({ ...criteria, location: e.target.value })
          }
        />
      </div>

      {/* 2. Dates (Start & End) */}
      <div className="flex-1 w-full grid grid-cols-2 gap-2">
        <Input
          id="startDate"
          label="Check-in"
          type="date"
          value={criteria.startDate || ""}
          onChange={(e) =>
            setCriteria({ ...criteria, startDate: e.target.value })
          }
        />
        <Input
          id="endDate"
          label="Check-out"
          type="date"
          value={criteria.endDate || ""}
          onChange={(e) =>
            setCriteria({ ...criteria, endDate: e.target.value })
          }
        />
      </div>

      {/* 3. Min Capacity (Guests) */}
      <div className="w-full md:w-24">
        <Input
          id="minCapacity"
          label="Guests"
          type="number"
          min="1"
          placeholder="1"
          icon={<Users size={16} strokeWidth={1.5} />}
          value={criteria.minCapacity?.toString() || ""}
          onChange={(e) =>
            setCriteria({
              ...criteria,
              minCapacity: parseInt(e.target.value) || undefined,
            })
          }
        />
      </div>

      {/* 4. Search Button */}
      <div className="w-full  md:w-auto ">
        <Button type="submit" isLoading={isLoading}>          <Search size={18} />          Search
        </Button>
      </div>
    </form>
  );
}
