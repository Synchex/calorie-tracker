import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, addDays, startOfDay, isSameDay } from 'date-fns';
import { useStore } from '@/stores/useStore';

export function DateSelector() {
  const { selectedDate, setSelectedDate } = useStore();

  const dates = useMemo(() => {
    const today = startOfDay(new Date());
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(today, i - 3);
      return {
        date,
        dayName: format(date, 'EEE'),
        dayNumber: format(date, 'd'),
        isToday: isSameDay(date, today),
        isSelected: isSameDay(date, selectedDate),
      };
    });
  }, [selectedDate]);

  return (
    <div className="px-4 py-3">
      <div className="flex justify-between items-center">
        {dates.map((day) => (
          <button
            key={day.date.toISOString()}
            onClick={() => setSelectedDate(day.date)}
            className="flex flex-col items-center gap-1 py-2 px-1 min-w-[44px]"
          >
            <span
              className={`text-xs font-medium ${
                day.isSelected
                  ? 'text-text-primary'
                  : 'text-text-tertiary'
              }`}
            >
              {day.dayName}
            </span>
            <div className="relative">
              {day.isSelected && (
                <motion.div
                  layoutId="date-indicator"
                  className="absolute inset-0 bg-accent rounded-full"
                  initial={false}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span
                className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-colors ${
                  day.isSelected
                    ? 'text-white'
                    : day.isToday
                    ? 'text-accent bg-surface'
                    : 'text-text-primary'
                }`}
              >
                {day.dayNumber}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
