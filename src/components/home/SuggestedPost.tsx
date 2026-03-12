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
                    <div className='flex-1 min-w-0 space-y-1.5'>
                      {item?.startDate && (
                        <span className='flex items-center gap-1.5 text-xs!'>
                          <Calendar size={11} />
                          {formatDate(item?.startDate)}
                        </span>
                      )}

                      <h3 className='text-sm font-semibold text-[#374151] truncate leading-snug'>
                        {item.title}
                      </h3>
                      <div className='flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs text-gray-500'>
                        {item.location && (
                          <span className='flex items-center gap-0.5 text-[#374151 ]'>
                            {/* <MapPin size={11} /> */}
                            <span className='truncate max-w-[120px] text-[#374151]'>
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
