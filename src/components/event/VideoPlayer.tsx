"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface VideoData {
  id: number;
  title: string;
  category: string;
  distance: string;
  rating: number;
  totalRatings: number;
  views: number;
  likes: number;
  author: string;
  authorAvatar: string;
  videoSrc: string;
  posterSrc: string;
}

const videos: VideoData[] = [
  {
    id: 1,
    title: "DJ Performance",
    category: "Entertainment",
    distance: "0.8 mi",
    rating: 4.7,
    totalRatings: 5,
    views: 20,
    likes: 4,
    author: "Darrell Steward",
    authorAvatar: "https://i.pravatar.cc/40?img=47",
    videoSrc:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    posterSrc:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&q=80",
  },
  {
    id: 2,
    title: "Live Concert",
    category: "Music",
    distance: "1.2 mi",
    rating: 4.5,
    totalRatings: 5,
    views: 35,
    likes: 12,
    author: "Jessica Parker",
    authorAvatar: "https://i.pravatar.cc/40?img=32",
    videoSrc:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    posterSrc:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&q=80",
  },
  {
    id: 3,
    title: "Street Art Festival",
    category: "Art & Culture",
    distance: "2.4 mi",
    rating: 4.9,
    totalRatings: 5,
    views: 58,
    likes: 21,
    author: "Marcus Johnson",
    authorAvatar: "https://i.pravatar.cc/40?img=12",
    videoSrc:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    posterSrc:
      "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=500&q=80",
  },
];

function StarRating({ rating, total }: { rating: number; total: number }) {
  return (
    <div className='flex items-center gap-1'>
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;
        return (
          <div key={i} className='relative w-4 h-4'>
            <svg
              viewBox='0 0 20 20'
              className='w-4 h-4 text-gray-600'
              fill='currentColor'
            >
              <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
            </svg>
            {(filled || partial) && (
              <div
                className='absolute inset-0 overflow-hidden'
                style={{ width: filled ? "100%" : `${(rating % 1) * 100}%` }}
              >
                <svg
                  viewBox='0 0 20 20'
                  className='w-4 h-4 text-green-500'
                  fill='currentColor'
                >
                  <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                </svg>
              </div>
            )}
          </div>
        );
      })}
      <span className='text-white text-sm font-semibold ml-1'>{rating}</span>
    </div>
  );
}

function VideoCard({
  video,
  isActive,
}: {
  video: VideoData;
  isActive: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likes);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isActive) {
      vid
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      vid.pause();
      vid.currentTime = 0;
      setIsPlaying(false);
      setProgress(0);
    }
  }, [isActive]);

  const togglePlay = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play().then(() => setIsPlaying(true));
    } else {
      vid.pause();
      setIsPlaying(false);
    }
    showControlsTemporarily();
  }, []);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setIsMuted(vid.muted);
  }, []);

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => setShowControls(false), 2500);
  };

  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid) return;
    setCurrentTime(vid.currentTime);
    setProgress((vid.currentTime / vid.duration) * 100 || 0);
  };

  const handleLoadedMetadata = () => {
    const vid = videoRef.current;
    if (!vid) return;
    setDuration(vid.duration);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const vid = videoRef.current;
    if (!vid) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    vid.currentTime = pct * vid.duration;
    showControlsTemporarily();
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((prev) => {
      setLikeCount((c) => (prev ? c - 1 : c + 1));
      return !prev;
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: video.title, text: video.category });
    }
  };

  return (
    <div
      className='relative w-full h-full bg-black flex items-center justify-center overflow-hidden'
      onClick={togglePlay}
      onMouseMove={showControlsTemporarily}
      onTouchStart={showControlsTemporarily}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={video.videoSrc}
        poster={video.posterSrc}
        className='absolute inset-0 w-full h-full object-cover'
        loop
        muted={isMuted}
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Dark gradient overlay bottom */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none' />

      {/* Top Controls */}
      <div
        className={`absolute top-0 left-0 right-0 flex justify-between items-center p-4 transition-opacity duration-300 ${showControls || !isPlaying ? "opacity-100" : "opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={toggleMute}
          className='w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all'
        >
          {isMuted ? (
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2'
              />
            </svg>
          ) : (
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15.536 8.464a5 5 0 010 7.072M12 6a7 7 0 010 12M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z'
              />
            </svg>
          )}
        </button>

        <button
          className='w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all'
          onClick={(e) => e.stopPropagation()}
        >
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            strokeWidth={2}
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
      </div>

      {/* Center Play/Pause Icon */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200 ${!isPlaying || showControls ? "opacity-100" : "opacity-0"}`}
      >
        <div className='w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30'>
          {isPlaying ? (
            <svg
              className='w-7 h-7 text-white'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M6 4h4v16H6V4zm8 0h4v16h-4V4z' />
            </svg>
          ) : (
            <svg
              className='w-7 h-7 text-white ml-1'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M8 5v14l11-7z' />
            </svg>
          )}
        </div>
      </div>

      {/* Bottom Info */}
      <div
        className='absolute bottom-0 left-0 right-0 px-4 pb-4 space-y-2'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div
          className='w-full h-1 bg-white/20 rounded-full cursor-pointer group'
          onClick={handleSeek}
        >
          <div
            className='h-full bg-white rounded-full relative transition-all'
            style={{ width: `${progress}%` }}
          >
            <div className='absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow -mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity' />
          </div>
        </div>

        {/* Time */}
        <div className='flex justify-between text-white/60 text-xs'>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Title & category */}
        <div>
          <h2 className='text-white font-bold text-xl leading-tight'>
            {video.title}
          </h2>
          <p className='text-white/60 text-sm'>{video.category}</p>
        </div>

        {/* Rating row */}
        <div className='flex items-center gap-3'>
          <span className='text-white/70 text-sm'>{video.distance}</span>
          <StarRating rating={video.rating} total={video.totalRatings} />
        </div>

        {/* Author row */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <img
              src={video.authorAvatar}
              alt={video.author}
              className='w-8 h-8 rounded-full border border-white/20 object-cover'
            />
            <span className='text-white text-sm font-medium'>
              {video.author}
            </span>
          </div>

          <div className='flex items-center gap-4'>
            {/* Views */}
            <button className='flex items-center gap-1 text-white/70 text-sm hover:text-white transition-colors'>
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                />
              </svg>
              <span>+{video.views}</span>
            </button>

            {/* Like */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-sm transition-all ${liked ? "text-red-400 scale-110" : "text-white/70 hover:text-red-400"}`}
            >
              <svg
                className='w-4 h-4'
                fill={liked ? "currentColor" : "none"}
                stroke='currentColor'
                strokeWidth={2}
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                />
              </svg>
              <span>+{likeCount}</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className='text-white/70 hover:text-white transition-colors'
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VideoPlayerFeed() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);
  // Keep index in a ref so the wheel closure always has the latest value
  const indexRef = useRef(0);
  // Animation lock — true while transition is in progress
  const isTransitioning = useRef(false);
  // Accumulated wheel delta for trackpad smoothing
  const accDelta = useRef(0);
  const resetDeltaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Central navigation — all nav goes through here
  const goToIndex = useCallback((next: number) => {
    if (isTransitioning.current) return;
    next = Math.min(Math.max(next, 0), videos.length - 1);
    if (next === indexRef.current) return;
    isTransitioning.current = true;
    indexRef.current = next;
    setCurrentIndex(next);
    // Unlock after CSS transition (500ms) + small buffer
    setTimeout(() => {
      isTransitioning.current = false;
    }, 550);
  }, []);

  const goNext = useCallback(
    () => goToIndex(indexRef.current + 1),
    [goToIndex],
  );
  const goPrev = useCallback(
    () => goToIndex(indexRef.current - 1),
    [goToIndex],
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startY.current === null) return;
    const diff = startY.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) {
      goToIndex(indexRef.current + (diff > 0 ? 1 : -1));
    }
    startY.current = null;
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Accumulate delta — handles both trackpad (small increments) and mouse wheel (large jumps)
      accDelta.current += e.deltaY;

      // Reset accumulator if wheel stops for 100ms
      if (resetDeltaTimer.current) clearTimeout(resetDeltaTimer.current);
      resetDeltaTimer.current = setTimeout(() => {
        accDelta.current = 0;
      }, 100);

      // Trigger navigation once enough delta has accumulated
      if (accDelta.current >= 80) {
        accDelta.current = 0;
        goToIndex(indexRef.current + 1);
      } else if (accDelta.current <= -80) {
        accDelta.current = 0;
        goToIndex(indexRef.current - 1);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (resetDeltaTimer.current) clearTimeout(resetDeltaTimer.current);
    };
    // goToIndex is stable — safe to omit from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='min-h-[91vh] bg-gray-900 flex items-center justify-center'>
      <div
        className='relative w-full max-w-sm mx-auto'
        style={{ height: "100svh", maxHeight: "780px" }}
      >
        {/* Phone frame */}
        <div
          ref={containerRef}
          className='relative w-full h-full bg-black rounded-3xl overflow-hidden shadow-2xl'
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Videos — stack is N times the container height; each slide is 1/N of that */}
          <div
            className='flex flex-col transition-transform duration-500 ease-in-out'
            style={{
              transform: `translateY(calc(-${currentIndex} * (100% / ${videos.length})))`,
              height: `${videos.length * 100}%`,
            }}
          >
            {videos.map((video, i) => (
              <div
                key={video.id}
                className='flex-shrink-0 w-full'
                style={{ height: `${100 / videos.length}%` }}
              >
                <VideoCard video={video} isActive={i === currentIndex} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows - outside the phone frame */}
        <div className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 flex flex-col gap-3'>
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className='w-11 h-11 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-gray-700 hover:bg-white hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed'
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              strokeWidth={2.5}
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M5 15l7-7 7 7'
              />
            </svg>
          </button>
          <button
            onClick={goNext}
            disabled={currentIndex === videos.length - 1}
            className='w-11 h-11 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-gray-700 hover:bg-white hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed'
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              strokeWidth={2.5}
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
