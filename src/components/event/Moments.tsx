"use client";

import Image from "next/image";
import { useState, useRef } from "react";

type MediaItem = {
  id: number;
  src: string;
  type: "photo" | "video";
  author: "owner" | "community";
  alt: string;
};

type FilterType = "all" | "owner" | "community";

const MOCK_MEDIA: MediaItem[] = [
  {
    id: 1,
    src: "/event/1.jpg",
    type: "photo",
    author: "owner",
    alt: "Guitarist performing on stage with blue lights",
  },
  {
    id: 2,
    src: "/event/2.jpg",
    type: "photo",
    author: "community",
    alt: "Guitarist in pink neon lights",
  },
  {
    id: 3,
    src: "/event/3.jpg",
    type: "photo",
    author: "community",
    alt: "Singer on stage with smoke",
  },
  {
    id: 4,
    src: "/event/4.jpg",
    type: "photo",
    author: "owner",
    alt: "Guitarist under red lights",
  },
  {
    id: 5,
    src: "/event/1.jpg",
    type: "photo",
    author: "community",
    alt: "Concert crowd",
  },
  {
    id: 6,
    src: "/event/2.jpg",
    type: "photo",
    author: "community",
    alt: "Stage lights",
  },
  {
    id: 7,
    src: "/event/3.jpg",
    type: "photo",
    author: "owner",
    alt: "Band performing live",
  },
];

const HASHTAGS = [
  "#hashtag",
  "#hashtag",
  "#hashtag",
  "#livemusic",
  "#concert",
  "#vibes",
  "#neon",
];
const VISIBLE_TAGS = 3;

export default function MomentsSection() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [lightbox, setLightbox] = useState<MediaItem | null>(null);
  const [showAllTags, setShowAllTags] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered =
    filter === "all"
      ? MOCK_MEDIA
      : MOCK_MEDIA.filter((m) => m.author === filter);

  const visibleTags = showAllTags ? HASHTAGS : HASHTAGS.slice(0, VISIBLE_TAGS);
  const hiddenCount = HASHTAGS.length - VISIBLE_TAGS;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 2500);
    }
  };

  return (
    <div className='bg-gray-100 flex items-center justify-center'>
      <div className='w-full max-w-2xl bg-white rounded-2xl shadow-sm p-5 sm:p-6'>
        {/* Header */}
        <div className='flex items-start justify-between mb-1'>
          <div>
            <h2 className='text-xl font-bold text-gray-900 tracking-tight'>
              Moments
            </h2>
            <p className='text-sm text-gray-500 mt-0.5'>
              Photos & Videos From this Event
            </p>
          </div>
          {/* Upload button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className='flex items-center gap-1.5 text-sm text-green-600 font-medium hover:text-green-700 transition-colors active:scale-95'
          >
            <svg
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
              <polyline points='17 8 12 3 7 8' />
              <line x1='12' y1='3' x2='12' y2='15' />
            </svg>
            <span className='hidden sm:inline'>Upload</span>
          </button>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*,video/*'
            multiple
            className='hidden'
            onChange={handleUpload}
          />
        </div>

        {/* Upload success toast */}
        {uploadSuccess && (
          <div className='mt-2 mb-1 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 animate-fade-in'>
            ✓ Media uploaded successfully!
          </div>
        )}

        {/* Filter tabs */}
        <div className='flex gap-2 mt-4 mb-5'>
          {(["all", "owner", "community"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all duration-150 active:scale-95 border
                ${
                  filter === f
                    ? "bg-green-500 text-white border-green-500 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Media grid */}
        {filtered.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12 text-gray-400'>
            <svg
              width='40'
              height='40'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.5'
            >
              <rect x='3' y='3' width='18' height='18' rx='2' />
              <circle cx='8.5' cy='8.5' r='1.5' />
              <polyline points='21 15 16 10 5 21' />
            </svg>
            <p className='mt-3 text-sm'>No media found</p>
          </div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3'>
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => setLightbox(item)}
                className='relative aspect-square rounded-xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                  fill
                />
                {/* Owner badge */}
                {item.author === "owner" && (
                  <span className='absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full'>
                    ★
                  </span>
                )}
                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-xl' />
              </button>
            ))}
          </div>
        )}

        {/* Hashtags */}
        <div className='flex flex-wrap gap-2 mt-5'>
          {visibleTags.map((tag, i) => (
            <span
              key={i}
              className='px-3 py-1 rounded-full border border-green-200 bg-green-50 text-green-700 text-sm font-medium cursor-pointer hover:bg-green-100 transition-colors'
            >
              {tag}
            </span>
          ))}
          {!showAllTags && hiddenCount > 0 && (
            <button
              onClick={() => setShowAllTags(true)}
              className='px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-gray-500 text-sm font-medium hover:bg-gray-100 transition-colors'
            >
              +{hiddenCount} More
            </button>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className='fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm'
          onClick={() => setLightbox(null)}
        >
          <div
            className='relative max-w-2xl w-full max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl'
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.src}
              alt={lightbox.alt}
              className='w-full h-full object-contain'
              fill
            />
            <button
              onClick={() => setLightbox(null)}
              className='absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors'
              aria-label='Close'
            >
              ✕
            </button>
            {/* Nav arrows */}
            <button
              onClick={() => {
                const idx = filtered.findIndex((m) => m.id === lightbox.id);
                setLightbox(
                  filtered[(idx - 1 + filtered.length) % filtered.length],
                );
              }}
              className='absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors'
              aria-label='Previous'
            >
              ‹
            </button>
            <button
              onClick={() => {
                const idx = filtered.findIndex((m) => m.id === lightbox.id);
                setLightbox(filtered[(idx + 1) % filtered.length]);
              }}
              className='absolute right-12 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors'
              aria-label='Next'
            >
              ›
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
