/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { useGetMyPostQuery } from "@/redux/features/profile/profileAPI";

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
  location: { type: string; coordinates: [number, number] };
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
  lastSeenLocation: { type: string; coordinates: [number, number] };
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

const MyPost = () => {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<IPost[]>([]);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const limit = 4;

  const { data, isLoading, isFetching } = useGetMyPostQuery(
    { page, limit },
    { refetchOnMountOrArgChange: false }
  );

  useEffect(() => {
    if (data?.data && data.data.length > 0) {
      setAllPosts((prev) => {
        const newItems = data.data.filter(
          (post: IPost) => !prev.some((p) => p._id === post._id)
        );
        return [...prev, ...newItems];
      });
    }
  }, [data]);

  // Smoothest Infinity Scroll — IntersectionObserver
  useEffect(() => {
    if (isFetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && data?.data?.length > 0) {
          setPage((prev) => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: "20px", // preload early
        threshold: 0.1,
      }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [isFetching, data?.data]);

  // First load skeleton
  if (isLoading && page === 1) {
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
    <div className='space-y-8'>
      {allPosts.map((post) => (
        <div key={post._id}>
          <Card className='overflow-hidden py-0'>
            <div className='relative h-48'>
              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                fill
                className='object-cover'
              />
            </div>
            <CardContent className='p-4'>
              <div className='flex items-start justify-between mb-2'>
                <h3 className='font-semibold text-[#1F2937] text-2xl'>
                  {post.title}
                </h3>
              </div>
              <div className='flex items-center gap-2.5 mb-3 text-sm text-[#4B5563]'>
                <div className='w-6 h-6'>
                  <MapPin className='w-4 h-4 text-[#15B826]' />
                </div>
                <p>{post.address}</p>
              </div>

              <p className='text-sm text-[#4B5563] leading-relaxed'>
                {post.description}
              </p>
            </CardContent>
          </Card>
        </div>
      ))}

      {/* Loader when fetching next pages */}
      {isFetching && (
        <div className='space-y-8 mt-6'>
          {[1, 2].map((i) => (
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
      )}

      {/* 🔥 Invisible Trigger for Smooth Infinite Scroll */}
      <div ref={loaderRef} className='h-10'></div>
    </div>
  );
};

export default MyPost;
