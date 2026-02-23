"use client";

import Image from "next/image";
import { useState } from "react";

interface Review {
  id: number;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  image?: string;
  helpful: number;
  notHelpful: number;
  userVote?: "helpful" | "notHelpful" | null;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 1,
    author: "Jacob Jones",
    avatar: "/event/1.jpg",
    rating: 4.5,
    date: "Jan 18, 2026",
    text: "Amazing experience! The DJ kept the energy high all night long. We had a blast, and the venue was perfect for our group size. Highly recommend!",
    image: "/event/1.jpg",
    helpful: 14,
    notHelpful: 2,
    userVote: null,
  },
  {
    id: 2,
    author: "Brooklyn Simmons",
    avatar: "/event/2.jpg",
    rating: 4.5,
    date: "Jan 18, 2026",
    text: "Great event! The food was delicious, and the atmosphere was vibrant. Can't wait for the next one!",
    helpful: 9,
    notHelpful: 1,
    userVote: null,
  },
  {
    id: 3,
    author: "Jerome Bell",
    avatar: "/event/3.jpg",
    rating: 4.5,
    date: "Jan 18, 2026",
    text: "Great event! The food was delicious, and the atmosphere was vibrant. Can't wait for the next one!",
    helpful: 6,
    notHelpful: 0,
    userVote: null,
  },
  {
    id: 4,
    author: "Leslie Alexander",
    avatar: "/event/4.jpg",
    rating: 5,
    date: "Jan 15, 2026",
    text: "Absolutely stellar! Every detail was on point. The staff was incredibly attentive and made sure everyone had a wonderful time.",
    helpful: 21,
    notHelpful: 0,
    userVote: null,
  },
  {
    id: 5,
    author: "Marvin McKinney",
    avatar: "/event/1.jpg",
    rating: 3,
    date: "Jan 10, 2026",
    text: "Decent event overall, but the sound system had some issues in the first hour. It improved later in the evening, but the initial problems were noticeable.",
    helpful: 4,
    notHelpful: 3,
    userVote: null,
  },
];

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

function ReviewCard({
  review,
  onVote,
}: {
  review: Review;
  onVote?: (id: number, vote: "helpful" | "notHelpful") => void;
}) {
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
            <span className='text-xs text-[#6B7280]'>{review.date}</span>
          </div>
        </div>

        {/* Review text */}
        <p className='text-sm text-[#1F2937] leading-relaxed'>{review.text}</p>

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
              src={review.avatar}
              alt={review.author}
              className='w-8 h-8 rounded-full bg-gray-100 object-cover border border-gray-200'
              width={32}
              height={32}
            />
            <span className='text-sm font-semibold text-gray-800'>
              {review.author}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ReviewSection({ id }: { id: string }) {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  const handleVote = (id: number, vote: "helpful" | "notHelpful") => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (r.userVote === vote) {
          // undo
          return {
            ...r,
            userVote: null,
            helpful: vote === "helpful" ? r.helpful - 1 : r.helpful,
            notHelpful: vote === "notHelpful" ? r.notHelpful - 1 : r.notHelpful,
          };
        }
        const wasHelpful = r.userVote === "helpful";
        const wasNotHelpful = r.userVote === "notHelpful";
        return {
          ...r,
          userVote: vote,
          helpful:
            vote === "helpful"
              ? r.helpful + 1
              : wasHelpful
                ? r.helpful - 1
                : r.helpful,
          notHelpful:
            vote === "notHelpful"
              ? r.notHelpful + 1
              : wasNotHelpful
                ? r.notHelpful - 1
                : r.notHelpful,
        };
      }),
    );
  };

  return (
    <>
      <div
        id='see-all'
        className='min-h-screen bg-gray-50 flex items-start justify-center'
      >
        <div className='w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col gap-6'>
          {/* Review list */}
          <div className='flex flex-col'>
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} onVote={handleVote} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
