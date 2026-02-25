"use client";

import { useGetMomentsQuery } from "@/redux/features/moments/momentsAPI";
import Image from "next/image";
import { useState } from "react";

type FilterType = "all" | "owner" | "community";

const VISIBLE_TAGS = 3;

function isVideoUrl(url: string) {
  return (
    url.includes("/video/") ||
    url.endsWith(".mp4") ||
    url.endsWith(".mov") ||
    url.endsWith(".webm")
  );
}

export default function MomentsSection() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [lightbox, setLightbox] = useState<{
    url: string;
    index: number;
  } | null>(null);
  const [showAllTags, setShowAllTags] = useState(false);
  const [tab, setTab] = useState("all");

  const { data, isFetching } = useGetMomentsQuery({
    id: "699c1df44bdd6c4865a77fa2",
    params: tab,
  });

  const moments = data?.data;
  const media: string[] = moments?.media ?? [];

  const hashtags = data?.data?.postInfo?.hasTag ?? [];

  const visibleTags = showAllTags ? hashtags : hashtags.slice(0, VISIBLE_TAGS);
  const hiddenCount = hashtags.length - VISIBLE_TAGS;

  const openLightbox = (index: number) =>
    setLightbox({ url: media[index], index });
  const closeLightbox = () => setLightbox(null);
  const goPrev = () => {
    if (!lightbox) return;
    const prevIndex = (lightbox.index - 1 + media.length) % media.length;
    setLightbox({ url: media[prevIndex], index: prevIndex });
  };
  const goNext = () => {
    if (!lightbox) return;
    const nextIndex = (lightbox.index + 1) % media.length;
    setLightbox({ url: media[nextIndex], index: nextIndex });
  };

  return (
    <div className='bg-gray-100 flex items-center justify-center'>
      <div className='w-full bg-white rounded-2xl shadow-sm p-5 sm:p-6'>
        {/* Header */}
        <div className='flex items-start justify-between mb-1'>
          <div>
            <h2 className='text-xl font-bold text-gray-900 tracking-tight'>
              Moments
            </h2>
            <p className='text-sm text-gray-500 mt-0.5'>
              Photos & Videos From this Event
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className='flex gap-2 mt-4 mb-5'>
          {(["all", "owner", "community"] as FilterType[]).map((f) => (
            <button
              key={f}
              disabled={isFetching}
              onClick={() => {
                setFilter(f);
                setTab(f);
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all duration-150 active:scale-95 border
                ${
                  filter === f
                    ? "bg-green-500 text-white border-green-500 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isFetching && (
          <div className='flex flex-col items-center justify-center py-12 text-gray-400'>
            <svg
              className='animate-spin'
              width='32'
              height='32'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.5'
            >
              <path d='M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83' />
            </svg>
            <p className='mt-3 text-sm'>Loading media...</p>
          </div>
        )}

        {/* Empty state */}
        {!isFetching && media.length === 0 && (
          <div className='flex flex-col items-center justify-center py-12 text-gray-400'>
            <svg
              width='40'
              height='40'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.5'
            >
              <rect x='3' y='3' width='18' height='18' rx='2' />
              <circle cx='8.5' cy='8.5' r='1.5' />
              <polyline points='21 15 16 10 5 21' />
            </svg>
            <p className='mt-3 text-sm'>No media found</p>
          </div>
        )}

        {/* Media grid */}
        {!isFetching && media.length > 0 && (
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3'>
            {media.map((url, index) => {
              const isVideo = isVideoUrl(url);
              return (
                <button
                  key={index}
                  onClick={() => openLightbox(index)}
                  className='relative aspect-square rounded-xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                >
                  {isVideo ? (
                    <>
                      <video
                        src={url}
                        className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                        muted
                        playsInline
                        preload='metadata'
                      />
                      <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                        <div className='bg-black/50 rounded-full p-2.5'>
                          <svg
                            width='18'
                            height='18'
                            viewBox='0 0 24 24'
                            fill='white'
                          >
                            <polygon points='5 3 19 12 5 21 5 3' />
                          </svg>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Image
                      src={url}
                      alt={`Media ${index + 1}`}
                      className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                      fill
                    />
                  )}
                  <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-xl' />
                </button>
              );
            })}
          </div>
        )}

        {/* Hashtags */}
        <div className='flex flex-wrap gap-2 mt-5'>
          {visibleTags.map((tag: string, i: number) => (
            <span
              key={i}
              className='px-3 py-1 rounded-full border border-green-200 bg-green-50 text-green-700 text-sm font-medium cursor-pointer hover:bg-green-100 transition-colors'
            >
              #{tag}
            </span>
          ))}
          {!showAllTags && hiddenCount > 0 && (
            <button
              onClick={() => setShowAllTags(true)}
              className='px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-gray-500 text-sm font-medium hover:bg-gray-100 transition-colors'
            >
              +{hiddenCount} More
            </button>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className='fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm'
          onClick={closeLightbox}
        >
          <div
            className='relative w-full max-w-3xl max-h-[90vh] flex items-center justify-center'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className='absolute top-3 right-3 z-10 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors'
              aria-label='Close'
            >
              ✕
            </button>

            {/* Media */}
            {isVideoUrl(lightbox.url) ? (
              <video
                key={lightbox.url}
                src={lightbox.url}
                className='max-w-full max-h-[80vh] rounded-xl object-contain'
                controls
                autoPlay
                playsInline
              />
            ) : (
              <div className='relative w-full h-[80vh] rounded-xl overflow-hidden'>
                <Image
                  src={lightbox.url}
                  alt={`Media ${lightbox.index + 1}`}
                  className='object-contain'
                  fill
                />
              </div>
            )}

            {/* Prev */}
            {media.length > 1 && (
              <button
                onClick={goPrev}
                className='absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors text-lg'
                aria-label='Previous'
              >
                ‹
              </button>
            )}

            {/* Next */}
            {media.length > 1 && (
              <button
                onClick={goNext}
                className='absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors text-lg'
                aria-label='Next'
              >
                ›
              </button>
            )}

            {/* Counter */}
            <div className='absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full'>
              {lightbox.index + 1} / {media.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
