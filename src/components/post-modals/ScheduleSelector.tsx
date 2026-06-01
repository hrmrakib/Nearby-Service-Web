"use client";

import { useRef } from "react";

const ALL_DAYS = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];

export interface ScheduleEntry {
  day: string;
  startTime: string;
  endTime: string;
  _id?: string;
}

interface ScheduleSelectorProps {
  schedule: ScheduleEntry[];
  onScheduleChange: (updated: ScheduleEntry[]) => void;
}

export const DEFAULT_SCHEDULE: ScheduleEntry[] = [
  { day: "mon", startTime: "09:00", endTime: "17:00" },
];

/** Returns true if endTime is strictly after startTime */
function isValidRange(startTime: string, endTime: string): boolean {
  if (!startTime || !endTime) return true;
  return endTime > startTime;
}

function TimeInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    ref.current?.focus();
    try {
      ref.current?.showPicker();
    } catch {
      // fallback to focus only if showPicker unsupported
    }
  };

  return (
    <div
      className='flex-1 flex items-center h-8 border border-input rounded-md bg-white px-2 cursor-pointer select-none'
      onClick={openPicker}
    >
      <input
        ref={ref}
        type='time'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='flex-1 text-xs bg-transparent outline-none cursor-pointer w-full'
      />
    </div>
  );
}

export function ScheduleSelector({
  schedule,
  onScheduleChange,
}: ScheduleSelectorProps) {
  const isSelected = (day: string) => schedule.some((s) => s.day === day);

  const getEntry = (day: string): ScheduleEntry =>
    schedule.find((s) => s.day === day) ?? {
      day,
      startTime: "09:00",
      endTime: "17:00",
    };

  const toggleDay = (day: string) => {
    if (isSelected(day)) {
      onScheduleChange(schedule.filter((s) => s.day !== day));
    } else {
      onScheduleChange([
        ...schedule,
        { day, startTime: "09:00", endTime: "17:00" },
      ]);
    }
  };

  const updateTime = (
    day: string,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    onScheduleChange(
      schedule.map((s) => (s.day === day ? { ...s, [field]: value } : s)),
    );
  };

  return (
    <div>
      <label className='text-sm font-bold mb-3 block'>Schedule</label>

      {/* Day toggle pills */}
      <div className='flex flex-wrap gap-2 mb-4'>
        {ALL_DAYS.map(({ key, label }) => (
          <button
            key={key}
            type='button'
            onClick={() => toggleDay(key)}
            className={`px-3.5 py-2 rounded-full text-xs font-medium border transition-colors ${
              isSelected(key)
                ? "bg-[#15B826] text-white border-[#15B826]"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Time inputs for selected days */}
      {schedule.length > 0 && (
        <div className='space-y-2'>
          {ALL_DAYS.filter(({ key }) => isSelected(key)).map(
            ({ key, label }) => {
              const entry = getEntry(key);
              const valid = isValidRange(entry.startTime, entry.endTime);

              return (
                <div key={key}>
                  <div
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                      valid ? "bg-gray-50" : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <span className='text-xs font-semibold text-gray-500 w-7 shrink-0'>
                      {label}
                    </span>
                    <div className='flex items-center gap-2 flex-1'>
                      <TimeInput
                        value={entry.startTime}
                        onChange={(val) => updateTime(key, "startTime", val)}
                      />
                      <span className='text-gray-400 text-xs shrink-0'>to</span>
                      <TimeInput
                        value={entry.endTime}
                        onChange={(val) => updateTime(key, "endTime", val)}
                      />
                    </div>
                  </div>

                  {/* Inline error message */}
                  {!valid && (
                    <p className='text-xs text-red-500 mt-1 ml-1'>
                      End time must be after start time.
                    </p>
                  )}
                </div>
              );
            },
          )}
        </div>
      )}

      {schedule.length === 0 && (
        <p className='text-xs text-gray-400 text-center py-3 border border-dashed border-gray-200 rounded-lg'>
          Select days above to set working hours
        </p>
      )}
    </div>
  );
}
