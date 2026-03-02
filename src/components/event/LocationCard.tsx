/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

interface LocationCardProps {
  lat?: number;
  lng?: number;
  address?: string;
  servicingAreas?: string;
  haveServiceAreas?: boolean;
}

function GoogleMap({
  lat,
  lng,
  apiKey,
}: {
  lat: number;
  lng: number;
  apiKey: string;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    // Load the Google Maps script if not already loaded
    const scriptId = "google-maps-script";

    const initMap = () => {
      if (!mapRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 15,
        disableDefaultUI: true,
        zoomControl: true,
        styles: [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: [{ color: "#f5f5f5" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#c9e8f7" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#ffffff" }],
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#e0e0e0" }],
          },
          {
            featureType: "poi",
            elementType: "geometry",
            stylers: [{ color: "#eeeeee" }],
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#d4eac8" }],
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#e5e5e5" }],
          },
          {
            featureType: "administrative",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b7280" }],
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca3af" }],
          },
        ],
      });

      // Add a marker at the location
      new window.google.maps.Marker({
        position: { lat, lng },
        map,
        title: "Location",
      });

      mapInstanceRef.current = map;
    };

    if (window.google?.maps) {
      initMap();
      return;
    }

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      // Script tag exists but not yet loaded — wait for it
      const existing = document.getElementById(scriptId) as HTMLScriptElement;
      existing.addEventListener("load", initMap);
    }
  }, [lat, lng, apiKey]);

  // Update map center if lat/lng props change
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({ lat, lng });
    }
  }, [lat, lng]);

  return (
    <div
      ref={mapRef}
      className='w-full h-full rounded-xl'
      style={{ minHeight: "100%" }}
    />
  );
}

export default function LocationCard({
  lat = 23.7761516,
  lng = 90.4068457,
  address = "3517 W. Gray St. Utica, Pennsylvania 57867",
  servicingAreas = "Los Angeles, IE and Orange Country",
  haveServiceAreas,
}: LocationCardProps) {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!;

  return (
    <div className='flex items-center justify-end font-[system-ui]'>
      <div className='w-full max-w-sm'>
        {/* Card */}
        <Link href='/map'>
          <div className='bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100'>
            {/* Map */}
            <div className='relative h-52 sm:h-60 bg-slate-100'>
              <GoogleMap lat={lat} lng={lng} apiKey={googleMapsApiKey} />
            </div>

            {/* Info */}
            <div className='px-5 py-4 space-y-3'>
              <div>
                <p className='text-xs font-bold text-[#374151] uppercase mb-0.5'>
                  Location
                </p>
                <p className='text-sm text-slate-700 leading-snug'>{address}</p>
              </div>

              {haveServiceAreas && <div className='h-px bg-slate-100' />}

              {haveServiceAreas && (
                <p className='text-sm font-semibold text-[#1F2937]'>
                  Servicing:{" "}
                  <span className='text-sm font-semibold text-[#1F2937]'>
                    {servicingAreas}
                  </span>
                </p>
              )}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
