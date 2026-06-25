"use client";

import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { Loader2, MapPin } from "lucide-react";
import { useSearchParams } from "next/navigation";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GMMap = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GMMarker = any;

let mapsScriptPromise: Promise<void> | null = null;

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (window.google?.maps) return Promise.resolve();

  if (!mapsScriptPromise) {
    mapsScriptPromise = new Promise((resolve, reject) => {
      if (document.getElementById("google-maps-script")) {
        const interval = setInterval(() => {
          if (window.google?.maps) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
        return;
      }
      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Google Maps failed to load"));
      document.head.appendChild(script);
    });
  }
  return mapsScriptPromise;
}

const MAP_STYLES: Record<string, unknown>[] = [
  { elementType: "geometry", stylers: [{ color: "#f8f9fa" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#444444" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
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
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#fdd835" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#f9a825" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#f1f3f4" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#b3d1e8" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#d8ead3" }],
  },
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  { featureType: "poi.business", stylers: [{ visibility: "off" }] },
  {
    featureType: "transit",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];

interface MiniMapProps {
  lat?: number;
  lng?: number;
  label?: string;
  width?: number | string;
  height?: number;
  zoom?: number;
  className?: string;
}

function MiniMapComponent({
  lat = 23.8103,
  lng = 90.4125,
  label = "Location",
  width = "100%",
  height = 820,
  zoom = 15,
  className = "",
}: MiniMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<GMMap>(null);
  const markerRef = useRef<GMMarker>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const params = useSearchParams();
  lat = params.get("lat") ? Number(params.get("lat")) : lat;
  lng = params.get("lng") ? Number(params.get("lng")) : lng;
  label = params.get("address") ? params.get("address")!.toString() : label;

  const GOOGLE_MAPS_API_KEY =
    process.env.NEXT_PUBLIC_GOOGLE_PLACES_AUTO_SUGGESTION ?? "";

  const initializeMap = useCallback(async () => {
    if (!mapRef.current || !GOOGLE_MAPS_API_KEY) {
      setMapError("Google Maps API key is missing.");
      setIsLoading(false);
      return;
    }
    try {
      await loadGoogleMapsScript(GOOGLE_MAPS_API_KEY);

      const center = { lat, lng };

      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        styles: MAP_STYLES,
        mapTypeId: "roadmap",
        backgroundColor: "#f8f9fa",
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "cooperative",
      });

      const marker = new window.google.maps.Marker({
        position: center,
        map,
        title: label,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: "#1565C0",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 3,
        },
        zIndex: 10,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="font-family:'Segoe UI',sans-serif;font-size:12px;font-weight:600;color:#1565C0;padding:2px 4px;">${label}</div>`,
      });
      marker.addListener("click", () => infoWindow.open(map, marker));

      mapInstanceRef.current = map;
      markerRef.current = marker;
      setIsLoading(false);
    } catch {
      setMapError("Failed to load Google Maps.");
      setIsLoading(false);
    }
  }, [GOOGLE_MAPS_API_KEY, lat, lng, zoom, label]);

  // Init once on mount
  useEffect(() => {
    initializeMap();
    return () => {
      if (markerRef.current) markerRef.current.setMap(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep map/marker in sync if lat/lng change after mount
  useEffect(() => {
    const map = mapInstanceRef.current;
    const marker = markerRef.current;
    if (!map || !marker || !window.google?.maps) return;
    const position = { lat, lng };
    marker.setPosition(position);
    map.panTo(position);
  }, [lat, lng]);

  return (
    <div
      className={`relative rounded-2xl overflow-hidden ${className}`}
      style={{
        background: "#f8f9fa",
        border: "1px solid #e0e0e0",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        width,
        height,
      }}
    >
      <div className='absolute top-3 right-3 z-10 text-sm font-semibold bg-gray-800 text-white rounded-full px-3 py-1 shadow-md max-w-[80%] truncate'>
        {label}
      </div>

      <div ref={mapRef} className='w-full h-full' />

      {isLoading && (
        <div
          className='absolute inset-0 flex flex-col items-center justify-center'
          style={{ background: "#f8f9facc" }}
        >
          <Loader2 className='animate-spin mb-2 text-blue-600' size={24} />
          <p className='text-xs text-gray-500'>Loading map…</p>
        </div>
      )}

      {mapError && (
        <div
          className='absolute inset-0 flex flex-col items-center justify-center px-4 text-center'
          style={{ background: "#f8f9facc" }}
        >
          <MapPin size={24} className='mb-2 text-red-500' />
          <p className='text-xs text-red-500 font-semibold'>{mapError}</p>
          <p className='text-[10px] text-gray-400 mt-1'>
            Check your NEXT_PUBLIC_GOOGLE_API_KEY
          </p>
        </div>
      )}
    </div>
  );
}

export default function MiniMap() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MiniMapComponent />
    </Suspense>
  );
}
