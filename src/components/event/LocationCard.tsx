/* eslint-disable @typescript-eslint/no-explicit-any */
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
  className?: string;
  width?: string;
}

let mapsLoaderPromise: Promise<void> | null = null;

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (mapsLoaderPromise) return mapsLoaderPromise;

  if (typeof window !== "undefined" && (window as any).google?.maps) {
    mapsLoaderPromise = Promise.resolve();
    return mapsLoaderPromise;
  }

  const existing = document.getElementById(
    "google-maps-script",
  ) as HTMLScriptElement | null;
  if (existing) {
    mapsLoaderPromise = new Promise((resolve) => {
      if ((window as any).google?.maps) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
    });
    return mapsLoaderPromise;
  }

  mapsLoaderPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = "google-maps-script";
    // script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker`;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google Maps failed to load"));
    document.head.appendChild(script);
  });

  return mapsLoaderPromise;
}

const MAP_STYLES = [
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
];

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
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (cancelled || !mapRef.current) return;

        const g = (window as any).google;

        const map = new g.maps.Map(mapRef.current, {
          center: { lat, lng },
          zoom: 15,
          disableDefaultUI: true,
          zoomControl: true,
          // NO mapId here — mapId disables the styles array entirely
          styles: MAP_STYLES,
        });

        mapInstanceRef.current = map;

        // Use legacy Marker (not deprecated enough to break — still fully supported,
        // just shows a console warning). AdvancedMarkerElement requires a real
        // Cloud Console mapId which also kills custom styles.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        markerRef.current = new g.maps.Marker({
          position: { lat, lng },
          map,
          title: "Location",
        });

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            g.maps.event.trigger(map, "resize");
            map.setCenter({ lat, lng });
          });
        });
      })
      .catch((err: Error) => {
        console.error("LocationCard: Maps load error →", err.message);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;
    const g = (window as any).google;
    const pos = { lat, lng };
    mapInstanceRef.current.setCenter(pos);
    markerRef.current.setPosition(pos);
    g?.maps?.event.trigger(mapInstanceRef.current, "resize");
  }, [lat, lng]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        clipPath: "inset(0 0 0 0 round 1rem 1rem 0 0)",
      }}
    >
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

export default function LocationCard({
  lat = 23.7761516,
  lng = 90.4068457,
  address = "",
  servicingAreas = "",
  haveServiceAreas,
  className,
  width,
}: LocationCardProps) {
  const googleMapsApiKey =
    process.env.NEXT_PUBLIC_GOOGLE_PLACES_AUTO_SUGGESTION!;

  return (
    <div className={`flex items-center font-[system-ui] ${className}`}>
      <div className={`w-full ${width}`}>
        <Link href='/map'>
          <div
            className='bg-white shadow-xl border border-slate-100'
            style={{ borderRadius: "1rem" }}
          >
            <div
              className='relative h-52 sm:h-60 bg-slate-100'
              style={{ borderRadius: "1rem 1rem 0 0" }}
            >
              <GoogleMap lat={lat} lng={lng} apiKey={googleMapsApiKey} />
            </div>

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

// /* eslint-disable @next/next/no-img-element */
// "use client";

// import Link from "next/link";
// import { useEffect, useRef } from "react";

// interface LocationCardProps {
//   lat?: number;
//   lng?: number;
//   address?: string;
//   servicingAreas?: string;
//   haveServiceAreas?: boolean;
//   className?: string;
//   width?: string;
// }

// function GoogleMap({
//   lat,
//   lng,
//   apiKey,
// }: {
//   lat: number;
//   lng: number;
//   apiKey: string;
// }) {
//   const mapRef = useRef<HTMLDivElement>(null);
//   const mapInstanceRef = useRef<google.maps.Map | null>(null);
//   const markerRef = useRef<google.maps.Marker | null>(null);

//   useEffect(() => {
//     const scriptId = "google-maps-script";

//     const initMap = () => {
//       if (!mapRef.current) return;

//       const map = new window.google.maps.Map(mapRef.current, {
//         center: { lat, lng },
//         zoom: 15,
//         disableDefaultUI: true,
//         zoomControl: true,
//         styles: [
//           {
//             featureType: "all",
//             elementType: "geometry",
//             stylers: [{ color: "#f5f5f5" }],
//           },
//           {
//             featureType: "water",
//             elementType: "geometry",
//             stylers: [{ color: "#c9e8f7" }],
//           },
//           {
//             featureType: "road",
//             elementType: "geometry",
//             stylers: [{ color: "#ffffff" }],
//           },
//           {
//             featureType: "road",
//             elementType: "geometry.stroke",
//             stylers: [{ color: "#e0e0e0" }],
//           },
//           {
//             featureType: "poi",
//             elementType: "geometry",
//             stylers: [{ color: "#eeeeee" }],
//           },
//           {
//             featureType: "poi.park",
//             elementType: "geometry",
//             stylers: [{ color: "#d4eac8" }],
//           },
//           {
//             featureType: "transit",
//             elementType: "geometry",
//             stylers: [{ color: "#e5e5e5" }],
//           },
//           {
//             featureType: "administrative",
//             elementType: "labels.text.fill",
//             stylers: [{ color: "#6b7280" }],
//           },
//           {
//             featureType: "road",
//             elementType: "labels.text.fill",
//             stylers: [{ color: "#9ca3af" }],
//           },
//         ],
//       });

//       markerRef.current = new window.google.maps.Marker({
//         position: { lat, lng },
//         map,
//         title: "Location",
//       });

//       mapInstanceRef.current = map;
//     };

//     if (window.google?.maps) {
//       initMap();
//       return;
//     }

//     const existingScript = document.getElementById(
//       scriptId,
//     ) as HTMLScriptElement | null;

//     if (!existingScript) {
//       const script = document.createElement("script");
//       script.id = scriptId;
//       script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
//       script.async = true;
//       script.defer = true;
//       script.onload = initMap;
//       document.head.appendChild(script);
//     } else {
//       if (window.google?.maps) {
//         initMap();
//       } else {
//         existingScript.addEventListener("load", initMap);
//       }
//     }

//     return () => {
//       const s = document.getElementById(scriptId) as HTMLScriptElement | null;
//       s?.removeEventListener("load", initMap);
//     };
//   }, [lat, lng, apiKey]);

//   useEffect(() => {
//     if (mapInstanceRef.current) {
//       mapInstanceRef.current.setCenter({ lat, lng });
//     }
//     if (markerRef.current) {
//       markerRef.current.setPosition({ lat, lng });
//     }
//   }, [lat, lng]);

//   return (
//     <div
//       ref={mapRef}
//       className='w-full h-full rounded-xl'
//       style={{ minHeight: "100%" }}
//     />
//   );
// }

// export default function LocationCard({
//   lat = 23.7761516,
//   lng = 90.4068457,
//   address = "",
//   servicingAreas = "",
//   haveServiceAreas,
//   className,
//   width,
// }: LocationCardProps) {
//   const googleMapsApiKey =
//     process.env.NEXT_PUBLIC_GOOGLE_PLACES_AUTO_SUGGESTION!;

//   return (
//     <div className={`flex items-center font-[system-ui] ${className}`}>
//       <div className={`w-full ${width}`}>
//         <Link href='/map'>
//           <div className='bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100'>
//             <div className='relative h-52 sm:h-60 bg-slate-100'>
//               <GoogleMap lat={lat} lng={lng} apiKey={googleMapsApiKey} />
//             </div>
//             <div className='px-5 py-4 space-y-3'>
//               <div>
//                 <p className='text-xs font-bold text-[#374151] uppercase mb-0.5'>
//                   Location
//                 </p>
//                 <p className='text-sm text-slate-700 leading-snug'>{address}</p>
//               </div>
//               {haveServiceAreas && <div className='h-px bg-slate-100' />}
//               {haveServiceAreas && (
//                 <p className='text-sm font-semibold text-[#1F2937]'>
//                   Servicing:{" "}
//                   <span className='text-sm font-semibold text-[#1F2937]'>
//                     {servicingAreas}
//                   </span>
//                 </p>
//               )}
//             </div>
//           </div>
//         </Link>
//       </div>
//     </div>
//   );
// }
