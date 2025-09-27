"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, MapPin, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { NavigationHeader } from "@/components/NavigationHeader";

export default function SelectTimePage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(16); // Sunday 16 is selected by default
  const [selectedTime, setSelectedTime] = useState("");

  const weekDays = [
    { day: "Sun", date: 16 },
    { day: "Mon", date: 17 },
    { day: "Tue", date: 18 },
    { day: "Wed", date: 19 },
    { day: "Thu", date: 20 },
    { day: "Fri", date: 21 },
    { day: "Sat", date: 22 },
    { day: "Sun", date: 23 },
    { day: "Mon", date: 24 },
  ];

  const timeSlots = [
    "9:00pm",
    "4:45pm",
    "5:00pm",
    "5:15pm",
    "5:30pm",
    "5:45pm",
    "6:00pm",
    "8:00pm",
  ];

  const handleContinue = () => {
    if (selectedTime) {
      // Store selected date and time in localStorage or state management
      localStorage.setItem("selectedDate", selectedDate.toString());
      localStorage.setItem("selectedTime", selectedTime);
      router.push("/confirm-booking");
    }
  };

  return (
    <div className='min-h-screen bg-[#F3F4F6] py-8 px-4'>
      <div className='container mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Side - Time Selection */}
          <div className='space-y-6 lg:col-span-2'>
            <NavigationHeader title='Select time' />

            {/* Month Navigation */}
            <div className='flex items-center justify-between'>
              <span className='text-lg font-semibold text-[#1F2937]'>July</span>
              <ChevronRight className='w-5 h-5 text-gray-400' />
            </div>

            {/* Calendar Days */}
            <div className='grid grid-cols-7 gap-2'>
              {weekDays.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDate(item.date)}
                  className={`p-3 rounded-lg text-center transition-colors ${
                    selectedDate === item.date
                      ? "bg-green-600 text-white"
                      : "bg-white text-[#1F2937] hover:bg-gray-50"
                  }`}
                >
                  <div className='text-xs font-medium'>{item.day}</div>
                  <div className='text-sm font-semibold mt-1'>{item.date}</div>
                </button>
              ))}
            </div>

            {/* Time Slots */}
            <div className='space-y-2'>
              {timeSlots.map((time, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTime(time)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    selectedTime === time
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <span className='font-medium text-[#1F2937]'>{time}</span>
                  <ChevronRight className='w-5 h-5 text-gray-400' />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Event Card */}
          <div className='lg:sticky lg:top-8 h-fit'>
            <Card className='overflow-hidden bg-white shadow-sm py-0'>
              <div className='relative aspect-[4/3] w-full'>
                <Image
                  src='/event/1.jpg'
                  alt='Live Jazz Night concert with crowd'
                  fill
                  className='object-cover'
                  priority
                />
              </div>

              <div className='p-6 space-y-4'>
                <h3 className='text-xl font-medium text-[#1F2937]'>
                  Live Jazz Night
                </h3>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-1'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className='w-4 h-4 fill-[#15B826] text-[#15B826]'
                      />
                    ))}
                    <span className='text-sm text-gray-600 ml-1'>4.9</span>
                  </div>

                  <div className='flex items-center gap-1 text-gray-600'>
                    <MapPin className='w-4 h-4' />
                    <span className='text-sm'>2.3 miles</span>
                  </div>
                </div>

                <div className='space-y-3 pt-2'>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Location</span>
                    <span className='font-medium text-[#1F2937]'>
                      123 Maple Street
                    </span>
                  </div>

                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Start From</span>
                    <span className='font-medium text-[#1F2937]'>$200</span>
                  </div>
                </div>

                <Button
                  onClick={handleContinue}
                  disabled={!selectedTime}
                  className='w-full h-12 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium py-3 rounded-lg transition-colors'
                >
                  Continue
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
