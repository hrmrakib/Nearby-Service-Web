/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload, Video, Loader } from "lucide-react";
import Image from "next/image";
import {
  useCreateServicePostForEntertainmentMutation,
  useCreateServicePostForFoodAndBeverageMutation,
  useCreateServicePostForPersonalHomeMutation,
  useCreateServicePostForVenuesMutation,
  useUpdatePostMutation,
} from "@/redux/features/post/postAPI";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ScheduleSelector } from "./ScheduleSelector";
import CommonLocationInput from "../location/CommonLocationInput";
import { useSelector } from "react-redux";

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
  },
];

const serviceCategories = [
  "Food & Beverage",
  "Entertainment",
  "Personal/Home Services",
  "Venues",
];

export default function PostServiceModal({
  isOpen,
  onClose,
  onBack,
}: PostEventModalProps) {
  const [scheduleData, setScheduleData] = useState(mockSchedule);
  const [selectedCategory, setSelectedCategory] = useState(
    serviceCategories[0],
  );

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

  // Existing URL-based previews populated in edit mode (not File objects)
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [existingVideoUrls, setExistingVideoUrls] = useState<string[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [amenitiesInput, setAmenitiesInput] = useState("");
  const [location, setLocation] = useState("");

  const [lat, setLat] = useState<number | null>();
  const [lng, setLng] = useState<number | null>();

  const [license, setLicense] = useState<File | null>(null);
  const [guestCapacity, setGuestCapacity] = useState<number | string>();
  const [amenities, setAmenities] = useState<string[]>([]);
  const [serviceType, setServiceType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: data2, isEditMode } = useSelector(
    (state: any) => state.postModal,
  );

  useEffect(() => {
    if (!data2 || !isEditMode) return;

    // Basic fields
    setTitle(data2.title ?? "");
    setDescription(data2.description ?? "");
    setPrice(String(data2.price ?? ""));
    setLocation(data2.address ?? "");

    // Location coordinates — backend stores as [lng, lat]
    setLng(data2.location?.coordinates?.[0] ?? null);
    setLat(data2.location?.coordinates?.[1] ?? null);

    // Cover image preview (URL from server)
    setCoverImagePreview(data2.image ?? null);

    // Category
    if (data2.subcategory) {
      setSelectedCategory(data2.subcategory);
    }

    // Hashtags — data2.hasTag is already a string array
    if (Array.isArray(data2.hasTag)) {
      setHashtags(data2.hasTag);
    }

    // Amenities
    if (Array.isArray(data2.amenities)) {
      setAmenities(data2.amenities);
    }

    // Schedule
    if (Array.isArray(data2.schedule) && data2.schedule.length > 0) {
      setScheduleData(data2.schedule);
    }

    // Venues specific
    if (data2.capacity) {
      setGuestCapacity(data2.capacity);
    }

    // Personal/Home Services specific
    if (data2.serviceType) {
      setServiceType(data2.serviceType);
    }

    // Split media array into images and videos for preview.
    // Cloudinary URLs contain "/video/" or "/image/" in the path.
    if (Array.isArray(data2.media) && data2.media.length > 0) {
      const mediaImageUrls: string[] = [];
      const mediaVideoUrls: string[] = [];
      let firstVideoUrl: string | null = null;

      data2.media.forEach((url: string) => {
        if (url.includes("/video/")) {
          if (!firstVideoUrl) {
            // First video becomes the cover video preview
            firstVideoUrl = url;
          } else {
            mediaVideoUrls.push(url);
          }
        } else if (url.includes("/image/")) {
          mediaImageUrls.push(url);
        }
      });

      if (firstVideoUrl) {
        setCoverVideoPreview(firstVideoUrl);
      }

      if (mediaImageUrls.length > 0) {
        setExistingImageUrls(mediaImageUrls);
      }

      if (mediaVideoUrls.length > 0) {
        setExistingVideoUrls(mediaVideoUrls);
      }
    }
  }, [data2, isEditMode]);

  const [createServicePostForFoodAndBeverageMutation] =
    useCreateServicePostForFoodAndBeverageMutation();
  const [createServicePostForEntertainmentMutation] =
    useCreateServicePostForEntertainmentMutation();
  const [createServicePostForPersonalHomeMutation] =
    useCreateServicePostForPersonalHomeMutation();
  const [createServicePostForVenuesMutation] =
    useCreateServicePostForVenuesMutation();

  const [udatePostMutation] = useUpdatePostMutation();

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

  const handleKeyDownForAmenity = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = amenitiesInput.trim().replace(/^#/, ""); // remove leading #
      if (value && !amenities.includes(value)) {
        setAmenities([...amenities, value]);
      }
      setAmenitiesInput(""); // reset input
    }
  };

  const handleRemove = (tag: string) => {
    setHashtags(hashtags.filter((t) => t !== tag));
  };

  const handleRemoveAmenity = (ame: string) => {
    setAmenities(amenities.filter((t) => t !== ame));
  };

  // common - food and beverage / entertainment
  const data = {
    title,
    description,
    price: Number(price),
    schedule: scheduleData,
    category: "service",
    subcategory: selectedCategory,
    address: location,
    location: {
      type: "Point",
      coordinates: [lng ?? 0, lat ?? 0],
    },
    hasTag: [...hashtags],
  };

  const homeServiceData = {
    ...data,
    serviceType: serviceType,
  };

  const venueServiceData = {
    ...data,
    capacity: Number(guestCapacity),
    amenities,
  };

  const handlePublish = async () => {
    try {
      const formData = new FormData();

      if (
        selectedCategory === "Food & Beverage" ||
        selectedCategory === "Entertainment"
      ) {
        formData.append("data", JSON.stringify(data));
      }
      if (selectedCategory === "Personal/Home Services") {
        formData.append("data", JSON.stringify(homeServiceData));
      }
      if (selectedCategory === "Venues") {
        formData.append("data", JSON.stringify(venueServiceData));
      }
      if (serviceType === "Personal/Home Services" && license) {
        formData.append("licenses", license);
      }

      if (coverImage) {
        formData.append("image", coverImage);
      }

      if (coverVideo) {
        formData.append("media", coverVideo);
      }

      images.forEach((img) => {
        formData.append("media", img);
      });

      videos.forEach((vid) => {
        formData.append("media", vid);
      });

      setIsLoading(true);

      let res;

      if (isEditMode) {
        res = await udatePostMutation({
          postId: data2._id,
          body: formData,
        }).unwrap();
      } else {
        if (selectedCategory === "Food & Beverage") {
          res =
            await createServicePostForFoodAndBeverageMutation(
              formData,
            ).unwrap();
        }
        if (selectedCategory === "Entertainment") {
          res =
            await createServicePostForEntertainmentMutation(formData).unwrap();
        }
        if (selectedCategory === "Personal/Home Services") {
          res =
            await createServicePostForPersonalHomeMutation(formData).unwrap();
        }
        if (selectedCategory === "Venues") {
          res = await createServicePostForVenuesMutation(formData).unwrap();
        }
      }

      if (res?.success) {
        toast.success(res?.message);
        onClose();
      }
    } catch (err) {
      console.error("Upload Failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(data2._id);

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
              {/* Existing image URLs from edit mode */}
              {existingImageUrls.map((url, i) => (
                <div key={`existing-img-${i}`} className='relative w-16 h-16'>
                  <Image
                    alt='additional'
                    width={200}
                    height={200}
                    src={url}
                    className='w-16 h-16 object-cover rounded'
                  />
                  <button
                    className='absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full'
                    onClick={() =>
                      setExistingImageUrls(
                        existingImageUrls.filter((_, idx) => idx !== i),
                      )
                    }
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* Newly picked image files */}
              {images.map((img, i) => (
                <div key={`new-img-${i}`} className='relative w-16 h-16'>
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
              {/* Existing video URLs from edit mode */}
              {existingVideoUrls.map((url, i) => (
                <div key={`existing-vid-${i}`} className='relative w-16 h-16'>
                  <Video className='w-12 h-12 text-gray-400 mx-auto mt-2' />
                  <button
                    className='absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full'
                    onClick={() =>
                      setExistingVideoUrls(
                        existingVideoUrls.filter((_, idx) => idx !== i),
                      )
                    }
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* Newly picked video files */}
              {videos.map((vid, i) => (
                <div key={`new-vid-${i}`} className='relative w-16 h-16'>
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
            <label className='text-sm font-bold mb-2 block'>Price</label>
            <Input
              type='number'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder='$ Enter price'
            />
          </div>

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
              <CommonLocationInput
                onChange={handleLocationChange}
                currentLocation={location}
              />
            </div>
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
                {serviceCategories?.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Service - Personal/Home Services */}
          {selectedCategory === "Personal/Home Services" && (
            <>
              <div>
                <label className='text-sm font-bold mb-2 block'>
                  Service Type
                </label>
                <Input
                  type='text'
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
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
                  Amenities (Comma separated or Press Enter)
                </label>
                <Input
                  type='text'
                  value={amenitiesInput}
                  onChange={(e) => setAmenitiesInput(e.target.value)}
                  placeholder='Enter amenities (comma separated)'
                  onKeyDown={handleKeyDownForAmenity}
                />
                <div className='mt-2 flex flex-wrap gap-2'>
                  {amenities?.map((ame, index) => (
                    <span
                      key={index}
                      className='bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm cursor-pointer'
                      onClick={() => handleRemoveAmenity(ame)}
                    >
                      {ame} ×
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          <Button
            type='submit'
            onClick={handlePublish}
            disabled={isLoading}
            className='w-full bg-[#15B826] hover:bg-green-600 text-white'
          >
            {isEditMode ? "Update" : "Publish"}
            {isLoading && <Loader className='animate-spin' />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */

// "use client";

// import { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Plus, Upload, Video, Loader } from "lucide-react";
// import Image from "next/image";
// import {
//   useCreateServicePostForEntertainmentMutation,
//   useCreateServicePostForFoodAndBeverageMutation,
//   useCreateServicePostForPersonalHomeMutation,
//   useCreateServicePostForVenuesMutation,
//   useUpdatePostMutation,
// } from "@/redux/features/post/postAPI";
// import { toast } from "sonner";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";
// import { ScheduleSelector } from "./ScheduleSelector";
// import CommonLocationInput from "../location/CommonLocationInput";
// import { useSelector } from "react-redux";

// interface PostEventModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onBack: () => void;
// }

// const mockSchedule = [
//   {
//     day: "mon",
//     startTime: "09:00",
//     endTime: "17:00",
//     timeSlots: [],
//   },
//   {
//     day: "tue",
//     startTime: "09:00",
//     endTime: "17:00",
//     timeSlots: [],
//   },
//   {
//     day: "wed",
//     startTime: "09:00",
//     endTime: "17:00",
//     timeSlots: [],
//   },
//   {
//     day: "thu",
//     startTime: "09:00",
//     endTime: "17:00",
//     timeSlots: [],
//   },
//   {
//     day: "fri",
//     startTime: "09:00",
//     endTime: "17:00",
//     timeSlots: [],
//   },
//   {
//     day: "sat",
//     startTime: "09:00",
//     endTime: "17:00",
//     timeSlots: [],
//   },
//   {
//     day: "sun",
//     startTime: "09:00",
//     endTime: "17:00",
//     timeSlots: [],
//   },
// ];

// const serviceCategories = [
//   "Food & Beverage",
//   "Entertainment",
//   "Personal/Home Services",
//   "Venues",
// ];

// export default function PostServiceModal({
//   isOpen,
//   onClose,
//   onBack,
// }: PostEventModalProps) {
//   const [scheduleData, setScheduleData] = useState(mockSchedule);
//   const [selectedCategory, setSelectedCategory] = useState(
//     serviceCategories[0],
//   );

//   const [coverVideoPreview, setCoverVideoPreview] = useState<string | null>(
//     null,
//   );
//   const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
//     null,
//   );

//   const [coverImage, setCoverImage] = useState<File | null>(null);
//   const [coverVideo, setCoverVideo] = useState<File | null>(null);

//   const [images, setImages] = useState<File[]>([]);
//   const [videos, setVideos] = useState<File[]>([]);

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [hashtags, setHashtags] = useState<string[]>([]);
//   const [inputValue, setInputValue] = useState("");
//   const [amenitiesInput, setAmenitiesInput] = useState("");
//   const [location, setLocation] = useState("");

//   const [lat, setLat] = useState<number | null>();
//   const [lng, setLng] = useState<number | null>();

//   const [license, setLicense] = useState<File | null>(null);
//   const [guestCapacity, setGuestCapacity] = useState<number | string>();
//   const [amenities, setAmenities] = useState<string[]>([]);
//   const [serviceType, setServiceType] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const { data: data2, isEditMode } = useSelector(
//     (state: any) => state.postModal,
//   );

//   useEffect(() => {
//     if (!data2 || !isEditMode) return;

//     // Basic fields
//     setTitle(data2.title ?? "");
//     setDescription(data2.description ?? "");
//     setPrice(String(data2.price ?? ""));
//     setLocation(data2.address ?? "");

//     // Location coordinates — backend stores as [lng, lat]
//     setLng(data2.location?.coordinates?.[0] ?? null);
//     setLat(data2.location?.coordinates?.[1] ?? null);

//     // Cover image preview (URL from server)
//     setCoverImagePreview(data2.image ?? null);
//     setCoverVideoPreview(data2.media ?? null);

//     // Category
//     if (data2.subcategory) {
//       setSelectedCategory(data2.subcategory);
//     }

//     // Hashtags
//     if (Array.isArray(data2.hasTag)) {
//       setHashtags([data2.hasTag]);
//     }

//     // Amenities
//     if (Array.isArray(data2.amenities)) {
//       setAmenities(data2.amenities);
//     }

//     // Schedule
//     if (Array.isArray(data2.schedule) && data2.schedule.length > 0) {
//       setScheduleData(data2.schedule);
//     }

//     // Venues specific
//     if (data2.capacity) {
//       setGuestCapacity(data2.capacity);
//     }

//     // Personal/Home Services specific
//     if (data2.serviceType) {
//       setServiceType(data2.serviceType);
//     }
//   }, [data2]);

//   console.log(hashtags);

//   const [createServicePostForFoodAndBeverageMutation] =
//     useCreateServicePostForFoodAndBeverageMutation();
//   const [createServicePostForEntertainmentMutation] =
//     useCreateServicePostForEntertainmentMutation();
//   const [createServicePostForPersonalHomeMutation] =
//     useCreateServicePostForPersonalHomeMutation();
//   const [createServicePostForVenuesMutation] =
//     useCreateServicePostForVenuesMutation();

//   const [udatePostMutation] = useUpdatePostMutation();

//   const handleCoverImageUpload = (e: any) => {
//     const file = e.target.files?.[0];
//     if (!file || !file.type.startsWith("image")) return;
//     setCoverImage(file);
//     setCoverImagePreview(URL.createObjectURL(file));
//   };

//   const handleCoverVideoUpload = (e: any) => {
//     const file = e.target.files?.[0];
//     if (!file || !file.type.startsWith("video")) return;
//     setCoverVideo(file);
//     setCoverVideoPreview(URL.createObjectURL(file));
//   };

//   const handleMoreImages = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files ?? []) as File[];
//     const imageFiles = files.filter((file) => file.type.startsWith("image"));

//     setImages((prev: File[]) => [...prev, ...imageFiles]);
//   };

//   const handleMoreVideos = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files ?? []) as File[];
//     const videoFiles = files.filter((file) => file.type.startsWith("video"));

//     setVideos((prev: File[]) => [...prev, ...videoFiles]);
//   };

//   const handleLocationChange = ({
//     location,
//     lat,
//     lng,
//   }: {
//     location: string;
//     lat: number | null;
//     lng: number | null;
//   }) => {
//     setLocation(location);
//     setLat(lat);
//     setLng(lng);
//   };

//   const handleLicenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (file.type !== "application/pdf") {
//       toast.error("Only PDF files are allowed!");
//       return;
//     }

//     setLicense(file);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" || e.key === ",") {
//       e.preventDefault();
//       const value = inputValue.trim().replace(/^#/, ""); // remove leading #
//       if (value && !hashtags.includes(value)) {
//         setHashtags([...hashtags, value]);
//       }
//       setInputValue(""); // reset input
//     }
//   };

//   const handleKeyDownForAmenity = (
//     e: React.KeyboardEvent<HTMLInputElement>,
//   ) => {
//     if (e.key === "Enter" || e.key === ",") {
//       e.preventDefault();
//       const value = amenitiesInput.trim().replace(/^#/, ""); // remove leading #
//       if (value && !amenities.includes(value)) {
//         setAmenities([...amenities, value]);
//       }
//       setAmenitiesInput(""); // reset input
//     }
//   };

//   const handleRemove = (tag: string) => {
//     setHashtags(hashtags.filter((t) => t !== tag));
//   };

//   const handleRemoveAmenity = (ame: string) => {
//     setAmenities(amenities.filter((t) => t !== ame));
//   };

//   // common - food and beverage / entertainment
//   const data = {
//     title,
//     description,
//     price: Number(price),
//     schedule: [
//       {
//         day: "mon",
//         startTime: "09:00",
//         endTime: "17:00",
//         timeSlots: [
//           { start: "09:00", end: "10:00", available: true },
//           { start: "10:00", end: "11:00", available: true },
//           { start: "11:00", end: "12:00", available: false },
//           { start: "12:00", end: "13:00", available: true },
//         ],
//       },
//       {
//         day: "wed",
//         startTime: "09:00",
//         endTime: "17:00",
//         timeSlots: [
//           { start: "09:00", end: "10:00", available: true },
//           { start: "10:00", end: "11:00", available: true },
//           { start: "11:00", end: "12:00", available: true },
//           { start: "12:00", end: "13:00", available: true },
//         ],
//       },
//     ],
//     category: "service",
//     subcategory: selectedCategory,
//     address: location,
//     location: {
//       type: "Point",
//       coordinates: [lng ?? 0, lat ?? 0],
//     },
//     hasTag: [...hashtags],
//   };

//   const homeServiceData = {
//     ...data,
//     serviceType: serviceType,
//   };

//   const venueServiceData = {
//     ...data,
//     capacity: Number(guestCapacity),
//     amenities,
//   };

//   const handlePublish = async () => {
//     try {
//       const formData = new FormData();

//       if (
//         selectedCategory === "Food & Beverage" ||
//         selectedCategory === "Entertainment"
//       ) {
//         formData.append("data", JSON.stringify(data));
//       }
//       if (selectedCategory === "Personal/Home Services") {
//         formData.append("data", JSON.stringify(homeServiceData));
//       }
//       if (selectedCategory === "Venues") {
//         formData.append("data", JSON.stringify(venueServiceData));
//       }

//       if (serviceType === "Personal/Home Services" && license) {
//         formData.append("licenses", license);
//       }

//       if (coverImage) {
//         formData.append("image", coverImage);
//       }

//       if (coverVideo) {
//         formData.append("media", coverVideo);
//       }

//       images.forEach((img) => {
//         formData.append("media", img);
//       });

//       videos.forEach((vid) => {
//         formData.append("media", vid);
//       });

//       setIsLoading(true);

//       let res;

//       if (selectedCategory === "Food & Beverage") {
//         res =
//           await createServicePostForFoodAndBeverageMutation(formData).unwrap();
//       }
//       if (selectedCategory === "Entertainment") {
//         res =
//           await createServicePostForEntertainmentMutation(formData).unwrap();
//       }
//       if (selectedCategory === "Personal/Home Services") {
//         res = await createServicePostForPersonalHomeMutation(formData).unwrap();
//       }
//       if (selectedCategory === "Venues") {
//         res = await createServicePostForVenuesMutation(formData).unwrap();
//       }

//       if (res?.success) {
//         toast.success(res?.message);
//         onClose();
//       }
//     } catch (err) {
//       console.error("Upload Failed:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className='sm:max-w-lg p-0 max-h-[90vh] overflow-y-auto scrollbar'>
//         <DialogHeader className='flex flex-row items-center justify-between p-4 border-b'>
//           <DialogTitle className='text-lg font-semibold'>
//             Post Service
//           </DialogTitle>
//         </DialogHeader>

//         <div className='p-4 space-y-6'>
//           <div>
//             <label className='text-sm font-bold mb-2 block'>
//               Cover Image / Cover Video
//             </label>

//             <div className='grid grid-cols-2 gap-3'>
//               {/* IMAGE UPLOAD */}
//               <label
//                 htmlFor='cover-image-upload'
//                 className='border rounded-lg p-3 flex flex-col items-center cursor-pointer'
//               >
//                 {coverImagePreview ? (
//                   <Image
//                     alt='Cover'
//                     width={300}
//                     height={300}
//                     src={coverImagePreview}
//                     className='w-full h-32 object-cover rounded'
//                   />
//                 ) : (
//                   <>
//                     <Upload className='w-6 h-6 text-gray-400' />
//                     <p className='text-xs text-gray-500 mt-2'>Upload Image</p>
//                   </>
//                 )}
//               </label>

//               {/* VIDEO UPLOAD */}
//               <label
//                 htmlFor='cover-video-upload'
//                 className='border rounded-lg p-3 flex flex-col items-center cursor-pointer'
//               >
//                 {coverVideoPreview ? (
//                   <video
//                     src={coverVideoPreview}
//                     controls
//                     className='w-full h-32 rounded'
//                   />
//                 ) : (
//                   <>
//                     <Video className='w-6 h-6 text-gray-400' />
//                     <p className='text-xs text-gray-500 mt-2'>Upload Video</p>
//                   </>
//                 )}
//               </label>
//             </div>

//             <input
//               id='cover-image-upload'
//               type='file'
//               accept='image/*'
//               className='hidden'
//               onChange={handleCoverImageUpload}
//             />

//             <input
//               id='cover-video-upload'
//               type='file'
//               accept='video/*'
//               className='hidden'
//               onChange={handleCoverVideoUpload}
//             />
//           </div>

//           <div>
//             <label className='text-sm font-bold mb-2 block'>
//               Add More Images
//             </label>

//             <div className='flex gap-2 flex-wrap'>
//               {images.map((img, i) => (
//                 <div key={i} className='relative w-16 h-16'>
//                   <Image
//                     alt='additional'
//                     width={200}
//                     height={200}
//                     src={URL.createObjectURL(img)}
//                     className='w-16 h-16 object-cover rounded'
//                   />
//                   <button
//                     className='absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full'
//                     onClick={() =>
//                       setImages(images.filter((_, idx) => idx !== i))
//                     }
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}

//               <label
//                 htmlFor='more-images-upload'
//                 className='w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer'
//               >
//                 <Plus className='w-4 h-4 text-gray-400' />
//               </label>

//               <input
//                 id='more-images-upload'
//                 type='file'
//                 multiple
//                 accept='image/*'
//                 className='hidden'
//                 onChange={handleMoreImages}
//               />
//             </div>
//           </div>

//           <div>
//             <label className='text-sm font-bold mb-2 block'>
//               Add More Videos
//             </label>

//             <div className='flex gap-2 flex-wrap'>
//               {videos.map((vid, i) => (
//                 <div key={i} className='relative w-16 h-16'>
//                   <Video className='w-12 h-12 text-gray-400 mx-auto mt-2' />
//                   <button
//                     className='absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full'
//                     onClick={() =>
//                       setVideos(videos.filter((_, idx) => idx !== i))
//                     }
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}

//               <label
//                 htmlFor='more-videos-upload'
//                 className='w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer'
//               >
//                 <Plus className='w-4 h-4 text-gray-400' />
//               </label>

//               <input
//                 id='more-videos-upload'
//                 type='file'
//                 multiple
//                 accept='video/*'
//                 className='hidden'
//                 onChange={handleMoreVideos}
//               />
//             </div>
//           </div>

//           <div>
//             <label className='text-sm font-bold mb-2 block'>Title</label>
//             <Input
//               placeholder='Enter title'
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className='text-sm font-bold mb-2 block'>Description</label>
//             <Textarea
//               rows={4}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className='w-full resize-none'
//               placeholder='Write event details...'
//             />
//           </div>

//           {/* Starting Price */}
//           <div>
//             <label className='text-sm font-bold mb-2 block'>Price</label>
//             <Input
//               type='number'
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               placeholder='$ Enter price'
//             />
//           </div>

//           <ScheduleSelector
//             schedule={scheduleData}
//             onScheduleChange={(updated: any) => setScheduleData(updated)}
//           />

//           {/* <AutoCompleteLocation /> */}

//           <div className='relative'>
//             <label className='text-sm font-bold mb-2 block'>
//               Location (Type your full address)
//             </label>
//             <div className='relative'>
//               <CommonLocationInput
//                 onChange={handleLocationChange}
//                 currentLocation={location}
//               />
//             </div>
//           </div>

//           <div className='grid grid-cols-2 gap-3'>
//             <div>
//               <label className='text-sm font-bold mb-2 block'>Latitude</label>
//               <Input value={lat ?? ""} readOnly className='bg-gray-100' />
//             </div>
//             <div>
//               <label className='text-sm font-bold mb-2 block'>Longitude</label>
//               <Input value={lng ?? ""} readOnly className='bg-gray-100' />
//             </div>
//           </div>

//           <div>
//             <label className='text-sm font-bold mb-2 block'>
//               Hashtags{" "}
//               <span className='text-xs'>(Type tag and press Enter)</span>
//             </label>
//             <Input
//               type='text'
//               placeholder='Type a hashtag and press Enter'
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               onKeyDown={handleKeyDown}
//             />
//             <div className='mt-2 flex flex-wrap gap-2'>
//               {hashtags.map((tag, index) => (
//                 <span
//                   key={index}
//                   className='bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm cursor-pointer'
//                   onClick={() => handleRemove(tag)}
//                 >
//                   #{tag} ×
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Category */}
//           <div className='w-full'>
//             <label className='text-sm font-bold mb-2 block'>Category</label>
//             <Select
//               value={selectedCategory}
//               onValueChange={setSelectedCategory}
//             >
//               <SelectTrigger className='w-full'>
//                 <SelectValue placeholder='Choose alert category' />
//               </SelectTrigger>
//               <SelectContent className='w-full'>
//                 {serviceCategories?.map((category) => (
//                   <SelectItem key={category} value={category}>
//                     {category}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Service - Personal/Home Services */}
//           {selectedCategory === "Personal/Home Services" && (
//             <>
//               <div>
//                 <label className='text-sm font-bold mb-2 block'>
//                   Service Type
//                 </label>
//                 <Input
//                   type='text'
//                   value={serviceType}
//                   onChange={(e) => setServiceType(e.target.value)}
//                   placeholder='Enter your service type'
//                 />
//               </div>

//               <div className='relative'>
//                 <div>
//                   <label className='text-sm font-bold mb-2 block'>
//                     Licenses (PDF only)
//                   </label>

//                   <label
//                     htmlFor='license-upload'
//                     className='flex items-center justify-between border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50'
//                   >
//                     <span className='text-sm text-gray-600'>
//                       {license ? license.name : "Upload your license PDF"}
//                     </span>
//                     <div className='absolute right-2 top-[60%]'>
//                       <svg
//                         width='16'
//                         height='16'
//                         viewBox='0 0 16 16'
//                         fill='none'
//                         xmlns='http://www.w3.org/2000/svg'
//                       >
//                         <g clip-path='url(#clip0_5788_1215)'>
//                           <path
//                             d='M14.2924 7.77449L8.16572 13.9012C7.41516 14.6517 6.39718 15.0734 5.33572 15.0734C4.27426 15.0734 3.25628 14.6517 2.50572 13.9012C1.75516 13.1506 1.3335 12.1326 1.3335 11.0712C1.3335 10.0097 1.75516 8.99172 2.50572 8.24116L8.63239 2.11449C9.13276 1.61412 9.81142 1.33301 10.5191 1.33301C11.2267 1.33301 11.9053 1.61412 12.4057 2.11449C12.9061 2.61487 13.1872 3.29352 13.1872 4.00116C13.1872 4.70879 12.9061 5.38745 12.4057 5.88782L6.27239 12.0145C6.0222 12.2647 5.68287 12.4052 5.32905 12.4052C4.97524 12.4052 4.63591 12.2647 4.38572 12.0145C4.13553 11.7643 3.99498 11.425 3.99498 11.0712C3.99498 10.7173 4.13553 10.378 4.38572 10.1278L10.0457 4.47449'
//                             stroke='#108F1E'
//                             stroke-width='1.5'
//                             stroke-linecap='round'
//                             stroke-linejoin='round'
//                           />
//                         </g>
//                         <defs>
//                           <clipPath id='clip0_5788_1215'>
//                             <rect width='16' height='16' fill='white' />
//                           </clipPath>
//                         </defs>
//                       </svg>
//                     </div>
//                     {/* <Upload className='w-5 h-5 text-gray-500' /> */}
//                   </label>

//                   <input
//                     id='license-upload'
//                     type='file'
//                     accept='application/pdf'
//                     className='hidden'
//                     onChange={handleLicenceUpload}
//                   />
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Service - Technical Services */}
//           {selectedCategory === "Venues" && (
//             <>
//               <div>
//                 <label className='text-sm font-bold mb-2 block'>Capacity</label>
//                 <Input
//                   type='number'
//                   value={guestCapacity}
//                   onChange={(e) => setGuestCapacity(e.target.value)}
//                   placeholder='Enter max guests'
//                 />
//               </div>

//               <div>
//                 <label className='text-sm font-bold mb-2 block'>
//                   Amenities (Comma separated or Press Enter)
//                 </label>
//                 <Input
//                   type='text'
//                   value={amenitiesInput}
//                   onChange={(e) => setAmenitiesInput(e.target.value)}
//                   placeholder='Enter amenities (comma separated)'
//                   onKeyDown={handleKeyDownForAmenity}
//                 />
//                 <div className='mt-2 flex flex-wrap gap-2'>
//                   {amenities?.map((ame, index) => (
//                     <span
//                       key={index}
//                       className='bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm cursor-pointer'
//                       onClick={() => handleRemoveAmenity(ame)}
//                     >
//                       {ame} ×
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}

//           <Button
//             type='submit'
//             onClick={handlePublish}
//             disabled={isLoading}
//             className='w-full bg-[#15B826] hover:bg-green-600 text-white'
//           >
//             {isEditMode ? "Update" : "Publish"}
//             {isLoading && <Loader className='animate-spin' />}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
