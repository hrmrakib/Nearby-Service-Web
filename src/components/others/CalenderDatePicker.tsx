"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarDatePickerProps {
  startDate?: Date;
  endDate?: Date;
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
  onClose?: () => void;
}

export default function CalendarDatePicker({
  startDate,
  endDate,
  onDateRangeChange,
  onClose,
}: CalendarDatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 8)); // September 2025
  const [tempStartDate, setTempStartDate] = useState<Date | null>(
    startDate || null
  );
  const [tempEndDate, setTempEndDate] = useState<Date | null>(endDate || null);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push({ date: prevMonthDay, isCurrentMonth: false });
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }

    // Add empty cells for days after the last day of the month to complete the grid
    const remainingCells = 42 - days.length; // 6 rows × 7 days = 42 cells
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonthDay = new Date(year, month + 1, i);
      days.push({ date: nextMonthDay, isCurrentMonth: false });
    }

    return days;
  };

  const handleDateClick = (date: Date) => {
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      // Start new selection
      setTempStartDate(date);
      setTempEndDate(null);
    } else if (tempStartDate && !tempEndDate) {
      // Set end date
      if (date >= tempStartDate) {
        setTempEndDate(date);
      } else {
        // If clicked date is before start date, make it the new start date
        setTempEndDate(tempStartDate);
        setTempStartDate(date);
      }
    }
  };

  const isDateSelected = (date: Date) => {
    if (!tempStartDate) return false;

    if (tempStartDate && !tempEndDate) {
      return date.toDateString() === tempStartDate.toDateString();
    }

    if (tempStartDate && tempEndDate) {
      return (
        date.toDateString() === tempStartDate.toDateString() ||
        date.toDateString() === tempEndDate.toDateString()
      );
    }

    return false;
  };

  const isDateInRange = (date: Date) => {
    if (!tempStartDate || !tempEndDate) return false;
    return date >= tempStartDate && date <= tempEndDate;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const handleReset = () => {
    setTempStartDate(null);
    setTempEndDate(null);
  };

  const handleApply = () => {
    onDateRangeChange(tempStartDate, tempEndDate);
    onClose?.();
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className='bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-72'>
      {/* Header */}
      <div className='flex items-center justify-between mb-4'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => navigateMonth("prev")}
          className='p-1 h-8 w-8'
        >
          <ChevronLeft className='w-4 h-4' />
        </Button>

        <h3 className='text-lg font-semibold text-gray-900'>
          {monthNames[currentMonth.getMonth()]}
          {currentMonth.getFullYear()}
        </h3>

        <Button
          variant='ghost'
          size='sm'
          onClick={() => navigateMonth("next")}
          className='p-1 h-8 w-8'
        >
          <ChevronRight className='w-4 h-4' />
        </Button>
      </div>

      {/* Days of week header */}
      <div className='grid grid-cols-7 gap-1 mb-2'>
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className='text-center text-sm font-medium text-gray-500 py-2'
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className='grid grid-cols-7 gap-1 mb-4'>
        {days.map((day, index) => {
          const isSelected = isDateSelected(day.date);
          const isInRange = isDateInRange(day.date);

          return (
            <button
              key={index}
              onClick={() => day.isCurrentMonth && handleDateClick(day.date)}
              disabled={!day.isCurrentMonth}
              className={`
                h-10 w-10 text-sm rounded-full flex items-center justify-center transition-colors
                ${
                  !day.isCurrentMonth
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-900 hover:bg-gray-100 cursor-pointer"
                }
                ${
                  isSelected ? "bg-green-500 text-white hover:bg-green-600" : ""
                }
                ${isInRange && !isSelected ? "bg-green-100 text-green-800" : ""}
              `}
            >
              {day.date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className='flex space-x-2'>
        <Button
          variant='outline'
          onClick={handleReset}
          className='flex-1 border-green-500 text-green-500 hover:bg-green-50 bg-transparent'
        >
          Reset
        </Button>
        <Button
          onClick={handleApply}
          className='flex-1 bg-green-500 hover:bg-green-600 text-white'
        >
          Apply
        </Button>
      </div>
    </div>
  );
}
