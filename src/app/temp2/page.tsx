"use client";

import { useState } from "react";
import {
  Heart,
  Share2,
  MapPin,
  Clock,
  Calendar,
  Users,
  MessageSquare,
  Bookmark,
  Reply,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
  replies?: Comment[];
}

interface SidebarCard {
  id: number;
  title: string;
  image: string;
  rating?: number;
  attendees?: string;
  description?: string;
  type: "event" | "highlight";
}

const galleryItems = [
  { id: 1, src: "/event-1.jpg", alt: "Concert crowd", tag: "Crowd" },
  {
    id: 2,
    src: "/hero-guitar.jpg",
    alt: "Guitarist on stage",
    tag: "Performance",
  },
  { id: 3, src: "/location.jpg", alt: "Venue exterior", tag: "Venue" },
  { id: 4, src: "/event-1.jpg", alt: "Event atmosphere", tag: "Lights" },
];

const initialComments: Comment[] = [
  {
    id: 1,
    author: "Sarah Johnson",
    avatar: "SJ",
    content:
      "This is going to be amazing! Can't wait for Saturday night. The lineup looks incredible.",
    time: "2h ago",
    likes: 24,
    replies: [
      {
        id: 2,
        author: "Mike Chen",
        avatar: "MC",
        content: "Right? I heard the guitarist is phenomenal. See you there!",
        time: "1h ago",
        likes: 5,
      },
    ],
  },
  {
    id: 3,
    author: "Jessica Lee",
    avatar: "JL",
    content: "Already got my tickets! Really looking forward to this.",
    time: "45m ago",
    likes: 12,
  },
];

const sidebarCards: SidebarCard[] = [
  {
    id: 1,
    title: "Live Jazz Night",
    image: "/event-1.jpg",
    rating: 4.8,
    attendees: "8.2K going",
    type: "event",
  },
  {
    id: 2,
    title: "Cozy Coffee Spot",
    image: "/coffee.jpg",
    description: "Perfect for pre-event hang",
    type: "highlight",
  },
  {
    id: 3,
    title: "Live Late Night",
    image: "/location.jpg",
    rating: 4.9,
    attendees: "12 shares",
    type: "event",
  },
];

export default function Home() {
  const [likedPhotos, setLikedPhotos] = useState<number[]>([]);
  const [newComment, setNewComment] = useState("");
  const [allComments, setAllComments] = useState(initialComments);
  const [savedItems, setSavedItems] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setLikedPhotos((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: allComments.length + 1,
        author: "You",
        avatar: "YOU",
        content: newComment,
        time: "now",
        likes: 0,
      };
      setAllComments([comment, ...allComments]);
      setNewComment("");
    }
  };

  const toggleSave = (id: number) => {
    setSavedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div
      key={comment.id}
      className={`flex gap-3 md:gap-4 ${isReply ? "ml-6 md:ml-10" : ""}`}
    >
      <Avatar className='w-10 h-10 flex-shrink-0'>
        <AvatarImage
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.avatar}`}
        />
        <AvatarFallback>{comment.avatar}</AvatarFallback>
      </Avatar>
      <div className='flex-1 min-w-0'>
        <div className='bg-muted/50 rounded-lg p-3 md:p-4'>
          <p className='font-semibold text-sm md:text-base'>{comment.author}</p>
          <p className='text-sm md:text-base text-foreground mt-1'>
            {comment.content}
          </p>
        </div>
        <div className='flex items-center gap-3 mt-2 text-xs md:text-sm text-muted-foreground'>
          <button className='hover:text-foreground transition-colors flex items-center gap-1'>
            <Heart className='w-3 h-3 md:w-4 md:h-4' />
            <span>{comment.likes}</span>
          </button>
          <button className='hover:text-foreground transition-colors flex items-center gap-1'>
            <Reply className='w-3 h-3 md:w-4 md:h-4' />
            <span>Reply</span>
          </button>
          <span>{comment.time}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen bg-background text-foreground'>
      {/* Hero Section */}
      <div className='relative w-full h-64 md:h-80 lg:h-96 overflow-hidden bg-card'>
        <Image
          src='/hero-guitar.jpg'
          alt='Night at Casa Verde - Live Music Event'
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent'></div>

        {/* Content Overlay */}
        <div className='absolute inset-0 flex flex-col justify-end p-4 md:p-8'>
          <div className='space-y-3'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-white text-balance'>
              Night at Casa Verde
            </h1>

            {/* Event Meta Info */}
            <div className='flex flex-wrap gap-4 md:gap-6 text-sm md:text-base text-gray-200'>
              <div className='flex items-center gap-2'>
                <Calendar className='w-4 h-4' />
                <span>Sat, Mar 15, 2025</span>
              </div>
              <div className='flex items-center gap-2'>
                <Clock className='w-4 h-4' />
                <span>8:00 PM - 11:00 PM</span>
              </div>
              <div className='flex items-center gap-2'>
                <MapPin className='w-4 h-4' />
                <span>Casa Verde, San Francisco</span>
              </div>
              <div className='flex items-center gap-2'>
                <Users className='w-4 h-4' />
                <span>2.5K Going</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 py-8 md:py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>
          {/* Left Column - Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Action Buttons */}
            <div className='flex flex-wrap gap-3 items-center'>
              <Button className='bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-base'>
                Going
              </Button>
              <Button
                variant='outline'
                size='icon'
                className='border-border hover:bg-muted'
              >
                <Bookmark className='w-5 h-5' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                className='border-border hover:bg-muted'
              >
                <Share2 className='w-5 h-5' />
              </Button>
            </div>

            {/* Event Info Card */}
            <Card className='bg-card border-border p-6'>
              <div className='space-y-6'>
                {/* About Event */}
                <div>
                  <h2 className='text-xl md:text-2xl font-semibold mb-4'>
                    About the event
                  </h2>
                  <p className='text-sm md:text-base text-muted-foreground leading-relaxed'>
                    Join us for an unforgettable evening of live music at Casa
                    Verde. Experience exceptional local talent in an intimate
                    setting with premium acoustics and warm atmosphere. Whether
                    you&apos;re a music enthusiast or looking for a unique night
                    out, this event promises an engaging experience with
                    talented performers and a vibrant community.
                  </p>
                  <button className='text-primary font-semibold text-sm mt-3 hover:underline'>
                    Read more
                  </button>
                </div>

                {/* Organizer */}
                <div className='border-t border-border pt-6'>
                  <h3 className='text-lg font-semibold mb-4'>Organizer</h3>
                  <div className='flex items-start gap-4'>
                    <Avatar className='w-12 h-12'>
                      <AvatarImage src='https://api.dicebear.com/7.x/avataaars/svg?seed=casa' />
                      <AvatarFallback>CV</AvatarFallback>
                    </Avatar>
                    <div className='flex-1'>
                      <p className='font-semibold text-base'>
                        Casa Verde Events
                      </p>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Curating unique music experiences in San Francisco
                      </p>
                      <button className='text-primary font-semibold text-sm mt-2 hover:underline'>
                        Contact Organizer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Gallery */}
            <Card className='bg-card border-border p-6'>
              <div className='space-y-6'>
                <div>
                  <h2 className='text-xl md:text-2xl font-semibold mb-2'>
                    Moments
                  </h2>
                  <p className='text-sm text-muted-foreground'>
                    Photos & Videos from the Event
                  </p>
                </div>

                {/* Gallery Grid */}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4'>
                  {galleryItems.map((item) => (
                    <div
                      key={item.id}
                      className='relative aspect-square rounded-lg overflow-hidden bg-muted group cursor-pointer'
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        className='object-cover group-hover:scale-105 transition-transform duration-300'
                      />
                      <div className='absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center'>
                        <span className='text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity'>
                          {item.tag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Engagement Stats */}
                <div className='flex flex-wrap gap-4 pt-4 border-t border-border'>
                  <button className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'>
                    <Heart className='w-5 h-5' />
                    <span className='text-sm'>1,284 likes</span>
                  </button>
                  <button className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'>
                    <MessageSquare className='w-5 h-5' />
                    <span className='text-sm'>127 comments</span>
                  </button>
                </div>
              </div>
            </Card>

            {/* Comments */}
            <Card className='bg-card border-border p-6'>
              <div className='space-y-6'>
                <h2 className='text-xl md:text-2xl font-semibold'>
                  Comments (42)
                </h2>

                {/* Add Comment */}
                <div className='flex gap-3 md:gap-4'>
                  <Avatar className='w-10 h-10 flex-shrink-0'>
                    <AvatarImage src='https://api.dicebear.com/7.x/avataaars/svg?seed=user' />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className='flex-1 flex gap-2'>
                    <Input
                      placeholder='Add a comment...'
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddComment()
                      }
                      className='bg-muted/50 border-border text-foreground placeholder:text-muted-foreground'
                    />
                    <Button
                      onClick={handleAddComment}
                      className='bg-primary hover:bg-primary/90 text-primary-foreground px-4 md:px-6'
                    >
                      Post
                    </Button>
                  </div>
                </div>

                {/* Comments List */}
                <div className='space-y-6 border-t border-border pt-6'>
                  {allComments.map((comment) => (
                    <div key={comment.id}>
                      {renderComment(comment)}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className='space-y-4 mt-4'>
                          {comment.replies.map((reply) =>
                            renderComment(reply, true),
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button className='text-primary font-semibold text-sm hover:underline'>
                  Load more comments
                </button>
              </div>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className='lg:col-span-1'>
            <div className='space-y-4'>
              {/* Location Card */}
              <Card className='bg-card border-border overflow-hidden'>
                <div className='relative w-full h-48'>
                  <Image
                    src='/location.jpg'
                    alt='Casa Verde Location'
                    fill
                    className='object-cover'
                  />
                </div>
                <div className='p-4 md:p-6'>
                  <h3 className='text-lg font-semibold mb-2'>Location</h3>
                  <div className='flex gap-2 items-start mb-4'>
                    <MapPin className='w-4 h-4 mt-1 flex-shrink-0 text-muted-foreground' />
                    <div>
                      <p className='text-sm font-medium'>
                        Casa Verde, San Francisco, CA
                      </p>
                      <p className='text-xs text-muted-foreground mt-1'>
                        123 Music Lane, SF 94105
                      </p>
                    </div>
                  </div>
                  <Button
                    variant='outline'
                    className='w-full border-border hover:bg-muted'
                  >
                    Get Directions
                  </Button>
                </div>
              </Card>

              {/* Highlights */}
              <div>
                <h3 className='font-semibold text-base md:text-lg mb-3 px-2'>
                  Unlock your next Jamee
                </h3>
                <p className='text-xs text-muted-foreground px-2 mb-4'>
                  Interested in seeing similar events? Create a free account to
                  connect with communities you love.
                </p>
                <Button className='w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 font-semibold'>
                  Discover More
                </Button>
              </div>

              {/* Event Cards */}
              <div className='space-y-4'>
                {sidebarCards.map((card) => (
                  <Card
                    key={card.id}
                    className='bg-card border-border overflow-hidden hover:border-primary/50 transition-colors'
                  >
                    <div className='relative w-full h-32 md:h-40'>
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <div className='p-3 md:p-4'>
                      <h4 className='font-semibold text-sm md:text-base line-clamp-2'>
                        {card.title}
                      </h4>
                      {card.description && (
                        <p className='text-xs text-muted-foreground mt-1'>
                          {card.description}
                        </p>
                      )}
                      {card.rating && (
                        <div className='flex items-center gap-2 mt-2'>
                          <div className='flex items-center gap-1'>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(card.rating!)
                                    ? "fill-yellow-500 text-yellow-500"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <span className='text-xs text-muted-foreground'>
                            {card.rating}
                          </span>
                        </div>
                      )}
                      {card.attendees && (
                        <p className='text-xs text-muted-foreground mt-1'>
                          {card.attendees}
                        </p>
                      )}
                      <div className='flex gap-2 mt-3'>
                        <Button
                          variant='outline'
                          size='sm'
                          className='flex-1 border-border hover:bg-muted h-8'
                        >
                          Learn more
                        </Button>
                        <button
                          onClick={() => toggleSave(card.id)}
                          className={`p-2 rounded-md transition-colors ${
                            savedItems.includes(card.id)
                              ? "bg-primary text-primary-foreground"
                              : "border border-border hover:bg-muted"
                          }`}
                          title='Save'
                        >
                          <Heart
                            className='w-4 h-4'
                            fill={
                              savedItems.includes(card.id)
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
