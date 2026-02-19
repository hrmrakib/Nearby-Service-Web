/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useGetSavedPostQuery } from "@/redux/features/profile/profileAPI";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";

export interface IPost {
  _id: string;
  author: string;
  image: string | null;
  media: string | null;
  title: string;
  description: string;
  startDate: string;
  startTime: string | null;
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
  attenders: any[];
  isSaved: boolean;
  totalSaved: number;
  schedule: any[];
  createdAt: string;
  updatedAt: string;
}

export interface ISaved {
  _id: string;
  userId: string;
  postId: IPost;
  createdAt: string;
  updatedAt: string;
}

export default function SavedPost() {
  const { data: savedPosts, isLoading } = useGetSavedPostQuery(undefined);

  const posts = savedPosts?.data;

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
    <div className='bg-[#F3F4F6]'>
      <div className='space-y-8'>
        {posts?.length > 0 ? (
          posts.map((event: ISaved) => (
            <Card key={event._id} className='overflow-hidden py-0'>
              <div className='relative h-48'>
                <Image
                  src={event?.postId?.image || "/placeholder.svg"}
                  alt={event?.postId?.title}
                  fill
                  className='object-cover'
                />
              </div>

              <CardContent className='p-4'>
                <div className='flex items-start justify-between mb-2'>
                  <h3 className='font-semibold text-[#1F2937] text-2xl'>
                    {event?.postId?.title}
                  </h3>
                </div>

                <div className='flex items-center gap-4 mb-3 text-sm text-[#4B5563]'>
                  <MapPin className='w-4 h-4 text-[#15B826]' />
                  <span>{event?.postId?.address}</span>
                </div>

                <p className='text-sm text-[#4B5563] leading-relaxed'>
                  {event?.postId?.description}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className='text-center text-xl text-gray-500'>No Saved Post</div>
        )}
      </div>
    </div>
  );
}
