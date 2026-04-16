import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";
import { bookingService } from "../api/BookingService";
import { useProperty } from "../hooks/useProperty";
import { PageHeader } from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import { CalendarDays } from "lucide-react";

export const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { property, isLoading } = useProperty(id);

  const [isBooking, setIsBooking] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const calculateNights = (): number => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff > 0 ? diff : 0;
  };

  const nights = property ? calculateNights() : 0;
  const totalPrice = property ? nights * property.pricePerNight : 0;

  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates.");
      return;
    }
    if (nights <= 0) {
      toast.error("Check-out must be after check-in.");
      return;
    }

    try {
      setIsBooking(true);
      await bookingService.create({
        propertyId: id!,
        startDate: checkIn,
        endDate: checkOut,
      });
      toast.success("Booking confirmed.");
      navigate("/guest/profile");
    } catch (error) {
      console.error(error);
      toast.error(getApiErrorMessage(error, "Failed to create booking."));
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 text-stone-400 font-light">
        Loading...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center h-96 text-stone-400 font-light">
        Property not found.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 animate-fade-in">
      <PageHeader
        title="Complete your booking"
        subtitle="Review the details and pick your dates."
      />

      {/* Property Summary */}
      <div className="flex gap-5 p-5 bg-white border border-stone-100 rounded-2xl shadow-sm mb-8">
        <div className="w-32 h-24 shrink-0 rounded-xl overflow-hidden bg-stone-100">
          {property.imageUrls.length > 0 && (
            <img
              src={property.imageUrls[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-medium text-stone-900">
            {property.title}
          </h2>
          <p className="text-sm text-stone-500 font-light">
            {property.location}
          </p>
          <p className="text-sm text-stone-900 font-medium">
            ${property.pricePerNight}{" "}
            <span className="text-stone-400 font-light">/ night</span>
          </p>
        </div>
      </div>

      {/* Date Selection */}
      <div className="bg-white border border-stone-100 rounded-2xl shadow-sm p-6 space-y-5">
        <h3 className="text-lg font-medium text-stone-900 flex items-center gap-2">
          <CalendarDays size={20} /> Select your dates
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs text-stone-500 font-medium uppercase tracking-wider">
              Check-in
            </label>
            <input
              type="date"
              value={checkIn}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900 transition-shadow"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs text-stone-500 font-medium uppercase tracking-wider">
              Check-out
            </label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || new Date().toISOString().split("T")[0]}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900 transition-shadow"
            />
          </div>
        </div>

        {/* Price Breakdown */}
        {nights > 0 && (
          <div className="space-y-3 pt-5 border-t border-stone-100">
            <div className="flex justify-between text-sm text-stone-600 font-light">
              <span>
                ${property.pricePerNight} × {nights} nights
              </span>
              <span>${totalPrice}</span>
            </div>
            <div className="flex justify-between text-stone-900 font-medium text-lg pt-3 border-t border-stone-100">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        )}

        <Button
          type="button"
          onClick={handleBooking}
          isLoading={isBooking}
          className="w-full"
        >
          Confirm Reservation
        </Button>
      </div>
    </div>
  );
};
