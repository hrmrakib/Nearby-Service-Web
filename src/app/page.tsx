"use client";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  MapPin,
  Star,
  Heart,
  MessageCircle,
  Phone,
} from "lucide-react";
import CalendarDatePicker from "@/components/others/CalenderDatePicker";
import Image from "next/image";

const categories = [
  { id: "all", label: "All", icon: "🌟" },
  { id: "events", label: "Events", icon: "📅" },
  { id: "deals", label: "Deals", icon: "🏷️" },
  { id: "services", label: "Services", icon: "🔧" },
  { id: "alerts", label: "Alerts", icon: "⚠️" },
];

const contentItems = [
  {
    id: 1,
    title: "Cozy Coffee Spot",
    image: "/product/1.jpg",
    rating: 4.9,
    distance: "2.3 miles",
    description:
      "Lorem ipsum dolor sit amet consectetur. Cursus dictum cursus massa justo massa sed nibh sagittis nunc. Amet aliquet ac sit etiam elementum tempus commodo ornare ac.",
    type: "deal",
  },
  {
    id: 2,
    title: "Live Jazz Night",
    image: "/product/2.jpg",
    rating: 4.9,
    distance: "2.3 miles",
    description:
      "Lorem ipsum dolor sit amet consectetur. Cursus dictum cursus massa justo massa sed nibh sagittis nunc. Amet aliquet ac sit etiam elementum tempus commodo ornare ac.",
    type: "event",
  },
  {
    id: 3,
    title: "Live Jazz Night",
    image: "/product/1.jpg",
    rating: 4.9,
    distance: "2.3 miles",
    description:
      "Lorem ipsum dolor sit amet consectetur. Cursus dictum cursus massa justo massa sed nibh sagittis nunc. Amet aliquet ac sit etiam elementum tempus commodo ornare ac.",
    type: "event",
  },
  {
    id: 4,
    title: "Live Jazz Night",
    image: "/product/2.jpg",
    rating: 4.9,
    distance: "2.3 miles",
    description:
      "Lorem ipsum dolor sit amet consectetur. Cursus dictum cursus massa justo massa sed nibh sagittis nunc. Amet aliquet ac sit etiam elementum tempus commodo ornare ac.",
    type: "event",
  },
  {
    id: 5,
    title: "Live Jazz Night",
    image: "/product/1.jpg",
    rating: 4.9,
    distance: "2.3 miles",
    description:
      "Lorem ipsum dolor sit amet consectetur. Cursus dictum cursus massa justo massa sed nibh sagittis nunc. Amet aliquet ac sit etiam elementum tempus commodo ornare ac.",
    type: "event",
  },
  {
    id: 6,
    title: "Live Jazz Night",
    image: "/product/2.jpg",
    rating: 4.9,
    distance: "2.3 miles",
    description:
      "Lorem ipsum dolor sit amet consectetur. Cursus dictum cursus massa justo massa sed nibh sagittis nunc. Amet aliquet ac sit etiam elementum tempus commodo ornare ac.",
    type: "event",
  },
  {
    id: 7,
    title: "Live Jazz Night",
    image: "/product/1.jpg",
    rating: 4.9,
    distance: "2.3 miles",
    description:
      "Lorem ipsum dolor sit amet consectetur. Cursus dictum cursus massa justo massa sed nibh sagittis nunc. Amet aliquet ac sit etiam elementum tempus commodo ornare ac.",
    type: "event",
  },
];

const contacts = [
  {
    id: 1,
    name: "Kristin Watson",
    avatar: "/placeholder-user.jpg",
    status: "online",
  },
  {
    id: 2,
    name: "Dianne Russell",
    avatar: "/placeholder-user.jpg",
    status: "online",
  },
  {
    id: 3,
    name: "Cody Fisher",
    avatar: "/placeholder-user.jpg",
    status: "online",
  },
  {
    id: 4,
    name: "Floyd Miles",
    avatar: "/placeholder-user.jpg",
    status: "offline",
  },
  {
    id: 5,
    name: "Ralph Edwards",
    avatar: "/placeholder-user.jpg",
    status: "online",
  },
  {
    id: 6,
    name: "Jane Cooper",
    avatar: "/placeholder-user.jpg",
    status: "online",
  },
  {
    id: 7,
    name: "Ronald Richards",
    avatar: "/placeholder-user.jpg",
    status: "online",
  },
  {
    id: 8,
    name: "Esther Howard",
    avatar: "/placeholder-user.jpg",
    status: "online",
  },
  {
    id: 9,
    name: "Jacob Jones",
    avatar: "/placeholder-user.jpg",
    status: "online",
  },
  {
    id: 10,
    name: "Annette Black",
    avatar: "/placeholder-user.jpg",
    status: "offline",
  },
];

export default function DashboardLayout() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [distanceRadius, setDistanceRadius] = useState([50]);
  const [maxPrice, setMaxPrice] = useState([150]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: new Date(2025, 8, 6), // September 6, 2025
    endDate: new Date(2025, 8, 15), // September 15, 2025
  });
  const [showCalendar, setShowCalendar] = useState(false);

  const handleStarToggle = (stars: number) => {
    setSelectedStars((prev) =>
      prev.includes(stars) ? prev.filter((s) => s !== stars) : [...prev, stars]
    );
  };

  const handleDateRangeChange = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    setDateRange({ startDate, endDate });
    setShowCalendar(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className='min-h-[calc(100vh-60px)] bg-[#F3F4F6]'>
      <div className='container flex gap-6 h-full mx-auto'>
        {/* Left Column - Filters */}
        <div className='sticky top-20 w-80 bg-transparent hidden lg:block h-[calc(100vh-80px)] overflow-y-auto'>
          <ScrollArea className='h-full'>
            <div className='p-6 space-y-6'>
              {/* Category Buttons */}
              <div className='space-y-2'>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "outline"
                    }
                    className={`w-full justify-start text-left ${
                      selectedCategory === category.id
                        ? "bg-[#15B826] hover:bg-green-600 text-white"
                        : "bg-white hover:bg-gray-50"
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
                    <div className='absolute top-full left-0 z-50 mt-1'>
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
                </div>

                {/* Distance Radius */}
                <div className='space-y-3'>
                  <Label className='text-sm font-medium text-gray-700'>
                    Distance Radius
                  </Label>
                  <div className='px-2'>
                    <Slider
                      value={distanceRadius}
                      onValueChange={setDistanceRadius}
                      max={100}
                      step={5}
                      className='w-full'
                    />
                    <div className='flex justify-between text-xs text-gray-500 mt-1'>
                      <span>0 miles</span>
                      <span>{distanceRadius[0]} miles</span>
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

                {/* Min Star Rating */}
                <div className='space-y-3'>
                  <Label className='text-sm font-medium text-gray-700'>
                    Min. Star Rating
                  </Label>
                  <div className='space-y-2'>
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className='flex items-center space-x-2'>
                        <Checkbox
                          id={`stars-${stars}`}
                          checked={selectedStars.includes(stars)}
                          onCheckedChange={() => handleStarToggle(stars)}
                        />
                        <label
                          htmlFor={`stars-${stars}`}
                          className='flex items-center space-x-1 cursor-pointer'
                        >
                          <div className='flex'>
                            {Array.from({ length: stars }, (_, i) => (
                              <Star
                                key={i}
                                className='w-4 h-4 fill-[#15B826] text-[#15B826]'
                              />
                            ))}
                            {Array.from({ length: 5 - stars }, (_, i) => (
                              <Star key={i} className='w-4 h-4 text-gray-300' />
                            ))}
                          </div>
                          <span className='text-sm text-gray-600'>
                            ({stars}+ Stars)
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Middle Column - Content Feed */}
        <div className='flex-1 bg-transparent'>
          <ScrollArea className='h-full'>
            <div className='p-6 space-y-6'>
              {contentItems.map((item) => (
                <Card
                  key={item.id}
                  className='overflow-hidden !border-none p-0'
                >
                  <div className='aspect-vide relative'>
                    <Image
                      width={600}
                      height={600}
                      src={item.image}
                      alt={item.title}
                      className='w-full h-[232px] object-cover'
                    />
                  </div>
                  <CardContent className='p-6'>
                    <div className='space-y-4'>
                      <div className='flex items-start justify-between'>
                        <h3 className='text-xl font-semibold text-gray-900'>
                          {item.title}
                        </h3>
                        <Button variant='ghost' size='sm'>
                          <Heart className='w-4 h-4' />
                        </Button>
                      </div>

                      <div className='flex items-center space-x-4'>
                        <div className='flex items-center space-x-1'>
                          {renderStars(Math.floor(item.rating))}
                          <span className='text-sm font-medium text-gray-900 ml-1'>
                            {item.rating}
                          </span>
                        </div>
                        <div className='flex items-center space-x-1 text-sm text-gray-600'>
                          <MapPin className='w-4 h-4' />
                          <span>{item.distance}</span>
                        </div>
                      </div>

                      <p className='text-gray-600 text-sm leading-relaxed'>
                        {item.description}
                      </p>

                      <div className='flex space-x-3 pt-2'>
                        <Button className='flex-1 bg-[#15B826] hover:bg-green-600'>
                          Request Quote
                        </Button>
                        <Button
                          variant='outline'
                          className='px-6 bg-transparent'
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right Column - Map & Contacts */}
        <div className='sticky top-20 w-80 bg-transparent hidden xl:block h-[calc(100vh-80px)] overflow-y-auto'>
          <ScrollArea className='h-full'>
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
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
