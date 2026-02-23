/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import getDistanceKm from "@/utils/getDistanceMiles";
import { MapPin, Star, Tag } from "lucide-react";
import Image from "next/image";

export default function RelatedCard({ userLng, userLat, relevantPosts }: any) {
  return (
    <div className='flex flex-col items-end justify-end gap-6 lg:gap-10 pt-5 font-sans'>
      {relevantPosts.map((post: any) => (
        <div
          key={post._id}
          className='card-font w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl card-shine relative'
        >
          {/* Image area */}
          <div className='relative h-52 sm:h-60 overflow-hidden'>
            {/* Gradient placeholder — swap src for real image */}
            <div className='w-full h-full'>
              <Image
                src={post?.image}
                alt={post?.title}
                fill
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                className='w-full h-full object-cover'
              />
            </div>
            <div className='img-overlay absolute inset-0' />
          </div>

          {/* Content */}
          <div className='bg-white p-5'>
            <h2 className='display-font text-[#374151] text-2xl font-black leading-tight mb-1'>
              {post?.title}
            </h2>

            {/* Meta row */}
            <div className='flex items-center gap-3 mt-5 flex-wrap'>
              {/* Distance */}
              <span className='flex items-center gap-1 text-[#374151] text-sm'>
                <MapPin className='w-4 h-4 text-[#108F1E]' />
                {getDistanceKm(
                  userLng,
                  userLat,
                  post?.location?.coordinates[1],
                  post?.location?.coordinates[0],
                ).toFixed(1)}{" "}
                km
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
