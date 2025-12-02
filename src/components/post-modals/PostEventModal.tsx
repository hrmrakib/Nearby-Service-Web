/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload, MapPin, Video } from "lucide-react";
import Image from "next/image";
import AutoCompleteLocation from "../location/AutoCompleteLocation";

interface PostEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

export default function PostEventModal({
  isOpen,
  onClose,
  onBack,
}: PostEventModalProps) {
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
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const locationTimeout = useRef<any>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleCoverImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image")) return;
    setCoverImage(file);
    setCoverVideo(null); // Reset video if selected
  };

  const handleCoverVideoUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("video")) return;
    setCoverVideo(file);
    setCoverImage(null); // Reset image if selected
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
    const isoStartDate = new Date(`${date}T${time}`).toISOString();

    return {
      title,
      description,
      startDate: isoStartDate,
      startTime: time,
      address: locationQuery,
      category: "Event",
      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
    };
  };

  const handlePublish = async () => {
    const formData = new FormData();

    const dataObj = buildPayload();
    formData.append("data", JSON.stringify(dataObj));

    // COVER IMAGE OR VIDEO
    if (coverImage) formData.append("coverImage", coverImage);
    if (coverVideo) formData.append("coverVideo", coverVideo);

    // MULTIPLE IMAGES
    images.forEach((img) => formData.append("images[]", img));

    // MULTIPLE VIDEOS
    videos.forEach((vid) => formData.append("videos[]", vid));

    const res = await fetch("/api/events", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    console.log("Submitted:", json);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-lg p-0 max-h-[90vh] overflow-y-auto scrollbar'>
        <DialogHeader className='flex flex-row items-center justify-between p-4 border-b'>
          <h2 className='text-lg font-semibold'>Post Event</h2>
        </DialogHeader>

        <div className='p-4 space-y-6'>
          <div>
            <label className='text-sm font-medium mb-2 block'>
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
            <label className='text-sm font-medium mb-2 block'>
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
            <label className='text-sm font-medium mb-2 block'>
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
            <label className='text-sm font-medium mb-2 block'>Title</label>
            <Input
              placeholder='Enter title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className='text-sm font-medium mb-2 block'>
              Description
            </label>
            <Textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='w-full resize-none'
              placeholder='Write event details...'
            />
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='text-sm font-medium mb-2 block'>Date</label>
              <Input
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <label className='text-sm font-medium mb-2 block'>Time</label>
              <Input
                type='time'
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <AutoCompleteLocation />

          <div className='relative'>
            <label className='text-sm font-medium mb-2 block'>Location</label>
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
              <label className='text-sm font-medium mb-2 block'>Latitude</label>
              <Input value={lat} readOnly className='bg-gray-100' />
            </div>
            <div>
              <label className='text-sm font-medium mb-2 block'>
                Longitude
              </label>
              <Input value={lng} readOnly className='bg-gray-100' />
            </div>
          </div>

          <div>
            <label className='text-sm font-medium mb-2 block'>
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

// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { useState, useRef } from "react";
// import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { X, Plus, Upload, MapPin, Calendar, Clock, Video } from "lucide-react";
// import Image from "next/image";
// import AutoCompleteLocation from "../location/AutoCompleteLocation";

// interface PostEventModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onBack: () => void;
// }

// export default function PostEventModal({
//   isOpen,
//   onClose,
//   onBack,
// }: PostEventModalProps) {
//   const [coverMedia, setCoverMedia] = useState<File | null>(null);
//   const [moreMedia, setMoreMedia] = useState<File[]>([]);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [locationQuery, setLocationQuery] = useState("");
//   const [locationResults, setLocationResults] = useState<any[]>([]);
//   const [lat, setLat] = useState("");
//   const [lng, setLng] = useState("");

//   const locationTimeout = useRef<any>(null);

//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");

//   const handleCoverUpload = (e: any) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setCoverMedia(file);
//   };

//   const handleMoreUpload = (e: any) => {
//     const files = Array.from(e.target.files);
//     setMoreMedia((prev: any) => [...prev, ...files]);
//   };

//   const handleLocationSearch = (value: string) => {
//     setLocationQuery(value);

//     if (locationTimeout.current) clearTimeout(locationTimeout.current);

//     locationTimeout.current = setTimeout(async () => {
//       if (!value.trim()) {
//         setLocationResults([]);
//         return;
//       }

//       const res = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${value}`
//       );
//       const data = await res.json();
//       setLocationResults(data);
//     }, 400);
//   };

//   const selectLocation = (place: any) => {
//     setLocationQuery(place.display_name);
//     setLat(place.lat);
//     setLng(place.lon);
//     setLocationResults([]);
//   };

//   const buildPayload = () => {
//     const isoStartDate = new Date(`${date}T${time}`).toISOString();

//     return {
//       // title,
//       // description,
//       startDate: isoStartDate,
//       startTime: time,
//       address: locationQuery,
//       category: "Event",
//       location: {
//         type: "Point",
//         coordinates: [parseFloat(lng), parseFloat(lat)],
//       },
//       // hasTag: hashtags.split(",").map((t) => t.trim()),
//     };
//   };

//   const handlePublish = async () => {
//     const formData = new FormData();

//     const dataObj = buildPayload();
//     formData.append("data", JSON.stringify(dataObj));

//     // ---- MULTIPLE IMAGES ----
//     coverMedia?.forEach((img: any) => {
//       formData.append("image", img);
//     });

//     // ---- MULTIPLE VIDEOS ----
//     moreMedia?.forEach((vid) => {
//       formData.append("media", vid);
//     });

//     const res = await fetch("/api/events", {
//       method: "POST",
//       body: formData,
//     });

//     const json = await res.json();
//     console.log("Submitted:", json);
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className='sm:max-w-lg p-0 max-h-[90vh] overflow-y-auto scrollbar'>
//         <DialogHeader className='flex flex-row items-center justify-between p-4 border-b'>
//           <h2 className='text-lg font-semibold'>Post-Event</h2>
//         </DialogHeader>

//         <div className='p-4 space-y-6'>
//           <div>
//             <label className='text-sm font-medium mb-2 block'>
//               Cover Photo / Video
//             </label>

//             <label
//               htmlFor='cover-upload'
//               className='rounded-lg  text-center cursor-pointer'
//             >
//               {coverMedia ? (
//                 <div>
//                   {coverMedia.type.startsWith("video") ? (
//                     <video
//                       src={URL.createObjectURL(coverMedia)}
//                       controls
//                       className='w-full h-48 rounded'
//                     />
//                   ) : (
//                     <Image
//                       alt='Cover Photo'
//                       width={500}
//                       height={500}
//                       src={URL.createObjectURL(coverMedia)}
//                       className='w-full h-48 object-cover rounded'
//                     />
//                   )}
//                 </div>
//               ) : (
//                 <div className='flex flex-col border rounded-2xl py-6'>
//                   <Upload className='w-6 h-6 mx-auto mb-2 text-gray-400' />
//                   <p className='text-sm text-gray-500'>Upload Photo/Video</p>
//                 </div>
//               )}
//             </label>

//             <input
//               id='cover-upload'
//               type='file'
//               accept='image/*,video/*'
//               className='hidden'
//               onChange={handleCoverUpload}
//             />
//           </div>

//           <div>
//             <label className='text-sm font-medium mb-2 block'>
//               Add More Media
//             </label>

//             <div className='flex gap-2 flex-wrap'>
//               {moreMedia.map((m, i) => (
//                 <div key={i} className='relative w-16 h-16'>
//                   {m.type.startsWith("video") ? (
//                     <Video className='w-12 h-12 text-gray-400 mx-auto mt-2' />
//                   ) : (
//                     <Image
//                       alt='More Media'
//                       width={500}
//                       height={500}
//                       src={URL.createObjectURL(m)}
//                       className='w-16 h-16 object-cover rounded'
//                     />
//                   )}

//                   <button
//                     className='absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full text-xs'
//                     onClick={() =>
//                       setMoreMedia(moreMedia.filter((_, idx) => idx !== i))
//                     }
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}

//               <label
//                 htmlFor='more-upload'
//                 className='w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer'
//               >
//                 <Plus className='w-4 h-4 text-gray-400' />
//               </label>

//               <input
//                 id='more-upload'
//                 type='file'
//                 multiple
//                 accept='image/*,video/*'
//                 className='hidden'
//                 onChange={handleMoreUpload}
//               />
//             </div>
//           </div>

//           <div>
//             <label className='text-sm font-medium mb-2 block'>Title</label>
//             <Input
//               type='text'
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder='Enter title'
//             />
//           </div>

//           <div>
//             <label className='text-sm font-medium mb-2 block'>
//               Description
//             </label>
//             <Textarea
//               placeholder='Enter description'
//               rows={4}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className='w-full resize-none break-words overflow-hidden'
//             />
//           </div>

//           <div className='grid grid-cols-2 gap-3'>
//             <div>
//               <label className='text-sm font-medium mb-2 block'>Date</label>
//               <div className='relative'>
//                 <Input
//                   type='date'
//                   value={date}
//                   onChange={(e) => setDate(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div>
//               <label className='text-sm font-medium mb-2 block'>Time</label>
//               <div className='relative'>
//                 <Input
//                   type='time'
//                   value={time}
//                   onChange={(e) => setTime(e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* testing autocomplete loction */}
//           <AutoCompleteLocation />

//           <div className='relative'>
//             <label className='text-sm font-medium mb-2 block'>Location</label>

//             <div className='relative'>
//               <Input
//                 placeholder='Search location'
//                 value={locationQuery}
//                 onChange={(e) => handleLocationSearch(e.target.value)}
//               />
//               <MapPin className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600' />
//             </div>

//             {locationResults.length > 0 && (
//               <ul className='absolute z-20 bg-white shadow rounded w-full border mt-1 max-h-60 overflow-y-auto'>
//                 {locationResults.map((loc) => (
//                   <li
//                     key={loc.place_id}
//                     className='p-2 hover:bg-gray-100 cursor-pointer text-sm'
//                     onClick={() => selectLocation(loc)}
//                   >
//                     {loc.display_name}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           <div className='grid grid-cols-2 gap-3'>
//             <div>
//               <label className='text-sm font-medium mb-2 block'>Latitude</label>
//               <Input value={lat} readOnly className='bg-gray-100' />
//             </div>

//             <div>
//               <label className='text-sm font-medium mb-2 block'>
//                 Longitude
//               </label>
//               <Input value={lng} readOnly className='bg-gray-100' />
//             </div>
//           </div>

//           <div>
//             <label className='text-sm font-medium mb-2 block'>Hashtags</label>
//             <Input placeholder='Enter hashtags for discovery' />
//           </div>

//           <Button
//             type='submit'
//             onClick={() => handlePublish()}
//             className='w-full bg-[#15B826] hover:bg-green-600 text-white'
//           >
//             Publish
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
