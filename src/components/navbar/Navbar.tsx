/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactElement, useEffect, useState } from "react";
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
  DropdownMenuSeparator,
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
import {
  useGetNotificationsQuery,
  useGetProfileQuery,
} from "@/redux/features/profile/profileAPI";
import { useDispatch } from "react-redux";
import { setSearchValue } from "@/redux/features/search/globalSearchSlice";
import { getTimeDifference } from "@/lib/getTimeDifferent";

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

interface MenuLink {
  divider?: false;
  label: string;
  href: string;
  icon: ReactElement;
  danger?: boolean;
  onClick?: () => void;
}

interface MenuDivider {
  divider: true;
}

type MenuItem = MenuLink | MenuDivider;

function isDivider(item: MenuItem): item is MenuDivider {
  return item.divider === true;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();
  const [page] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState<boolean>(false);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    setHasToken(!!localStorage?.getItem("accessToken"));
  }, []);

  const { data: profile, isFetching } = useGetProfileQuery(
    {},
    { skip: !hasToken },
  );

  const { data, isFetching: isFetchingNotifications } =
    useGetNotificationsQuery({ page, limit });
  const notificationsData = data?.data;
  const totalCount: number = data?.meta?.total ?? data?.meta?.total ?? 0;

  useEffect(() => {
    if (notificationsData) {
      setNotifications((prev) => [...prev, ...notificationsData]);
    }
  }, [notificationsData]);

  const dispatch = useDispatch();

  const handleLogout = (): void => {
    localStorage.removeItem("accessToken");
    router.push("/login");
    setIsDropdownOpen(false);
  };

  const menuItems: MenuItem[] = [
    {
      label: "Orders",
      href: "/orders",
      icon: (
        <svg
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.8'
          className='w-4 h-4'
        >
          <path
            d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2'
            strokeLinecap='round'
          />
          <rect x='9' y='3' width='6' height='4' rx='1' strokeLinecap='round' />
          <path d='M9 12h6M9 16h4' strokeLinecap='round' />
        </svg>
      ),
    },
    {
      label: "My Bookings",
      href: "/bookings/my",
      icon: (
        <svg
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.8'
          className='w-4 h-4'
        >
          <rect
            x='3'
            y='4'
            width='18'
            height='18'
            rx='2'
            strokeLinecap='round'
          />
          <path d='M16 2v4M8 2v4M3 10h18' strokeLinecap='round' />
        </svg>
      ),
    },
    {
      label: "Client Bookings",
      href: "/bookings/clients",
      icon: (
        <svg
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.8'
          className='w-4 h-4'
        >
          <path
            d='M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2'
            strokeLinecap='round'
          />
          <circle cx='9' cy='7' r='4' />
          <path
            d='M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75'
            strokeLinecap='round'
          />
        </svg>
      ),
    },
    {
      label: "Boosted Posts",
      href: "/posts/boosted",
      icon: (
        <svg
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.8'
          className='w-4 h-4'
        >
          <path
            d='M13 10V3L4 14h7v7l9-11h-7z'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      ),
    },
    { divider: true },
    {
      label: "Community Guidelines",
      href: "/community-guidelines",
      icon: (
        <svg
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.8'
          className='w-4 h-4'
        >
          <path d='M4 6h16M4 10h16M4 14h10' strokeLinecap='round' />
        </svg>
      ),
    },
    {
      label: "Terms of Services",
      href: "/terms",
      icon: (
        <svg
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.8'
          className='w-4 h-4'
        >
          <circle cx='12' cy='12' r='10' />
          <path d='M12 8v4M12 16h.01' strokeLinecap='round' />
        </svg>
      ),
    },
    {
      label: "Privacy Policy",
      href: "/privacy",
      icon: (
        <svg
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.8'
          className='w-4 h-4'
        >
          <path
            d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      ),
    },
    {
      label: "About Us",
      href: "/about",
      icon: (
        <svg
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.8'
          className='w-4 h-4'
        >
          <circle cx='12' cy='12' r='10' />
          <path d='M12 16v-4M12 8h.01' strokeLinecap='round' />
        </svg>
      ),
    },
    {
      label: "Support",
      href: "/support",
      icon: (
        <svg
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.8'
          className='w-4 h-4'
        >
          <path
            d='M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z'
            strokeLinecap='round'
          />
        </svg>
      ),
    },
    { divider: true },
    {
      label: "Logout",
      href: "#",
      onClick: () => setIsDropdownOpen(true),
      icon: (
        <svg
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.8'
          className='w-4 h-4'
        >
          <path
            d='M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      ),
      danger: true,
    },
  ];

  const hiddenPaths = [
    "/signup",
    "/login",
    "/forgot-password",
    "/verify-password",
    "/verify-otp",
    "/otp-verify",
    "/reset-password",
    "/payment/success",
    "/payment/failure",
  ];

  if (hiddenPaths.includes(pathname)) return null;

  return (
    <>
      <nav className='sticky top-0 z-30 bg-white backdrop-blur-md supports-[backdrop-filter]:bg-background/60 border-b border-border px-4 py-3 z-[999]'>
        <div className='container mx-auto'>
          <div className='flex items-center justify-between h-16'>
            {/* Logo + Search */}
            <div className='flex items-center gap-4'>
              <Link href='/' className='flex items-center'>
                <Image src='/logo.svg' alt='Logo' width={42} height={48} />
              </Link>
              <div className='hidden md:flex items-center relative'>
                <Search className='absolute left-3 w-4 h-4 text-muted-foreground' />
                <Input
                  placeholder='Search nearby...'
                  onChange={(e) => dispatch(setSearchValue(e.target.value))}
                  className='pl-10 w-64 bg-[#E5E7EB] border-0'
                />
              </div>
            </div>

            {/* Nav Links */}
            <div className='hidden md:flex items-center gap-8'>
              <Link
                href='/'
                className='text-lg font-medium text-[#1F2937] hover:text-[#15B826]'
              >
                Home
              </Link>
              <Link
                href='/#all-post'
                className='text-lg font-medium text-[#1F2937] hover:text-[#15B826]'
              >
                Recommended
              </Link>
              <button
                type='button'
                className='text-lg font-medium text-[#1F2937] hover:text-[#15B826]'
                onClick={() => setIsCreatePostOpen(true)}
              >
                Add Post
              </button>
            </div>

            {/* Right Section */}
            <div className='flex items-center gap-2 sm:gap-4'>
              {/* Messages */}
              <Link href='/messages' aria-label='Messages'>
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
                  <button type='button' aria-label='Notifications'>
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
                  className='w-80 max-h-[400px] overflow-y-auto p-0'
                >
                  <div className='px-4 py-3 border-b border-gray-100'>
                    <h2 className='text-base font-semibold text-gray-900'>
                      Notifications
                    </h2>
                  </div>
                  <div className='divide-y divide-gray-100'>
                    {notifications?.length ? (
                      notifications.map((notification: INotification) => (
                        <div
                          key={notification._id}
                          className='px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer'
                        >
                          <div className='flex items-start gap-3'>
                            <div className='mt-0.5 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0'>
                              <Bell className='w-3.5 h-3.5 text-white' />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <p className='text-sm text-gray-800 leading-relaxed'>
                                {notification.content}
                              </p>
                              <p className='text-xs text-gray-400 mt-1'>
                                {getTimeDifference(
                                  notification.createdAt?.split("T")[0],
                                )}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className='w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1.5' />
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className='px-4 py-8 text-center text-sm text-gray-400'>
                        No notifications yet
                      </div>
                    )}

                    <div className='flex items-center justify-center py-2'>
                      {isFetchingNotifications ? (
                        <svg
                          className='animate-spin text-[#15B826]'
                          width='18'
                          height='18'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                        >
                          <path d='M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83' />
                        </svg>
                      ) : (
                        <button
                          onClick={() => setLimit((prev) => prev + 10)}
                          className='text-sm font-semibold text-[#15B826] hover:underline px-4 py-2'
                        >
                          Show more
                        </button>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Login button if not authenticated */}
              {!isFetching && !profile?.data && (
                <Link
                  href='/login'
                  className='bg-[#15B826] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#13a522] transition'
                >
                  Login
                </Link>
              )}

              {/* User Dropdown */}
              {profile?.data && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar
                      title={profile.data.name}
                      className='relative w-12 h-12 cursor-pointer ring-2 ring-offset-1 ring-[#15B826] hover:ring-[#13a522] transition'
                    >
                      <AvatarImage src={profile.data.image || "/avatar.png"} />
                      <AvatarFallback className='bg-[#15B826] text-white font-semibold'>
                        {profile.data.name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .slice(0, 2) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className='w-56 p-2 rounded-2xl shadow-xl border border-gray-100 bg-white'
                    align='end'
                    sideOffset={8}
                  >
                    {/* Profile summary */}
                    <Link href={`/profile`}>
                      <div className='px-3 py-2 mb-1'>
                        <p className='text-sm font-semibold text-gray-900 truncate'>
                          {profile.data.name}
                        </p>
                        <p className='text-xs text-gray-400 truncate'>
                          {profile.data.email}
                        </p>
                      </div>
                    </Link>

                    <DropdownMenuSeparator className='bg-gray-100' />

                    {menuItems.map((item, index) => {
                      if (isDivider(item)) {
                        return (
                          <DropdownMenuSeparator
                            key={`divider-${index}`}
                            className='bg-gray-100 my-1'
                          />
                        );
                      }

                      const commonClasses = [
                        "flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150",
                        item.danger
                          ? "text-red-500 hover:bg-red-50"
                          : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700",
                      ].join(" ");

                      const iconClasses = [
                        "flex-shrink-0 transition-transform duration-150 group-hover:scale-110",
                        item.danger ? "text-red-400" : "text-[#15B826]",
                      ].join(" ");

                      if (item.onClick) {
                        return (
                          <button
                            key={item.label}
                            type='button'
                            role='menuitem'
                            onClick={item.onClick}
                            className={commonClasses + " group"}
                          >
                            <span className={iconClasses}>{item.icon}</span>
                            <span className='truncate'>{item.label}</span>
                          </button>
                        );
                      }

                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          role='menuitem'
                          className={commonClasses + " group"}
                        >
                          <span className={iconClasses}>{item.icon}</span>
                          <span className='truncate'>{item.label}</span>
                        </Link>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Mobile Menu Button */}
              <button
                type='button'
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
              <div className='mb-4 relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500' />
                <input
                  type='text'
                  placeholder='Search nearby...'
                  onChange={(e) => dispatch(setSearchValue(e.target.value))}
                  className='w-full pl-10 pr-4 py-2 bg-gray-200 rounded-lg text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition'
                />
              </div>
              <div className='flex flex-col items-end gap-4'>
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
                  type='button'
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

      {/* Logout Confirmation Dialog */}
      <Dialog open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogDescription className='my-4 text-xl lg:text-2xl font-semibold text-gray-900'>
              Are you sure you want to log out?
            </DialogDescription>
          </DialogHeader>
          <div className='w-full flex items-center justify-center gap-4'>
            <Button
              onClick={handleLogout}
              className='bg-transparent w-40 h-11 text-[#15B826] border border-[#15B826] hover:bg-[#15b8251f]'
            >
              Logout
            </Button>
            <DialogClose asChild>
              <Button
                variant='outline'
                className='w-40 h-11 bg-[#15B826] text-white hover:bg-[#13a522] hover:text-white'
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
