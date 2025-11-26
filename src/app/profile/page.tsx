/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CloudUpload, MapPin, Star } from "lucide-react";
import Image from "next/image";
import {
  useGetAttendingEventQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/features/profile/profileAPI";
import { toast } from "sonner";
import AttendingEvents from "@/components/profile/AttendingEvents";
import SavedPost from "@/components/profile/SavedPost";
import MyPost from "@/components/profile/MyPost";

interface EventCard {
  id: string;
  title: string;
  image: string;
  distance: string;
  rating: number;
  description: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
}

const eventCards: EventCard[] = [
  {
    id: "1",
    title: "Cozy Coffee Spot",
    image: "/event/1.jpg",
    distance: "2.3 miles",
    rating: 4.9,
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam nunc tempus sagittis mauris. Tincidunt fermentum mi aenean tempus sagittis mauris. Tincidunt fermentum mi aenean",
  },
  {
    id: "2",
    title: "Rainbow Bar",
    image: "/event/2.jpg",
    distance: "2.3 miles",
    rating: 4.9,
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam nunc tempus sagittis mauris. Tincidunt fermentum mi aenean tempus sagittis mauris. Tincidunt fermentum mi aenean",
  },
  {
    id: "3",
    title: "Live Jazz Night",
    image: "/event/3.jpg",
    distance: "2.3 miles",
    rating: 4.9,
    description:
      "Lorem ipsum dolor sit amet consectetur. Aliquam nunc tempus sagittis mauris. Tincidunt fermentum mi aenean tempus sagittis mauris. Tincidunt fermentum mi aenean",
  },
];

const followers: User[] = [
  { id: "1", name: "Theresa Webb", avatar: "/profile.png" },
  { id: "2", name: "Devon Lane", avatar: "/profile.png" },
  { id: "3", name: "Robert Fox", avatar: "/profile.png" },
  { id: "4", name: "Guy Hawkins", avatar: "/profile.png" },
  { id: "5", name: "Floyd Miles", avatar: "/profile.png" },
  { id: "6", name: "Jenny Wilson", avatar: "/profile.png" },
  { id: "7", name: "Jacob Jones", avatar: "/profile.png" },
  { id: "8", name: "Arlene McCoy", avatar: "/profile.png" },
  { id: "9", name: "Ralph Edwards", avatar: "/profile.jpg" },
  { id: "10", name: "Esther Howard", avatar: "/profile.jpg" },
  { id: "11", name: "Floyd Miles", avatar: "/profile.png" },
];

const following: User[] = [
  { id: "1", name: "Theresa Webb", avatar: "/profile.png" },
  { id: "2", name: "Devon Lane", avatar: "/profile.png" },
  { id: "3", name: "Robert Fox", avatar: "/profile.png" },
  { id: "4", name: "Guy Hawkins", avatar: "/profile.png" },
  { id: "5", name: "Floyd Miles", avatar: "/profile.png" },
  { id: "6", name: "Jenny Wilson", avatar: "/profile.png" },
  { id: "7", name: "Jacob Jones", avatar: "/profile.png" },
  { id: "8", name: "Arlene McCoy", avatar: "/profile.png" },
  { id: "9", name: "Ralph Edwards", avatar: "/profile.jpg" },
  { id: "10", name: "Esther Howard", avatar: "/profile.jpg" },
  { id: "11", name: "Floyd Miles", avatar: "/profile.png" },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"post" | "attending" | "saved">(
    "post"
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [image, setImage] = useState();
  const [imagePreview, setImagePreview] = useState<string | null>();
  const [user, setUser] = useState({
    name: "",
    location: "",
    image: "",
    bio: "",
    paypalAccount: "",
  });
  const { data: userProfile, refetch } = useGetProfileQuery(undefined);
  const [updateProfileMutation] = useUpdateProfileMutation();

  const profile = userProfile?.data;

  useEffect(() => {
    setUser({
      name: profile?.name,
      location: profile?.address,
      image: profile?.image,
      bio: profile?.bio,
      paypalAccount: profile?.paypalAccount,
    });
  }, [profile]);

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();
      const data = {
        name: user.name,
        address: user.location,
        bio: user.bio,
        paypalAccount: user.paypalAccount,
      };

      formData.append("data", JSON.stringify(data));
      if (image) {
        formData.append("profile_pic", image);
      }

      const res = await updateProfileMutation(formData).unwrap();

      console.log(res);

      if (res?.success) {
        toast.success(res?.message);
        refetch();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsEditMode(false);
    }
  };

  const handleCancelEdit = () => {
    // setEditData(profileData);
    setIsEditMode(false);
  };

  const handleEditProfile = () => {
    setIsEditMode(true);
  };

  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];

    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  console.log(image);

  if (isEditMode) {
    return (
      <div className='min-h-screen bg-[#F3F4F6] Z-10'>
        <div className='max-w-xl mx-auto bg-transparent min-h-screen'>
          <div className='px-6 pt-8 pb-6'>
            {/* Profile Image */}
            <div className='z-10 relative w-24 h-24 mx-auto mb-8'>
              <div className='w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-green-500 p-1'>
                <div className='w-full h-full rounded-full overflow-hidden relative'>
                  <Image
                    src={imagePreview ?? user?.image}
                    alt='Profile Image'
                    width={120}
                    height={120}
                    className='w-full h-full object-cover'
                  />

                  {/* File input for image upload */}
                  <input
                    id='file-upload'
                    type='file'
                    accept='image/*'
                    onChange={handleImageUpload}
                    className='absolute bottom-0 left-0 w-full h-full opacity-0 cursor-pointer'
                  />

                  {/* Upload Icon */}
                  <div className='Z-50 absolute -bottom-2 right-2 z-40 text-white bg-[#15b82580] p-2 rounded-full border-2 border-white'>
                    <label htmlFor='file-upload'>
                      <CloudUpload className='w-6 h-6' />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <div className='space-y-6'>
              <div>
                <label className='block text-lg font-bold text-[#030712] mb-2'>
                  Name
                </label>
                <Input
                  value={user?.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className='w-full h-12 bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-lg'
                  placeholder='Enter your name'
                />
              </div>

              <div>
                <label className='block text-lg font-bold text-[#030712] mb-2'>
                  Paypal Account (Email) <span className='text-red-500'>*</span>
                </label>
                <Input
                  value={user?.paypalAccount}
                  onChange={(e) =>
                    setUser({ ...user, paypalAccount: e.target.value })
                  }
                  className='w-full h-12 bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-lg'
                  placeholder='Enter your Paypal Account (Email)'
                />
              </div>

              <div>
                <label className='block text-lg font-bold text-[#030712] mb-2'>
                  Location
                </label>
                <Input
                  value={user?.location}
                  onChange={(e) =>
                    setUser({ ...user, location: e.target.value })
                  }
                  className='w-full h-12 bg-white border-2 border-gray-300 rounded-lg px-4 py-2 text-lg'
                />
              </div>

              <div>
                <label className='block text-lg font-bold text-[#030712] mb-2'>
                  Bio
                </label>
                <Textarea
                  value={user?.bio}
                  onChange={(e) => setUser({ ...user, bio: e.target.value })}
                  placeholder='Add bio...'
                  className='w-full min-h-40 bg-white border-2 border-gray-300 resize-none !text-base'
                />
              </div>

              <div className='flex gap-3 mt-10'>
                <Button
                  onClick={handleSaveChanges}
                  className='flex-1 h-12 bg-[#15B826] hover:bg-[#0bca1e] text-white rounded-full py-3'
                >
                  Save Changes
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  variant='outline'
                  className='flex-1 h-12 rounded-full py-3 bg-transparent'
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-[#F3F4F6]'>
      <div className='max-w-3xl mx-auto bg-transparent min-h-screen'>
        {/* Profile Header */}
        <div className='px-6 pt-8 pb-6 text-center'>
          {/* Profile Image */}
          <div className='relative w-24 h-24 mx-auto mb-4'>
            <div className='w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-green-500 p-1'>
              <div className='w-full h-full rounded-full overflow-hidden relative'>
                <Image
                  src={profile?.image || "/profile.png"}
                  alt={profile?.name || "Profile Image"}
                  width={88}
                  height={88}
                  className='w-full h-full object-cover'
                />
                {/* Online indicator */}
                <div className='absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white'></div>
              </div>
            </div>
          </div>

          {/* Name */}
          <h1 className='text-xl font-semibold text-[#1F2937] mb-2'>
            {profile?.name || "No Name"}
          </h1>

          {/* Location */}
          <div className='flex items-center justify-center gap-1 text-[#4B5563] mb-6'>
            <MapPin className='w-4 h-4' />
            <span className='text-sm'>
              {profile?.address || "No address provided"}
            </span>
          </div>
        </div>

        {/* Bio Section */}
        <div className='px-6 pb-6'>
          <div className='bg-white rounded-lg p-4'>
            <h2 className='text-lg lg:text-[30px] font-bold text-[#1F2937] mb-3'>
              Bio
            </h2>
            <p className='text-[#4B5563] text-lg leading-relaxed'>
              {profile?.bio || "No bio available."}
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className='px-6 pb-6'>
          <div className='flex justify-between gap-5'>
            <div className='flex-1 text-center bg-white hover:bg-gray-50 rounded-lg p-2 transition-colors'>
              <div className='text-2xl lg:text-[30px] font-bold text-[#1F2937]'>
                {profile?.post || 0}
              </div>
              <div className='text-base text-[#4B5563]'>Posts</div>
            </div>
            <button
              onClick={() => setShowFollowersModal(true)}
              className='flex-1 text-center bg-white hover:bg-gray-50 rounded-lg p-2 transition-colors cursor-pointer'
            >
              <div className='text-2xl font-bold text-[#1F2937]'>
                {profile?.follower || 0}
              </div>
              <div className='text-base text-[#4B5563]'>Followers</div>
            </button>
            <button
              onClick={() => setShowFollowingModal(true)}
              className='flex-1 text-center bg-white hover:bg-gray-50 rounded-lg p-2 transition-colors cursor-pointer'
            >
              <div className='text-2xl font-bold text-[#1F2937]'>
                {profile?.following || 0}
              </div>
              <div className='text-base text-[#4B5563]'>Following</div>
            </button>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className='px-6 pb-6 text-center'>
          <Button
            onClick={handleEditProfile}
            variant='outline'
            className='px-8 py-2 rounded-full border-green-500 text-green-500 hover:bg-green-50 bg-transparent'
          >
            Edit Profile
          </Button>
        </div>

        {/* Tabs */}
        <div className='px-6 pb-4'>
          <div className='flex gap-4'>
            <button
              onClick={() => setActiveTab("post")}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                activeTab === "post"
                  ? "bg-green-500 text-white"
                  : "text-[#4B5563] hover:text-[#1F2937]"
              }`}
            >
              Post
            </button>
            <button
              onClick={() => setActiveTab("attending")}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                activeTab === "attending"
                  ? "bg-green-500 text-white"
                  : "text-[#4B5563] hover:text-[#1F2937]"
              }`}
            >
              Attending
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                activeTab === "saved"
                  ? "bg-green-500 text-white"
                  : "text-[#4B5563] hover:text-[#1F2937]"
              }`}
            >
              Saved
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='px-6 pb-6'>
          {activeTab === "post" && <MyPost />}

          {activeTab === "attending" && <AttendingEvents />}

          {activeTab === "saved" && <SavedPost />}
        </div>

        {/* Followers Modal */}
        <Dialog open={showFollowersModal} onOpenChange={setShowFollowersModal}>
          <DialogContent className='max-w-sm mx-auto max-h-[80vh] p-0'>
            <DialogHeader className='p-4 pb-2 border-b'>
              <div className='flex items-center justify-between'>
                <DialogTitle className='text-lg font-semibold'>
                  Followers (120)
                </DialogTitle>
                <button
                  onClick={() => setShowFollowersModal(false)}
                  className='p-1 hover:bg-gray-100 rounded-full'
                >
                  {/* <X className='w-5 h-5' /> */}
                </button>
              </div>
            </DialogHeader>
            <div className='overflow-y-auto max-h-96 p-4'>
              <div className='space-y-3'>
                {followers.map((user) => (
                  <div key={user.id} className='flex items-center gap-3'>
                    <Avatar className='w-10 h-10'>
                      <AvatarImage
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                      />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className='font-medium text-[#1F2937]'>
                      {user.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Following Modal */}
        <Dialog open={showFollowingModal} onOpenChange={setShowFollowingModal}>
          <DialogContent className='max-w-sm mx-auto max-h-[80vh] p-0'>
            <DialogHeader className='p-4 pb-2 border-b'>
              <div className='flex items-center justify-between'>
                <DialogTitle className='text-lg font-semibold'>
                  Following (325)
                </DialogTitle>
                <button
                  onClick={() => setShowFollowingModal(false)}
                  className='p-1 hover:bg-gray-100 rounded-full'
                >
                  {/* <X className='w-5 h-5' /> */}
                </button>
              </div>
            </DialogHeader>
            <div className='overflow-y-auto max-h-96 p-4'>
              <div className='space-y-3'>
                {following.map((user) => (
                  <div key={user.id} className='flex items-center gap-3'>
                    <Avatar className='w-10 h-10'>
                      <AvatarImage
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                      />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className='font-medium text-[#1F2937]'>
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
