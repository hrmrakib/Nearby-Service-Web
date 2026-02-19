/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import React, { useRef } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const libraries: any = ["places"];

interface LocationValue {
  location: string;
  lat: number | null;
  lng: number | null;
}

interface Props {
  onChange: (value: LocationValue) => void;
}

const CommonLocationInput = ({ onChange }: Props) => {
  // Google Autocomplete Ref
  const locationRef = useRef<google.maps.places.Autocomplete | null>(null);
  // Load Google Maps script
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

      onChange?.({ location: newLocation, lat: newLat, lng: newLng });
    }
  };

  if (loadError) return <div>Error loading maps</div>;

  return (
    <div className='relative'>
      {isLoaded ? (
        <Autocomplete
          onLoad={(autocomplete) => (locationRef.current = autocomplete)}
          onPlaceChanged={onPlaceChanged}
        >
          <div className='space-y-2'>
            <Label
              htmlFor='location'
              className='text-sm font-medium text-muted-foreground'
            >
              Location / Address
            </Label>
            <Input
              id='location'
              type='text'
              placeholder='Enter Your Location / Address'
              //   value={location ?? ""}
              //   onChange={(e) => setLocation(e.target.value)}
              required
              className='h-12'
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
