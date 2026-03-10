/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Eye } from "lucide-react";
import { useGetBoostedListQuery } from "@/redux/features/boost/boostAPI";
import { useRouter } from "next/navigation";

interface BoostItem {
  _id: string;
  title: string;
  image: string;
  views: number;
  boostActivatedAt: string;
  createdAt: string;
}

const BOOST_DURATION_SECONDS = 24 * 3600;

function getRemainingSeconds(boostActivatedAt: string): number {
  const activatedAt = new Date(boostActivatedAt).getTime();
  const now = Date.now();
  const elapsed = Math.floor((now - activatedAt) / 1000);
  return Math.max(0, BOOST_DURATION_SECONDS - elapsed);
}

function formatBoostDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function BoostCardSkeleton() {
  return (
    <div className='bg-white rounded-lg p-4 sm:p-5 border border-gray-200'>
      <div className='flex gap-4'>
        {/* Image skeleton */}
        <div className='flex-shrink-0'>
          <div className='w-20 sm:w-24 h-20 sm:h-24 rounded-lg bg-gray-200 animate-pulse' />
        </div>

        {/* Content skeleton */}
        <div className='flex-1 min-w-0 space-y-3'>
          {/* Title */}
          <div className='h-5 bg-gray-200 rounded animate-pulse w-3/4' />

          {/* Meta */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <div className='w-4 h-4 rounded bg-gray-200 animate-pulse flex-shrink-0' />
              <div className='h-4 bg-gray-200 rounded animate-pulse w-2/5' />
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-4 h-4 rounded bg-gray-200 animate-pulse flex-shrink-0' />
              <div className='h-4 bg-gray-200 rounded animate-pulse w-1/4' />
            </div>
          </div>

          {/* Timer */}
          <div className='h-4 bg-gray-200 rounded animate-pulse w-2/5' />
        </div>
      </div>
    </div>
  );
}

export default function BoostResultsPage() {
  const router = useRouter();
  const { data, isLoading } = useGetBoostedListQuery({});
  const boosts: BoostItem[] = data?.data || [];

  const [timers, setTimers] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (boosts.length === 0) return;
    const initial: { [key: string]: number } = {};
    boosts.forEach((boost) => {
      initial[boost._id] = getRemainingSeconds(boost.boostActivatedAt);
    });
    setTimers(initial);
  }, [boosts.length]);

  useEffect(() => {
    if (Object.keys(timers).length === 0) return;
    const interval = setInterval(() => {
      setTimers((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((key) => {
          updated[key] = Math.max(0, updated[key] - 1);
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [Object.keys(timers).length]);

  const formatTimeRemaining = (seconds: number): string => {
    if (seconds <= 0) return "Boost expired";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `Boost active for ${hours} hrs ${minutes} mins`;
  };

  return (
    <div className='bg-[#F3F4F6] h-[90vh]'>
      {/* Header */}
      <header className='sticky top-0 z-10 bg-transparent border-b border-gray-200'>
        <div className='px-4 sm:px-6 py-4 flex items-center gap-3'>
          <button
            onClick={() => router.back()}
            className='flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-lg transition-colors'
            aria-label='Go back'
          >
            <ArrowLeft size={24} className='text-gray-800' />
          </button>
          <h1 className='text-xl sm:text-2xl font-semibold text-gray-900'>
            Boost Results
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className='px-4 sm:px-6 py-6 sm:py-8 max-w-2xl'>
        {/* Description */}
        <div className='mb-6 sm:mb-8'>
          <p className='text-gray-600 text-sm sm:text-base leading-relaxed'>
            Boost keeps your post on top of the feed for 24 hours. Local
            relevance (within 25 mile)
          </p>
        </div>

        {/* Skeleton */}
        {isLoading && (
          <div className='space-y-4 sm:space-y-5'>
            {[1, 2, 3].map((i) => (
              <BoostCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Boost Results Cards */}
        {!isLoading && (
          <div className='space-y-4 sm:space-y-5'>
            {boosts.map((boost) => (
              <div
                key={boost._id}
                className='bg-white rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow'
              >
                <div className='flex gap-4'>
                  {/* Thumbnail Image */}
                  <div className='flex-shrink-0'>
                    <div className='w-20 sm:w-24 h-20 sm:h-24 rounded-lg overflow-hidden bg-gray-200'>
                      <img
                        src={boost.image}
                        alt={boost.title}
                        className='w-full h-full object-cover'
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className='flex-1 min-w-0'>
                    <h2 className='text-base sm:text-lg font-semibold text-gray-900 mb-3 break-words'>
                      {boost.title}
                    </h2>

                    <div className='space-y-2 mb-3'>
                      <div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600'>
                        <Calendar
                          size={16}
                          className='text-green-600 flex-shrink-0'
                        />
                        <span>{formatBoostDate(boost.boostActivatedAt)}</span>
                      </div>
                      <div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600'>
                        <Eye
                          size={16}
                          className='text-gray-400 flex-shrink-0'
                        />
                        <span>{boost.views} views</span>
                      </div>
                    </div>

                    {/* Active Status + View Button */}
                    <div className='flex items-center justify-between'>
                      <div className='text-xs sm:text-sm font-medium text-amber-600'>
                        {formatTimeRemaining(timers[boost._id] ?? 0)}
                      </div>
                      <button
                        onClick={() => router.push(`/my-post/${boost._id}`)}
                        className='text-xs sm:text-sm font-medium text-white bg-[#15B826] hover:bg-green-700 transition-colors px-3 py-1.5 rounded-md'
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {boosts.length === 0 && (
              <div className='text-center py-12'>
                <p className='text-gray-500 text-sm sm:text-base'>
                  No active boosts at the moment
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
