"use client";

import { MapPin, Star, Tag } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function RelatedCard() {
  const [saved, setSaved] = useState(false);

  return (
    <div className='flex flex-col items-end justify-end gap-6 lg:gap-10 pt-5 font-sans'>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className='card-font w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl card-shine relative'
        >
          {/* Image area */}
          <div className='relative h-52 sm:h-60 overflow-hidden'>
            {/* Gradient placeholder — swap src for real image */}
            <div className='w-full h-full'>
              <Image
                src='/event/2.jpg'
                alt='Event'
                fill
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                className='w-full h-full object-cover'
              />
            </div>
            <div className='img-overlay absolute inset-0' />

            {/* Save / heart */}
            <button
              onClick={() => setSaved(!saved)}
              className={`save-btn absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center pill-tag text-white ${saved ? "active" : ""}`}
              aria-label='Save event'
            >
              <svg
                viewBox='0 0 24 24'
                className='w-5 h-5'
                fill={saved ? "currentColor" : "none"}
                stroke='currentColor'
                strokeWidth='2'
              >
                <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className='bg-white p-5'>
            <h2 className='display-font text-[#374151] text-2xl font-black leading-tight mb-1'>
              Live Jazz Night
            </h2>

            {/* Meta row */}
            <div className='flex items-center gap-3 mt-5 flex-wrap'>
              {/* Distance */}
              <span className='flex items-center gap-1 text-[#374151] text-sm'>
                <MapPin className='w-4 h-4 text-[#108F1E]' />
                2.3 miles
              </span>

              {/* Rating */}
              <div className='flex items-center gap-1'>
                <Star className='w-4 h-4 text-[#108F1E]' fill='#108F1E' />
                <span className='flex items-center gap-1 text-sm text-[#374151] font-medium'>
                  4.9
                </span>
              </div>

              {/* Tag */}
              <span className='flex items-center gap-1 text-[#030712] text-sm'>
                <Tag className='w-4 h-4 text-[#108F1E]' />
                Service
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
