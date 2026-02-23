"use client";

import AboutEvent from "@/components/event/AboutEvent";
import CommentsSection from "@/components/event/Comments";
import LocationCard from "@/components/event/LocationCard";
import MomentsSection from "@/components/event/Moments";
import RelatedCard from "@/components/event/RelatedCard";
import ReviewSection from "@/components/event/ReviewSection";
import UnlockNextJurnee from "@/components/event/UnlockNextJurnee";
import AddressDisplay from "@/components/share/AddressDisplay";
import { useGetCommentsByPostIdQuery } from "@/redux/features/comment/commentAPI";
import { useGetPostDetailByIdQuery } from "@/redux/features/post/postAPI";
import { useGetProfileQuery } from "@/redux/features/profile/profileAPI";
import { useGetReviewsByPostIdQuery } from "@/redux/features/review/reviewAPI";
import formatDate from "@/utils/formatDate";
import getDistanceKm from "@/utils/getDistanceMiles";

import {
  Bookmark,
  Calendar,
  Eye,
  MapPin,
  MessageSquareText,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type ToastMessage = {
  id: number;
  text: string;
};

function LoadingSpinner() {
  return (
    <div className='min-h-[90vh] bg-[#F3F4F6] flex items-center justify-center'>
      <div className='flex flex-col items-center gap-4'>
        {/* Outer track */}
        <div className='relative w-16 h-16'>
          <div className='absolute inset-0 rounded-full border-4 border-green-100' />
          {/* Spinning arc */}
          <div className='absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 animate-spin' />
          {/* Inner pulsing dot */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='w-3 h-3 rounded-full bg-green-500 animate-pulse' />
          </div>
        </div>
        <p className='text-sm font-medium text-green-600 tracking-wide animate-pulse'>
          Loading event...
        </p>
      </div>
    </div>
  );
}

export default function EventDetailPage() {
  const { id } = useParams();
  const [imagePreview, setImagePreview] = useState("");

  const [attended, setAttended] = useState(false);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(284);
  const [saveCount, setSaveCount] = useState(91);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const { data, isLoading } = useGetPostDetailByIdQuery(id);
  const { data: comments } = useGetCommentsByPostIdQuery(id);
  const { data: reviews } = useGetReviewsByPostIdQuery(id);
  const { data: profile } = useGetProfileQuery(undefined);

  const postDetail = data?.data?.detail;
  const relevantPosts = data?.data?.relevantPosts;

  const userLat = profile?.data?.location?.coordinates[0];
  const userLng = profile?.data?.location?.coordinates[1];

  const thumbnails = postDetail?.media?.filter((m: string) =>
    /\.(jpg|jpeg|png|webp)(\?.*)?$/i.test(m),
  );

  useEffect(() => {
    if (postDetail?.image) {
      setImagePreview(postDetail?.image);
    }
  }, [postDetail]);

  const showToast = (text: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      2500,
    );
  };

  const handleAttend = () => {
    setAttended((prev) => {
      const next = !prev;
      showToast(next ? "🎉 You're attending!" : "Removed from attending");
      return next;
    });
  };

  const handleSave = () => {
    setSaved((prev) => {
      const next = !prev;
      setSaveCount((c) => (next ? c + 1 : c - 1));
      showToast(next ? "🔖 Event saved!" : "Removed from saved");
      return next;
    });
  };

  const handleLike = () => {
    setLiked((prev) => {
      const next = !prev;
      setLikeCount((c) => (next ? c + 1 : c - 1));
      showToast(next ? "❤️ You liked this!" : "Like removed");
      return next;
    });
  };

  const menuOptions = [
    {
      label: "Share event",
      icon: "↗",
      action: () => showToast("Link copied!"),
    },
    {
      label: "Report event",
      icon: "⚑",
      action: () => showToast("Thanks for reporting"),
    },
    { label: "Hide event", icon: "✕", action: () => showToast("Event hidden") },
  ];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  console.log(
    userLat,
    userLng,
    postDetail?.location?.coordinates[1],
    postDetail?.location?.coordinates[0],
  );

  return (
    <div className='min-h-screen bg-[#F3F4F6]'>
      <div className='relative w-full'>
        {/* Hero Section */}
        <div className='relative w-full h-56 md:h-110 overflow-hidden bg-card'>
          <Image
            src={imagePreview}
            alt='Night at Casa Verde'
            fill
            className='object-cover'
            priority
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>

          {/* Title */}
          <div className='absolute bottom-6 left-6 md:left-8'>
            <h1 className='text-3xl md:text-4xl font-bold text-white mb-2'>
              {postDetail?.title || "No title"}
            </h1>
            <h1 className='text-base md:text-xl font-medium text-white mb-2 capitalize'>
              {postDetail?.category || "No category"}
            </h1>
            <div className='flex flex-wrap gap-2 text-white text-xs md:text-sm'>
              <div className='flex items-center gap-2'>
                <MessageSquareText className='w-5 h-5' />
                <span className='font-semibold'>
                  {postDetail?.category === "event"
                    ? postDetail?.reviewsCount + " comments"
                    : postDetail?.reviewsCount + " reviews"}
                </span>
                <span>•</span>
                <a href='#see-all' className='hover:underline'>
                  See all
                </a>
              </div>

              <div className='flex items-center gap-2'>
                <MapPin className='w-5 h-5' />
                <span className='font-semibold'>
                  {" "}
                  {getDistanceKm(
                    userLng,
                    userLat,
                    postDetail?.location?.coordinates[1],
                    postDetail?.location?.coordinates[0],
                  ).toFixed(1)}{" "}
                  km
                </span>
                <span>•</span>
                <AddressDisplay
                  key={postDetail?.address}
                  address={postDetail?.address ?? ""}
                />
              </div>

              <div className='flex items-center gap-2'>
                <Calendar className='w-5 h-5' />
                <span className='font-semibold'>
                  {formatDate(postDetail?.createdAt)}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <Eye className='w-5 h-5' />
                <span className='font-semibold'>
                  {postDetail?.views}+ Views
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Photos Bottom Right — outside overflow-hidden, on top of all */}
        <div className='absolute -bottom-4 md:-bottom-8 right-6 flex gap-5 z-[500]'>
          {thumbnails?.map((thumb: string, idx: number) => (
            <div
              key={idx}
              className='w-12 lg:w-24 h-12 lg:h-24 rounded-lg overflow-hidden shadow-lg'
              onClick={() => setImagePreview(thumb)}
            >
              <Image
                src={thumb}
                alt={`Thumbnail ${idx + 1}`}
                width={96}
                height={96}
                className='w-full h-full object-cover'
              />
            </div>
          ))}
        </div>
      </div>

      <div
        className='bg-white'
        style={{ boxShadow: "0 5px 6px rgba(0, 0, 0, 0.1)" }}
      >
        <div className='container mx-auto bg-white flex flex-col items-start justify-center p-4 font-sans'>
          {/* Action Bar */}
          <div className='w-full max-w-2xl bg-white rounded-2xl px-4 py-3'>
            <div className='flex flex-wrap items-center gap-2 sm:gap-3'>
              {/* Attend Button */}
              <button
                onClick={handleAttend}
                className={`
              flex-1 min-w-0 flex items-center justify-center gap-2
              px-4 py-3 rounded-xl font-semibold text-sm sm:text-base
              transition-all duration-200 active:scale-95 select-none
              ${
                attended
                  ? "bg-green-700 text-white shadow-inner"
                  : "bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg"
              }
            `}
              >
                <span
                  className={`transition-transform duration-200 ${attended ? "scale-110" : ""}`}
                >
                  {attended ? "✓" : ""}
                </span>
                <span className='truncate'>
                  {attended ? "Attending" : "Attend"}
                </span>
              </button>

              {/* Comment Button */}
              <button
                onClick={() => showToast("💬 Comments coming soon!")}
                className='flex-shrink-0 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl border-2 border-green-500 text-green-500 hover:bg-green-50 active:scale-95 transition-all duration-200'
                aria-label='Comments'
              >
                <MessageSquareText />
              </button>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className={`
              flex-shrink-0 flex items-center justify-center gap-1.5
              px-3 sm:px-4 py-3 h-11 sm:h-12 rounded-xl border-2 font-medium text-sm
              transition-all duration-200 active:scale-95 select-none
              ${
                saved
                  ? "border-green-500 bg-green-50 text-green-600"
                  : "border-green-500 text-green-500 hover:bg-green-50"
              }
            `}
              >
                <Bookmark />
                <span className='hidden sm:inline'>Save</span>
                <span className='text-xs text-green-400'>{saveCount}</span>
              </button>

              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`
              flex-shrink-0 flex items-center justify-center gap-1.5
              px-3 sm:px-4 py-3 h-11 sm:h-12 rounded-xl border-2 font-medium text-sm
              transition-all duration-200 active:scale-95 select-none
              ${
                liked
                  ? "border-green-500 bg-green-50 text-green-600"
                  : "border-green-500 text-green-500 hover:bg-green-50"
              }
            `}
              >
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill={liked ? "currentColor" : "none"}
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className={`transition-all duration-200 ${liked ? "scale-110" : ""}`}
                >
                  <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
                </svg>
                <span className='hidden sm:inline'>Like</span>
                <span className='text-xs text-green-400'>{likeCount}</span>
              </button>

              {/* More Options */}
              <div className='relative flex-shrink-0'>
                <button
                  onClick={() => setMenuOpen((p) => !p)}
                  className='flex items-center justify-center w-8 h-11 sm:h-12 text-gray-400 hover:text-gray-600 active:scale-95 transition-all duration-200'
                  aria-label='More options'
                >
                  <svg
                    width='4'
                    height='18'
                    viewBox='0 0 4 18'
                    fill='currentColor'
                  >
                    <circle cx='2' cy='2' r='2' />
                    <circle cx='2' cy='9' r='2' />
                    <circle cx='2' cy='16' r='2' />
                  </svg>
                </button>

                {menuOpen && (
                  <>
                    <div
                      className='fixed inset-0 z-10'
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className='absolute right-0 bottom-full mb-2 z-20 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[160px]'>
                      {menuOptions.map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => {
                            opt.action();
                            setMenuOpen(false);
                          }}
                          className='w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left'
                        >
                          <span className='text-gray-400'>{opt.icon}</span>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Demo label */}

          <style jsx global>{`
            @keyframes fade-in-down {
              from {
                opacity: 0;
                transform: translateY(-8px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fade-in-down {
              animation: fade-in-down 0.2s ease-out;
            }
          `}</style>
        </div>
      </div>

      <div className='container mx-auto px-4 py-6 md:py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-7 gap-6 md:gap-8 lg:gap-36'>
          {/* Left Column */}
          <div className='lg:col-span-4 space-y-6'>
            {/* Event Details */}
            <AboutEvent />
            <MomentsSection />
            <CommentsSection id='see-all' />
            <ReviewSection id='see-all' />

            {/* Deal Details */}
            {/* Service Details */}
            {/* Missing Person Details */}
          </div>

          {/* Right Sidebar */}
          <div className='lg:col-span-3 space-y-4'>
            <LocationCard
              // lat={postDetail?.location?.coordinates[0]}
              // lng={postDetail?.location?.coordinates[1]}
              address={postDetail?.address}
              lat={90.39064309999999}
              lng={23.7511665}
              googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY!}
            />
            <RelatedCard
              userLng={userLng}
              userLat={userLat}
              relevantPosts={relevantPosts}
            />
            <UnlockNextJurnee />
          </div>
        </div>
      </div>
    </div>
  );
}
