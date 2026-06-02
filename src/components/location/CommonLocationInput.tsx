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
  value?: string | null;
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
  value,
  onChange,
  placeholder = "City or Zip Code",
  className = "",
  label = "",
}: LocationInputProps) {
  const [location, setLocation] = useState(value ?? "");
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
