import React from "react";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const AboutEvent = () => {
  return (
    <Card className='bg-white p-6 border-none'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-bold mb-4'>About the Event</h2>
        <div className='flex items-center gap-2'>
          <div className='flex flex-col items-end'>
            <p className='text-sm text-[#1F2937] font-bold'>Jacob Jones</p>
            <p className='text-xs text-[#4B5563]'>Post by:</p>
          </div>
          <Avatar className='w-10 h-10 flex-shrink-0'>
            <AvatarImage src='/user.png' />
            <AvatarFallback>CV</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className='flex gap-4'>
        <div className='flex-1'>
          <p className='text-sm text-[#374151] leading-relaxed'>
            Join us for an unforgettable evening of live music at Casa Verde.
            Experience exceptional local talent in an intimate setting with
            premium acoustics. Whether you&apos;re a music enthusiast or looking
            for a unique night out, this event promises an engaging experience.
          </p>
          <button className='text-[#108F1E] font-semibold text-sm mt-3 hover:underline'>
            Read more
          </button>
        </div>
      </div>
      <div className=''>
        <p className='text-xs text-[#374151]'>
          Entry:{" "}
          <span className='font-bold font-base text-[#1F2937]'> Free</span>
        </p>
      </div>
    </Card>
  );
};

export default AboutEvent;
