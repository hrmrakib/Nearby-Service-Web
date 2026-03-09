/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  MapPin,
  ChevronRight,
  Calendar,
  Bell,
  Scissors,
  Zap,
  Tag,
} from "lucide-react";
import Image from "next/image";
import { useSuggestionPostQuery } from "@/redux/features/post/postAPI";
import Link from "next/link";
import getDistanceMiles from "@/utils/getDistanceMiles";
import { useAuth } from "@/hooks/useAuth.ts";

const categoryColors: Record<string, string> = {
  service: "bg-teal-100 text-teal-700",
  event: "bg-purple-100 text-purple-700",
  deal: "bg-amber-100 text-amber-700",
  alert: "bg-red-100 text-red-700",
};

const categoryIcons: Record<string, React.ReactNode> = {
  service: <Scissors size={14} />,
  event: <Calendar size={14} />,
  deal: <Zap size={14} />,
  alert: <Bell size={14} />,
};

function formatSectionTitle(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const SECTIONS = [
  "trendingServices",
  "upcomingEvents",
  "nearestDeals",
  "alerts",
] as const;

const INITIAL_COUNT = 4;

export function SuggestedPost() {
  const { userLat, userLng } = useAuth();
  const { data, isLoading, isError } = useSuggestionPostQuery({});
  const [showAllMap, setShowAllMap] = useState<Record<string, boolean>>({});

  if (isLoading) {
    return (
      <div className='space-y-4'>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className='bg-white rounded-2xl border border-gray-100 h-48 animate-pulse'
          />
        ))}
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <div className='bg-white rounded-2xl border border-red-100 px-5 py-8 text-center text-red-400 text-sm'>
        Failed to load data. Please try again.
      </div>
    );
  }

  return (
    <div className='space-y-5'>
      {SECTIONS.map((sectionKey) => {
        const items = (data.data[sectionKey] as any[]) ?? [];
        if (!items.length) return null;

        const showAll = showAllMap[sectionKey] ?? false;
        const displayed = showAll ? items : items.slice(0, INITIAL_COUNT);

        return (
          <div
            key={sectionKey}
            className='max-w-[55%] bg-white rounded-2xl shadow-sm overflow-hidden'
          >
            {/* Section Header */}
            <div className='px-5 py-4 border-b border-gray-100 flex items-center justify-between'>
              <h2 className='text-base font-bold text-gray-900'>
                {formatSectionTitle(sectionKey)}
              </h2>
              <span className='text-xs text-gray-400 font-medium'>
                {items.length} item{items.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Items */}
            <div className='divide-y divide-gray-50'>
              {displayed.map((item) => {
                const catColor =
                  categoryColors[item.category] ?? "bg-gray-100 text-gray-600";
                const catIcon = categoryIcons[item.category] ?? (
                  <Tag size={14} />
                );

                return (
                  <Link
                    href={`/event/${item._id}`}
                    key={item._id}
                    className='flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors'
                  >
                    {/* Thumbnail */}
                    <div className='flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gray-100'>
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={64}
                          height={64}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center text-gray-300 text-xs'>
                          No img
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className='flex-1 min-w-0'>
                      {/* <span
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1 ${catColor}`}
                      >
                        {catIcon}
                        {item.subcategory ?? item.category}
                      </span> */}
                      {item.startDate && (
                        <span className='flex items-center gap-1.5 text-xs!'>
                          <Calendar size={11} />
                          {formatDate(item.startDate)}
                        </span>
                      )}
                      <h3 className='text-sm font-semibold text-gray-900 truncate leading-snug'>
                        {item.title}
                      </h3>
                      <div className='flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs text-gray-500'>
                        {item.location && (
                          <span className='flex items-center gap-0.5 text-teal-600'>
                            <MapPin size={11} />
                            <span className='truncate max-w-[120px]'>
                              {/* {item.address} */}
                              {getDistanceMiles(
                                userLat!,
                                userLng!,
                                item?.location?.coordinates[1],
                                item?.location?.coordinates[0],
                              ).toFixed(1)}{" "}
                              miles
                            </span>
                          </span>
                        )}

                        {item.price != null && (
                          <span className='font-medium text-gray-700'>
                            ${item.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* See More / Less */}
            {items.length > INITIAL_COUNT && (
              <div className='px-5 py-3 border-t border-gray-100'>
                <button
                  onClick={() =>
                    setShowAllMap((prev) => ({
                      ...prev,
                      [sectionKey]: !showAll,
                    }))
                  }
                  className='flex items-center gap-1 text-teal-600 hover:text-teal-700 text-sm font-semibold transition-colors'
                >
                  {showAll ? "Show Less" : `See All ${items.length}`}
                  <ChevronRight
                    size={15}
                    className={`transition-transform ${showAll ? "rotate-90" : ""}`}
                  />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ("use client");

// import { useState } from "react";
// import { MapPin, ChevronRight } from "lucide-react";
// import Image from "next/image";
// import { useSuggestionPostQuery } from "@/redux/features/post/postAPI";

interface Event {
  id: string;
  title: string;
  image: string;
  date: string;
  distance: number;
}

export function SuggestedPost2() {
  const [expanded, setExpanded] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const { data } = useSuggestionPostQuery({});

  console.log(data);

  const allEvents: Event[] = [
    {
      id: "1",
      title: "Cozy Coffee Spot",
      image:
        "https://images.unsplash.com/photo-1442512595331-e89e90e38fe0?w=400&h=300&fit=crop",
      date: "Sept 25",
      distance: 2.3,
    },
    {
      id: "2",
      title: "Cozy Coffee Spot",
      image:
        "https://images.unsplash.com/photo-1442512595331-e89e90e38fe0?w=400&h=300&fit=crop",
      date: "Sept 25",
      distance: 2.3,
    },
    {
      id: "3",
      title: "Cozy Coffee Spot",
      image:
        "https://images.unsplash.com/photo-1442512595331-e89e90e38fe0?w=400&h=300&fit=crop",
      date: "Sept 25",
      distance: 2.3,
    },
    {
      id: "4",
      title: "Cozy Coffee Spot",
      image:
        "https://images.unsplash.com/photo-1442512595331-e89e90e38fe0?w=400&h=300&fit=crop",
      date: "Sept 25",
      distance: 2.3,
    },
    {
      id: "5",
      title: "Jazz Night at Blue Note",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      date: "Sept 25",
      distance: 3.1,
    },
    {
      id: "6",
      title: "Sunset Park Yoga Session",
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop",
      date: "Sept 25",
      distance: 1.8,
    },
  ];

  const displayedEvents = showAllEvents ? allEvents : allEvents.slice(0, 4);

  const handleSeeMore = () => {
    setShowAllEvents(!showAllEvents);
    setExpanded(!expanded);
  };

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='max-w-full'>
        {/* Tomorrow's Events Card */}
        <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
          {/* Card Header */}
          <div className='px-6 sm:px-8 py-5 sm:py-6 border-b border-gray-200'>
            <h2 className='text-lg sm:text-xl font-semibold text-gray-900'>
              Tomorrow&apos;s Events
            </h2>
          </div>

          {/* Events List */}
          <div className='divide-y divide-gray-100'>
            {displayedEvents.map((event) => (
              <div
                key={event.id}
                className='px-3 sm:px-6 py-2 sm:py-5 hover:bg-gray-50 transition-colors'
              >
                <div className='flex gap-4'>
                  {/* Event Image */}
                  <div className='flex-shrink-0'>
                    <div className='w-16 sm:w-18 h-16 sm:h-18 rounded-lg overflow-hidden bg-gray-200'>
                      <Image
                        src={"/event/1.jpg"}
                        alt={event.title}
                        className='w-full h-full object-cover'
                        width={400}
                        height={300}
                      />
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className='flex-1 min-w-0'>
                    {/* Date Badge */}
                    <div className='text-xs sm:text-sm font-semibold text-teal-600 mb-1'>
                      {event.date}
                    </div>

                    {/* Title */}
                    <h3 className='text-sm sm:text-base font-semibold text-gray-900 mb-2 break-words'>
                      {event.title}
                    </h3>

                    {/* Distance */}
                    <div className='flex items-center gap-1.5 text-xs sm:text-sm text-teal-600'>
                      <MapPin
                        size={16}
                        className='flex-shrink-0 text-[#108F1E]'
                      />
                      <span>{event.distance} miles</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* See More Button */}
          <div className='px-6 sm:px-8 py-4 sm:py-5 border-t border-gray-200'>
            <button
              onClick={handleSeeMore}
              className='text-teal-600 hover:text-teal-700 font-semibold text-sm sm:text-base flex items-center gap-1 transition-colors'
            >
              {showAllEvents ? "Show Less" : "See More"}
              <ChevronRight
                size={16}
                className={`transition-transform ${expanded ? "rotate-90" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Quick Info */}
        <div className='mt-6 text-center text-gray-600 text-sm'>
          <p>
            Showing {displayedEvents.length} of {allEvents.length} events for
            tomorrow
          </p>
        </div>
      </div>
    </div>
  );
}
