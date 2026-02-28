/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const PREVIEW_WORDS = 30;

const AboutEvent = ({ postDetail }: any) => {
  const [expanded, setExpanded] = React.useState<boolean>(false);

  const words = postDetail?.description?.split(" ") ?? [];
  const isLong = words.length > PREVIEW_WORDS;
  const displayText =
    expanded || !isLong
      ? postDetail?.description
      : words.slice(0, PREVIEW_WORDS).join(" ") + "...";

  return (
    <Card className='bg-white p-6 border-none'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-bold mb-4'>About the Event</h2>
        <div className='flex items-center gap-2'>
          <div className='flex flex-col items-end'>
            <p className='text-sm text-[#1F2937] font-bold'>
              {postDetail?.author?.name || "N/A"}
            </p>
            <p className='text-xs text-[#4B5563]'>Post by:</p>
          </div>
          <Avatar className='w-10 h-10 flex-shrink-0'>
            <AvatarImage src={postDetail?.author?.image} />
            <AvatarFallback>CV</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className='flex gap-4'>
        <div className='flex-1'>
          <p className='text-sm text-[#374151] leading-relaxed'>
            {displayText || "No description"}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded((prev) => !prev)} // ✅ fixed
              className='text-[#108F1E] font-semibold text-sm mt-3 hover:underline'
            >
              {expanded ? "See less" : "See more"}
            </button>
          )}
        </div>
      </div>

      <div>
        <p className='text-sm text-[#374151]'>
          Entry:{" "}
          <span className='font-bold text-[#1F2937]'>
            {postDetail?.price ? "$" + postDetail.price : "Free"}
          </span>
        </p>
      </div>
    </Card>
  );
};

export default AboutEvent;
