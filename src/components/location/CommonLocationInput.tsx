/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface LocationResult {
  address: string;
  lat: number;
  lng: number;
}

interface LocationInputProps {
  onChange: (result: LocationResult | null) => void;
  placeholder?: string;
  className?: string;
  label?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

export default function CommonLocationInput({
  onChange,
  placeholder = "City or Zip Code",
  className = "",
  label = "Location",
}: LocationInputProps) {
  const [location, setLocation] = useState("");
  const locationInputRef = useRef<HTMLInputElement>(null);
  const [mapsInstance, setMapsInstance] = useState<any>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_AUTO_SUGGESTION;

  useEffect(() => {
    if (window.google?.maps) {
      setMapsInstance(window.google.maps);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapsInstance(window.google.maps);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mapsInstance || !locationInputRef.current) return;

    const autocomplete = new mapsInstance.places.Autocomplete(
      locationInputRef.current,
      {
        types: ["geocode"],
        fields: ["formatted_address", "geometry", "name"],
      },
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.formatted_address || !place.geometry?.location) {
        toast.error("Please select a location from the list");
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const address = place.formatted_address;

      setLocation(address);
      onChange({ address, lat, lng });
    });

    return () => mapsInstance.event.clearInstanceListeners(autocomplete);
  }, [mapsInstance, onChange]);

  const handleClear = () => {
    setLocation("");
    onChange(null);
  };

  return (
    <div>
      {label && (
        <label className='block text-sm sm:text-base font-medium text-gray-700 mb-3'>
          {label}
        </label>
      )}
      <div className='relative'>
        <Input
          ref={locationInputRef}
          placeholder={placeholder}
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            onChange(null);
          }}
          className={`bg-white! pr-10 border-gray-300 text-sm sm:text-base h-11 sm:h-11 rounded-md ${className}`}
        />
        {location && (
          <button
            onClick={handleClear}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        )}
      </div>
    </div>
  );
}

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { Autocomplete, useLoadScript } from "@react-google-maps/api";
// import React, { useEffect, useRef, useState } from "react";
// import { Input } from "../ui/input";

// const libraries: any = ["places"];

// interface LocationValue {
//   location: string;
//   lat: number | null;
//   lng: number | null;
// }

// interface Props {
//   onChange: (value: LocationValue) => void;
//   className?: string;
//   currentLocation?: string;
// }

// const CommonLocationInput = ({
//   onChange,
//   className,
//   currentLocation = "",
// }: Props) => {
//   const locationRef = useRef<google.maps.places.Autocomplete | null>(null);

//   // ✅ Local state so user can freely type/clear
//   const [inputValue, setInputValue] = useState(currentLocation ?? "");

//   // ✅ Sync when parent's currentLocation loads (e.g. after profile fetch)
//   useEffect(() => {
//     if (currentLocation !== undefined) {
//       setInputValue(currentLocation);
//     }
//   }, [currentLocation]);

//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
//     libraries,
//   });

//   const onPlaceChanged = () => {
//     if (locationRef.current) {
//       const place = locationRef.current.getPlace();
//       const newLocation = place.formatted_address || "";
//       const newLat = place.geometry?.location?.lat() ?? null;
//       const newLng = place.geometry?.location?.lng() ?? null;

//       // ✅ Update local display value too
//       setInputValue(newLocation);
//       onChange?.({ location: newLocation, lat: newLat, lng: newLng });
//     }
//   };

//   console.log({ isLoaded });

//   if (loadError) return <div>Error loading maps</div>;

//   return (
//     <div className='relative'>
//       {isLoaded ? (
//         <Autocomplete
//           onLoad={(autocomplete) => (locationRef.current = autocomplete)}
//           onPlaceChanged={onPlaceChanged}
//         >
//           <div className='space-y-2'>
//             <Input
//               id='location'
//               type='text'
//               placeholder='Enter Your Location / Address'
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)} // ✅ Allow free typing
//               required
//               className={className ? className : "h-12"}
//             />
//           </div>
//         </Autocomplete>
//       ) : (
//         <Input
//           type='text'
//           placeholder='Loading location search...'
//           disabled
//           className='h-12'
//         />
//       )}
//     </div>
//   );
// };

// export default CommonLocationInput;
