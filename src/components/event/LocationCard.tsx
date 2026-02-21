/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef } from "react";

interface LocationCardProps {
  lat?: number;
  lng?: number;
  address?: string;
  servicingAreas?: string;
  googleMapsApiKey: string;
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
  googleMapsApiKey,
}: LocationCardProps) {
  return (
    <div className='flex items-center justify-end font-[system-ui]'>
      <div className='w-full max-w-sm'>
        {/* Card */}
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

            <div className='h-px bg-slate-100' />

            <p className='text-sm font-semibold text-[#1F2937]'>
              Servicing:{" "}
              <span className='text-sm font-semibold text-[#1F2937]'>
                {servicingAreas}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// /* eslint-disable @next/next/no-img-element */
// "use client";

// interface LocationCardProps {
//   lat?: number;
//   lng?: number;
//   address?: string;
//   servicingAreas?: string;
// }

// // Minimal static map using OpenStreetMap tile (no API key needed)
// function StaticMap({ lat, lng }: { lat: number; lng: number }) {
//   const zoom = 15;
//   // Convert lat/lng to tile numbers
//   const tileX = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
//   const tileY = Math.floor(
//     ((1 -
//       Math.log(
//         Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180),
//       ) /
//         Math.PI) /
//       2) *
//       Math.pow(2, zoom),
//   );

//   // Use a 3x3 grid of tiles for a wider view
//   const tileSize = 256;
//   const tiles = [];
//   for (let dy = -1; dy <= 1; dy++) {
//     for (let dx = -1; dx <= 1; dx++) {
//       tiles.push({
//         x: tileX + dx,
//         y: tileY + dy,
//         dx,
//         dy,
//       });
//     }
//   }

//   // Calculate pixel offset of the exact lat/lng within the center tile
//   const worldX = ((lng + 180) / 360) * Math.pow(2, zoom) * tileSize;
//   const worldY =
//     ((1 -
//       Math.log(
//         Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180),
//       ) /
//         Math.PI) /
//       2) *
//     Math.pow(2, zoom) *
//     tileSize;
//   const centerTileOriginX = tileX * tileSize;
//   const centerTileOriginY = tileY * tileSize;
//   const offsetX = worldX - centerTileOriginX;
//   const offsetY = worldY - centerTileOriginY;

//   // The pin is at the center of a 3x3 grid (768x768), adjusted by pixel offset
//   const pinX = tileSize + offsetX;
//   const pinY = tileSize + offsetY;

//   return (
//     <div className='relative w-full h-full overflow-hidden rounded-xl bg-slate-100'>
//       {/* Tile grid */}
//       <div
//         className='absolute'
//         style={{
//           width: tileSize * 3,
//           height: tileSize * 3,
//           top: "50%",
//           left: "50%",
//           transform: `translate(${-pinX}px, ${-pinY}px)`,
//         }}
//       >
//         {tiles.map(({ x, y, dx, dy }) => (
//           <img
//             key={`${x}-${y}`}
//             src={`https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`}
//             alt=''
//             width={tileSize}
//             height={tileSize}
//             className='absolute'
//             style={{
//               left: (dx + 1) * tileSize,
//               top: (dy + 1) * tileSize,
//             }}
//           />
//         ))}
//       </div>

//       {/* Soft vignette overlay */}
//       <div className='absolute inset-0 pointer-events-none rounded-xl shadow-[inset_0_0_30px_rgba(0,0,0,0.08)]' />
//     </div>
//   );
// }

// export default function LocationCard({
//   lat = 23.7761516,
//   lng = 90.4068457,
//   address = "3517 W. Gray St. Utica, Pennsylvania 57867",
//   servicingAreas = "Los Angeles, IE and Orange Country",
// }: LocationCardProps) {
//   return (
//     <div className='flex items-center justify-end font-[system-ui]'>
//       <div className='w-full max-w-sm'>
//         {/* Card */}
//         <div className='bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100'>
//           {/* Map */}
//           <div className='relative h-52 sm:h-60 bg-slate-100'>
//             <StaticMap key={0} lat={lat} lng={lng} />
//           </div>

//           {/* Info */}
//           <div className='px-5 py-4 space-y-3'>
//             <div>
//               <p className='text-xs font-bold text-[#374151] uppercase mb-0.5'>
//                 Location
//               </p>
//               <p className='text-sm text-slate-700 leading-snug'>{address}</p>
//             </div>

//             <div className='h-px bg-slate-100' />

//             <p className='text-sm font-semibold text-[#1F2937]'>
//               Servicing:{" "}
//               <span className='text-sm font-semibold text-[#1F2937]'>
//                 {servicingAreas}
//               </span>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
