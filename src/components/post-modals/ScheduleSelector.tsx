"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface TimeSlot {
  start: string;
  end: string;
  available?: boolean;
}

interface ScheduleDay {
  day: string;
  startTime?: string;
  endTime?: string;
  timeSlots?: TimeSlot[];
}

interface ScheduleSelectorProps {
  schedule: ScheduleDay[];
  onScheduleChange?: (schedule: ScheduleDay[]) => void;
}

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_LABELS: Record<string, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

export function ScheduleSelector({
  schedule,
  onScheduleChange,
}: ScheduleSelectorProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>(
    schedule.length > 0 ? [schedule[0].day] : ["mon"]
  );
  const [newSlotStart, setNewSlotStart] = useState("09:00");
  const [newSlotEnd, setNewSlotEnd] = useState("10:00");
  const [repeatAll, setRepeatAll] = useState(false);

  const handleRepeatChange = (checked: boolean) => {
    setRepeatAll(checked);
    if (checked) {
      setSelectedDays(DAYS);
    } else {
      setSelectedDays([selectedDays[0] || "mon"]);
    }
  };

  const handleDayClick = (day: string) => {
    if (repeatAll) return;
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAddSlot = () => {
    const newTimeSlot: TimeSlot = {
      start: newSlotStart,
      end: newSlotEnd,
      available: true,
    };

    const updatedSchedule = schedule.map((day) => {
      if (selectedDays.includes(day.day)) {
        return {
          ...day,
          timeSlots: [...day.timeSlots, newTimeSlot],
        };
      }
      return day;
    });

    onScheduleChange(updatedSchedule);
    setNewSlotStart("09:00");
    setNewSlotEnd("10:00");
  };

  const handleRemoveSlot = (dayToUpdate: string, index: number) => {
    const updatedSchedule = schedule.map((day) => {
      if (day.day === dayToUpdate) {
        return {
          ...day,
          timeSlots: day.timeSlots.filter((_, i) => i !== index),
        };
      }
      return day;
    });

    onScheduleChange(updatedSchedule);
  };

  const handleToggleAvailability = (dayToUpdate: string, index: number) => {
    const updatedSchedule = schedule.map((day) => {
      if (day.day === dayToUpdate) {
        const updatedSlots = day.timeSlots.map((slot, i) =>
          i === index ? { ...slot, available: !slot.available } : slot
        );
        return {
          ...day,
          timeSlots: updatedSlots,
        };
      }
      return day;
    });

    onScheduleChange(updatedSchedule);
  };

  const handleApply = () => {
    console.log("[v0] Final schedule:", schedule);
  };

  return (
    <div className='w-full mx-auto'>
      <Card className='p-4 border-2'>
        {/* Header */}
        <div className='mb-6'>
          <h2 className='text-base font-bold text-foreground mb-1'>
            Availability
          </h2>
        </div>

        {/* Day Selection */}
        <div className='mb-6'>
          <label className='block text-sm font-semibold text-foreground mb-3'>
            Day
          </label>
          <div className='bg-card rounded-xl border border-border p-3 md:p-4'>
            <div className='flex gap-1 md:gap-3 flex-wrap overflow-x-auto pb-2'>
              {DAYS.map((day) => (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  disabled={repeatAll}
                  className={`px-3 md:px-2.5 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all border ${
                    selectedDays.includes(day)
                      ? "bg-green-600 text-white"
                      : "text-muted-foreground hover:text-foreground"
                  } ${repeatAll ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {DAY_LABELS[day]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Time Range Inputs */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
          <div>
            <label className='block text-sm font-semibold text-foreground mb-2'>
              From
            </label>
            <div className='relative'>
              <input
                type='time'
                value={newSlotStart}
                onChange={(e) => setNewSlotStart(e.target.value)}
                className='w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition'
                placeholder='Available from'
              />
            </div>
          </div>
          <div>
            <label className='block text-sm font-semibold text-foreground mb-2'>
              To
            </label>
            <div className='relative'>
              <input
                type='time'
                value={newSlotEnd}
                onChange={(e) => setNewSlotEnd(e.target.value)}
                className='w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition'
                placeholder='Available till'
              />
            </div>
          </div>
        </div>

        {/* Time Slots Display for Selected Days */}
        {selectedDays.map((dayKey) => {
          const dayData = schedule.find((d) => d.day === dayKey);
          if (!dayData || dayData.timeSlots.length === 0) return null;

          return (
            <div key={dayKey} className='mb-6'>
              <label className='block text-sm font-semibold text-foreground mb-3'>
                {DAY_LABELS[dayKey]} - Time Slots
              </label>
              <div className='flex flex-wrap gap-2'>
                {dayData.timeSlots.map((slot, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                      slot.available
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                    onClick={() => handleToggleAvailability(dayKey, index)}
                  >
                    <span>
                      {slot.start}-{slot.end}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSlot(dayKey, index);
                      }}
                      className='hover:opacity-70 transition ml-1'
                    >
                      <X className='w-4 h-4' />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Add Slot Button */}
        <button
          onClick={handleAddSlot}
          className='w-1/3 mx-auto px-3 py-2 rounded-lg border-2 border-green-600 text-green-600 font-semibold hover:bg-green-50 transition flex items-center justify-center gap-2 mb-6'
        >
          <Plus className='w-5 h-5' />
          Add Slot
        </button>

        {/* Repeat Checkbox */}
        <div className='flex items-center gap-3 p-4 bg-muted/50 rounded-lg mb-6'>
          <Checkbox
            id='repeat'
            checked={repeatAll}
            onCheckedChange={(checked) =>
              handleRepeatChange(checked as boolean)
            }
          />
          <label
            htmlFor='repeat'
            className='text-sm text-foreground cursor-pointer font-medium'
          >
            Repeat this for all days of the week.
          </label>
        </div>
      </Card>
    </div>
  );
}
