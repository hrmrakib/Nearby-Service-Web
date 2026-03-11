"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { Booking } from "../../types/booking";

// Mock data - in production this would come from API
const MOCK_BOOKINGS: Booking[] = [
  {
    _id: "6926d2cbec68e12de8f6a750",
    orderId: "SDH6ZSUS",
    service: {
      _id: "6926cd6ab535a1ad7c69ff0a",
      title: "Conference Hall Rental",
      category: "Event Venues",
    },
    provider: {
      _id: "68f4a45b8ff76daba97da3d7",
      name: "Jurnee",
      email: "alphabytes.gpt@gmail.com",
      address: "Aqua Tower",
    },
    customer: "6915c5edbbcf954de4fbbc58",
    scheduleId: "6926cd6ab535a1ad7c69ff0b",
    slotId: "6926cd6ab535a1ad7c69ff0c",
    slotStart: "09:00",
    slotEnd: "10:00",
    serviceDate: "2025-11-28T10:00:00.000Z",
    status: "PENDING",
    amount: 200,
    createdAt: "2025-11-26T10:13:31.263Z",
    updatedAt: "2025-11-26T10:13:31.263Z",
    __v: 0,
  },
  {
    _id: "6926d2cbec68e12de8f6a751",
    orderId: "XYZ12345",
    service: {
      _id: "6926cd6ab535a1ad7c69ff0d",
      title: "DJ Performance",
      category: "Entertainment",
    },
    provider: {
      _id: "68f4a45b8ff76daba97da3d8",
      name: "Maria Hernandez",
      email: "maria@example.com",
      address: "123 Maple Street",
    },
    customer: "6915c5edbbcf954de4fbbc58",
    scheduleId: "6926cd6ab535a1ad7c69ff0e",
    slotId: "6926cd6ab535a1ad7c69ff0f",
    slotStart: "10:00",
    slotEnd: "11:00",
    serviceDate: "2025-06-15T10:00:00.000Z",
    status: "PENDING",
    amount: 53,
    createdAt: "2025-06-01T10:00:00.000Z",
    updatedAt: "2025-06-01T10:00:00.000Z",
    __v: 0,
  },
];

function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
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
    <div className='w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0'>
      {name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)}
    </div>
  );
}

function MarkAsCompleteComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Simulate API fetch by bookingId
    setTimeout(() => {
      const found =
        MOCK_BOOKINGS.find((b) => b._id === bookingId) || MOCK_BOOKINGS[1];
      setBooking(found);
      setLoading(false);
    }, 400);
  }, [bookingId]);

  const handleMarkComplete = async () => {
    if (!booking) return;
    setSubmitting(true);

    // Simulate API call: PATCH /bookings/:id/complete
    await new Promise((res) => setTimeout(res, 1000));
    setSubmitting(false);
    setSuccess(true);

    // Navigate to review page after short delay
    setTimeout(() => {
      router.push(`/review?bookingId=${booking._id}`);
    }, 800);
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin' />
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-lg mx-auto px-4 pt-6 pb-10'>
        {/* Header */}
        <div className='flex items-center gap-3 mb-8'>
          <button
            onClick={() => router.back()}
            className='p-1.5 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <ArrowLeft className='w-5 h-5 text-gray-700' />
          </button>
          <h1 className='text-xl font-bold text-gray-900'>Mark as Complete</h1>
        </div>

        {/* Provider */}
        <div className='flex flex-col items-center mb-6'>
          <ProviderAvatar name={booking.provider.name} />
          <p className='mt-2 font-semibold text-gray-900'>
            {booking.provider.name}
          </p>
        </div>

        {/* Booking Details Card */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6'>
          <div className='mb-4'>
            <p className='font-semibold text-gray-900 text-base'>
              {formatFullDate(booking.serviceDate)}
            </p>
            <p className='text-gray-500 text-sm mt-0.5'>
              at {formatTime(booking.slotStart)}
            </p>
          </div>

          <div className='flex items-center gap-2 mb-5'>
            <MapPin className='w-4 h-4 text-green-500 flex-shrink-0' />
            <span className='text-sm text-gray-700'>
              {booking.provider.address}
            </span>
          </div>

          <div className='border-t border-gray-100 pt-4 flex items-center justify-between'>
            <span className='text-sm text-gray-500'>Quoted</span>
            <span className='font-semibold text-gray-900'>
              ${booking.amount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleMarkComplete}
          disabled={submitting || success}
          className={`w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all duration-200 ${
            success
              ? "bg-green-600"
              : submitting
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 active:bg-green-700"
          }`}
        >
          {success
            ? "✓ Marked Complete!"
            : submitting
              ? "Processing..."
              : "Mark as Complete"}
        </button>

        <p className='text-center text-xs text-gray-400 mt-3'>
          Payment will be released once the customer confirms.
        </p>
      </div>
    </div>
  );
}
export default function MarkAsCompletePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MarkAsCompleteComponent />
    </Suspense>
  );
}
