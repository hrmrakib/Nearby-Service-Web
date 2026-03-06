/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Star, MapPin, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useGetPostDetailByIdQuery } from "@/redux/features/post/postAPI";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import { useCreateBoostPaymentIntentMutation } from "@/redux/features/boost/boostAPI";
import getDistanceMiles from "@/utils/getDistanceMiles";
import { useAuth } from "@/hooks/useAuth.ts";
import { toast } from "sonner";

export default function BoostPostPage() {
  const id = useParams().id as string;
  const router = useRouter();
  const { userLat, userLng } = useAuth();

  const { data, isLoading } = useGetPostDetailByIdQuery(id);
  const [createBoastPaymentIntentMutationm, { isLoading: boostLoading }] =
    useCreateBoostPaymentIntentMutation();
  const postDetail = data?.data?.detail;

  const handleBoostPost = async () => {
    try {
      const res = await createBoastPaymentIntentMutationm({
        offerId: id,
        amount: 5,
      }).unwrap();

      if (res?.url) {
        window.open(res?.url, "_blank");
      }
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  };

  const requirements = [
    "Post must have at least 1 clear photo",
    "Complete title & description",
    "Local relevance (within 50 miles)",
  ];

  if (isLoading) {
    return <LoadingSpinner text='Boastable post' />;
  }

  return (
    <div className='min-h- bg-transparent py-8 px-4'>
      <div className='max-w-md mx-auto space-y-6'>
        {/* Header Section */}
        <div className='relative text-center space-y-4'>
          <h1 className='text-2xl font-semibold text-gray-900'>
            <ArrowLeft
              className='absolute top-2 left-2 w-6 h-6 cursor-pointer'
              size={15}
              onClick={() => router.back()}
            />{" "}
            Boost Post
          </h1>
          <p className='text-gray-600 leading-relaxed'>
            Boost keeps your post on top of the feed for 24 hours. Flat fee: $5.
          </p>
        </div>

        {/* Requirements Section */}
        <div className='space-y-3'>
          {requirements.map((requirement, index) => (
            <div key={index} className='flex items-center gap-3'>
              <div className='flex-shrink-0'>
                <Check className='w-5 h-5 text-green-500' />
              </div>
              <span className='text-gray-700 text-sm'>{requirement}</span>
            </div>
          ))}
        </div>

        {/* Post Preview Card */}
        <Card className='overflow-hidden bg-white shadow-sm py-0'>
          <div className='relative aspect-[4/3] w-full'>
            {postDetail?.image && (
              <Image
                src={postDetail?.image}
                alt='Live Jazz Night concert with crowd'
                fill
                className='object-cover'
                priority
              />
            )}
          </div>

          <div className='p-4 space-y-3'>
            <h3 className='text-lg font-medium text-gray-900'>
              {postDetail?.title}
            </h3>

            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-1'>
                {[...Array(postDetail?.averageRating || 0)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-4 h-4 fill-green-500 text-green-500'
                  />
                ))}
                <span className='text-sm text-gray-600 ml-1'>
                  {postDetail?.averageRating}
                </span>
              </div>

              <div className='flex items-center gap-1 text-gray-600'>
                <MapPin className='w-4 h-4 text-[#108F1E]' />
                <span className='text-sm'>
                  {getDistanceMiles(
                    userLat!,
                    userLng!,
                    postDetail?.location?.coordinates[1],
                    postDetail?.location?.coordinates[0],
                  ).toFixed(1)}{" "}
                  miles
                </span>
              </div>
            </div>

            <Button
              onClick={handleBoostPost}
              disabled={boostLoading || postDetail?.boost}
              className='w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors'
            >
              {boostLoading
                ? "Processing Payment..."
                : postDetail?.boost
                  ? "Already Boosted"
                  : "Boost Post · $5"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
