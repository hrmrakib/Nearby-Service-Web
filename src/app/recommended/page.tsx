"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  MapPin,
  Clock,
  Users,
  Search,
  Filter,
  Heart,
  Bookmark,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface RecommendedEvent {
  id: string;
  title: string;
  image: string;
  rating: number;
  distance: string;
  price: number;
  category: string;
  duration: string;
  attendees: number;
  description: string;
  isBookmarked: boolean;
  isLiked: boolean;
  tags: string[];
}

const categories = [
  "All",
  "Music",
  "Food & Drink",
  "Arts & Culture",
  "Sports",
  "Business",
  "Technology",
];

const priceRanges = [
  "All Prices",
  "Free",
  "$1 - $50",
  "$51 - $100",
  "$101 - $200",
  "$200+",
];

const mockEvents: RecommendedEvent[] = [
  {
    id: "1",
    title: "Live Jazz Night",
    image: "/images/jazz-concert.jpg",
    rating: 4.9,
    distance: "2.3 miles",
    price: 200,
    category: "Music",
    duration: "3 hours",
    attendees: 150,
    description: "An intimate evening of smooth jazz with local artists",
    isBookmarked: true,
    isLiked: false,
    tags: ["Popular", "Tonight"],
  },
  {
    id: "2",
    title: "Wine Tasting Experience",
    image: "/wine-tasting.png",
    rating: 4.7,
    distance: "1.8 miles",
    price: 85,
    category: "Food & Drink",
    duration: "2 hours",
    attendees: 45,
    description: "Discover premium wines from local vineyards",
    isBookmarked: false,
    isLiked: true,
    tags: ["New", "Limited"],
  },
  {
    id: "3",
    title: "Art Gallery Opening",
    image: "/art-gallery-opening.png",
    rating: 4.6,
    distance: "3.1 miles",
    price: 0,
    category: "Arts & Culture",
    duration: "4 hours",
    attendees: 200,
    description: "Contemporary art exhibition featuring emerging artists",
    isBookmarked: false,
    isLiked: false,
    tags: ["Free", "Weekend"],
  },
  {
    id: "4",
    title: "Tech Startup Pitch Night",
    image: "/startup-pitch-event.png",
    rating: 4.8,
    distance: "0.9 miles",
    price: 25,
    category: "Technology",
    duration: "2.5 hours",
    attendees: 80,
    description: "Watch innovative startups pitch their ideas to investors",
    isBookmarked: true,
    isLiked: true,
    tags: ["Trending", "Networking"],
  },
  {
    id: "5",
    title: "Cooking Masterclass",
    image: "/cooking-class.png",
    rating: 4.5,
    distance: "4.2 miles",
    price: 120,
    category: "Food & Drink",
    duration: "3 hours",
    attendees: 25,
    description: "Learn to cook authentic Italian cuisine with a master chef",
    isBookmarked: false,
    isLiked: false,
    tags: ["Hands-on", "Small Group"],
  },
  {
    id: "6",
    title: "Morning Yoga Session",
    image: "/outdoor-yoga-class.png",
    rating: 4.4,
    distance: "1.5 miles",
    price: 30,
    category: "Sports",
    duration: "1.5 hours",
    attendees: 35,
    description: "Start your day with peaceful yoga in the park",
    isBookmarked: false,
    isLiked: true,
    tags: ["Morning", "Outdoor"],
  },
];

export default function RecommendedPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All Prices");
  const [events, setEvents] = useState(mockEvents);
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;
    const matchesPrice =
      selectedPriceRange === "All Prices" ||
      (selectedPriceRange === "Free" && event.price === 0) ||
      (selectedPriceRange === "$1 - $50" &&
        event.price > 0 &&
        event.price <= 50) ||
      (selectedPriceRange === "$51 - $100" &&
        event.price > 50 &&
        event.price <= 100) ||
      (selectedPriceRange === "$101 - $200" &&
        event.price > 100 &&
        event.price <= 200) ||
      (selectedPriceRange === "$200+" && event.price > 200);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const toggleBookmark = (eventId: string) => {
    setEvents(
      events.map((event) =>
        event.id === eventId
          ? { ...event, isBookmarked: !event.isBookmarked }
          : event
      )
    );
  };

  const toggleLike = (eventId: string) => {
    setEvents(
      events.map((event) =>
        event.id === eventId ? { ...event, isLiked: !event.isLiked } : event
      )
    );
  };

  const handleEventClick = (eventId: string) => {
    router.push(`/select-time?eventId=${eventId}`);
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <div className='border-b border-border bg-card'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-3xl font-bold text-foreground'>
                  Recommended for You
                </h1>
                <p className='text-muted-foreground mt-1'>
                  Discover amazing events tailored to your interests
                </p>
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowFilters(!showFilters)}
                className='lg:hidden'
              >
                <Filter className='w-4 h-4 mr-2' />
                Filters
              </Button>
            </div>

            {/* Mobile Search */}
            <div className='lg:hidden'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
                <Input
                  placeholder='Search events...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-6'>
        <div className='flex gap-6'>
          {/* Sidebar Filters */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block w-full lg:w-80 space-y-6`}
          >
            <Card className='p-6'>
              <h3 className='font-semibold text-foreground mb-4'>
                Filter Events
              </h3>

              {/* Desktop Search */}
              <div className='hidden lg:block mb-6'>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
                  <Input
                    placeholder='Search events...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='pl-10'
                  />
                </div>
              </div>

              {/* Categories */}
              <div className='space-y-3'>
                <h4 className='font-medium text-sm text-foreground'>
                  Category
                </h4>
                <div className='space-y-2'>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === category
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent text-muted-foreground hover:text-accent-foreground"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className='space-y-3'>
                <h4 className='font-medium text-sm text-foreground'>
                  Price Range
                </h4>
                <div className='space-y-2'>
                  {priceRanges.map((range) => (
                    <button
                      key={range}
                      onClick={() => setSelectedPriceRange(range)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedPriceRange === range
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent text-muted-foreground hover:text-accent-foreground"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className='flex-1'>
            <div className='flex items-center justify-between mb-6'>
              <p className='text-muted-foreground'>
                {filteredEvents.length} events found
              </p>
            </div>

            {/* Events Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
              {filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className='overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group'
                >
                  <div className='relative'>
                    <div className='relative aspect-[4/3] w-full'>
                      <Image
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        fill
                        className='object-cover group-hover:scale-105 transition-transform duration-300'
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className='absolute top-3 right-3 flex gap-2'>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(event.id);
                        }}
                        className='p-2 rounded-full bg-white/90 hover:bg-white transition-colors'
                      >
                        <Bookmark
                          className={`w-4 h-4 ${
                            event.isBookmarked
                              ? "fill-primary text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(event.id);
                        }}
                        className='p-2 rounded-full bg-white/90 hover:bg-white transition-colors'
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            event.isLiked
                              ? "fill-red-500 text-red-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Tags */}
                    <div className='absolute top-3 left-3 flex gap-2'>
                      {event.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant='secondary'
                          className='text-xs bg-white/90'
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div
                    className='p-4 space-y-3'
                    onClick={() => handleEventClick(event.id)}
                  >
                    <div>
                      <h3 className='font-semibold text-foreground group-hover:text-primary transition-colors'>
                        {event.title}
                      </h3>
                      <p className='text-sm text-muted-foreground mt-1 line-clamp-2'>
                        {event.description}
                      </p>
                    </div>

                    <div className='flex items-center justify-between text-sm'>
                      <div className='flex items-center gap-1'>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(event.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className='text-muted-foreground ml-1'>
                          {event.rating}
                        </span>
                      </div>
                      <div className='flex items-center gap-1 text-muted-foreground'>
                        <MapPin className='w-3 h-3' />
                        <span>{event.distance}</span>
                      </div>
                    </div>

                    <div className='flex items-center justify-between text-sm text-muted-foreground'>
                      <div className='flex items-center gap-3'>
                        <div className='flex items-center gap-1'>
                          <Clock className='w-3 h-3' />
                          <span>{event.duration}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Users className='w-3 h-3' />
                          <span>{event.attendees}</span>
                        </div>
                      </div>
                      <div className='font-semibold text-foreground'>
                        {event.price === 0 ? "Free" : `$${event.price}`}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className='text-center py-12'>
                <p className='text-muted-foreground'>
                  No events found matching your criteria.
                </p>
                <Button
                  variant='outline'
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setSelectedPriceRange("All Prices");
                  }}
                  className='mt-4'
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
