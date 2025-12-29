/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, MessageCircle, Phone, Loader, Calendar } from "lucide-react";
import Image from "next/image";
import { HeroSection } from "@/components/home/HeroSection";
import { useGetAllPostQuery } from "@/redux/features/post/postAPI";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useToggleSaveMutation } from "@/redux/features/save/saveAPI";
import Link from "next/link";
import CalendarDatePicker from "@/components/others/CalenderDatePicker";

const categories = [
  { id: "all", label: "All", icon: "🌟" },
  { id: "event", label: "Events", icon: "📅" },
  { id: "deal", label: "Deals", icon: "🏷️" },
  { id: "service", label: "Services", icon: "🔧" },
  { id: "alert", label: "Alerts", icon: "⚠️" },
  { id: "nearby", label: "Nearby", icon: "📍" },
  { id: "video", label: "Videos", icon: "📹" },
  { id: "saved", label: "Saved", icon: "❤️" },
  { id: "following", label: "Following", icon: "👥" },
  { id: "attending", label: "Attending", icon: "🎉" },
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

export interface IPost {
  _id: string;
  author: string;
  image: string | null;
  media: string | null;
  title: string;
  description: string;
  startDate: string;
  startTime: string | null;
  address: string;
  location: { type: string; coordinates: [number, number] };
  hasTag: string[];
  views: number;
  likes: number;
  endDate: string | null;
  price: string | null;
  category: string;
  subcategory: string | null;
  serviceType: string | null;
  missingName: string | null;
  missingAge: string | null;
  clothingDescription: string | null;
  lastSeenLocation: { type: string; coordinates: [number, number] };
  lastSeenDate: string | null;
  contactInfo: string | null;
  expireLimit: string | null;
  capacity: number | null;
  amenities: string | null;
  licenses: string | null;
  status: string;
  boost: boolean;
  attenders: any[];
  isSaved: boolean;
  totalSaved: number;
  schedule: any[];
  createdAt: string;
  updatedAt: string;
}

export default function DashboardLayout() {
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
  const [showCalendar, setShowCalendar] = useState(false);
  const search = useSelector((state: any) => state.globalSearch.searchValue);
  const [toggleSaveMutation] = useToggleSaveMutation();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [allPosts, setAllPosts] = useState<IPost[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 3;
  const { data, isFetching, refetch } = useGetAllPostQuery({
    category: selectedCategory,
    // subcategory: selectedCategory,
    // lat: 0,
    // lng: 0,
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
            (post: any) => !prev.some((p) => p._id === post._id)
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
      "[data-radix-scroll-area-viewport]"
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
      }
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
    endDate: Date | null
  ) => {
    setDateRange({ startDate, endDate });
    setShowCalendar(false);
  };

  return (
    <div className='min-h-[calc(100vh-60px)] bg-[#F3F4F6]'>
      <HeroSection />

      <div
        // className='container mx-auto flex justify-between gap-6 h-full mt-8'
        className='container mx-auto grid grid-cols-1 lg:grid-cols-[20rem_1fr] xl:grid-cols-[20rem_1fr_20rem] gap-6 mt-8'
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
                    className={`w-full justify-start text-left text-[#4B5563] font-medium ${
                      selectedCategory === category.id
                        ? "bg-[#15B826] hover:bg-[#0bb61c] text-white"
                        : "bg-transparent hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className='mr-2'>{category.icon}</span>
                    {category.label}
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
                  <Select defaultValue='new-york'>
                    <SelectTrigger className='w-full'>
                      <div className='flex items-center'>
                        <MapPin className='w-4 h-4 mr-2 text-gray-500' />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='new-york'>New York</SelectItem>
                      <SelectItem value='los-angeles'>Los Angeles</SelectItem>
                      <SelectItem value='chicago'>Chicago</SelectItem>
                    </SelectContent>
                  </Select>
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
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Middle Column - Content Feed */}
        <div className='min-w-0 min-h-0'>
          <ScrollArea className='h-auto' ref={scrollRef}>
            <div className='p-6 space-y-6'>
              {allPosts?.map((item: IPost) => (
                <Card
                  key={item._id}
                  className='overflow-hidden !border-none p-0'
                >
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
                        {/* <Button
                          onClick={() => handleLikeToggle(item?._id)}
                          variant='ghost'
                          size='sm'
                        >
                          <Heart className='w-4 h-4' />
                        </Button> */}
                      </div>

                      <div className='flex items-center space-x-4'>
                        <div className='flex items-center space-x-1 text-base text-gray-600'>
                          <div className='w-6 h-6'>
                            <MapPin className='w-4 h-4 text-[#15B826]' />
                          </div>
                          <p>{item.address}</p>
                        </div>
                      </div>

                      {/* {item?.reviewsCount > 0 && (
                        <div className='flex items-center space-x-1'>
                          {renderStars(Math.floor(item?.reviewsCount || 0))}
                          <span className='text-sm font-medium text-gray-900 ml-1'>
                            {item.averageRating}
                          </span>
                        </div>
                      )} */}

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
              ))}
            </div>

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
