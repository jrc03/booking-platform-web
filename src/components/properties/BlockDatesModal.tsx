import { useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { X, CalendarOff } from "lucide-react";
import Button from "../ui/Button";
import { startOfToday } from "date-fns";

interface BlockDatesModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onConfirm: (start: Date, end: Date) => void;
  onCancel: () => void;
}

export const BlockDatesModal = ({
  isOpen,
  isSubmitting,
  onConfirm,
  onCancel,
}: BlockDatesModalProps) => {
  const [range, setRange] = useState<DateRange | undefined>();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!range?.from || !range?.to) return;
    onConfirm(range.from, range.to);
  };

  const handleClose = () => {
    setRange(undefined);
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in py-10 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-fit overflow-hidden animate-scale-in my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <CalendarOff size={20} className="text-stone-700" />
            <h3 className="text-lg font-medium text-stone-900">Manage Availability</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-3 flex flex-col items-center border border-stone-100 p-2 rounded-2xl">
            <DayPicker
              mode="range"
              selected={range}
              onSelect={setRange}
              disabled={{ before: startOfToday() }}
              numberOfMonths={2}
              className="p-3"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={!range?.from || !range?.to || isSubmitting}
              isLoading={isSubmitting}
              className="flex-1"
            >
              Block Selected Dates
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
