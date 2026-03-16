"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Booking } from "../../types/booking";
import {
  useGetPastBookingsQuery,
  useGetUpcomingBookingsQuery,
} from "@/redux/features/booking/bookingAPI";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(":");
  const h = parseInt(hours);
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${displayH}:${minutes} ${period}`;
}

function ProviderAvatar({ name }: { name: string }) {
  return (
    <div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0'>
      {name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)}
    </div>
  );
}

function BookingCard({
  booking,
  onMarkComplete,
}: {
  booking: Booking;
  onMarkComplete: (booking: Booking) => void;
}) {
  return (
    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4'>
      <div className='flex items-center gap-3 mb-4'>
        <ProviderAvatar name={booking.provider.name} />
        <div>
          <p className='font-semibold text-gray-900 text-sm'>
            {booking.provider.name}
          </p>
          <p className='text-gray-500 text-xs'>{booking.service.title}</p>
        </div>
      </div>

      <div className='flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5 mb-4'>
        <div className='flex items-center gap-2'>
          <Calendar className='w-4 h-4 text-[#15B826]' />
          <span className='text-sm text-gray-700'>
            {formatDate(booking.serviceDate)}
          </span>
        </div>
        <div className='w-px h-4 bg-gray-300' />
        <div className='flex items-center gap-2'>
          <Clock className='w-4 h-4 text-[#15B826]' />
          <span className='text-sm text-gray-700'>
            {formatTime(booking.slotStart)}
          </span>
        </div>
      </div>

      <button
        onClick={() => onMarkComplete(booking)}
        className='w-full bg-[#15B826] hover:bg-green-600 active:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors duration-150 text-sm'
      >
        Mark as Complete
      </button>
    </div>
  );
}

function PastBookingCard({ booking }: { booking: Booking }) {
  return (
    <div className='bg-white rounded-2xl shadow-sm border border-[#D1D5DB] p-4 mb-4'>
      <div className='flex items-center gap-3 mb-4'>
        <ProviderAvatar name={booking.provider.name} />
        <div className='flex-1'>
          <p className='font-semibold text-gray-900 text-sm'>
            {booking.provider.name}
          </p>
          <p className='text-gray-500 text-xs'>{booking.service.title}</p>
        </div>
        <span className='text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full'>
          Completed
        </span>
      </div>

      <div className='flex items-center justify-between bg-white rounded-xl px-3 py-2.5 shadow-md'>
        <div className='flex items-center gap-2'>
          <Calendar className='w-4 h-4 text-[#15B826]' />
          <span className='text-sm text-gray-700'>
            {formatDate(booking.serviceDate)}
          </span>
        </div>
        <div className='w-px h-4 bg-gray-300' />
        <div className='flex items-center gap-2'>
          <Clock className='w-4 h-4 text-[#15B826]' />
          <span className='text-sm text-gray-700'>
            {formatTime(booking.slotStart)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const { data: upcoming, isLoading: upcomingLoading } =
    useGetUpcomingBookingsQuery({});
  const { data: past, isLoading: pastLoading } = useGetPastBookingsQuery({});

  const upcomingBookings = upcoming?.data || [];
  const pastBookings = upcoming?.data || [];

  const handleMarkComplete = (booking: Booking) => {
    router.push(`/mark-complete?bookingId=${booking._id}`);
  };

  return (
    <div className='min-h-screen bg-[#F3F4F6]'>
      <div className='max-w-2xl px-4 pt-6 pb-10'>
        {/* Header */}
        <div className='flex items-center gap-3 mb-6'>
          <button
            onClick={() => router.back()}
            className='p-1.5 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <ArrowLeft className='w-5 h-5 text-gray-700' />
          </button>
          <h1 className='text-xl font-bold text-gray-900'>My Bookings</h1>
        </div>

        {/* Tabs */}
        <div className='max-w-1/2 flex bg-white rounded-xl border border-gray-200 p-1 mb-6 shadow-sm'>
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
              activeTab === "upcoming"
                ? "bg-[#15B826] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
              activeTab === "past"
                ? "bg-[#15B826] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Past
          </button>
        </div>

        {/* Content */}
        {upcomingLoading || pastLoading ? (
          <div className='flex flex-col gap-4'>
            {[1, 2].map((i) => (
              <div
                key={i}
                className='bg-white rounded-2xl h-40 animate-pulse border border-gray-100'
              />
            ))}
          </div>
        ) : activeTab === "upcoming" ? (
          upcomingBookings.length === 0 ? (
            <div className='text-center py-16 text-gray-400'>
              <Calendar className='w-12 h-12 mx-auto mb-3 opacity-30' />
              <p className='font-medium'>No upcoming bookings</p>
            </div>
          ) : (
            upcomingBookings.map((booking: Booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onMarkComplete={handleMarkComplete}
              />
            ))
          )
        ) : pastBookings.length === 0 ? (
          <div className='text-center py-16 text-gray-400'>
            <Calendar className='w-12 h-12 mx-auto mb-3 opacity-30' />
            <p className='font-medium'>No past bookings</p>
          </div>
        ) : (
          pastBookings.map((booking: Booking) => (
            <PastBookingCard key={booking._id} booking={booking} />
          ))
        )}
      </div>
    </div>
  );
}
