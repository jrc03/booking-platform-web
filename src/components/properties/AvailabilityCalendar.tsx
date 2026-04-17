import { useEffect, useState } from "react";
import { propertyService } from "../../api/propertyService";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

interface AvailabilityCalendarProps {
  propertyId: string;
}

export const AvailabilityCalendar = ({
  propertyId,
}: AvailabilityCalendarProps) => {
  const [disabledRanges, setDisabledRanges] = useState<
    { from: Date; to: Date }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await propertyService.getUnavailableDates(propertyId);
        const ranges = data.map((range) => ({
          from: new Date(range.startDate),
          to: new Date(range.endDate),
        }));
        setDisabledRanges(ranges);
      } catch (error) {
        console.error("Error fetching unavailable dates:", error);
      }
    };
    fetchData();
  }, [propertyId]);

  const today = new Date();

  return (
    <div className="pt-6 border-t border-stone-100">
      <h2 className="text-xl font-semibold text-stone-900 mb-4">
        Availability
      </h2>
      <div className="rdp-custom">
        <DayPicker
          numberOfMonths={1}
          startMonth={today}
          disabled={[{ before: today }, ...disabledRanges]}
        />
      </div>
    </div>
  );
};
