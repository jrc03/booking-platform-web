import { useEffect, useState } from "react";
import { propertyService } from "../../api/propertyService";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

interface AvailabilityCalendarProps {
  propertyId: string;
  refreshTrigger?: number;
}

export const AvailabilityCalendar = ({
  propertyId,
  refreshTrigger = 0,
}: AvailabilityCalendarProps) => {
  const [disabledRanges, setDisabledRanges] = useState<{ from: Date; to: Date }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const data = await propertyService.getUnavailableDates(propertyId);
        setDisabledRanges(
          data.map((d) => ({
            from: new Date(d.startDate),
            to: new Date(d.endDate),
          })),
        );
      } catch (error) {
        console.error("Failed to fetch blocked dates:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDates();
  }, [propertyId, refreshTrigger]);

  const today = new Date();

  return (
    <div className="pt-6 border-t border-stone-100">
      <h2 className="text-xl font-semibold text-stone-900 mb-4">
        Availability
      </h2>
      {isLoading ? (
        <div className="py-10 text-center text-sm text-stone-400 font-light rdp-custom bg-stone-50 rounded-2xl animate-pulse">
          Loading calendar...
        </div>
      ) : (
        <div className="rdp-custom">
          <DayPicker
            numberOfMonths={1}
            startMonth={today}
            disabled={[{ before: today }, ...disabledRanges]}
          />
        </div>
      )}
    </div>
  );
};
