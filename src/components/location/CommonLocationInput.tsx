/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";

const libraries: any = ["places"];

interface LocationValue {
  location: string;
  lat: number | null;
  lng: number | null;
}

interface Props {
  onChange: (value: LocationValue) => void;
  className?: string;
  currentLocation?: string;
}

const CommonLocationInput = ({
  onChange,
  className,
  currentLocation = "",
}: Props) => {
  const locationRef = useRef<google.maps.places.Autocomplete | null>(null);

  // ✅ Local state so user can freely type/clear
  const [inputValue, setInputValue] = useState(currentLocation ?? "");

  // ✅ Sync when parent's currentLocation loads (e.g. after profile fetch)
  useEffect(() => {
    if (currentLocation !== undefined) {
      setInputValue(currentLocation);
    }
  }, [currentLocation]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
    libraries,
  });

  const onPlaceChanged = () => {
    if (locationRef.current) {
      const place = locationRef.current.getPlace();
      const newLocation = place.formatted_address || "";
      const newLat = place.geometry?.location?.lat() ?? null;
      const newLng = place.geometry?.location?.lng() ?? null;

      // ✅ Update local display value too
      setInputValue(newLocation);
      onChange?.({ location: newLocation, lat: newLat, lng: newLng });
    }
  };

  console.log({ isLoaded });

  if (loadError) return <div>Error loading maps</div>;

  return (
    <div className='relative'>
      {isLoaded ? (
        <Autocomplete
          onLoad={(autocomplete) => (locationRef.current = autocomplete)}
          onPlaceChanged={onPlaceChanged}
        >
          <div className='space-y-2'>
            <Input
              id='location'
              type='text'
              placeholder='Enter Your Location / Address'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)} // ✅ Allow free typing
              required
              className={className ? className : "h-12"}
            />
          </div>
        </Autocomplete>
      ) : (
        <Input
          type='text'
          placeholder='Loading location search...'
          disabled
          className='h-12'
        />
      )}
    </div>
  );
};

export default CommonLocationInput;
