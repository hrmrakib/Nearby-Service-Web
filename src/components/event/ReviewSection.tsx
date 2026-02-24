/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import formatDate from "@/utils/formatDate";
import Image from "next/image";
import { useState } from "react";

type Review = {
  _id: string;
  userId: {
    name: string;
    image: string;
  };
  postId: string;
  image: string;
  video: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
};

function StarRating({
  rating,
  interactive = false,
  onChange,
}: {
  rating: number;
  interactive?: boolean;
  onChange?: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className='flex gap-0.5'>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = interactive
          ? star <= (hovered || rating)
          : star <= Math.floor(rating);
        const half = !interactive && !filled && star - 0.5 <= rating;

        return (
          <button
            key={star}
            type='button'
            disabled={!interactive}
            className={`relative w-5 h-5 transition-transform duration-150 ${interactive ? "cursor-pointer hover:scale-125" : "cursor-default"}`}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => interactive && onChange?.(star)}
            aria-label={`${star} star`}
          >
            {/* Background star (empty) */}
            <svg
              viewBox='0 0 20 20'
              className='absolute inset-0 w-full h-full text-gray-200'
            >
              <path
                fill='currentColor'
                d='M10 1l2.39 4.85 5.36.78-3.88 3.78.92 5.35L10 13.27l-4.79 2.49.92-5.35L2.25 6.63l5.36-.78z'
              />
            </svg>
            {/* Filled portion */}
            <svg
              viewBox='0 0 20 20'
              className='absolute inset-0 w-full h-full text-emerald-500'
              style={{
                clipPath: filled
                  ? "none"
                  : half
                    ? "inset(0 50% 0 0)"
                    : "inset(0 100% 0 0)",
              }}
            >
              <path
                fill='currentColor'
                d='M10 1l2.39 4.85 5.36.78-3.88 3.78.92 5.35L10 13.27l-4.79 2.49.92-5.35L2.25 6.63l5.36-.78z'
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4'
      onClick={onClose}
    >
      <button
        className='absolute top-4 right-4 text-white bg-white/20 hover:bg-white/40 rounded-full w-9 h-9 flex items-center justify-center transition-colors'
        onClick={onClose}
        aria-label='Close'
      >
        ✕
      </button>
      <img
        src={src}
        alt='Review image'
        className='max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain'
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <>
      {lightbox && (
        <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
      )}

      <div className='py-6 first:pt-0 last:pb-0 border-b last:border-b-0 border-gray-100 flex flex-col gap-3 animate-fadeIn'>
        {/* Header row */}
        <div className='flex items-start justify-between gap-3'>
          <div className='flex gap-1.5'>
            <StarRating rating={review.rating} />
            <span className='text-xs text-[#6B7280]'>
              {formatDate(review.createdAt)}
            </span>
          </div>
        </div>

        {/* Review text */}
        <p className='text-sm text-[#1F2937] leading-relaxed'>
          {review?.content}
        </p>

        {/* Optional image */}
        {review.image && (
          <button
            className='block overflow-hidden rounded-2xl max-w-xs w-full cursor-zoom-in hover:opacity-90 transition-opacity'
            onClick={() => setLightbox(review.image!)}
            aria-label='View full image'
          >
            <Image
              src={review.image}
              alt='Review attachment'
              className='w-full h-40 sm:h-48 object-cover'
              width={640}
              height={480}
              loading='lazy'
            />
          </button>
        )}

        {/* Footer: avatar + helpfulness */}
        <div className='flex items-center justify-between gap-4 flex-wrap'>
          {/* Avatar */}
          <div className='flex items-center gap-2.5'>
            <Image
              src={review?.userId?.image}
              alt={review?.userId?.name}
              className='w-8 h-8 rounded-full bg-gray-100 object-cover border border-gray-200'
              width={32}
              height={32}
            />
            <span className='text-sm font-semibold text-gray-800'>
              {review?.userId?.name}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ReviewSection({ reviews }: { reviews: Review[] }) {
  return (
    <>
      <div
        id='see-all'
        className='min-h-screen bg-gray-50 flex items-start justify-center'
      >
        <div className='w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col gap-6'>
          {/* Review list */}
          <div className='flex flex-col'>
            {reviews?.map((review: Review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
