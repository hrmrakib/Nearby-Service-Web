/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useGetAttendingEventQuery } from "@/redux/features/profile/profileAPI";
import { MapPin, Star } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";

export interface IEvent {
  _id: string;
  author: string;
  image: string | null;
  media: string | null;
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  address: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  hasTag: string[];
  views: number;
  likes: number;
  endDate: string | null;
  price: string | null;
  category: string;
  subcategory: string | null;
  serviceType: string | null;
  missingName: string | null;
  missingAge: string | null;
  clothingDescription: string | null;
  lastSeenLocation: {
    type: string;
    coordinates: [number, number];
  };
  lastSeenDate: string | null;
  contactInfo: string | null;
  expireLimit: string | null;
  capacity: number | null;
  amenities: string | null;
  licenses: string | null;
  status: string;
  boost: boolean;
  attenders: {
    name: string;
    image: string;
  }[];
  isSaved: boolean;
  totalSaved: number;
  schedule: any[];
  createdAt: string;
  updatedAt: string;
}

const AttendingEvents = () => {
  const { data: attendingEvents, isLoading } =
    useGetAttendingEventQuery(undefined);

  const attending = attendingEvents?.data;

  if (isLoading) {
    return (
      <div className='space-y-8'>
        {[1, 2, 3].map((i) => (
          <Card key={i} className='overflow-hidden'>
            <Skeleton className='h-48 w-full' />
            <CardContent className='p-4 space-y-3'>
              <Skeleton className='h-6 w-2/3' />
              <Skeleton className='h-4 w-1/3' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-5/6' />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className='space-y-8'>
        {attending?.map((event: IEvent) => (
          <Card key={event._id} className='overflow-hidden py-0'>
            <div className='relative h-48'>
              <Image
                src={event?.image || "/placeholder.svg"}
                alt={event?.title}
                fill
                className='object-cover'
              />
            </div>
            <CardContent className='p-4'>
              <div className='flex items-start justify-between mb-2'>
                <h3 className='font-semibold text-[#1F2937] text-2xl'>
                  {event.title}
                </h3>
              </div>
              <div className='flex items-center gap-4 mb-3 text-sm text-[#4B5563]'>
                <MapPin className='w-4 h-4 text-[#15B826]' />
                <span>{event.address}</span>
              </div>
              <p className='text-sm text-[#4B5563] leading-relaxed'>
                {event.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AttendingEvents;
