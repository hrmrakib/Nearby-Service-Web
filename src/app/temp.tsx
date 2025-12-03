/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, Upload, MapPin } from "lucide-react";

interface PostAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

export default function PostAlertModal({
  isOpen,
  onClose,
  onBack,
}: PostAlertModalProps) {
  const [selectedCategory, setSelectedCategory] = useState("");

  const alertCategories = [
    "Community Update",
    "Safety Alert",
    "Lost & Found",
    "Weather / Hazard",
    "Missing Person",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-lg p-0 max-h-[90vh] overflow-y-auto'>
        <DialogHeader className='flex flex-row items-center justify-between p-4 border-b'>
          <h2 className='text-lg font-semibold'>Post-Alert</h2>
          <Button variant='ghost' size='icon' onClick={onClose}>
            <X className='w-4 h-4' />
          </Button>
        </DialogHeader>

        <div className='p-4 space-y-6'>
          {/* Cover Photo/Video */}
          <div>
            <label className='text-sm font-medium mb-2 block'>
              Cover Photo / Video
            </label>
            <div className='border-2 border-dashed border-gray-200 rounded-lg p-8 text-center'>
              <Upload className='w-6 h-6 mx-auto mb-2 text-gray-400' />
              <p className='text-sm text-gray-500'>Upload Photo/Video</p>
            </div>
          </div>

          {/* Add More Media */}
          <div>
            <label className='text-sm font-medium mb-2 block'>
              Add More Media
            </label>
            <div className='flex gap-2'>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className='w-16 h-16 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center'
                >
                  <Plus className='w-4 h-4 text-gray-400' />
                </div>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className='text-sm font-medium mb-2 block'>Title</label>
            <Input placeholder='Enter title' />
          </div>

          {/* Description */}
          <div>
            <label className='text-sm font-medium mb-2 block'>
              Description
            </label>
            <Textarea placeholder='Enter description' rows={4} />
          </div>

          {/* Location */}
          <div>
            <label className='text-sm font-medium mb-2 block'>Location</label>
            <div className='relative'>
              <Input placeholder='Select location' />
              <MapPin className='absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500' />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className='text-sm font-medium mb-2 block'>Category</label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder='Choose alert category' />
              </SelectTrigger>
              <SelectContent>
                {alertCategories.map((category) => (
                  <SelectItem
                    key={category}
                    value={category.toLowerCase().replace(/\s+/g, "-")}
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Contact Info */}
          <div>
            <label className='text-sm font-medium mb-2 block'>
              Contact Info
            </label>
            <Input placeholder='Share contact information' />
          </div>

          {/* Hashtags */}
          <div>
            <label className='text-sm font-medium mb-2 block'>Hashtags</label>
            <Input placeholder='Enter hashtags for discovery' />
          </div>

          {/* Set auto-expire */}
          <div>
            <label className='text-sm font-medium mb-2 block'>
              Set auto-expire
            </label>
            <Select defaultValue='7-days'>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='1-day'>1 Day</SelectItem>
                <SelectItem value='3-days'>3 Days</SelectItem>
                <SelectItem value='7-days'>7 Days</SelectItem>
                <SelectItem value='14-days'>14 Days</SelectItem>
                <SelectItem value='30-days'>30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Publish Button */}
          <Button className='w-full bg-green-500 hover:bg-green-600 text-white'>
            Publish
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
