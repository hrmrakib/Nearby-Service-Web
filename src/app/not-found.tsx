/* eslint-disable @next/next/no-img-element */
import React from "react";
import "./globals.css";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className='relative boxShadow px-10 w-full lg:flex-row gap-[30px] lg:gap-0 flex-col flex items-center justify-evenly  rounded-xl'>
      <div className='w-[80%] lg:w-[40%]'>
        <img
          src='https://i.ibb.co/HdHH4Pb/Frame-6.png'
          alt='illustration'
          className='w-full'
        />
      </div>

      <div className='w-full lg:w-[30%] text-center lg:text-start'>
        <h1 className='text-[2.5rem] dark:text-{#abc2d3] sm:text-[4rem] font-[800] text-[#566FA7] leading-[80px]'>
          OOPS!
        </h1>

        <h3 className='text-[#8093B8] dark:text-slate-400 text-[0.9rem] sm:text-[1.2rem]'>
          Looks like big foot has broken the link
        </h3>

        <Link href='/'>
          <button className='py-3 px-6 sm:px-8 text-[0.9rem] sm:text-[1rem] rounded-full bg-[#566FA7] text-white mt-8 cursor-pointer'>
            Back to homepage
          </button>
        </Link>
      </div>

      <div className='absolute top-0 right-0 flex items-center gap-4'>
        <img
          src='https://i.ibb.co/HdHH4Pb/Frame-6.png'
          alt='illustration'
          className='w-6'
        />
        <img
          src='https://i.ibb.co/HdHH4Pb/Frame-6.png'
          alt='illustration'
          className='w-6'
        />
      </div>
    </div>
  );
};

export default NotFound;
