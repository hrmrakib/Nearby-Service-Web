"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

export function HeroSection() {
  const [isHovered, setIsHovered] = useState(false);

  const handleExplore = () => {
    // Implement your navigation logic here
    console.log("Exploring events...");
    // Example: router.push('/events')
  };

  return (
    <section className='min-h-[94vh] w-full bg-[#005865] overflow-hidden'>
      {/* Container */}
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-28'>
        {/* Grid Layout - Mobile first */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center'>
          {/* Left Content */}
          <div className='flex flex-col justify-center space-y-6 md:space-y-8'>
            {/* Heading */}
            <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold text-white leading-tight text-balance'>
              Your Next Discovery Starts Here
            </h1>

            {/* Description */}
            <p className='text-lg sm:text-xl text-gray-100 leading-relaxed max-w-lg text-balance'>
              Uncover local gems, connect with your community, and make every
              day an adventure. Jurnee helps you find events, deals, and
              services tailored to your interests.
            </p>

            {/* CTA Button */}
            <div className='pt-2'>
              <button
                onClick={handleExplore}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className='inline-flex items-center gap-2 px-8 py-3 sm:px-10 sm:py-4 bg-[#15B826] hover:bg-[#0ac01d] text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
                aria-label='Explore Events'
              >
                Explore Events
                <ChevronRight
                  size={20}
                  className={`transition-transform duration-300 ${
                    isHovered ? "translate-x-1" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Right Image - Hidden on mobile, visible on lg */}
          <div className='hidden lg:flex justify-center items-center'>
            <div className='relative w-full aspect-square max-w-lg'>
              {/* Image Container with shadow and rounded corners */}
              <div className='absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-700 rounded-3xl shadow-2xl overflow-hidden'>
                <Image
                  src='/hero-bg.jpg'
                  alt='Festival Community Event'
                  fill
                  className='object-cover w-full h-full'
                  priority
                  sizes='(max-width: 1024px) 100vw, 50vw'
                />
              </div>

              {/* Decorative accent */}
              <div className='absolute -bottom-4 -right-4 w-32 h-32 bg-white/5 rounded-full blur-3xl'></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Image - Visible only on mobile */}
      <div className='lg:hidden px-4 sm:px-6 pb-12 sm:pb-16'>
        <div className='relative w-full aspect-video'>
          <div className='absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl shadow-2xl overflow-hidden'>
            <Image
              src='/festival-outdoor-event-girl-community-gathering-co.jpg'
              alt='Festival Community Event'
              fill
              className='object-cover w-full h-full'
              priority
              sizes='100vw'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
