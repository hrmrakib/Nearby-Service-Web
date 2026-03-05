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

// "use client";

// import { Input } from "@/components/ui/input";

// const ALL_DAYS = [
//   { key: "mon", label: "Mon" },
//   { key: "tue", label: "Tue" },
//   { key: "wed", label: "Wed" },
//   { key: "thu", label: "Thu" },
//   { key: "fri", label: "Fri" },
//   { key: "sat", label: "Sat" },
//   { key: "sun", label: "Sun" },
// ];

// export interface ScheduleEntry {
//   day: string;
//   startTime: string;
//   endTime: string;
//   _id?: string;
// }

// interface ScheduleSelectorProps {
//   schedule: ScheduleEntry[];
//   onScheduleChange: (updated: ScheduleEntry[]) => void;
// }

// export function ScheduleSelector({
//   schedule,
//   onScheduleChange,
// }: ScheduleSelectorProps) {
//   const isSelected = (day: string) => schedule.some((s) => s.day === day);

//   const getEntry = (day: string): ScheduleEntry =>
//     schedule.find((s) => s.day === day) ?? {
//       day,
//       startTime: "09:00",
//       endTime: "17:00",
//     };

//   const toggleDay = (day: string) => {
//     if (isSelected(day)) {
//       // Remove the day
//       onScheduleChange(schedule.filter((s) => s.day !== day));
//     } else {
//       // Add with defaults
//       onScheduleChange([
//         ...schedule,
//         { day, startTime: "09:00", endTime: "17:00" },
//       ]);
//     }
//   };

//   const updateTime = (
//     day: string,
//     field: "startTime" | "endTime",
//     value: string,
//   ) => {
//     onScheduleChange(
//       schedule.map((s) => (s.day === day ? { ...s, [field]: value } : s)),
//     );
//   };

//   return (
//     <div>
//       <label className='text-sm font-bold mb-3 block'>Schedule</label>

//       {/* Day toggle pills */}
//       <div className='flex flex-wrap gap-2 mb-4'>
//         {ALL_DAYS.map(({ key, label }) => (
//           <button
//             key={key}
//             type='button'
//             onClick={() => toggleDay(key)}
//             className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
//               isSelected(key)
//                 ? "bg-[#15B826] text-white border-[#15B826]"
//                 : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
//             }`}
//           >
//             {label}
//           </button>
//         ))}
//       </div>

//       {/* Time inputs for selected days */}
//       {schedule.length > 0 && (
//         <div className='space-y-2'>
//           {ALL_DAYS.filter(({ key }) => isSelected(key)).map(
//             ({ key, label }) => {
//               const entry = getEntry(key);
//               return (
//                 <div
//                   key={key}
//                   className='flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2'
//                 >
//                   <span className='text-xs font-semibold text-gray-500 w-7 shrink-0'>
//                     {label}
//                   </span>
//                   <div className='flex items-center gap-2 flex-1'>
//                     <Input
//                       type='time'
//                       value={entry.startTime}
//                       onChange={(e) =>
//                         updateTime(key, "startTime", e.target.value)
//                       }
//                       className='h-8 text-xs'
//                     />
//                     <span className='text-gray-400 text-xs shrink-0'>to</span>
//                     <Input
//                       type='time'
//                       value={entry.endTime}
//                       onChange={(e) =>
//                         updateTime(key, "endTime", e.target.value)
//                       }
//                       className='h-8 text-xs'
//                     />
//                   </div>
//                 </div>
//               );
//             },
//           )}
//         </div>
//       )}

//       {schedule.length === 0 && (
//         <p className='text-xs text-gray-400 text-center py-3 border border-dashed border-gray-200 rounded-lg'>
//           Select days above to set working hours
//         </p>
//       )}
//     </div>
//   );
// }

// ? Select day with multiple time slots

// "use client";

// import { useState } from "react";
// import { Plus, X } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";

// interface TimeSlot {
//   start: string;
//   end: string;
//   available?: boolean;
// }

// interface ScheduleDay {
//   day: string;
//   startTime?: string;
//   endTime?: string;
//   timeSlots?: TimeSlot[];
// }

// interface ScheduleSelectorProps {
//   schedule: ScheduleDay[];
//   onScheduleChange?: (schedule: ScheduleDay[]) => void;
// }

// const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
// const DAY_LABELS: Record<string, string> = {
//   mon: "Mon",
//   tue: "Tue",
//   wed: "Wed",
//   thu: "Thu",
//   fri: "Fri",
//   sat: "Sat",
//   sun: "Sun",
// };

// export function ScheduleSelector({
//   schedule,
//   onScheduleChange,
// }: ScheduleSelectorProps) {
//   const [selectedDays, setSelectedDays] = useState<string[]>(
//     schedule?.length > 0 ? [schedule[0].day] : ["mon"],
//   );
//   const [newSlotStart, setNewSlotStart] = useState("09:00");
//   const [newSlotEnd, setNewSlotEnd] = useState("10:00");
//   const [repeatAll, setRepeatAll] = useState(false);

//   const handleRepeatChange = (checked: boolean) => {
//     setRepeatAll(checked);
//     if (checked) {
//       setSelectedDays(DAYS);
//     } else {
//       setSelectedDays([selectedDays[0] || "mon"]);
//     }
//   };

//   const handleDayClick = (day: string) => {
//     if (repeatAll) return;
//     setSelectedDays((prev) =>
//       prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
//     );
//   };

//   const handleAddSlot = () => {
//     if (!newSlotStart || !newSlotEnd) return;
//     if (newSlotStart >= newSlotEnd) return;

//     const newTimeSlot: TimeSlot = {
//       start: newSlotStart,
//       end: newSlotEnd,
//       available: true,
//     };

//     const updatedSchedule = schedule.map((day) => {
//       if (selectedDays.includes(day.day)) {
//         return {
//           ...day,
//           // Fix: default to [] if timeSlots is undefined
//           timeSlots: [...(day.timeSlots ?? []), newTimeSlot],
//         };
//       }
//       return day;
//     });

//     onScheduleChange?.(updatedSchedule);
//     setNewSlotStart("09:00");
//     setNewSlotEnd("10:00");
//   };

//   const handleRemoveSlot = (dayToUpdate: string, index: number) => {
//     const updatedSchedule = schedule.map((day) => {
//       if (day.day === dayToUpdate) {
//         return {
//           ...day,
//           timeSlots: (day.timeSlots ?? []).filter((_, i) => i !== index),
//         };
//       }
//       return day;
//     });

//     onScheduleChange?.(updatedSchedule);
//   };

//   const handleToggleAvailability = (dayToUpdate: string, index: number) => {
//     const updatedSchedule = schedule.map((day) => {
//       if (day.day === dayToUpdate) {
//         const updatedSlots = (day.timeSlots ?? []).map((slot, i) =>
//           i === index ? { ...slot, available: !slot.available } : slot,
//         );
//         return {
//           ...day,
//           timeSlots: updatedSlots,
//         };
//       }
//       return day;
//     });

//     onScheduleChange?.(updatedSchedule);
//   };

//   return (
//     <div className='w-full mx-auto'>
//       <Card className='p-4 border-2'>
//         {/* Header */}
//         <div className='mb-6'>
//           <h2 className='text-base font-bold text-foreground mb-1'>
//             Availability
//           </h2>
//         </div>

//         {/* Day Selection */}
//         <div className='mb-6'>
//           <label className='block text-sm font-semibold text-foreground mb-3'>
//             Day
//           </label>
//           <div className='bg-card rounded-xl border border-border p-3 md:p-4'>
//             <div className='flex gap-1 md:gap-3 flex-wrap overflow-x-auto pb-2'>
//               {DAYS.map((day) => (
//                 <button
//                   key={day}
//                   onClick={() => handleDayClick(day)}
//                   disabled={repeatAll}
//                   className={`px-3 md:px-2.5 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all border ${
//                     selectedDays.includes(day)
//                       ? "bg-green-600 text-white border-green-600"
//                       : "text-muted-foreground hover:text-foreground border-transparent"
//                   } ${repeatAll ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
//                 >
//                   {DAY_LABELS[day]}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Time Range Inputs */}
//         <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
//           <div
//             className='relative cursor-pointer'
//             onClick={() =>
//               (
//                 document.getElementById("fromTime") as HTMLInputElement
//               )?.showPicker()
//             }
//           >
//             <label className='block text-sm font-semibold text-foreground mb-2'>
//               From
//             </label>
//             <input
//               id='fromTime'
//               type='time'
//               value={newSlotStart}
//               onChange={(e) => setNewSlotStart(e.target.value)}
//               className='w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition'
//             />
//           </div>
//           <div
//             className='relative cursor-pointer'
//             onClick={() =>
//               (
//                 document.getElementById("toTime") as HTMLInputElement
//               )?.showPicker()
//             }
//           >
//             <label className='block text-sm font-semibold text-foreground mb-2'>
//               To
//             </label>
//             <input
//               id='toTime'
//               type='time'
//               value={newSlotEnd}
//               onChange={(e) => setNewSlotEnd(e.target.value)}
//               className='w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition'
//             />
//           </div>
//         </div>

//         {/* Validation hint */}
//         {newSlotStart >= newSlotEnd && (
//           <p className='text-xs text-red-500 mb-4'>
//             &quot;From&quot; time must be earlier than &quot;To&quot; time.
//           </p>
//         )}

//         {/* Add Slot Button */}
//         <button
//           onClick={handleAddSlot}
//           disabled={!selectedDays.length || newSlotStart >= newSlotEnd}
//           className='w-1/3 mx-auto px-3 py-2 rounded-lg border-2 border-green-600 text-green-600 font-semibold hover:bg-green-50 transition flex items-center justify-center gap-2 mb-6 disabled:opacity-50 disabled:cursor-not-allowed'
//         >
//           <Plus className='w-5 h-5' />
//           Add Slot
//         </button>

//         {/* Time Slots Display for Selected Days */}
//         {selectedDays.map((dayKey) => {
//           const dayData = schedule.find((d) => d.day === dayKey);
//           if (!dayData || !dayData.timeSlots?.length) return null;

//           return (
//             <div key={dayKey} className='mb-6'>
//               <label className='block text-sm font-semibold text-foreground mb-3'>
//                 {DAY_LABELS[dayKey]} — Time Slots
//               </label>
//               <div className='flex flex-wrap gap-2'>
//                 {dayData.timeSlots.map((slot, index) => (
//                   <div
//                     key={index}
//                     className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
//                       slot.available
//                         ? "bg-green-100 text-green-800 hover:bg-green-200"
//                         : "bg-red-100 text-red-800 hover:bg-red-200"
//                     }`}
//                     onClick={() => handleToggleAvailability(dayKey, index)}
//                     title={
//                       slot.available
//                         ? "Click to mark unavailable"
//                         : "Click to mark available"
//                     }
//                   >
//                     <span>
//                       {slot.start}–{slot.end}
//                     </span>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleRemoveSlot(dayKey, index);
//                       }}
//                       className='hover:opacity-70 transition ml-1'
//                       aria-label='Remove slot'
//                     >
//                       <X className='w-4 h-4' />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           );
//         })}

//         {/* Repeat Checkbox */}
//         <div className='flex items-center gap-3 p-4 bg-muted/50 rounded-lg'>
//           <Checkbox
//             id='repeat'
//             checked={repeatAll}
//             onCheckedChange={(checked) =>
//               handleRepeatChange(checked as boolean)
//             }
//           />
//           <label
//             htmlFor='repeat'
//             className='text-sm text-foreground cursor-pointer font-medium'
//           >
//             Repeat this for all days of the week.
//           </label>
//         </div>
//       </Card>
//     </div>
//   );
// }
