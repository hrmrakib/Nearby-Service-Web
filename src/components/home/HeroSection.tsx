"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSelectedCategory } from "@/redux/features/post/postSlice";

export function HeroSection() {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const handleExplore = () => {
    dispatch(setSelectedCategory("event"));
    const section = document.getElementById("all-post");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className='max-h-[80vh] w-full bg-[#005865] overflow-hidden'>
      {/* Container */}
      <div className='container mx-auto py-6 md:py-0'>
        {/* Grid Layout - Mobile first */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center justify-center md:justify-between'>
          {/* Left Content */}
          <div className='flex flex-col items-center justify-center space-y-6 md:space-y-8'>
            {/* Heading */}
            <h1 className='text-center md:text-left text-3xl sm:text-5xl md:text-6xl lg:text-6xl font-bold text-white leading-tight text-balance'>
              Your Next Discovery Starts Here
            </h1>

            {/* Description */}
            <p className='text-center md:text-left text-sm sm:text-xl text-gray-100 leading-relaxed text-balance'>
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
            <div className='relative w-full flex justify-center items-center aspect-square h-full max-w-3xl shadow-3xl'>
              {/* Image Container with shadow and rounded corners */}
              {/* <div className='absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-700 rounded-3xl shadow-2xl overflow-hidden'> */}
              <Image
                src='/hero-bg.jpg'
                alt='Festival Community Event'
                // fill
                width={800}
                height={800}
                className='object-cover w-full h-[60%] rounded-3xl'
                priority
                sizes='(max-width: 1024px) 100vw, 50vw'
              />
              {/* </div> */}

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
              src='/hero-bg.jpg'
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
