"use client";

import { useState } from "react";
import { Search, MessageCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreatePostModal from "@/components/CreatePostModal";
import Image from "next/image";

export default function Navbar() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  return (
    <>
      <nav className='bg-white border-b border-border px-4 py-3'>
        <div className='flex items-center justify-between container mx-auto'>
          {/* Logo */}
          <div className='flex items-center gap-4'>
            <div>
              <Image src='/logo.svg' alt='Logo' width={42} height={48} />
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className='hidden md:flex items-center relative'>
              <Search className='absolute left-3 w-4 h-4 text-muted-foreground' />
              <Input
                placeholder='Search nearby...'
                className='pl-10 w-64 bg-gray-50 border-0'
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className='hidden md:flex items-center gap-8'>
            <Button
              variant='ghost'
              className='text-foreground hover:text-primary'
            >
              Home
            </Button>
            <Button
              variant='ghost'
              className='text-foreground hover:text-primary'
            >
              Recommended
            </Button>
            <Button
              variant='ghost'
              className='text-foreground hover:text-primary'
              onClick={() => setIsCreatePostOpen(true)}
            >
              Add Post
            </Button>
          </div>

          {/* Right Side Icons */}
          <div className='flex items-center gap-3'>
            {/* Mobile Search */}
            <Button variant='ghost' size='icon' className='md:hidden'>
              <Search className='w-5 h-5' />
            </Button>

            {/* Messages */}
            <Button variant='ghost' size='icon'>
              <MessageCircle className='w-5 h-5' />
            </Button>

            {/* Notifications */}
            <Button variant='ghost' size='icon'>
              <Bell className='w-5 h-5' />
            </Button>

            {/* Profile */}
            <Avatar className='w-8 h-8'>
              <AvatarImage src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-2VoKCmB8myDIP93N1AKJS2YVO5Dfvg.png' />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className='md:hidden mt-3 flex justify-center gap-6'>
          <Button variant='ghost' className='text-sm'>
            Home
          </Button>
          <Button variant='ghost' className='text-sm'>
            Recommended
          </Button>
          <Button
            variant='ghost'
            className='text-sm'
            onClick={() => setIsCreatePostOpen(true)}
          >
            Add Post
          </Button>
        </div>
      </nav>

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />
    </>
  );
}
