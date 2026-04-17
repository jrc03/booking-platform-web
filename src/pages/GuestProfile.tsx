import { useEffect, useState } from "react";
import type { BookingResponseDto, PropertyResponseDto } from "../types/dtos";
import { bookingService } from "../api/BookingService";
import { propertyService } from "../api/propertyService";
import { toast } from "sonner";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";
import ConfirmModal from "../components/ui/ConfirmModal";
import {
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  CalendarDays,
} from "lucide-react";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";

export const GuestProfile = () => {
  const [bookings, setBookings] = useState<BookingResponseDto[]>([]);
  const [properties, setProperties] = useState<
    Record<string, PropertyResponseDto>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cancelId, setCancelId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingService.getMyBookings();
        setBookings(data);

        const uniqueIds = [...new Set(data.map((b) => b.propertyId))];
        const propertyMap: Record<string, PropertyResponseDto> = {};
        await Promise.all(
          uniqueIds.map(async (pid) => {
            const prop = await propertyService.getById(pid);
            propertyMap[pid] = prop;
          }),
        );
        setProperties(propertyMap);
      } catch (error) {
        console.error(error);
        toast.error(getApiErrorMessage(error, "Failed to load bookings."));
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async () => {
    if (!cancelId) return;
    try {
      await bookingService.cancel(cancelId);
      toast.success("Booking cancelled.");
      setBookings((prev) =>
        prev.map((b) =>
          b.id === cancelId ? { ...b, status: "Cancelled" } : b,
        ),
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to cancel booking."));
    } finally {
      setCancelId(null);
    }
  };
  const handleComplete = async (id: string) => {
    try {
      await bookingService.complete(id);
      toast.success("Booking completed.");
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "Completed" } : b)),
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to complete booking."));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmed":
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            <Clock size={12} /> Confirmed
          </span>
        );
      case "Completed":
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-stone-700 bg-stone-100 px-2.5 py-1 rounded-full">
            <CheckCircle size={12} /> Completed
          </span>
        );
      case "Cancelled":
        return (
          <span className="flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
            <XCircle size={12} /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 text-stone-400 font-light">
        Loading your bookings...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      <PageHeader
        title="My Bookings"
        subtitle="View and manage your reservations."
      />

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-stone-200 rounded-2xl">
          <p className="text-stone-400 font-light text-lg mb-4">
            You don't have any bookings yet.
          </p>
          <Link to="/">
            <Button type="button">Browse Properties</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const property = properties[booking.propertyId];
            return (
              <div
                key={booking.id}
                className="flex gap-5 p-5 bg-white border border-stone-100 rounded-2xl shadow-sm"
              >
                {/* Property Image */}
                <Link
                  to={`/property/${booking.propertyId}`}
                  className="w-28 h-24 shrink-0 rounded-xl overflow-hidden bg-stone-100"
                >
                  {property?.imageUrls?.[0] && (
                    <img
                      src={property.imageUrls[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </Link>

                {/* Booking Info */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        to={`/property/${booking.propertyId}`}
                        className="text-lg font-medium text-stone-900 hover:underline truncate block"
                      >
                        {property?.title || "Loading..."}
                      </Link>
                      {property?.location && (
                        <p className="text-sm text-stone-500 font-light flex items-center gap-1">
                          <MapPin size={14} /> {property.location}
                        </p>
                      )}
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-stone-600 font-light">
                    <span className="flex items-center gap-1">
                      <CalendarDays size={14} />
                      {new Date(booking.startDate).toLocaleDateString()} -{" "}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </span>
                    <span className="font-medium text-stone-900">
                      ${booking.totalPrice}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    {booking.status === "Confirmed" && (
                      <>
                        <button
                          onClick={() => handleComplete(booking.id)}
                          className="text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Mark as Completed
                        </button>
                        <button
                          onClick={() => setCancelId(booking.id)}
                          className="text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={cancelId !== null}
        title="Cancel booking"
        message="Are you sure you want to cancel this reservation?"
        confirmLabel="Cancel Booking"
        onConfirm={handleCancel}
        onCancel={() => setCancelId(null)}
      />
    </div>
  );
};
