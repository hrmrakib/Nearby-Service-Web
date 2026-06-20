/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Calendar, Tag, Loader2, Loader } from "lucide-react";
import Image from "next/image";
import { HeroSection } from "@/components/home/HeroSection";
import {
  useAttendEventMutation,
  useGetAllPostQuery,
} from "@/redux/features/post/postAPI";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useToggleSaveMutation } from "@/redux/features/save/saveAPI";
import CalendarDatePicker from "@/components/others/CalenderDatePicker";
import MinStarRating from "@/components/home/Minstarrating";
import getDistanceMiles from "@/utils/getDistanceMiles";
import { useAuth } from "@/hooks/useAuth.ts";
import { useRouter } from "next/navigation";
import LocationCard from "@/components/event/LocationCard";
import { SuggestedPost } from "@/components/home/SuggestedPost";
import CommonLocationInput from "@/components/location/CommonLocationInput";
import { categories } from "@/constants";
import MiniMap from "@/components/home/MiniMap";

type TAuthor = {
  _id: string;
  name: string;
  email: string;
  image: string;
  stripeAccountId: string;
  isStripeConnected: boolean;
};

type TSchedule = {
  _id: string;
  day: string;
  startTime: string;
  endTime: string;
  timeSlots: any[];
};

type TLocation = {
  type: "Point";
  coordinates: number[];
};

type IPost = {
  _id: string;
  author: TAuthor;
  image: string;
  media: string[];
  title: string;
  description: string;
  startDate: string | null;
  startTime: string | null;
  address: string;
  location: TLocation;
  hasTag: string[];
  views: number;
  likes: number;
  endDate: string | null;
  couponCode: string;
  price: number | null;
  schedule: TSchedule[];
  category: string;
  subcategory: string | null;
  serviceType: string | null;
  missingName: string | null;
  missingAge: string | null;
  clothingDescription: string | null;
  lastSeenLocation: TLocation;
  lastSeenDate: string | null;
  contactInfo: string | null;
  expireLimit: string | null;
  capacity: number | null;
  amenities: string | null;
  licenses: string | null;
  status: "PUBLISHED" | "DRAFT" | string;
  boost: boolean;
  attenders: any[];
  isSaved: boolean;
  totalSaved: number;
  createdAt: string;
  updatedAt: string;
  distance: number;
  boostPriority: number;
  averageRating: number;
  reviewsCount: number;
};

const renderStars = (count: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <svg
      key={i}
      width='14'
      height='14'
      viewBox='0 0 24 24'
      fill={i < count ? "#FBBF24" : "none"}
      stroke={i < count ? "#FBBF24" : "#D1D5DB"}
      strokeWidth='1.5'
    >
      <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
    </svg>
  ));
};

const today = new Date();
const next7Days = new Date();
next7Days.setDate(today.getDate() + 7);

// Shape of filters actually sent to the API (only updated on "Apply Filters")
type AppliedFilters = {
  lat: number | undefined;
  lng: number | undefined;
  maxDistance: number | undefined;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  dateFrom: string | undefined;
  dateTo: string | undefined;
  rating: number | undefined;
};

export default function DashboardLayout() {
  const hasSelectedCategory = useSelector(
    (state: any) => state.postCategory.selectedCategory,
  );
  const { userLat, userLng, user } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(hasSelectedCategory);

  // ---------- draft filter state (UI controls) ----------
  const [distanceRadius, setDistanceRadius] = useState([0]);
  const [minPrice, setMinPrice] = useState([0]);
  const [maxPrice, setMaxPrice] = useState([500]);
  const [minStarRating, setMinStarRating] = useState([0]);

  const [dateChanged, setDateChanged] = useState(false);
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: today,
    endDate: next7Days,
  });
  const [showCalendar, setShowCalendar] = useState(false);

  // google places auto-suggest (draft)
  const [coordinates, setCoordinates] = useState<{
    address: string;
    lat: number;
    lng: number;
  } | null>(null);

  // ---------- APPLIED filters (only updated on button click) ----------
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters | null>(
    null,
  );

  const search = useSelector((state: any) => state.globalSearch.searchValue);
  const [toggleSaveMutation, { isLoading: isSaving }] = useToggleSaveMutation();
  const [attendEventMutation, { isLoading: isAttending }] =
    useAttendEventMutation();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [allPosts, setAllPosts] = useState<IPost[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [savingItemId, setSavingItemId] = useState<string | null>(null);
  const [attendingItemId, setAttendingItemId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const limit = 50;

  useEffect(() => {
    setSelectedCategory(hasSelectedCategory);
  }, [hasSelectedCategory]);

  const { data, isFetching, refetch } = useGetAllPostQuery({
    category: selectedCategory,
    lat: appliedFilters?.lat,
    lng: appliedFilters?.lng,
    maxDistance: appliedFilters?.maxDistance,
    minPrice: appliedFilters?.minPrice,
    maxPrice: appliedFilters?.maxPrice,
    dateFrom: appliedFilters?.dateFrom,
    dateTo: appliedFilters?.dateTo,
    rating: appliedFilters?.rating,
    search,
    page,
    limit,
  });

  // Reset posts when category or search changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setAllPosts([]);
  }, [selectedCategory, search]);

  useEffect(() => {
    if (data?.data && data?.data?.length > 0) {
      if (page === 1) {
        setAllPosts(data?.data);
      } else {
        setAllPosts((prev) => {
          const newItems = data?.data?.filter(
            (post: any) => !prev.some((p) => p._id === post._id),
          );
          return [...prev, ...newItems];
        });
      }

      if (allPosts.length + data.data.length >= (data.meta?.total || 0)) {
        setHasMore(false);
      }
    }
  }, [data]);

  // Infinite Scroll — IntersectionObserver
  useEffect(() => {
    if (!hasMore || isFetching) return;

    const scrollViewport = scrollRef.current!.querySelector(
      "[data-radix-scroll-area-viewport]",
    );

    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      {
        root: scrollViewport,
        rootMargin: "0px",
        threshold: 0.5,
      },
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  const handleSaveToggle = async (postId: string) => {
    setSavingItemId(postId);
    try {
      const res = await toggleSaveMutation({ postId }).unwrap();
      if (res?.success) {
        refetch();
      }
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  };

  const handleDateRangeChange = (
    startDate: Date | null,
    endDate: Date | null,
  ) => {
    setDateRange({ startDate, endDate });
    setDateChanged(true);
    setShowCalendar(false);
  };

  const handleMinStarRatingChange = (rating: number[]) => {
    setMinStarRating(rating);
  };

  /** Snapshot all draft filter values into appliedFilters, reset page, trigger refetch */
  const handleApplyFilters = () => {
    const lat =
      coordinates?.lat !== undefined ? coordinates.lat : (userLat ?? undefined);
    const lng =
      coordinates?.lng !== undefined ? coordinates.lng : (userLng ?? undefined);

    setAppliedFilters({
      lat,
      lng,
      maxDistance: distanceRadius[0] > 0 ? distanceRadius[0] : undefined,
      minPrice: minPrice[0] > 0 ? minPrice[0] : undefined,
      maxPrice: maxPrice[0] < 500 ? maxPrice[0] : undefined,
      dateFrom: dateChanged
        ? (dateRange.startDate?.toISOString() ?? undefined)
        : undefined,
      dateTo: dateChanged
        ? (dateRange.endDate?.toISOString() ?? undefined)
        : undefined,
      rating: minStarRating[0] > 0 ? minStarRating[0] : undefined,
    });

    setPage(1);
    setHasMore(true);
    setAllPosts([]);
  };

  const handleActionOnPost = async (id: string, category: string) => {
    try {
      if (category === "event") {
        setAttendingItemId(id);
        const res = await attendEventMutation(id).unwrap();
        if (res?.success) {
          refetch();
          toast.success(res?.message);
        }
      }
    } catch (error: any) {
      toast.error(error?.data?.message);
    } finally {
      setAttendingItemId(null);
    }
  };

  const isUserAttending = (
    attenders: { email: string }[],
    email: string,
  ): boolean => {
    return attenders.some((attender) => attender.email === email);
  };

  return (
    <div className='min-h-[calc(100vh-60px)] bg-[#F3F4F6]'>
      <HeroSection />

      <div
        id='all-post'
        className='container mx-auto grid grid-cols-1 lg:grid-cols-[20rem_1fr] xl:grid-cols-[20rem_1fr_20rem] gap-6 lg:gap-24 mt-8'
      >
        {/* Left Column - Filters */}
        <div className='sticky top-20 w-80 bg-transparent hidden lg:block h-[calc(100vh-80px)] overflow-y-auto'>
          <ScrollArea className='h-[calc(100vh-100px)]'>
            <div className='p-6 space-y-6'>
              {/* Category Buttons */}
              <div className='space-y-2'>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    className={`w-full justify-start text-left text-[#1F2937] font-medium ${
                      selectedCategory === category.id
                        ? "bg-[#15B826] hover:bg-[#0bb61c] text-white"
                        : "bg-transparent hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className='mr-2'>{category.icon}</span>
                    <span>{category.label}</span>
                  </Button>
                ))}
              </div>

              {/* Filters Section */}
              <div className='space-y-6'>
                <h3 className='text-lg font-semibold text-gray-900'>Filters</h3>

                {/* Location Filter */}
                <div className='space-y-2'>
                  <CommonLocationInput
                    onChange={(result) => setCoordinates(result)}
                    label='Location'
                    placeholder='City or Zip Code'
                  />
                </div>

                {/* Date Range Filter */}
                <div className='space-y-3 relative'>
                  <Label className='text-sm font-medium text-gray-700'>
                    Date
                  </Label>

                  <Button
                    variant='outline'
                    onClick={() => setShowCalendar(!showCalendar)}
                    className='w-full justify-start text-left'
                  >
                    <Calendar className='w-4 h-4 mr-2 text-gray-500' />
                    {dateRange.startDate && dateRange.endDate ? (
                      <span>
                        {dateRange.startDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        -{" "}
                        {dateRange.endDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    ) : (
                      <span className='text-gray-500'>Select date range</span>
                    )}
                  </Button>

                  {/* Calendar Dropdown */}
                  {showCalendar && (
                    <div className='absolute top-16 left-0 z-50 mt-1'>
                      {dateRange.startDate && dateRange.endDate && (
                        <CalendarDatePicker
                          startDate={dateRange.startDate}
                          endDate={dateRange.endDate}
                          onDateRangeChange={handleDateRangeChange}
                          onClose={() => setShowCalendar(false)}
                        />
                      )}
                    </div>
                  )}

                  {/* Distance Radius */}
                  <div className='space-y-3'>
                    <Label className='text-sm font-medium text-gray-700'>
                      Distance Radius (Max: 1500 miles)
                    </Label>
                    <div className='px-2'>
                      <Slider
                        value={distanceRadius}
                        onValueChange={setDistanceRadius}
                        max={1500}
                        step={5}
                        className='w-full'
                      />
                      <div className='flex justify-between text-xs text-gray-500 mt-1'>
                        <span>0 miles</span>
                        <span>{distanceRadius[0]} miles</span>
                      </div>
                    </div>
                  </div>

                  {/* Min Price */}
                  <div className='space-y-3'>
                    <Label className='text-sm font-medium text-gray-700'>
                      Min Price
                    </Label>
                    <div className='px-2'>
                      <Slider
                        value={minPrice}
                        onValueChange={setMinPrice}
                        max={500}
                        step={10}
                        className='w-full'
                      />
                      <div className='flex justify-between text-xs text-gray-500 mt-1'>
                        <span>$0</span>
                        <span>${minPrice[0]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Max Price */}
                  <div className='space-y-3'>
                    <Label className='text-sm font-medium text-gray-700'>
                      Max Price
                    </Label>
                    <div className='px-2'>
                      <Slider
                        value={maxPrice}
                        onValueChange={setMaxPrice}
                        max={500}
                        step={10}
                        className='w-full'
                      />
                      <div className='flex justify-between text-xs text-gray-500 mt-1'>
                        <span>$0</span>
                        <span>${maxPrice[0]}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <MinStarRating onChange={handleMinStarRatingChange} />
              </div>

              {/* Apply Filters Button */}
              <Button
                onClick={handleApplyFilters}
                className='w-full bg-[#15B826] hover:bg-[#0bb61c] text-white'
              >
                Apply Filters
              </Button>
            </div>
          </ScrollArea>
        </div>

        {/* Middle Column - Content Feed */}
        <div className='min-w-0 min-h-0'>
          <ScrollArea
            className='h-auto [&>[data-radix-scroll-area-scrollbar]]:hidden !space-y-2'
            ref={scrollRef}
          >
            {allPosts?.map((item: IPost) => (
              <div key={item._id} className='p-6 space-y-6'>
                <Card className='overflow-hidden !border-none p-0 shadow-md'>
                  <div
                    onClick={() => router.push(`/event/${item?._id}`)}
                    className='relative cursor-pointer'
                  >
                    {item?.image && (
                      <Image
                        width={600}
                        height={600}
                        src={item.image || ""}
                        alt={item.title}
                        className='w-full h-[300px] object-cover'
                      />
                    )}
                  </div>
                  <CardContent
                    onClick={() => router.push(`/event/${item?._id}`)}
                    className='p-6 cursor-pointer gap-0 pt-0'
                  >
                    <div className='space-y-3'>
                      <div className='flex items-start justify-between'>
                        <h3 className='text-base font-semibold text-gray-900'>
                          {item.title}
                        </h3>
                      </div>

                      <div className='flex items-center space-x-4'>
                        <div className='flex items-center gap-5 text-base text-[#374151]'>
                          <div className='flex items-center gap-1'>
                            <MapPin className='w-4 h-4 text-[#108F1E] flex-shrink-0' />
                            <p className='text-[13px] font-medium'>
                              {getDistanceMiles(
                                userLat!,
                                userLng!,
                                item?.location?.coordinates[1],
                                item?.location?.coordinates[0],
                              ).toFixed(1)}{" "}
                              miles
                            </p>
                          </div>

                          {item?.averageRating > 0 && (
                            <div className='flex items-center gap-1'>
                              {renderStars(
                                Math.floor(item?.averageRating || 0),
                              )}
                              <span className='text-sm font-medium text-[#374151]'>
                                {item?.averageRating}
                              </span>
                            </div>
                          )}

                          <div className='flex items-center gap-1 text-[#374151] text-sm capitalize'>
                            <Tag className='w-4 h-4 text-[#108F1E]' />
                            {item?.category}
                          </div>
                        </div>
                      </div>

                      <p className='text-[#374151] text-sm leading-relaxed'>
                        {item.description.split(" ").length > 28
                          ? item.description.split(" ").slice(0, 28).join(" ") +
                            "..."
                          : item.description}
                      </p>

                      <div
                        onClick={(e) => e.stopPropagation()}
                        className='flex items-center space-x-3 pt-2'
                      >
                        {(item?.category === "event" ||
                          item?.category === "service" ||
                          item?.category === "deal" ||
                          item?.category === "alert") && (
                          <button
                            onClick={() =>
                              handleActionOnPost(item?._id, item?.category)
                            }
                            disabled={
                              item?.category === "event" &&
                              (attendingItemId === item._id ||
                                isUserAttending(
                                  item.attenders,
                                  user?.email as string,
                                ))
                            }
                            className={`w-[88%] h-11 flex-1 flex items-center justify-center gap-2 font-semibold text-white rounded-md text-center disabled:cursor-not-allowed transition-colors
                              ${
                                item?.category === "event" &&
                                isUserAttending(
                                  item.attenders,
                                  user?.email as string,
                                )
                                  ? "bg-green-700 opacity-80"
                                  : "bg-[#15B826] hover:bg-green-600 disabled:opacity-70"
                              }`}
                          >
                            {item?.category === "event" ? (
                              attendingItemId === item._id ? (
                                <>
                                  <Loader2 className='w-4 h-4 animate-spin' />
                                  <span>Attending...</span>
                                </>
                              ) : isUserAttending(
                                  item.attenders,
                                  user?.email as string,
                                ) ? (
                                <>
                                  <span>✓</span>
                                  <span>Attending</span>
                                </>
                              ) : (
                                "Attend"
                              )
                            ) : item?.category === "service" ? (
                              "Request Quote"
                            ) : item?.category === "deal" ? (
                              "Get Deal"
                            ) : (
                              "Add Comment"
                            )}
                          </button>
                        )}
                        {/* {(item?.category === "event" ||
                          item?.category === "service" ||
                          item?.category === "deal" ||
                          item?.category === "alert") && (
                          <button
                            onClick={() =>
                              handleActionOnPost(item?._id, item?.category)
                            }
                            disabled={attendingItemId === item._id}
                            className='w-[88%] h-11 flex-1 flex items-center justify-center gap-2 font-semibold text-white rounded-md text-center bg-[#15B826] hover:bg-green-600 disabled:opacity-70 disabled:cursor-not-allowed'
                          >
                            {item?.category === "event" &&
                            attendingItemId === item._id ? (
                              <>
                                <Loader2 className='w-4 h-4 animate-spin' />
                                <span>Attending...</span>
                              </>
                            ) : isUserAttending(
                                item.attenders,
                                user?.email as string,
                              ) ? (
                              <>
                                <span>✓</span>
                                <span>Attending</span>
                              </>
                            ) : (
                              "Attend"
                            )}
                            {item?.category === "service" && "Request Quote"}
                            {item?.category === "deal" && "Get Deal"}
                            {item?.category === "alert" && "Add Comment"}
                          </button>
                        )} */}

                        <Button
                          variant='outline'
                          disabled={isSaving && item?._id === savingItemId}
                          className={`w-[16%] h-11 px-6 bg-transparent font-semibold text-[#15B826] border border-[#15B826] ${
                            item?.isSaved ? "bg-[#15B826] text-white" : ""
                          }`}
                          onClick={() => handleSaveToggle(item?._id)}
                        >
                          {item?.isSaved ? "Saved" : "Save"}{" "}
                          {isSaving && item?._id === savingItemId && (
                            <Loader className='w-4 h-4 animate-spin' />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}

            {allPosts?.length === 0 && !isFetching && (
              <div className='h-[calc(100vh-80px)] flex items-center justify-center'>
                <p className='text-gray-600'>No posts found</p>
              </div>
            )}

            {isFetching && (
              <div
                ref={loaderRef}
                className='h-52 md:h-64 flex items-center justify-center'
              >
                <Loader className='animate-spin' />
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Right Column - Map & Contacts */}
        <div className='sticky top-20 w-80 bg-transparent hidden xl:block h-[calc(100vh-80px)] overflow-y-auto mt-5'>
          <ScrollArea className='h-[calc(100vh-100px)]'>
            <div className='space-y-6'>
              <div className='space-y-3'>
                {/* <LocationCard
                  lat={90.39064309999999}
                  lng={23.7511665}
                  width='max-w-[70%]'
                /> */}
                <MiniMap
                  lat={23.8103}
                  lng={90.4125}
                  label='Dhaka'
                  width={400}
                  height={350}
                />
              </div>

              <div className='space-y-4'>
                <SuggestedPost />
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className='lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4'>
        <div className='flex justify-around'>
          {categories.slice(0, 4).map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              size='sm'
              className={
                selectedCategory === category.id
                  ? "bg-[#15B826] hover:bg-green-600"
                  : ""
              }
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className='text-xs'>{category.icon}</span>
              <span className='text-xs'>{category.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
