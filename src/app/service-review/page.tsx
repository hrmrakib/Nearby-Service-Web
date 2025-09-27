"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star, MapPin } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ReviewPage() {
  const router = useRouter();
  const [rating, setRating] = useState(3); // Default to 3 stars as shown in image
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarClick = (starIndex: number) => {
    setRating(starIndex + 1);
  };

  const handleSubmitReview = async () => {
    setIsSubmitting(true);

    // Simulate review submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Review submitted successfully!");
      // Navigate back to main page or success page
      router.push("/");
    }, 1500);
  };

  const handleSkip = () => {
    router.push("/");
  };

  return (
    <div className='min-h-screen bg-[#F3F4F6] py-8 px-4'>
      <div className='container mx-auto'>
        <h1 className='text-2xl font-semibold text-[#030712]'>Review</h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Side - Review Form */}
          <div className='space-y-6 lg:col-span-2'>
            {/* Star Rating */}
            <div className='flex items-center justify-center gap-2 py-4'>
              {[...Array(5)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleStarClick(index)}
                  className='transition-colors hover:scale-110 transform'
                >
                  <Star
                    className={`w-8 h-8 ${
                      index < rating
                        ? "fill-green-500 text-green-500"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Review Text Area */}
            <div className='space-y-3 bg-white p-4 rounded-lg shadow-sm'>
              <Textarea
                placeholder='Write a review'
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className='min-h-[120px] resize-none border-gray-200 focus:border-[#15B826] focus:ring-[#15B826]'
              />
            </div>

            {/* Action Buttons */}
            <div className='w-1/2 mx-auto space-y-3 pt-4'>
              <Button
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                className='w-full h-12 bg-[#15B826] hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 rounded-lg transition-colors'
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>

              <Button
                onClick={handleSkip}
                variant='outline'
                className='w-full h-12 border-[#15B826] text-[#15B826] hover:bg-green-50 font-medium py-3 rounded-lg transition-colors bg-transparent'
              >
                Skip
              </Button>
            </div>
          </div>

          {/* Right Side - Event Card */}
          <div className='lg:sticky lg:top-8 h-fit mt-20 lg:mt-16'>
            <Card className='overflow-hidden bg-white shadow-sm py-0'>
              <div className='relative aspect-[4/3] w-full h-44'>
                <Image
                  src='/event/1.jpg'
                  alt='Live Jazz Night concert with crowd'
                  fill
                  className='object-cover'
                  priority
                />
              </div>

              <div className='p-6 space-y-4'>
                <h3 className='text-xl font-medium text-[#030712]'>
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
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
