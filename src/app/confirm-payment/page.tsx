"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, MapPin } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { NavigationHeader } from "@/components/NavigationHeader";

export default function ConfirmPaymentPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmPayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      router.push("/service-review");
    }, 2000);
  };

  return (
    <div className='min-h-screen bg-[#F3F4F6] py-8 px-4'>
      <div className='max-w-6xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Left Side - Payment Confirmation */}
          <div className='space-y-6'>
            <NavigationHeader title='Confirm Payment' />

            <h1 className='text-2xl font-semibold text-[#030712]'>
              Confirm Payment
            </h1>

            {/* Order Summary Card */}
            <Card className='p-6 bg-white space-y-4'>
              <div className='text-lg font-medium text-green-600 mb-4'>
                Order Summary
              </div>

              <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <span className='text-[#030712]'>Service Price</span>
                  <span className='font-medium text-[#030712]'>200.00</span>
                </div>

                <div className='flex justify-between items-center'>
                  <span className='text-[#030712]'>Jurnee fee</span>
                  <span className='font-medium text-[#030712]'>3.00</span>
                </div>

                <hr className='border-gray-200' />

                <div className='flex justify-between items-center text-lg font-semibold'>
                  <span className='text-[#030712]'>Total</span>
                  <span className='text-[#030712]'>$203.00</span>
                </div>
              </div>
            </Card>

            {/* Payment Button */}
            <div className='flex justify-center pt-4'>
              <Button
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className='bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-12 rounded-lg transition-colors'
              >
                {isProcessing ? "Processing..." : "Confirm & Pay"}
              </Button>
            </div>
          </div>

          {/* Right Side - Event Card */}
          <div className='lg:sticky lg:top-8 h-fit'>
            <Card className='overflow-hidden bg-white shadow-sm py-0'>
              <div className='relative aspect-[4/3] w-full'>
                <Image
                  src='/event/2.jpg'
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

                <div className='space-y-3 pt-2'>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Location</span>
                    <span className='font-medium text-[#030712]'>
                      123 Maple Street
                    </span>
                  </div>

                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Start From</span>
                    <span className='font-medium text-[#030712]'>$200</span>
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
