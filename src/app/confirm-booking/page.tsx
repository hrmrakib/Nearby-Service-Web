"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star, MapPin } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { NavigationHeader } from "@/components/NavigationHeader";

export default function ConfirmBookingPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    time: "",
  });

  useEffect(() => {
    // Get booking details from localStorage
    const selectedDate = localStorage.getItem("selectedDate");
    const selectedTime = localStorage.getItem("selectedTime");

    if (selectedDate && selectedTime) {
      setBookingDetails({
        date: `Tuesday, September 6, 2024`, // This would be calculated from selectedDate
        time: `10:00 AM`, // This would be converted from selectedTime
      });
    }
  }, []);

  const handleConfirmBooking = () => {
    localStorage.setItem("bookingMessage", message);
    router.push("/confirm-payment");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className='min-h-screen bg-[#F3F4F6] py-8 px-4'>
      <div className='container mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Side - Booking Confirmation */}
          <div className='space-y-6 lg:col-span-2'>
            <NavigationHeader title='Confirm Booking' />

            <h1 className='text-2xl font-semibold text-[#030712]'>
              Confirm Booking
            </h1>

            {/* Booking Details Card */}
            <Card className='p-6 bg-white'>
              <div className='space-y-2'>
                <div className='text-lg font-medium text-[#030712]'>
                  {bookingDetails.date}
                </div>
                <div className='text-lg font-medium text-[#030712]'>
                  at {bookingDetails.time}
                </div>
                <div className='flex items-center gap-2 text-gray-600 mt-4'>
                  <MapPin className='w-4 h-4 text-green-600' />
                  <span>123 Maple Street</span>
                </div>
              </div>
            </Card>

            {/* Message Section */}
            <div className='space-y-3 bg-white p-6 rounded-lg shadow-sm'>
              <label className='text-lg font-medium text-[#030712] pb-6'>
                Message (Optional)
              </label>
              <Textarea
                placeholder='Enter your message'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className='min-h-[120px] resize-none border-gray-200 focus:border-green-600 focus:ring-green-600'
              />
            </div>
          </div>

          {/* Right Side - Event Card */}
          <div className='lg:sticky lg:top-8 h-fit'>
            <Card className='overflow-hidden bg-white shadow-sm py-0'>
              <div className='relative aspect-[4/3] w-full h-44'>
                <Image
                  src='/event/1.jpg'
                  alt='Live Jazz Night concert with crowd'
                  fill
                  className='object-cover'
                  priority
                />
              </div>

              <div className='p-6 space-y-4'>
                <h3 className='text-xl font-medium text-[#030712]'>
                  Live Jazz Night
                </h3>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-1'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className='w-4 h-4 fill-green-500 text-green-500'
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
                    <span className='font-medium text-[#030712]'>
                      123 Maple Street
                    </span>
                  </div>

                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Start From</span>
                    <span className='font-medium text-[#030712]'>$200</span>
                  </div>
                </div>

                <div className='space-y-3 pt-2'>
                  <Button
                    onClick={handleConfirmBooking}
                    className='w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors'
                  >
                    Confirm Booking
                  </Button>

                  <Button
                    onClick={handleCancel}
                    variant='outline'
                    className='w-full border-green-600 text-green-600 hover:bg-green-50 font-medium py-3 rounded-lg transition-colors bg-transparent'
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
