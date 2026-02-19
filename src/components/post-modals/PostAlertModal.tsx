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
import {
  useCreateAlertMissingPersonPostMutation,
  useCreateAlertPostMutation,
} from "@/redux/features/post/postAPI";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import CommonLocationInput from "../CommonLocationInput";

interface PostEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

const alertCategories = [
  "Community Update",
  "Safety Alert",
  "Lost & Found",
  "Weather / Hazard",
  "Missing Person",
];

export default function PostEventModal({
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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [autoExpire, setAutoExpire] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [location, setLocation] = useState("");

  const [missingPLocationResults, setMissingLocationResults] = useState<any[]>(
    [],
  );

  const [lat, setLat] = useState<number | null>();
  const [lng, setLng] = useState<number | null>();
  const [missingLat, setMissingLat] = useState("");
  const [missingLng, setMissingLng] = useState("");

  const [missingPersonInfo, setMissingPersonInfo] = useState({
    name: "",
    age: "",
    clothing: "",
    lastSeenLocation: "",
    lastSeenDate: "",
    lastSeenTime: "",
  });

  const locationTimeout = useRef<any>(null);
  const [createAlertPostMutation, { isLoading }] = useCreateAlertPostMutation();
  const [
    createAlertMissingPersonPostMutation,
    { isLoading: isLoadingMissing },
  ] = useCreateAlertMissingPersonPostMutation();

  const handleCoverImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image")) return;
    setCoverImage(file);
    setCoverImagePreview(URL.createObjectURL(file));
  };

  const handleCoverVideoUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("video")) return;
    setCoverVideo(file);
    setCoverVideoPreview(URL.createObjectURL(file));
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

  const handleLocationSearchMissing = (value: string) => {
    setMissingPersonInfo({
      ...missingPersonInfo,
      lastSeenLocation: value,
    });

    if (locationTimeout.current) clearTimeout(locationTimeout.current);

    locationTimeout.current = setTimeout(async () => {
      if (!value.trim()) {
        setMissingLocationResults([]);
        return;
      }

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${value}`,
      );
      const data = await res.json();
      setMissingLocationResults(data);
    }, 400);
  };

  const selectLocation2 = (place: any) => {
    setMissingPersonInfo({
      ...missingPersonInfo,
      lastSeenLocation: place.display_name,
    });
    setMissingLat(place.lat);
    setMissingLng(place.lon);
    setMissingLocationResults([]);
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
    return {
      title,
      description,
      category: selectedCategory,
      address: location,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
      hasTag: hashtags,
      contactInfo: contact,
      expireLimit: autoExpire,
    };
  };

  const alertData = {
    title,
    description,
    category: selectedCategory,
    subcategory: selectedCategory,
    address: location,
    location: {
      type: "Point",
      coordinates: [lng, lat],
    },
    hasTag: hashtags,
    contactInfo: contact,
    expireLimit: Number(autoExpire),
  };

  const missingPersonAlertData = {
    title,
    description,
    category: selectedCategory,
    subcategory: "Missing Person",
    address: location,
    location: {
      type: "Point",
      coordinates: [lng, lat],
    },
    lastSeenLocation: {
      type: "Point",
      coordinates: [parseFloat(missingLng), parseFloat(missingLat)],
    },
    hasTag: hashtags,
    missingName: missingPersonInfo.name,
    missingAge: Number(missingPersonInfo.age),
    clothingDescription: missingPersonInfo.clothing,
    lastSeenDate: `${missingPersonInfo.lastSeenDate}T${missingPersonInfo.lastSeenTime}:00`,
    contactInfo: contact,
    expireLimit: Number(autoExpire),
  };

  const handlePublish = async () => {
    try {
      const formData = new FormData();

      if (selectedCategory === "Missing Person") {
        formData.append("data", JSON.stringify(missingPersonAlertData));
      } else {
        formData.append("data", JSON.stringify(alertData));
      }

      if (coverImage) formData.append("image", coverImage);
      if (coverVideo) formData.append("media", coverVideo);

      images.forEach((file) => formData.append("media", file));
      videos.forEach((file) => formData.append("media", file));

      if (selectedCategory === "Missing Person") {
        const res =
          await createAlertMissingPersonPostMutation(formData).unwrap();
        if (res?.success) toast.success(res.message);
        onClose();
      } else {
        const res = await createAlertPostMutation(formData).unwrap();
        if (res?.success) toast.success(res.message);
        onClose();
      }
    } catch (err) {
      console.error("Upload Failed:", err);
      toast.error("Upload failed.");
    }
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className='sm:max-w-lg p-0 max-h-[90vh] overflow-y-auto scrollbar'
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className='flex flex-row items-center justify-between p-4 border-b'>
          <DialogTitle className='text-lg font-semibold'>
            Post Alert
          </DialogTitle>
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
                {coverImagePreview ? (
                  <Image
                    alt='Cover'
                    width={300}
                    height={300}
                    src={coverImagePreview}
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
                {coverVideoPreview ? (
                  <video
                    src={coverVideoPreview}
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

          {/* location  */}
          <div className='w-full'>
            <label className='text-sm font-bold mb-2 block'>
              Location (Type your full address)
            </label>

            <CommonLocationInput onChange={handleLocationChange} />
          </div>

          {/* Category */}
          <div className='w-full'>
            <label className='text-sm font-bold mb-2 block'>Category</label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Choose alert category' />
              </SelectTrigger>
              <SelectContent className='w-full'>
                {alertCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Only for missing person */}
          {selectedCategory === "Missing Person" && (
            <>
              <div>
                <label className='text-sm font-bold mb-2 block'>
                  Missing Person&apos;s Name
                </label>
                <Input
                  placeholder='Enter missing person name'
                  value={missingPersonInfo.name}
                  onChange={(e) =>
                    setMissingPersonInfo({
                      ...missingPersonInfo,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className='text-sm font-bold mb-2 block'>
                  Missing Person&apos;s Age
                </label>
                <Input
                  placeholder='Enter missing person age'
                  value={missingPersonInfo.age}
                  onChange={(e) =>
                    setMissingPersonInfo({
                      ...missingPersonInfo,
                      age: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className='text-sm font-bold mb-2 block'>
                  Clothing Information
                </label>
                <Input
                  placeholder='Enter clothing information '
                  value={missingPersonInfo.clothing}
                  onChange={(e) =>
                    setMissingPersonInfo({
                      ...missingPersonInfo,
                      clothing: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className='relative'>
                <label className='text-sm font-bold mb-2 block'>
                  Last Seen Location
                </label>
                <div className='relative'>
                  <Input
                    placeholder='Search location'
                    value={missingPersonInfo.lastSeenLocation}
                    onChange={(e) =>
                      handleLocationSearchMissing(e.target.value)
                    }
                    required
                  />
                  <MapPin className='absolute right-3 top-1/2 -translate-y-1/2 text-green-600 w-4 h-4' />
                </div>

                {missingPLocationResults.length > 0 && (
                  <ul className='absolute z-20 bg-white shadow rounded w-full border mt-1 max-h-60 overflow-y-auto'>
                    {missingPLocationResults?.map((loc) => (
                      <li
                        key={loc.place_id}
                        className='p-2 hover:bg-gray-100 cursor-pointer text-sm'
                        onClick={() => selectLocation2(loc)}
                      >
                        {loc.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='text-sm font-bold mb-2 block'>Date</label>
                  <Input
                    type='date'
                    value={missingPersonInfo.lastSeenDate}
                    onChange={(e) =>
                      setMissingPersonInfo({
                        ...missingPersonInfo,
                        lastSeenDate: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className='text-sm font-bold mb-2 block'>Time</label>
                  <Input
                    type='time'
                    value={missingPersonInfo.lastSeenTime}
                    onChange={(e) =>
                      setMissingPersonInfo({
                        ...missingPersonInfo,
                        lastSeenTime: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* Lat & Lng */}
          {selectedCategory !== "Missing Person" && (
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='text-sm font-bold mb-2 block'>Latitude</label>
                <Input value={lat ?? ""} readOnly className='bg-gray-100' />
              </div>
              <div>
                <label className='text-sm font-bold mb-2 block'>
                  Longitude
                </label>
                <Input value={lng ?? ""} readOnly className='bg-gray-100' />
              </div>
            </div>
          )}

          {/* Contact */}
          <div>
            <label className='text-sm font-bold mb-2 block'>Contact </label>
            <Input
              placeholder='Share contact information'
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
          </div>

          {/* Hashtags */}
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

          {/* Set auto-expire */}
          <div>
            <label className='text-sm font-bold mb-2 block'>
              Set auto-expire
            </label>
            <Select
              value={autoExpire}
              onValueChange={setAutoExpire}
              defaultValue='7'
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select auto-expire' />
              </SelectTrigger>
              <SelectContent className='w-full'>
                <SelectItem value='1'>1 Day</SelectItem>
                <SelectItem value='3'>3 Days</SelectItem>
                <SelectItem value='7'>7 Days</SelectItem>
                <SelectItem value='14'>14 Days</SelectItem>
                <SelectItem value='30'>30 Days</SelectItem>
                <SelectItem value='60'>60 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type='submit'
            onClick={handlePublish}
            disabled={isLoadingMissing || isLoading}
            className='w-full bg-[#15B826] hover:bg-green-600 text-white mt-3'
          >
            Publish{" "}
            {(isLoadingMissing || isLoading) && (
              <Loader className='animate-spin' />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
