/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Bell, Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreatePostModal from "@/components/CreatePostModal";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useGetProfileQuery } from "@/redux/features/profile/profileAPI";
import { useDispatch } from "react-redux";
import { setSearchValue } from "@/redux/features/search/globalSearchSlice";
import { useGetNotificationsQuery } from "@/redux/features/post/postAPI";
import { getTimeDifference } from "@/lib/getTimeDifferent";

interface Notification {
  id: number;
  message: string;
  timestamp: string;
  isRead: boolean;
}
interface INotification {
  _id: string;
  content: string;
  senderId: string;
  receiverId: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!localStorage?.getItem("accessToken"));
  }, []);

  const { data: profile, isFetching } = useGetProfileQuery(
    {},
    {
      skip: !hasToken,
    },
  );

  const { data } = useGetNotificationsQuery({
    page,
    limit,
  });
  const notifications = data?.data;
  console.log(data);

  const dispatch = useDispatch();

  const handleLogout = () => {
    // Handle logout logic here
    localStorage.removeItem("accessToken");
    router.push("/login");
    setIsDropdownOpen(false);
  };

  if (
    pathname === "/signup" ||
    pathname === "/login" ||
    pathname === "/forgot-password" ||
    pathname === "/verify-password" ||
    pathname === "/verify-otp" ||
    pathname === "/otp-verify" ||
    pathname === "/reset-password" ||
    pathname === "/payment/success" ||
    pathname === "/payment/failure"
  ) {
    return null;
  }

  return (
    <>
      <nav className='sticky top-0 z-30 bg-white backdrop-blur-md supports-[backdrop-filter]:bg-background/60 border-b border-border px-4 py-3'>
        <div className='container mx-auto'>
          <div className='flex items-center justify-between h-16'>
            {/* Logo Section */}

            <div className='flex items-center gap-4'>
              <Link href='/' className='flex items-center'>
                <Image src='/logo.svg' alt='Logo' width={42} height={48} />
              </Link>

              {/* Search Bar - Hidden on mobile */}
              <div className='hidden md:flex items-center relative'>
                <Search className='absolute left-3 w-4 h-4 text-muted-foreground' />
                <Input
                  placeholder='Search nearby...'
                  onChange={(e) => dispatch(setSearchValue(e.target.value))}
                  className='pl-10 w-64 bg-[#E5E7EB] border-0'
                />
              </div>
            </div>

            {/* Navigation Links */}
            <div className='hidden md:flex items-center gap-8'>
              <Link
                href='/'
                className='text-lg font-medium text-[#1F2937] hover:text-[#15B826]'
              >
                Home
              </Link>
              <Link
                href='/recommended'
                className='text-lg font-medium text-[#1F2937] hover:text-[#15B826]'
              >
                Recommended
              </Link>
              <button
                className='text-lg font-medium text-[#1F2937] hover:text-[#15B826]'
                onClick={() => setIsCreatePostOpen(true)}
              >
                Add Post
              </button>
            </div>

            {/* Right Icons Section */}
            <div className='flex items-center gap-2 sm:gap-4'>
              {/* Icons visible on all screen sizes */}
              {/* Messages */}
              <Link href='/messages'>
                <svg
                  width='48'
                  height='48'
                  viewBox='0 0 48 48'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <rect
                    x='-0.00012207'
                    width='48'
                    height='48'
                    rx='24'
                    fill='#E5E7EB'
                  />
                  <path
                    d='M18.9999 24L28.9999 24'
                    stroke='#1F2937'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M18.9999 20L24.9999 20'
                    stroke='#1F2937'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M14.9999 32.2895V17C14.9999 15.8954 15.8953 15 16.9999 15H30.9999C32.1044 15 32.9999 15.8954 32.9999 17V27C32.9999 28.1046 32.1044 29 30.9999 29H19.9611C19.3536 29 18.7789 29.2762 18.3994 29.7506L16.0684 32.6643C15.7141 33.1072 14.9999 32.8567 14.9999 32.2895Z'
                    stroke='#1F2937'
                    strokeWidth='1.5'
                  />
                </svg>
              </Link>

              {/* Notifications */}
              <Popover>
                <PopoverTrigger asChild>
                  <button>
                    <svg
                      width='48'
                      height='48'
                      viewBox='0 0 48 48'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <rect
                        x='-0.00012207'
                        width='48'
                        height='48'
                        rx='24'
                        fill='#E5E7EB'
                      />
                      <path
                        d='M29.9999 20.4C29.9999 18.7026 29.3677 17.0747 28.2425 15.8745C27.1173 14.6743 25.5912 14 23.9999 14C22.4086 14 20.8825 14.6743 19.7572 15.8745C18.632 17.0747 17.9999 18.7026 17.9999 20.4C17.9999 27.8667 14.9999 30 14.9999 30H32.9999C32.9999 30 29.9999 27.8667 29.9999 20.4Z'
                        stroke='#1F2937'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M25.7299 33C25.5541 33.3031 25.3017 33.5547 24.9981 33.7295C24.6945 33.9044 24.3503 33.9965 23.9999 33.9965C23.6495 33.9965 23.3053 33.9044 23.0017 33.7295C22.6981 33.5547 22.4457 33.3031 22.2699 33'
                        stroke='#1F2937'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  align='end'
                  sideOffset={10}
                  alignOffset={300}
                  className='max-w-2xl max-h-[400px] overflow-y-auto'
                >
                  <div className='h-auto bg-gradient-to-br from-gray-50 to-gray-100'>
                    <div className='max-w-2xl mx-auto px-4 pb-6 sm:py-8'>
                      <div className='px-4 py-1 border-b border-gray-100'>
                        <h1 className='text-xl sm:text-2xl font-semibold text-gray-900'>
                          Notifications
                        </h1>
                      </div>

                      <div className='divide-y divide-gray-100'>
                        {notifications?.map((notification: INotification) => (
                          <div
                            key={notification?._id}
                            className='py-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer'
                          >
                            <div className='flex flex-col items-start gap-3 sm:gap-4'>
                              <div className='w-full flex items-center justify-between'>
                                <div className='mt-1'>
                                  <div className='w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md p-1'>
                                    <Bell className='w-5 h-5 sm:w-6 sm:h-6 text-white' />
                                  </div>
                                </div>

                                <div className='flex items-center gap-2 ml-2'>
                                  <span className='text-xs sm:text-sm text-gray-500 whitespace-nowrap'>
                                    {getTimeDifference(
                                      notification?.createdAt?.split("T")[0],
                                    )}
                                  </span>
                                  {!notification?.read && (
                                    <div className='w-2 h-2 bg-green-500 rounded-full flex-shrink-0' />
                                  )}
                                </div>
                              </div>

                              <div className='flex-1 min-w-0'>
                                <p className='text-sm sm:text-base text-gray-900 leading-relaxed'>
                                  {notification?.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {!isFetching && !profile?.data && (
                <Link
                  href='/login'
                  className='bg-[#15B826] text-white px-4 py-2 rounded-md'
                >
                  Login
                </Link>
              )}

              {/* User Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {!profile?.data?.image ? null : (
                    <Avatar
                      title={profile?.data?.name}
                      className='relative w-12 h-12'
                    >
                      <AvatarImage
                        src={profile?.data?.image || "/avatar.png"}
                      />
                      <AvatarFallback>
                        {profile?.data?.name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("") || "N/A"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className='z-[999] w-40 border-none'
                  align='end'
                  forceMount
                >
                  <div className='p-3 flex flex-col gap-2 rounded-md'>
                    <Link href='/profile' className='hover:text-[#15B826]'>
                      View Profile
                    </Link>
                    <button
                      onClick={() => setIsDropdownOpen(true)}
                      className='w-full text-left hover:text-red-500'
                    >
                      Logout
                    </button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className='md:hidden p-2 hover:bg-gray-100 rounded-full transition'
                aria-label='Toggle menu'
              >
                {isOpen ? (
                  <X className='w-6 h-6 text-gray-700' />
                ) : (
                  <Menu className='w-6 h-6 text-gray-700' />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className='md:hidden border-t border-gray-200 py-4 px-2 space-y-2'>
              {/* Mobile Search Bar */}
              <div className='mb-4'>
                <div className='relative w-full'>
                  <input
                    type='text'
                    placeholder='Search nearby...'
                    // value={searchValue}
                    onChange={(e) => dispatch(setSearchValue(e.target.value))}
                    className='w-full pl-10 pr-4 py-2 bg-gray-200 rounded-lg text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition'
                  />
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500' />
                </div>
              </div>

              {/* Mobile Navigation Links */}

              <div className='flex flex-col items-end gap-8'>
                <Link
                  href='/'
                  className='text-lg font-medium text-[#1F2937] hover:text-[#15B826]'
                >
                  Home
                </Link>
                <Link
                  href='/recommended'
                  className='text-lg font-medium text-[#1F2937] hover:text-[#15B826]'
                >
                  Recommended
                </Link>
                <button
                  className='text-lg font-medium text-[#1F2937] hover:text-[#15B826]'
                  onClick={() => setIsCreatePostOpen(true)}
                >
                  Add Post
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />

      <Dialog open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DialogContent className='sm:max-w-[525px]'>
          <DialogHeader>
            <DialogDescription className='my-4 text-xl lg:text-[30px] font-semibold'>
              Are you sure you want to log out?
            </DialogDescription>
          </DialogHeader>
          <div className='w-full flex items-center justify-center gap-6'>
            <Button
              onClick={() => handleLogout()}
              className='bg-transparent w-40 h-11 !text-[#15B826] border !border-[#15B826] hover:bg-[#15b8251f] '
            >
              Logout
            </Button>
            <DialogClose asChild>
              <Button
                variant='outline'
                className='w-40 h-11 bg-[#15B826] text-white'
                onClick={() => setIsDropdownOpen(false)}
              >
                Cancel
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
