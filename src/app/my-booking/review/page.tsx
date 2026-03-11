"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Star, MapPin } from "lucide-react";

interface ReviewFormState {
  rating: number;
  comment: string;
}

// Mock featured event to show alongside review
const FEATURED_EVENT = {
  name: "Live Jazz Night",
  distance: "2.3 miles",
  rating: 4.9,
  image:
    "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=250&fit=crop",
};

function StarRating({
  rating,
  onRate,
}: {
  rating: number;
  onRate: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className='flex items-center gap-2'>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onRate(star)}
          className='transition-transform duration-100 hover:scale-110 active:scale-95'
        >
          <Star
            className={`w-9 h-9 transition-colors duration-150 ${
              star <= (hovered || rating)
                ? "fill-green-500 text-green-500"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
function ReviewComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [form, setForm] = useState<ReviewFormState>({ rating: 3, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (form.rating === 0) return;
    setSubmitting(true);

    // Simulate API call: POST /reviews
    await new Promise((res) => setTimeout(res, 900));
    setSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      router.push("/bookings");
    }, 1000);
  };

  const handleSkip = () => {
    router.push("/bookings");
  };

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
          <h1 className='text-xl font-bold text-gray-900'>Review</h1>
        </div>

        {/* Two-column layout on wider screens, stacked on mobile */}
        <div className='flex flex-col md:flex-row gap-6'>
          {/* Left: Review Form */}
          <div className='flex-1'>
            {/* Star Rating */}
            <div className='mb-5'>
              <StarRating
                rating={form.rating}
                onRate={(r) => setForm((prev) => ({ ...prev, rating: r }))}
              />
            </div>

            {/* Text Area */}
            <div className='relative mb-6'>
              <textarea
                value={form.comment}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, comment: e.target.value }))
                }
                placeholder='Write a review'
                rows={6}
                className='w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none shadow-sm'
              />
              {/* Expand icon */}
              <div className='absolute top-3 right-3 text-gray-300'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='w-4 h-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5'
                  />
                </svg>
              </div>
            </div>

            {/* Buttons */}
            <button
              onClick={handleSubmit}
              disabled={submitting || submitted || form.rating === 0}
              className={`w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all duration-200 mb-3 ${
                submitted
                  ? "bg-green-600"
                  : submitting
                    ? "bg-green-400 cursor-not-allowed"
                    : form.rating === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 active:bg-green-700"
              }`}
            >
              {submitted
                ? "✓ Review Submitted!"
                : submitting
                  ? "Submitting..."
                  : "Submit Review"}
            </button>

            <button
              onClick={handleSkip}
              className='w-full py-3.5 rounded-xl font-semibold text-green-500 text-sm border-2 border-green-500 hover:bg-green-50 active:bg-green-100 transition-colors duration-150'
            >
              Skip
            </button>
          </div>

          {/* Right: Featured Event Card */}
          <div className='md:w-48 lg:w-56'>
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={FEATURED_EVENT.image}
                alt={FEATURED_EVENT.name}
                className='w-full h-36 object-cover'
              />
              <div className='p-3'>
                <p className='font-semibold text-gray-900 text-sm mb-1.5'>
                  {FEATURED_EVENT.name}
                </p>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-1'>
                    <MapPin className='w-3 h-3 text-green-500' />
                    <span className='text-xs text-gray-500'>
                      {FEATURED_EVENT.distance}
                    </span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Star className='w-3 h-3 fill-green-500 text-green-500' />
                    <span className='text-xs font-medium text-gray-700'>
                      {FEATURED_EVENT.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReviewComponent />
    </Suspense>
  );
}
