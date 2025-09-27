"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Star, MapPin } from "lucide-react";
import Image from "next/image";

export default function BoostPostPage() {
  const [isLoading, setIsLoading] = useState(false);
  const handleBoostPost = async () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert("Your post has been boosted!");
    }, 2000);
  };

  const requirements = [
    "Post must have at least 1 clear photo",
    "Complete title & description",
    "Local relevance (within 25 miles)",
  ];

  return (
    <div className='min-h-screen bg-gray-100 py-8 px-4'>
      <div className='max-w-md mx-auto space-y-6'>
        {/* Header Section */}
        <div className='text-center space-y-4'>
          <h1 className='text-2xl font-semibold text-gray-900'>Boost Post</h1>
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
            <Image
              src='/event/1.jpg'
              alt='Live Jazz Night concert with crowd'
              fill
              className='object-cover'
              priority
            />
          </div>

          <div className='p-4 space-y-3'>
            <h3 className='text-lg font-medium text-gray-900'>
              Live Jazz Night
            </h3>

            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-1'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-4 h-4 fill-green-500 text-green-500'
                  />
                ))}
                <span className='text-sm text-gray-600 ml-1'>4.9</span>
              </div>

              <div className='flex items-center gap-1 text-gray-600'>
                <MapPin className='w-4 h-4' />
                <span className='text-sm'>2.3 miles</span>
              </div>
            </div>

            <Button
              onClick={handleBoostPost}
              disabled={isLoading}
              className='w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors'
            >
              {isLoading ? "Boosting..." : "Boost Now - $5"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
