/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Upload, MapPin, Calendar, Clock } from "lucide-react";

interface PostDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

export default function PostDealModal({
  isOpen,
  onClose,
  onBack,
}: PostDealModalProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-lg p-0 max-h-[90vh] overflow-y-auto'>
        <DialogHeader className='flex flex-row items-center justify-between p-4 border-b'>
          <h2 className='text-lg font-semibold'>Post-Deal</h2>
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

          {/* Time Period */}
          <div>
            <label className='text-sm font-medium mb-2 block'>
              Time Period
            </label>
            <div className='grid grid-cols-2 gap-3'>
              <div className='relative'>
                <Input
                  placeholder='Start'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Calendar className='absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500' />
              </div>
              <div className='relative'>
                <Input
                  placeholder='End'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <Clock className='absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500' />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className='text-sm font-medium mb-2 block'>Location</label>
            <div className='relative'>
              <Input placeholder='Select location' />
              <MapPin className='absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500' />
            </div>
          </div>

          {/* Hashtags */}
          <div>
            <label className='text-sm font-medium mb-2 block'>Hashtags</label>
            <Input placeholder='Enter hashtags for discovery' />
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
