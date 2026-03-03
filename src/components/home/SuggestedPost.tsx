"use client";

import { useState } from "react";
import { MapPin, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useSuggestionPostQuery } from "@/redux/features/post/postAPI";

interface Event {
  id: string;
  title: string;
  image: string;
  date: string;
  distance: number;
}

export function SuggestedPost() {
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
                      <MapPin size={16} className='flex-shrink-0' />
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
