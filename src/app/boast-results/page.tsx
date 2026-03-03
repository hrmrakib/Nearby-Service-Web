/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Eye } from "lucide-react";

interface BoostResult {
  id: string;
  title: string;
  image: string;
  date: string;
  views: number;
}

export default function BoostResultsPage() {
  const [boosts, setBoosts] = useState<BoostResult[]>([
    {
      id: "1",
      title: "Cozy Coffee Spot",
      image:
        "https://images.unsplash.com/photo-1442512595331-e89e90e38fe0?w=400&h=300&fit=crop",
      date: "January 19, 2026",
      views: 120,
    },
    {
      id: "2",
      title: "DJ Performance",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      date: "January 19, 2026",
      views: 120,
    },
  ]);

  const [timers, setTimers] = useState<{ [key: string]: number }>({
    "1": 11 * 3600,
    "2": 11 * 3600,
  });

  useEffect(() => {
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
  }, []);

  const formatTimeRemaining = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `Boost active for ${hours} hrs ${minutes} mins`;
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className='bg-[#F3F4F6] h-[90vh]'>
      {/* Header */}
      <header className='sticky top-0 z-10 bg-transparent border-b border-gray-200'>
        <div className='px-4 sm:px-6 py-4 flex items-center gap-3'>
          <button
            onClick={handleBack}
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

        {/* Boost Results Cards */}
        <div className='space-y-4 sm:space-y-5'>
          {boosts.map((boost) => (
            <div
              key={boost.id}
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
                  {/* Title */}
                  <h2 className='text-base sm:text-lg font-semibold text-gray-900 mb-3 break-words'>
                    {boost.title}
                  </h2>

                  {/* Meta Information */}
                  <div className='space-y-2 mb-3'>
                    {/* Date */}
                    <div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600'>
                      <Calendar
                        size={16}
                        className='text-green-600 flex-shrink-0'
                      />
                      <span>{boost.date}</span>
                    </div>

                    {/* Views */}
                    <div className='flex items-center gap-2 text-xs sm:text-sm text-gray-600'>
                      <Eye size={16} className='text-gray-400 flex-shrink-0' />
                      <span>{boost.views} views</span>
                    </div>
                  </div>

                  {/* Active Status */}
                  <div className='text-xs sm:text-sm font-medium text-amber-600'>
                    {formatTimeRemaining(timers[boost.id])}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State Message */}
        {boosts.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-sm sm:text-base'>
              No active boosts at the moment
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
