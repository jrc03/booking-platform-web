import { useEffect, useState } from "react";
import type { PropertyResponseDto } from "../types/dtos";
import { propertyService } from "../api/propertyService";
import { toast } from "sonner";
import { Plus, MapPin, Users, DollarSign, Trash2, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import ConfirmModal from "../components/ui/ConfirmModal";

export const HostDashboard = () => {
  const [properties, setProperties] = useState<PropertyResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      const data = await propertyService.getMyProperties();
      setProperties(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load your properties");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await propertyService.delete(deleteId);
      toast.success("Property deleted.");
      setProperties((prev) => prev.filter((p) => p.id !== deleteId));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete property.");
    } finally {
      setDeleteId(null);
    }
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 text-stone-400 font-light">
        Loading your properties...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-fade-in">
      <PageHeader
        title="Your Properties"
        subtitle="Manage and track your listed spaces."
        action={
          <Link to="/host/properties/new">
            <Button type="button">
              <span className="flex items-center gap-2">
                <Plus size={18} /> Add Property
              </span>
            </Button>
          </Link>
        }
      />
      {properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-stone-200 rounded-2xl">
          <p className="text-stone-400 font-light text-lg mb-4">
            You haven't listed any properties yet.
          </p>
          <Link to="/host/properties/new">
            <Button type="button">
              <span className="flex items-center gap-2">
                <Plus size={18} /> Create your first listing
              </span>
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="aspect-video bg-stone-100 overflow-hidden">
                {property.imageUrls.length > 0 ? (
                  <img
                    src={property.imageUrls[0]}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300 text-sm font-light">
                    No image
                  </div>
                )}
              </div>
              <div className="p-5 space-y-3">
                <h3 className="text-lg font-medium text-stone-900 truncate">
                  {property.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-stone-500 font-light">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {property.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={14} /> {property.capacity}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <span className="flex items-center gap-1 text-stone-900 font-medium">
                    <DollarSign size={16} />
                    {property.pricePerNight}
                    <span className="text-stone-400 font-light text-sm">
                      /night
                    </span>
                  </span>
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/host/properties/${property.id}/edit`}
                      className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                      title="Edit property"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => setDeleteId(property.id)}
                      className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete property"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Delete property"
        message="Are you sure? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
