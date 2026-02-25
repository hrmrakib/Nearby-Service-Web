/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MapPin,
  MessageCircle,
  Phone,
  Loader,
  Calendar,
  Tag,
} from "lucide-react";
import Image from "next/image";
import { HeroSection } from "@/components/home/HeroSection";
import { useGetAllPostQuery } from "@/redux/features/post/postAPI";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useToggleSaveMutation } from "@/redux/features/save/saveAPI";
import Link from "next/link";
import CalendarDatePicker from "@/components/others/CalenderDatePicker";
import CommonLocationInput from "@/components/CommonLocationInput";
import MinStarRating from "@/components/home/Minstarrating";
import getDistanceKm from "@/utils/getDistanceMiles";
import { useAuth } from "@/hooks/useAuth.ts";

const categories = [
  {
    id: "all",
    label: "All",
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.8}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <circle cx='4.5' cy='4.5' r='2' />
        <circle cx='12' cy='4.5' r='2' />
        <circle cx='19.5' cy='4.5' r='2' />
        <circle cx='4.5' cy='12' r='2' />
        <circle cx='12' cy='12' r='2' />
        <circle cx='19.5' cy='12' r='2' />
        <circle cx='4.5' cy='19.5' r='2' />
        <circle cx='12' cy='19.5' r='2' />
        <circle cx='19.5' cy='19.5' r='2' />
      </svg>
    ),
  },
  {
    id: "event",
    label: "Events",
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.8}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <rect x='3' y='4' width='18' height='18' rx='2' />
        <path d='M16 2v4M8 2v4M3 10h18' />
        <path
          d='M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01'
          strokeWidth={2.5}
        />
      </svg>
    ),
  },
  {
    id: "deal",
    label: "Deals",
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.8}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M12.5 2.5H19a.5.5 0 0 1 .5.5v6.5a.5.5 0 0 1-.15.35l-9.5 9.5a2 2 0 0 1-2.83 0l-3.87-3.87a2 2 0 0 1 0-2.83l9.5-9.5A.5.5 0 0 1 12.5 2.5Z' />
        <circle cx='16.5' cy='7.5' r='1.2' fill='currentColor' stroke='none' />
      </svg>
    ),
  },
  {
    id: "service",
    label: "Services",
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.8}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77Z' />
      </svg>
    ),
  },
  {
    id: "alert",
    label: "Alerts",
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.8}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9' />
        <path d='M10.3 21a1.94 1.94 0 0 0 3.4 0' />
      </svg>
    ),
  },
  {
    id: "nearby",
    label: "Nearby",
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.8}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z' />
        <circle cx='12' cy='9' r='2.5' />
      </svg>
    ),
  },
  {
    id: "video",
    label: "Videos",
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.8}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <rect x='2' y='5' width='15' height='14' rx='2' />
        <path d='m17 9 5-3v12l-5-3V9Z' />
      </svg>
    ),
  },
  {
    id: "saved",
    label: "Saved",
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.8}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z' />
      </svg>
    ),
  },
  {
    id: "following",
    label: "Following",
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.8}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3Z' />
        <path d='M8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3Z' />
        <path d='M8 14c-3.33 0-5 1.67-5 2.5V18h10v-1.5c0-.83-1.67-2.5-5-2.5Z' />
        <path d='M16 14c.96 0 1.83.17 2.56.44M19 17v-1' />
        <path d='M21 16h-4' />
      </svg>
    ),
  },
  {
    id: "attending",
    label: "Attending",
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.8}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
        <path d='M22 4 12 14.01l-3-3' />
      </svg>
    ),
  },
];

const contacts = [
  {
    id: 1,
    name: "Kristin Watson",
    avatar: "/profile.png",
    status: "online",
  },
  {
    id: 2,
    name: "Dianne Russell",
    avatar: "/profile.png",
    status: "online",
  },
  {
    id: 3,
    name: "Cody Fisher",
    avatar: "/profile.png",
    status: "online",
  },
  {
    id: 4,
    name: "Floyd Miles",
    avatar: "/profile.png",
    status: "offline",
  },
  {
    id: 5,
    name: "Ralph Edwards",
    avatar: "/profile.png",
    status: "online",
  },
  {
    id: 6,
    name: "Jane Cooper",
    avatar: "/profile.png",
    status: "online",
  },
  {
    id: 7,
    name: "Ronald Richards",
    avatar: "/profile.png",
    status: "online",
  },
  {
    id: 8,
    name: "Esther Howard",
    avatar: "/profile.png",
    status: "online",
  },
  {
    id: 9,
    name: "Jacob Jones",
    avatar: "/profile.png",
    status: "online",
  },
  {
    id: 10,
    name: "Annette Black",
    avatar: "/profile.png",
    status: "offline",
  },
];

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

export default function DashboardLayout() {
  const { userLat, userLng } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [distanceRadius, setDistanceRadius] = useState([50]);
  const [minPrice, setMinPrice] = useState([150]);
  const [maxPrice, setMaxPrice] = useState([150]);
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: new Date(2025, 8, 6),
    endDate: new Date(2025, 8, 15),
  });
  const [location, setLocation] = useState<string>("");
  const [showCalendar, setShowCalendar] = useState(false);
  const search = useSelector((state: any) => state.globalSearch.searchValue);
  const [toggleSaveMutation] = useToggleSaveMutation();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [allPosts, setAllPosts] = useState<IPost[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // google places auto-suggest
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isFetching, refetch } = useGetAllPostQuery({
    category: selectedCategory,
    // subcategory: selectedCategory,
    lat: lat,
    lng: lng,
    // maxDistance: distanceRadius[0],
    // minPrice: minPrice[0],
    // maxPrice: maxPrice[0],
    // date: "",
    search,
    page,
    limit,
  });

  // const posts = allPosts?.data || [];
  const totalPosts = data?.meta?.total || 0;

  // reset posts
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setAllPosts([]);
  }, [selectedCategory, search]);

  // useEffect(() => {
  //   const accessToken = localStorage.getItem("accessToken");
  //   if (!accessToken) {
  //     localStorage.setItem("accessToken", "null");
  //   }
  // }, []);

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

  // Smoothest Infinity Scroll — IntersectionObserver
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
    try {
      const res = await toggleSaveMutation({
        postId,
      }).unwrap();
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
    setShowCalendar(false);
  };

  const handleLocationChange = ({
    location,
    lat,
    lng,
  }: {
    location: string;
    lat: number | null;
    lng: number | null;
  }) => {
    setLocation(location);
    setLat(lat);
    setLng(lng);
  };

  const handleMinStarRatingChange = (minStarRating: number[]) => {
    console.log(minStarRating);
  };

  return (
    <div className='min-h-[calc(100vh-60px)] bg-[#F3F4F6]'>
      <HeroSection />

      <div className='container mx-auto grid grid-cols-1 lg:grid-cols-[20rem_1fr] xl:grid-cols-[20rem_1fr_20rem] gap-6 mt-8'>
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

                {/* City Filter */}
                <div className='space-y-2'>
                  <Label className='text-sm font-medium text-gray-700'>
                    City
                  </Label>

                  <CommonLocationInput onChange={handleLocationChange} />
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
                          month: "short", // Use "short" for abbreviated month
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        -{" "}
                        {dateRange.endDate.toLocaleDateString("en-US", {
                          month: "short", // Use "short" for abbreviated month
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
            </div>
          </ScrollArea>
        </div>

        {/* Middle Column - Content Feed */}
        <div className='min-w-0 min-h-0'>
          <ScrollArea
            className='h-auto [&>[data-radix-scroll-area-scrollbar]]:hidden'
            ref={scrollRef}
          >
            {allPosts?.map((item: IPost) => (
              <Link
                key={item._id}
                href={`/event/${item?._id}`}
                className='p-6 space-y-6'
              >
                <Card className='overflow-hidden !border-none p-0'>
                  <div className='aspect-vide relative'>
                    {item?.image && (
                      <Image
                        width={600}
                        height={600}
                        src={item.image || ""}
                        alt={item.title}
                        className='w-full h-[232px] object-cover'
                      />
                    )}
                  </div>
                  <CardContent className='p-6'>
                    <div className='space-y-4'>
                      <div className='flex items-start justify-between'>
                        <h3 className='text-xl font-semibold text-gray-900'>
                          {item.title}
                        </h3>
                      </div>

                      <div className='flex items-center space-x-4'>
                        <div className='flex items-center gap-5 text-base text-gray-600'>
                          <div className='flex items-center gap-1'>
                            <MapPin className='w-4 h-4 text-[#15B826] flex-shrink-0' />
                            <p className='text-sm'>
                              {getDistanceKm(
                                userLng!,
                                userLat!,
                                item?.location?.coordinates[1],
                                item?.location?.coordinates[0],
                              ).toFixed(1)}{" "}
                              km
                            </p>
                          </div>

                          {item?.averageRating > 0 && (
                            <div className='flex items-center gap-1'>
                              {renderStars(
                                Math.floor(item?.averageRating || 0),
                              )}
                              <span className='text-sm font-medium text-gray-900'>
                                {item?.averageRating}
                              </span>
                            </div>
                          )}

                          <div className='flex items-center gap-1 text-[#030712] text-sm'>
                            <Tag className='w-4 h-4 text-[#108F1E]' />
                            {item?.category}
                          </div>
                        </div>
                      </div>

                      <p className='text-[#374151] text-base leading-relaxed'>
                        {item.description}
                      </p>

                      <div className='flex items-center space-x-3 pt-2'>
                        <Link
                          href={`/service-booking/${item._id}`}
                          className='h-11 flex-1 flex items-center justify-center font-semibold text-white rounded-md text-center bg-[#15B826] hover:bg-green-600'
                        >
                          Request Quote
                        </Link>
                        <Button
                          variant='outline'
                          className={`h-11 px-6 bg-transparent font-semibold text-[#15B826] border border-[#15B826] ${
                            item.isSaved ? "bg-[#15B826] text-white" : ""
                          }`}
                          onClick={() => handleSaveToggle(item?._id)}
                        >
                          {item.isSaved ? "Saved" : "Save"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {isFetching && (
              <div
                ref={loaderRef}
                className='h-12 flex items-center justify-center'
              >
                {isFetching && <Loader className='animate-spin' />}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Right Column - Map & Contacts */}
        <div className='sticky top-20 w-80 bg-transparent hidden xl:block h-[calc(100vh-80px)] overflow-y-auto'>
          <ScrollArea className='h-[calc(100vh-100px)]'>
            <div className='p-6 space-y-6'>
              {/* Map Section */}
              <div className='space-y-3'>
                <h3 className='text-lg font-semibold text-gray-900'>Map</h3>
                <div className='aspect-square bg-gray-100 rounded-lg overflow-hidden'>
                  <Image
                    width={600}
                    height={600}
                    src='/map.png'
                    alt='Map'
                    className='w-full h-full object-cover'
                  />
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Contacts
                </h3>
                <div className='space-y-3'>
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className='flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer'
                    >
                      <div className='relative'>
                        <Avatar className='w-10 h-10'>
                          <AvatarImage
                            src={contact.avatar || "/placeholder.svg"}
                            alt={contact.name}
                          />
                          <AvatarFallback>
                            {contact.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            contact.status === "online"
                              ? "bg-[#15B826]"
                              : "bg-gray-400"
                          }`}
                        />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-gray-900 truncate'>
                          {contact.name}
                        </p>
                      </div>
                      <div className='flex space-x-1'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='p-1 h-8 w-8'
                        >
                          <MessageCircle className='w-4 h-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='p-1 h-8 w-8'
                        >
                          <Phone className='w-4 h-4' />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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
