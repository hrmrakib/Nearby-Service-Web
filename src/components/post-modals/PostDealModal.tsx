/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload, MapPin, Video, Loader } from "lucide-react";
import Image from "next/image";
import AutoCompleteLocation from "../location/AutoCompleteLocation";
import {
  useCreateDealPostMutation,
  useCreateEventPostMutation,
} from "@/redux/features/post/postAPI";
import { toast } from "sonner";
import CommonLocationInput from "../location/CommonLocationInput";

interface PostEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

export default function PostDealModal({
  isOpen,
  onClose,
  onBack,
}: PostEventModalProps) {
  const [coverVideoPreview, setCoverVideoPreview] = useState<string | null>(
    null,
  );
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null,
  );
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverVideo, setCoverVideo] = useState<File | null>(null);

  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState<any[]>([]);
  const [location, setLocation] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const locationTimeout = useRef<any>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [createDealPostMutation, { isLoading }] = useCreateDealPostMutation();

  const handleCoverImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image")) return;
    setCoverImage(file);
  };

  const handleCoverVideoUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("video")) return;
    setCoverVideo(file);
  };

  const handleMoreImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []) as File[];
    const imageFiles = files.filter((file) => file.type.startsWith("image"));

    setImages((prev: File[]) => [...prev, ...imageFiles]);
  };

  const handleMoreVideos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []) as File[];
    const videoFiles = files.filter((file) => file.type.startsWith("video"));

    setVideos((prev: File[]) => [...prev, ...videoFiles]);
  };

  const handleLocationChange = ({
    location,
    lat,
    lng,
  }: {
    location: string;
    lat: number | null;
    lng: number | null;
  }) => {
    setLocation(location);
    setLat(lat);
    setLng(lng);
  };

  const selectLocation = (place: any) => {
    setLocationQuery(place.display_name);
    setLat(place.lat);
    setLng(place.lon);
    setLocationResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = inputValue.trim().replace(/^#/, ""); // remove leading #
      if (value && !hashtags.includes(value)) {
        setHashtags([...hashtags, value]);
      }
      setInputValue(""); // reset input
    }
  };

  const handleRemove = (tag: string) => {
    setHashtags(hashtags.filter((t) => t !== tag));
  };

  const buildPayload = () => {
    const isoStartDateTime = new Date(`${date}T${time}`).toISOString();
    const isoEndDateTime = new Date(`${endDate}T${endTime}`).toISOString();

    return {
      title,
      description,
      startDate: isoStartDateTime,
      endDate: isoEndDateTime,
      address: locationQuery,
      category: "Event",
      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
      hasTag: hashtags,
    };
  };

  const handlePublish = async () => {
    const start = new Date(`${date}T${time}`);
    const end = new Date(`${endDate}T${endTime}`);

    if (!date || !time || !endDate || !endTime) {
      toast.error("Please select both start and end date & time.");
      return;
    }

    if (end < start) {
      toast.error("End date/time cannot be earlier than start date/time.");
      return;
    }

    try {
      const formData = new FormData();

      const dataObj = buildPayload();

      formData.append("data", JSON.stringify(dataObj));

      if (coverImage) formData.append("image", coverImage);
      if (coverVideo) formData.append("media", coverVideo);

      images.forEach((file) => formData.append("media", file));
      videos.forEach((file) => formData.append("media", file));

      const res = await createDealPostMutation(formData).unwrap();

      if (res?.success) {
        toast.success(res?.message);
        onClose();
      }
    } catch (err) {
      toast.error("Upload failed.");
      console.error("Upload Failed:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-lg p-0 max-h-[90vh] overflow-y-auto scrollbar'>
        <DialogHeader className='flex flex-row items-center justify-between p-4 border-b'>
          <DialogTitle className='text-lg font-semibold'>Post Deal</DialogTitle>
        </DialogHeader>

        <div className='p-4 space-y-6'>
          <div>
            <label className='text-sm font-bold mb-2 block'>
              Cover Image / Cover Video
            </label>

            <div className='grid grid-cols-2 gap-3'>
              {/* IMAGE UPLOAD */}
              <label
                htmlFor='cover-image-upload'
                className='border rounded-lg p-3 flex flex-col items-center cursor-pointer'
              >
                {coverImage ? (
                  <Image
                    alt='Cover'
                    width={300}
                    height={300}
                    src={URL.createObjectURL(coverImage)}
                    className='w-full h-32 object-cover rounded'
                  />
                ) : (
                  <>
                    <Upload className='w-6 h-6 text-gray-400' />
                    <p className='text-xs text-gray-500 mt-2'>Upload Image</p>
                  </>
                )}
              </label>

              {/* VIDEO UPLOAD */}
              <label
                htmlFor='cover-video-upload'
                className='border rounded-lg p-3 flex flex-col items-center cursor-pointer'
              >
                {coverVideo ? (
                  <video
                    src={URL.createObjectURL(coverVideo)}
                    controls
                    className='w-full h-32 rounded'
                  />
                ) : (
                  <>
                    <Video className='w-6 h-6 text-gray-400' />
                    <p className='text-xs text-gray-500 mt-2'>Upload Video</p>
                  </>
                )}
              </label>
            </div>

            <input
              id='cover-image-upload'
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handleCoverImageUpload}
            />

            <input
              id='cover-video-upload'
              type='file'
              accept='video/*'
              className='hidden'
              onChange={handleCoverVideoUpload}
            />
          </div>

          <div>
            <label className='text-sm font-bold mb-2 block'>
              Add More Images
            </label>

            <div className='flex gap-2 flex-wrap'>
              {images.map((img, i) => (
                <div key={i} className='relative w-16 h-16'>
                  <Image
                    alt='additional'
                    width={200}
                    height={200}
                    src={URL.createObjectURL(img)}
                    className='w-16 h-16 object-cover rounded'
                  />
                  <button
                    className='absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full'
                    onClick={() =>
                      setImages(images.filter((_, idx) => idx !== i))
                    }
                  >
                    ×
                  </button>
                </div>
              ))}

              <label
                htmlFor='more-images-upload'
                className='w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer'
              >
                <Plus className='w-4 h-4 text-gray-400' />
              </label>

              <input
                id='more-images-upload'
                type='file'
                multiple
                accept='image/*'
                className='hidden'
                onChange={handleMoreImages}
              />
            </div>
          </div>

          <div>
            <label className='text-sm font-bold mb-2 block'>
              Add More Videos
            </label>

            <div className='flex gap-2 flex-wrap'>
              {videos.map((vid, i) => (
                <div key={i} className='relative w-16 h-16'>
                  <Video className='w-12 h-12 text-gray-400 mx-auto mt-2' />
                  <button
                    className='absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full'
                    onClick={() =>
                      setVideos(videos.filter((_, idx) => idx !== i))
                    }
                  >
                    ×
                  </button>
                </div>
              ))}

              <label
                htmlFor='more-videos-upload'
                className='w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer'
              >
                <Plus className='w-4 h-4 text-gray-400' />
              </label>

              <input
                id='more-videos-upload'
                type='file'
                multiple
                accept='video/*'
                className='hidden'
                onChange={handleMoreVideos}
              />
            </div>
          </div>

          <div>
            <label className='text-sm font-bold mb-2 block'>Title</label>
            <Input
              placeholder='Enter title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className='text-sm font-bold mb-2 block'>Description</label>
            <Textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='w-full resize-none'
              placeholder='Write event details...'
              required
            />
          </div>

          {/* start date and time */}
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='text-sm font-bold mb-2 block'>Start Date</label>
              <Input
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className='text-sm font-bold mb-2 block'>Start Time</label>
              <Input
                type='time'
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* end date and time */}
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='text-sm font-bold mb-2 block'>End Date</label>
              <Input
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className='text-sm font-bold mb-2 block'>End Time</label>
              <Input
                type='time'
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <AutoCompleteLocation />

          <div className='relative'>
            <label className='text-sm font-bold mb-2 block'>
              Location (Type your full address)
            </label>
            <div className='relative'>
              <CommonLocationInput
                onChange={handleLocationChange}
                currentLocation={location}
              />
            </div>

            {locationResults.length > 0 && (
              <ul className='absolute z-20 bg-white shadow rounded w-full border mt-1 max-h-60 overflow-y-auto'>
                {locationResults.map((loc) => (
                  <li
                    key={loc.place_id}
                    className='p-2 hover:bg-gray-100 cursor-pointer text-sm'
                    onClick={() => selectLocation(loc)}
                  >
                    {loc.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='text-sm font-bold mb-2 block'>Latitude</label>
              <Input value={lat ?? ""} readOnly className='bg-gray-100' />
            </div>
            <div>
              <label className='text-sm font-bold mb-2 block'>Longitude</label>
              <Input value={lng ?? ""} readOnly className='bg-gray-100' />
            </div>
          </div>

          <div>
            <label className='text-sm font-bold mb-2 block'>
              Hashtags{" "}
              <span className='text-xs'>(Type tag and press Enter)</span>
            </label>
            <Input
              type='text'
              placeholder='Type a hashtag and press Enter'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              required
            />
            <div className='mt-2 flex flex-wrap gap-2'>
              {hashtags.map((tag, index) => (
                <span
                  key={index}
                  className='bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm cursor-pointer'
                  onClick={() => handleRemove(tag)}
                >
                  #{tag} ×
                </span>
              ))}
            </div>
          </div>

          <Button
            type='submit'
            onClick={handlePublish} 
            disabled={isLoading}
            className='w-full bg-[#15B826] hover:bg-green-600 text-white'
          >
            Publish {isLoading && <Loader className='animate-spin' />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
