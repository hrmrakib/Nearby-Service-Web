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
import { Plus, Upload, MapPin, Video, Clock } from "lucide-react";
import Image from "next/image";
import AutoCompleteLocation from "../location/AutoCompleteLocation";
import {
  useCreateEventPostMutation,
  useCreateServicePostForEntertainmentMutation,
  useCreateServicePostForFoodAndBeverageMutation,
  useCreateServicePostForPersonalHomeMutation,
  useCreateServicePostForVenuesMutation,
} from "@/redux/features/post/postAPI";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ScheduleSelector } from "./ScheduleSelector";

interface PostEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

const mockSchedule = [
  {
    day: "mon",
    startTime: "09:00",
    endTime: "17:00",
    timeSlots: [],
  },
  {
    day: "tue",
    startTime: "09:00",
    endTime: "17:00",
    timeSlots: [],
  },
  {
    day: "wed",
    startTime: "09:00",
    endTime: "17:00",
    timeSlots: [],
  },
  {
    day: "thu",
    startTime: "09:00",
    endTime: "17:00",
    timeSlots: [],
  },
  {
    day: "fri",
    startTime: "09:00",
    endTime: "17:00",
    timeSlots: [],
  },
  {
    day: "sat",
    startTime: "09:00",
    endTime: "17:00",
    timeSlots: [],
  },
  {
    day: "sun",
    startTime: "09:00",
    endTime: "17:00",
    timeSlots: [],
  },
];

const alertCategories = [
  "Food & Beverage",
  "Entertainment",
  "Personal/Home Services",
  "Venues",
];

export default function PostEventModal({
  isOpen,
  onClose,
  onBack,
}: PostEventModalProps) {
  const [scheduleData, setScheduleData] = useState(mockSchedule);
  const [selectedCategory, setSelectedCategory] = useState(alertCategories[0]);
  const [selectedDays, setSelectedDays] = useState<string[]>(["Mon"]);
  const [repeatAll, setRepeatAll] = useState(false);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const [coverVideoPreview, setCoverVideoPreview] = useState<string | null>(
    null
  );
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverVideo, setCoverVideo] = useState<File | null>(null);

  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState<any[]>([]);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const locationTimeout = useRef<any>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  // conditionally used
  const [rate, setRate] = useState({
    hourly: 0,
    day: 1,
  });
  const [license, setLicense] = useState<File | null>(null);
  const [guestCapacity, setGuestCapacity] = useState<number | string>();
  const [amenities, setAmenities] = useState<number | string>();

  const [createEventPostMutation] = useCreateEventPostMutation();

  const [createServicePostForFoodAndBeverageMutation] =
    useCreateServicePostForFoodAndBeverageMutation();
  const [createServicePostForEntertainmentMutation] =
    useCreateServicePostForEntertainmentMutation();
  const [createServicePostForPersonalHomeMutation] =
    useCreateServicePostForPersonalHomeMutation();
  const [createServicePostForVenuesMutation] =
    useCreateServicePostForVenuesMutation();

  console.log({ scheduleData });

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

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

  // const handleCoverImageUpload = (e: any) => {
  //   const file = e.target.files?.[0];
  //   if (!file || !file.type.startsWith("image")) return;
  //   setCoverImage(file);
  //   setCoverVideo(null); // Reset video if selected
  // };

  // const handleCoverVideoUpload = (e: any) => {
  //   const file = e.target.files?.[0];
  //   if (!file || !file.type.startsWith("video")) return;
  //   setCoverVideo(file);
  //   setCoverImage(null); // Reset image if selected
  // };

  // const handleMoreImages = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = Array.from(e.target.files ?? []) as File[];
  //   const imageFiles = files.filter((file) => file.type.startsWith("image"));

  //   setImages((prev: File[]) => [...prev, ...imageFiles]);
  // };

  // const handleMoreVideos = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = Array.from(e.target.files ?? []) as File[];
  //   const videoFiles = files.filter((file) => file.type.startsWith("video"));

  //   setVideos((prev: File[]) => [...prev, ...videoFiles]);
  // };

  const handleLocationSearch = (value: string) => {
    setLocationQuery(value);

    if (locationTimeout.current) clearTimeout(locationTimeout.current);

    locationTimeout.current = setTimeout(async () => {
      if (!value.trim()) {
        setLocationResults([]);
        return;
      }

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${value}`
      );
      const data = await res.json();
      setLocationResults(data);
    }, 400);
  };

  const selectLocation = (place: any) => {
    setLocationQuery(place.display_name);
    setLat(place.lat);
    setLng(place.lon);
    setLocationResults([]);
  };

  const handleLicenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed!");
      return;
    }

    setLicense(file);
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
    // const isoStartDate = new Date(`${date}T${time}`).toISOString();

    return {
      title,
      description,
      // startDate: isoStartDate,
      // startTime: isoStartDate,
      address: locationQuery,
      category: "Event",
      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
      hasTag: hashtags,
    };
  };

  const data = {
    title,
    description,
    price,
    schedule: [
      {
        day: "mon",
        startTime: "09:00",
        endTime: "17:00",
        timeSlots: [
          { start: "09:00", end: "10:00", available: true },
          { start: "10:00", end: "11:00", available: true },
          { start: "11:00", end: "12:00", available: false },
          { start: "12:00", end: "13:00", available: true },
        ],
      },
      {
        day: "wed",
        startTime: "09:00",
        endTime: "17:00",
        timeSlots: [
          { start: "09:00", end: "10:00", available: true },
          { start: "10:00", end: "11:00", available: true },
          { start: "11:00", end: "12:00", available: true },
          { start: "12:00", end: "13:00", available: true },
        ],
      },
    ],
    category: "service",
    subcategory: selectedCategory,
    address: locationQuery,
    location: {
      type: "Point",
      coordinates: [parseFloat(lng), parseFloat(lat)],
    },
    hasTag: hashtags,
    capacity: guestCapacity,
    amenities: ["Wi-Fi", "Projector", "Audio System", "Catering"],
  };

  console.log({ amenities });

  const handlePublish = async () => {
    try {
      const formData = new FormData();

      const dataObj = buildPayload();
      console.log(dataObj);

      formData.append("data", JSON.stringify(dataObj));

      if (coverImage) {
        formData.append("image", coverImage);
      }

      if (coverVideo) {
        formData.append("media", coverVideo);
      }

      // MULTIPLE IMAGES
      images.forEach((img) => {
        formData.append("image", img);
      });

      // MULTIPLE VIDEOS
      videos.forEach((vid) => {
        formData.append("media", vid);
      });

      // const res = await createEventPostMutation(formData).unwrap();

      // if (res?.success) {
      //   toast.success(res?.message);
      //   onClose();
      // }
    } catch (err) {
      console.error("Upload Failed:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-lg p-0 max-h-[90vh] overflow-y-auto scrollbar'>
        <DialogHeader className='flex flex-row items-center justify-between p-4 border-b'>
          <DialogTitle className='text-lg font-semibold'>
            Post Service
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
            />
          </div>

          {/* Starting Price */}
          <div>
            <label className='text-sm font-bold mb-2 block'>
              Starting price
            </label>
            <Input
              type='number'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder='$ Enter starting price'
            />
          </div>

          {/* Availability */}
          {/* <div>
            <label className='text-sm font-bold mb-2 block'>Availability</label>
            <div className='space-y-3'>
              <div>
                <label className='text-xs text-muted-foreground mb-2 block'>
                  Day
                </label>
                <div className='flex gap-2'>
                  {days.map((day) => (
                    <Button
                      key={day}
                      variant={
                        selectedDays.includes(day) ? "default" : "outline"
                      }
                      size='sm'
                      className={`text-xs ${
                        selectedDays.includes(day)
                          ? "bg-green-500 hover:bg-green-600"
                          : ""
                      }`}
                      onClick={() => toggleDay(day)}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='text-sm font-bold mb-2 block'>
                    Start Time
                  </label>
                  <Input
                    type='time'
                    value={startTime}
                    placeholder='Available from'
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>

                <div>
                  <label className='text-sm font-bold mb-2 block'>Time</label>
                  <Input
                    type='time'
                    value={endTime}
                    placeholder='Available till'
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              <div className='mt-4'>
                <label className='text-xs text-muted-foreground mb-1 block'>
                  Repeat
                </label>

                <div className='flex items-center gap-2'>
                  <Checkbox
                    id='repeat-all'
                    checked={repeatAll}
                    onCheckedChange={(val) => {
                      setRepeatAll(!!val);
                      if (val) {
                        setSelectedDays(days);
                      } else {
                        setSelectedDays([]);
                      }
                    }}
                  />
                  <label
                    htmlFor='repeat-all'
                    className='text-sm cursor-pointer'
                  >
                    Repeat this for all days of the week.
                  </label>
                </div>
              </div>
            </div>
          </div> */}

          {/* <ScheduleSelector
            schedule={scheduleData}
            onScheduleChange={setScheduleData}
          /> */}

          <ScheduleSelector
            schedule={scheduleData}
            onScheduleChange={(updated: any) => setScheduleData(updated)}
          />

          {/* <AutoCompleteLocation /> */}

          <div className='relative'>
            <label className='text-sm font-bold mb-2 block'>
              Location (Type your full address)
            </label>
            <div className='relative'>
              <Input
                placeholder='Search location'
                value={locationQuery}
                onChange={(e) => handleLocationSearch(e.target.value)}
              />
              <MapPin className='absolute right-3 top-1/2 -translate-y-1/2 text-green-600 w-4 h-4' />
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
              <Input value={lat} readOnly className='bg-gray-100' />
            </div>
            <div>
              <label className='text-sm font-bold mb-2 block'>Longitude</label>
              <Input value={lng} readOnly className='bg-gray-100' />
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

          {/* Service - Entertainment */}
          {selectedCategory === "Entertainment" && (
            <div>
              <label className='text-sm font-bold mb-2 block text-[#030712]'>
                Rate
              </label>
              <div className='flex items-center justify-between gap-4 border border-gray-200 rounded-2xl px-2 py-5'>
                <div className='w-1/2'>
                  <label className='text-sm font-bold mb-2 block'>Hourly</label>
                  <Input
                    type='number'
                    value={rate.hourly}
                    onChange={(e) =>
                      setRate({ ...rate, hourly: Number(e.target.value) })
                    }
                    placeholder='Enter starting price'
                  />
                </div>
                <div className='w-1/2'>
                  <label className='text-sm font-bold mb-2 block'>Day</label>
                  <Input
                    type='number'
                    value={rate.day}
                    onChange={(e) =>
                      setRate({ ...rate, day: Number(e.target.value) })
                    }
                    placeholder='Enter starting price'
                  />
                </div>
              </div>
            </div>
          )}

          {/* Service - Personal/Home Services */}
          {selectedCategory === "Personal/Home Services" && (
            <>
              <div>
                <label className='text-sm font-bold mb-2 block'>
                  Service Type
                </label>
                <Input
                  type='text'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder='Enter your service type'
                />
              </div>

              <div className='relative'>
                <div>
                  <label className='text-sm font-bold mb-2 block'>
                    Licenses (PDF only)
                  </label>

                  <label
                    htmlFor='license-upload'
                    className='flex items-center justify-between border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50'
                  >
                    <span className='text-sm text-gray-600'>
                      {license ? license.name : "Upload your license PDF"}
                    </span>
                    <div className='absolute right-2 top-[60%]'>
                      <svg
                        width='16'
                        height='16'
                        viewBox='0 0 16 16'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <g clip-path='url(#clip0_5788_1215)'>
                          <path
                            d='M14.2924 7.77449L8.16572 13.9012C7.41516 14.6517 6.39718 15.0734 5.33572 15.0734C4.27426 15.0734 3.25628 14.6517 2.50572 13.9012C1.75516 13.1506 1.3335 12.1326 1.3335 11.0712C1.3335 10.0097 1.75516 8.99172 2.50572 8.24116L8.63239 2.11449C9.13276 1.61412 9.81142 1.33301 10.5191 1.33301C11.2267 1.33301 11.9053 1.61412 12.4057 2.11449C12.9061 2.61487 13.1872 3.29352 13.1872 4.00116C13.1872 4.70879 12.9061 5.38745 12.4057 5.88782L6.27239 12.0145C6.0222 12.2647 5.68287 12.4052 5.32905 12.4052C4.97524 12.4052 4.63591 12.2647 4.38572 12.0145C4.13553 11.7643 3.99498 11.425 3.99498 11.0712C3.99498 10.7173 4.13553 10.378 4.38572 10.1278L10.0457 4.47449'
                            stroke='#108F1E'
                            stroke-width='1.5'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                          />
                        </g>
                        <defs>
                          <clipPath id='clip0_5788_1215'>
                            <rect width='16' height='16' fill='white' />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    {/* <Upload className='w-5 h-5 text-gray-500' /> */}
                  </label>

                  <input
                    id='license-upload'
                    type='file'
                    accept='application/pdf'
                    className='hidden'
                    onChange={handleLicenceUpload}
                  />
                </div>

                {/* <div className='absolute right-2 top-[60%]'>
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 16 16'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <g clip-path='url(#clip0_5788_1215)'>
                      <path
                        d='M14.2924 7.77449L8.16572 13.9012C7.41516 14.6517 6.39718 15.0734 5.33572 15.0734C4.27426 15.0734 3.25628 14.6517 2.50572 13.9012C1.75516 13.1506 1.3335 12.1326 1.3335 11.0712C1.3335 10.0097 1.75516 8.99172 2.50572 8.24116L8.63239 2.11449C9.13276 1.61412 9.81142 1.33301 10.5191 1.33301C11.2267 1.33301 11.9053 1.61412 12.4057 2.11449C12.9061 2.61487 13.1872 3.29352 13.1872 4.00116C13.1872 4.70879 12.9061 5.38745 12.4057 5.88782L6.27239 12.0145C6.0222 12.2647 5.68287 12.4052 5.32905 12.4052C4.97524 12.4052 4.63591 12.2647 4.38572 12.0145C4.13553 11.7643 3.99498 11.425 3.99498 11.0712C3.99498 10.7173 4.13553 10.378 4.38572 10.1278L10.0457 4.47449'
                        stroke='#108F1E'
                        stroke-width='1.5'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                    </g>
                    <defs>
                      <clipPath id='clip0_5788_1215'>
                        <rect width='16' height='16' fill='white' />
                      </clipPath>
                    </defs>
                  </svg>
                </div> */}
              </div>
            </>
          )}

          {/* Service - Technical Services */}
          {selectedCategory === "Venues" && (
            <>
              <div>
                <label className='text-sm font-bold mb-2 block'>Capacity</label>
                <Input
                  type='number'
                  value={guestCapacity}
                  onChange={(e) => setGuestCapacity(e.target.value)}
                  placeholder='Enter max guests'
                />
              </div>

              <div>
                <label className='text-sm font-bold mb-2 block'>
                  Amenities
                </label>
                <Input
                  type='text'
                  value={amenities}
                  onChange={(e) => setAmenities(e.target.value)}
                  placeholder='Enter amenities (comma separated)'
                />
              </div>
            </>
          )}

          <Button
            type='submit'
            onClick={handlePublish}
            className='w-full bg-[#15B826] hover:bg-green-600 text-white'
          >
            Publish
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
