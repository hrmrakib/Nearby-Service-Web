"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, MessageCircle, X } from "lucide-react";
import Image from "next/image";

// Mock data for followers and following
const mockUsers = [
  { id: 1, name: "Theresa Webb", avatar: "/woman-profile.png" },
  { id: 2, name: "Devon Lane", avatar: "/man-profile.png" },
  { id: 3, name: "Robert Fox", avatar: "/man-profile-2.png" },
  { id: 4, name: "Guy Hawkins", avatar: "/man-profile-3.png" },
  { id: 5, name: "Floyd Miles", avatar: "/man-profile-4.png" },
  { id: 6, name: "Jenny Wilson", avatar: "/woman-profile-two.png" },
  { id: 7, name: "Jacob Jones", avatar: "/man-profile-5.png" },
  { id: 8, name: "Arlene McCoy", avatar: "/woman-profile-3.png" },
  { id: 9, name: "Ralph Edwards", avatar: "/man-profile-6.png" },
  { id: 10, name: "Esther Howard", avatar: "/woman-profile-4.png" },
  { id: 11, name: "Floyd Miles", avatar: "/man-profile-7.jpg" },
];

// Mock events data
const mockEvents = [
  {
    id: 1,
    title: "Cozy Coffee Spot",
    distance: "2.3 miles",
    rating: 4.9,
    image: "/cozy-coffee-shop.png",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam nunc tempus sagittis mauris. Placerat fermentum mi auctor ornare ipsum non sed. Urna diam faucibus amet sed felis elementum aliquam suspendisse proin. Amet suscipit arcu.",
  },
  {
    id: 2,
    title: "Rainbow Bar",
    distance: "2.3 miles",
    rating: 4.9,
    image: "/colorful-neon-bar-interior.jpg",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam nunc tempus sagittis mauris. Placerat fermentum mi auctor ornare ipsum non sed. Urna diam faucibus amet sed felis elementum aliquam suspendisse proin. Amet suscipit arcu.",
  },
  {
    id: 3,
    title: "Live Jazz Night",
    distance: "2.3 miles",
    rating: 4.9,
    image: "/live-jazz-concert-crowd.jpg",
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam nunc tempus sagittis mauris. Placerat fermentum mi auctor ornare ipsum non sed. Urna diam faucibus amet sed felis elementum aliquam suspendisse proin. Amet suscipit arcu.",
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Post");
  const [followersModalOpen, setFollowersModalOpen] = useState(false);
  const [followingModalOpen, setFollowingModalOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-md mx-auto bg-white min-h-screen'>
        {/* Profile Header */}
        <div className='px-6 pt-8 pb-6 text-center'>
          <div className='relative inline-block mb-4'>
            <Avatar className='w-24 h-24 mx-auto'>
              <AvatarImage
                src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cqYTa9Hi6XCMKHHvB8usFyM4rtJ58T.png'
                alt='Susan Flores'
                className='object-cover'
              />
              <AvatarFallback>SF</AvatarFallback>
            </Avatar>
          </div>

          <h1 className='text-xl font-semibold text-gray-900 mb-1'>
            Susan Flores
          </h1>

          <div className='flex items-center justify-center text-gray-500 text-sm mb-6'>
            <MapPin className='w-4 h-4 mr-1' />
            Los Angeles, CA
          </div>

          <div className='flex gap-3 justify-center'>
            <Button
              onClick={handleFollow}
              className={`px-8 py-2 rounded-lg font-medium ${
                isFollowing
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
            <Button
              variant='outline'
              className='px-6 py-2 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent'
            >
              <MessageCircle className='w-4 h-4 mr-2' />
              Message
            </Button>
          </div>
        </div>

        {/* Bio Section */}
        <div className='px-6 mb-6'>
          <h2 className='text-lg font-semibold text-gray-900 mb-3'>Bio</h2>
          <p className='text-gray-600 text-sm leading-relaxed'>
            Lorem ipsum dolor sit amet consectetur. Sapien ut viverra in quis.
            Ac dictum pellentesque tortor id eu facilisis quisque urna. Iaculis
            eros viverra non ut eu. Molestie phasellus nibh consectetur aliquam
            egestas hendrerit arcu. Fermentum rhoncus enim elementum magna
            praesent aenean aliquet. Velit id sed montes sapien
          </p>
        </div>

        {/* Stats Section */}
        <div className='px-6 mb-6'>
          <div className='flex justify-between'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-gray-900'>12</div>
              <div className='text-sm text-gray-500'>Posts</div>
            </div>
            <div
              className='text-center cursor-pointer'
              onClick={() => setFollowersModalOpen(true)}
            >
              <div className='text-2xl font-bold text-gray-900'>102</div>
              <div className='text-sm text-gray-500'>Followers</div>
            </div>
            <div
              className='text-center cursor-pointer'
              onClick={() => setFollowingModalOpen(true)}
            >
              <div className='text-2xl font-bold text-gray-900'>325</div>
              <div className='text-sm text-gray-500'>Following</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='px-6 mb-4'>
          <div className='flex gap-4'>
            <button
              onClick={() => setActiveTab("Post")}
              className={`px-6 py-2 rounded-lg font-medium ${
                activeTab === "Post"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Post
            </button>
            <button
              onClick={() => setActiveTab("Attending")}
              className={`px-6 py-2 rounded-lg font-medium ${
                activeTab === "Attending"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Attending
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className='px-6 pb-8'>
          <div className='space-y-4'>
            {mockEvents.map((event) => (
              <Card key={event.id} className='overflow-hidden'>
                <div className='relative h-48'>
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    fill
                    className='object-cover'
                  />
                </div>
                <div className='p-4'>
                  <h3 className='font-semibold text-gray-900 mb-1'>
                    {event.title}
                  </h3>
                  <div className='flex items-center text-sm text-gray-500 mb-2'>
                    <MapPin className='w-3 h-3 mr-1' />
                    {event.distance}
                    <span className='mx-2'>•</span>
                    <span className='flex items-center'>⭐ {event.rating}</span>
                  </div>
                  <p className='text-xs text-gray-600 leading-relaxed'>
                    {event.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Followers Modal */}
        <Dialog open={followersModalOpen} onOpenChange={setFollowersModalOpen}>
          <DialogContent className='max-w-sm mx-auto max-h-[80vh] p-0'>
            <DialogHeader className='p-4 pb-2 border-b'>
              <div className='flex items-center justify-between'>
                <DialogTitle className='text-lg font-semibold'>
                  Followers (120)
                </DialogTitle>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setFollowersModalOpen(false)}
                  className='h-8 w-8 p-0'
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
            </DialogHeader>
            <div className='overflow-y-auto max-h-96 p-4'>
              <div className='space-y-3'>
                {mockUsers.map((user) => (
                  <div key={user.id} className='flex items-center gap-3'>
                    <Avatar className='w-10 h-10'>
                      <AvatarImage
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                      />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className='text-sm font-medium text-gray-900'>
                      {user.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Following Modal */}
        <Dialog open={followingModalOpen} onOpenChange={setFollowingModalOpen}>
          <DialogContent className='max-w-sm mx-auto max-h-[80vh] p-0'>
            <DialogHeader className='p-4 pb-2 border-b'>
              <div className='flex items-center justify-between'>
                <DialogTitle className='text-lg font-semibold'>
                  Following (325)
                </DialogTitle>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setFollowingModalOpen(false)}
                  className='h-8 w-8 p-0'
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
            </DialogHeader>
            <div className='overflow-y-auto max-h-96 p-4'>
              <div className='space-y-3'>
                {mockUsers.map((user) => (
                  <div key={user.id} className='flex items-center gap-3'>
                    <Avatar className='w-10 h-10'>
                      <AvatarImage
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                      />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className='text-sm font-medium text-gray-900'>
                      {user.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
