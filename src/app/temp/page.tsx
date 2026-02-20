"use client";

import { useState } from "react";
import { Heart, MapPin, MessageSquare, Bookmark, Share } from "lucide-react";
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
}

const galleryItems = [
  { id: 1, src: "/event-1.jpg", tag: "Trending" },
  { id: 2, src: "/hero-guitar.jpg", tag: "Exciting" },
  { id: 3, src: "/location.jpg", tag: "Lighting" },
  { id: 4, src: "/event-1.jpg", tag: "Crowd" },
];

const thumbnails = [
  "/event-1.jpg",
  "/hero-guitar.jpg",
  "/location.jpg",
  "/coffee.jpg",
];

const initialComments: Comment[] = [
  {
    id: 1,
    author: "Sarah Johnson",
    avatar: "SJ",
    content:
      "Amazing event! Can't wait for the next one. The lineup looks incredible.",
    time: "2h",
    likes: 24,
  },
  {
    id: 2,
    author: "Mike Davis",
    avatar: "MD",
    content:
      "I'll definitely be there! This is going to be an unforgettable night.",
    time: "1h",
    likes: 18,
  },
  {
    id: 3,
    author: "Jessica Lee",
    avatar: "JL",
    content: "Already got my tickets! Really looking forward to this event.",
    time: "45m",
    likes: 12,
  },
];

export default function Home() {
  const [newComment, setNewComment] = useState("");
  const [allComments, setAllComments] = useState(initialComments);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: allComments.length + 1,
        author: "You",
        avatar: "U",
        content: newComment,
        time: "now",
        likes: 0,
      };
      setAllComments([comment, ...allComments]);
      setNewComment("");
    }
  };

  return (
    <div className='min-h-screen bg-slate-100'>
      {/* Hero Section */}
      <div className='relative w-full h-56 md:h-72 overflow-hidden bg-card'>
        <Image
          src='/hero-guitar.jpg'
          alt='Night at Casa Verde'
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>

        {/* Thumbnail Photos Top Right */}
        <div className='absolute top-4 right-4 flex gap-2 z-10'>
          {thumbnails.map((thumb, idx) => (
            <div
              key={idx}
              className='w-12 h-12 rounded overflow-hidden border-2 border-white'
            >
              <Image
                src={thumb}
                alt={`Thumbnail ${idx + 1}`}
                width={48}
                height={48}
                className='w-full h-full object-cover'
              />
            </div>
          ))}
        </div>

        {/* Title */}
        <div className='absolute bottom-6 left-6 md:left-8'>
          <h1 className='text-3xl md:text-4xl font-bold text-white mb-2'>
            Night at Casa Verde
          </h1>
          <div className='flex gap-2 text-white text-xs md:text-sm'>
            <span>Sat 15 • 8:00 PM</span>
            <span>•</span>
            <span>San Francisco</span>
            <span>•</span>
            <span>2.5K Going</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-6xl mx-auto px-4 py-6 md:py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left Column */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Action Buttons */}
            <div className='flex gap-2 items-center'>
              <Button className='bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold'>
                Going
              </Button>
              <Button variant='outline' size='sm' className='rounded-full'>
                <Bookmark className='w-4 h-4' />
              </Button>
              <Button variant='outline' size='sm' className='rounded-full'>
                <Share className='w-4 h-4' />
              </Button>
              <Button variant='outline' size='sm' className='rounded-full'>
                Save
              </Button>
            </div>

            {/* About Event */}
            <Card className='bg-white p-6'>
              <h2 className='text-lg font-bold mb-4'>About the Event</h2>
              <div className='flex gap-4'>
                <div className='flex-1'>
                  <p className='text-sm text-gray-600 leading-relaxed'>
                    Join us for an unforgettable evening of live music at Casa
                    Verde. Experience exceptional local talent in an intimate
                    setting with premium acoustics. Whether you&apos;re a music
                    enthusiast or looking for a unique night out, this event
                    promises an engaging experience.
                  </p>
                  <button className='text-green-600 font-semibold text-sm mt-3 hover:underline'>
                    Read more
                  </button>
                </div>
                <Avatar className='w-12 h-12 flex-shrink-0'>
                  <AvatarImage src='https://api.dicebear.com/7.x/avataaars/svg?seed=casa' />
                  <AvatarFallback>CV</AvatarFallback>
                </Avatar>
              </div>
              <div className='mt-4 pt-4 border-t'>
                <p className='text-xs text-gray-600'>
                  Organizer:{" "}
                  <span className='font-semibold text-gray-900'>
                    Casa Verde Events
                  </span>
                </p>
              </div>
            </Card>

            {/* Gallery */}
            <Card className='bg-white p-6'>
              <h2 className='text-lg font-bold mb-1'>Moments</h2>
              <p className='text-xs text-gray-600 mb-4'>
                Photos & Videos from this Event
              </p>
              <div className='grid grid-cols-4 gap-3 mb-4'>
                {galleryItems.map((item) => (
                  <div
                    key={item.id}
                    className='relative aspect-square rounded overflow-hidden group cursor-pointer'
                  >
                    <Image
                      src={item.src}
                      alt={item.tag}
                      fill
                      className='object-cover group-hover:scale-110 transition-transform'
                    />
                    <span className='absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded text-bold'>
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
              <div className='flex gap-6 text-sm text-gray-600'>
                <button className='flex items-center gap-1 hover:text-gray-900'>
                  <Heart className='w-4 h-4' /> 1.2K
                </button>
                <button className='flex items-center gap-1 hover:text-gray-900'>
                  <MessageSquare className='w-4 h-4' /> 127
                </button>
              </div>
            </Card>

            {/* Comments */}
            <Card className='bg-white p-6'>
              <h2 className='text-lg font-bold mb-4'>Comments (42)</h2>

              {/* Add Comment */}
              <div className='flex gap-2 mb-6'>
                <Avatar className='w-8 h-8 flex-shrink-0'>
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className='flex-1 flex gap-1'>
                  <Input
                    placeholder='Add a Comment'
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className='text-sm border border-gray-300 rounded'
                  />
                  <Button
                    onClick={handleAddComment}
                    className='bg-green-600 hover:bg-green-700 text-white px-4 py-1'
                  >
                    Post
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              <div className='space-y-4'>
                {allComments.map((comment) => (
                  <div key={comment.id} className='flex gap-3'>
                    <Avatar className='w-8 h-8 flex-shrink-0'>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.avatar}`}
                      />
                      <AvatarFallback>{comment.avatar}</AvatarFallback>
                    </Avatar>
                    <div className='flex-1'>
                      <div className='bg-gray-100 rounded p-3'>
                        <p className='font-semibold text-sm'>
                          {comment.author}
                        </p>
                        <p className='text-sm text-gray-700'>
                          {comment.content}
                        </p>
                      </div>
                      <div className='flex gap-3 mt-1 text-xs text-gray-600'>
                        <button className='hover:text-gray-900 flex items-center gap-1'>
                          <Heart className='w-3 h-3' /> {comment.likes}
                        </button>
                        <span>{comment.time} ago</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className='text-green-600 font-semibold text-sm mt-4 hover:underline'>
                Add more comments
              </button>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className='space-y-4'>
            {/* Location */}
            <Card className='bg-white overflow-hidden'>
              <div className='relative w-full h-32'>
                <Image
                  src='/location.jpg'
                  alt='Location'
                  fill
                  className='object-cover'
                />
              </div>
              <div className='p-4'>
                <h3 className='font-bold text-sm mb-2'>Location</h3>
                <div className='flex gap-2 text-xs text-gray-700 mb-3'>
                  <MapPin className='w-3 h-3 flex-shrink-0 mt-0.5' />
                  <div>
                    <p>Casa Verde, San Francisco, CA</p>
                    <p className='text-gray-500'>123 Music Lane</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* CTA Section */}
            <div className='bg-white p-4 rounded-lg'>
              <h3 className='font-bold text-sm mb-2'>Unlock your Next Jamee</h3>
              <p className='text-xs text-gray-600 mb-3'>
                Interested in seeing similar events? Create a free account to
                connect with communities you love.
              </p>
              <Button className='w-full bg-green-600 hover:bg-green-700 text-white py-2 font-semibold'>
                Discover More
              </Button>
            </div>

            {/* Event Cards */}
            <Card className='bg-white overflow-hidden'>
              <div className='relative w-full h-32'>
                <Image
                  src='/event-1.jpg'
                  alt='Live Jazz Night'
                  fill
                  className='object-cover'
                />
              </div>
              <div className='p-3'>
                <h4 className='font-bold text-sm'>Live Late Night</h4>
                <p className='text-xs text-gray-600 mt-1'>0.2 miles away</p>
                <div className='flex items-center gap-1 mt-2'>
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xs ${i < 4 ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      ★
                    </span>
                  ))}
                  <span className='text-xs text-gray-600 ml-1'>4.9</span>
                </div>
                <div className='flex gap-2 mt-3'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex-1 text-xs py-1'
                  >
                    Learn more
                  </Button>
                  <Button size='sm' className='px-2 py-1 border'>
                    <Heart className='w-3 h-3' />
                  </Button>
                </div>
              </div>
            </Card>

            <Card className='bg-white overflow-hidden'>
              <div className='relative w-full h-32'>
                <Image
                  src='/coffee.jpg'
                  alt='Cozy Coffee Spot'
                  fill
                  className='object-cover'
                />
              </div>
              <div className='p-3'>
                <h4 className='font-bold text-sm'>Cozy Coffee Spot</h4>
                <p className='text-xs text-gray-600 mt-1'>0.1 miles away</p>
                <div className='flex items-center gap-1 mt-2'>
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xs ${i < 4 ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      ★
                    </span>
                  ))}
                  <span className='text-xs text-gray-600 ml-1'>4.7</span>
                </div>
                <div className='flex gap-2 mt-3'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex-1 text-xs py-1'
                  >
                    Learn more
                  </Button>
                  <Button size='sm' className='px-2 py-1 border'>
                    <Heart className='w-3 h-3' />
                  </Button>
                </div>
              </div>
            </Card>

            <Card className='bg-white overflow-hidden'>
              <div className='relative w-full h-32'>
                <Image
                  src='/event-1.jpg'
                  alt='Live Jazz Night'
                  fill
                  className='object-cover'
                />
              </div>
              <div className='p-3'>
                <h4 className='font-bold text-sm'>Live Jazz Night</h4>
                <p className='text-xs text-gray-600 mt-1'>0.5 miles away</p>
                <div className='flex items-center gap-1 mt-2'>
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xs ${i < 4 ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      ★
                    </span>
                  ))}
                  <span className='text-xs text-gray-600 ml-1'>4.8</span>
                </div>
                <div className='flex gap-2 mt-3'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex-1 text-xs py-1'
                  >
                    Learn more
                  </Button>
                  <Button size='sm' className='px-2 py-1 border'>
                    <Heart className='w-3 h-3' />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
