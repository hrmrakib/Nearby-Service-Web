"use client";

export default function UnlockNextJurnee() {
  return (
    <>
      <div className='flex items-end justify-end mt-6 lg:mt-12'>
        <div className='p-8 w-full max-w-sm bg-[#F3FFF4] flex flex-col items-center text-center rounded-2xl gap-5 shadow-lg'>
          {/* Title */}
          <h2 className='text-2xl font-bold text-[#1F2937] leading-snug'>
            Unlock Your Next Jurnee
          </h2>

          {/* Description */}
          <p className='text-gray-500 text-sm sm:text-base leading-relaxed max-w-xs'>
            Explore hundreds of unique events and services tailored to your
            interests. Your next unforgettable experience is just a click away.
          </p>

          {/* CTA Button */}
          <button
            className={`bg-[#15B826] text-white w-2/3 py-4 px-6 flex items-center justify-center rounded-2xl gap-2`}
          >
            Discover More
          </button>
        </div>
      </div>
    </>
  );
}
