/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState, useCallback, JSX } from "react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type FilterType = "All" | "Events" | "Deals" | "Services" | "Alerts";

interface CardItem {
  id: number;
  title: string;
  category: FilterType;
  image: string;
  distance: string;
  rating: number;
  tag: string;
  description: string;
  lat: number;
  lng: number;
  shopIcon: string;
}

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const CARDS: CardItem[] = [
  {
    id: 1,
    title: "Cozy Coffee Spot",
    category: "Deals",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80",
    distance: "2.3 mi",
    rating: 4.9,
    tag: "Deals",
    description:
      "Artisan espresso crafted from single-origin beans. Signature cinnamon latte in a warm, sunlit corner surrounded by good books.",
    lat: 40.7282,
    lng: -73.8803,
    shopIcon: "☕",
  },
  {
    id: 2,
    title: "Live Jazz Night",
    category: "Events",
    image:
      "https://images.unsplash.com/photo-1501386761578-eaa54b4e9d57?w=600&q=80",
    distance: "1.1 mi",
    rating: 4.7,
    tag: "Events",
    description:
      "Saturday nights come alive with live jazz, craft cocktails, and a crowd that knows how to move. Doors open at 8 PM.",
    lat: 40.7328,
    lng: -73.8753,
    shopIcon: "🎷",
  },
  {
    id: 3,
    title: "Quick Bike Repair",
    category: "Services",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    distance: "0.8 mi",
    rating: 4.8,
    tag: "Services",
    description:
      "Flat tire? Chain slipped? Our certified mechanics get you back on the road in under 30 minutes — most repairs under $20.",
    lat: 40.7255,
    lng: -73.8833,
    shopIcon: "🔧",
  },
  {
    id: 4,
    title: "Flash Sale: 50% Off",
    category: "Deals",
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
    distance: "3.0 mi",
    rating: 4.5,
    tag: "Deals",
    description:
      "Today only — half price on all outerwear. Dozens of styles, all sizes in stock at the Atlas Street location.",
    lat: 40.731,
    lng: -73.878,
    shopIcon: "🛍",
  },
  {
    id: 5,
    title: "Road Closure Alert",
    category: "Alerts",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80",
    distance: "0.5 mi",
    rating: 0,
    tag: "Alerts",
    description:
      "Queens Blvd between 63rd Dr and Woodhaven is closed until 6 PM for utility work. Expect detours via Junction Blvd.",
    lat: 40.727,
    lng: -73.877,
    shopIcon: "⚠️",
  },
  {
    id: 6,
    title: "Yoga in the Park",
    category: "Events",
    image:
      "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&q=80",
    distance: "1.6 mi",
    rating: 4.6,
    tag: "Events",
    description:
      "Free Sunday morning yoga at Juniper Valley Park. All levels welcome — bring your mat, we supply the good vibes.",
    lat: 40.73,
    lng: -73.882,
    shopIcon: "🧘",
  },
];

/* ─────────────────────────────────────────────
   Filter config
───────────────────────────────────────────── */
const FILTERS: { label: FilterType; icon: JSX.Element }[] = [
  { label: "All", icon: <AllIcon /> },
  { label: "Events", icon: <CalIcon /> },
  { label: "Deals", icon: <TagIcon /> },
  { label: "Services", icon: <WrenchIcon /> },
  { label: "Alerts", icon: <BellIcon /> },
];

const TAG_STYLES: Record<string, string> = {
  Deals: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Events: "bg-violet-50 text-violet-700 border border-violet-200",
  Services: "bg-sky-50 text-sky-700 border border-sky-200",
  Alerts: "bg-rose-50 text-rose-700 border border-rose-200",
};

const MARKER_COLORS: Record<string, string> = {
  Deals: "#059669",
  Events: "#7c3aed",
  Services: "#0284c7",
  Alerts: "#dc2626",
  All: "#16a34a",
};

/* ─────────────────────────────────────────────
   Custom pin-shape SVG marker with arrow
───────────────────────────────────────────── */
function buildMarkerSvg(
  emoji: string,
  color: string,
  selected: boolean,
): string {
  const W = selected ? 52 : 44;
  const H = selected ? 62 : 52;
  const cx = W / 2;
  const r = W * 0.36;
  const cy = r + 4;
  const tipY = H - 2;

  // Teardrop / map-pin path
  const d = [
    `M ${cx} ${tipY}`,
    `C ${cx - 4} ${tipY - 10}, ${cx - r - 4} ${cy + r * 0.6}, ${cx - r} ${cy}`,
    `A ${r} ${r} 0 1 1 ${cx + r} ${cy}`,
    `C ${cx + r + 4} ${cy + r * 0.6}, ${cx + 4} ${tipY - 10}, ${cx} ${tipY}`,
    `Z`,
  ].join(" ");

  const ringR = r + (selected ? 9 : 6);
  const pulse = selected
    ? `<circle cx="${cx}" cy="${cy}" r="${ringR}" fill="${color}" opacity="0.15"><animate attributeName="r" values="${ringR - 2};${ringR + 8};${ringR - 2}" dur="1.8s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.2;0;0.2" dur="1.8s" repeatCount="indefinite"/></circle>`
    : "";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${pulse}
    <path d="${d}" fill="${color}" stroke="${selected ? "#fff" : "rgba(255,255,255,0.85)"}" stroke-width="${selected ? 2.5 : 2}" filter="drop-shadow(0 3px 8px rgba(0,0,0,${selected ? "0.45" : "0.28"}))"/>
    <text x="${cx}" y="${cy + 1.5}" font-size="${r * 0.98}" text-anchor="middle" dominant-baseline="central">${emoji}</text>
  </svg>`;

  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

/* ─────────────────────────────────────────────
   User location marker (blue dot + arrow)
───────────────────────────────────────────── */
function buildUserDot(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="16" fill="#3b82f6" opacity="0.15">
      <animate attributeName="r" values="10;18;10" dur="2.2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.2;0;0.2" dur="2.2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="20" cy="20" r="10" fill="#3b82f6" stroke="#ffffff" stroke-width="3" filter="drop-shadow(0 2px 6px rgba(59,130,246,0.6))"/>
    <circle cx="20" cy="20" r="4" fill="#ffffff"/>
    <!-- heading arrow -->
    <polygon points="20,5 24,14 20,11 16,14" fill="#3b82f6" opacity="0.9"/>
  </svg>`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export default function MapExplorer({
  googleApiKey = "AIzaSyDltI2vV-mbS5Qy-gz2lPMTf7RAbR4tZRs",
  defaultLat = 40.7282,
  defaultLng = -73.8803,
}: {
  googleApiKey: string;
  defaultLat?: number;
  defaultLng?: number;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<number, google.maps.Marker>>(new Map());

  const [panelOpen, setPanelOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const filtered = CARDS.filter(
    (c) => activeFilter === "All" || c.category === activeFilter,
  );

  // ── Load Google Maps script ──
  useEffect(() => {
    if (typeof window === "undefined") return;
    const load = () => initMap();
    if ((window as any).google?.maps) {
      load();
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}`;
    script.async = true;
    script.onload = load;
    document.head.appendChild(script);
  }, []);

  const initMap = useCallback(() => {
    if (!mapRef.current) return;
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: defaultLat, lng: defaultLng },
      zoom: 14,
      disableDefaultUI: true,
      zoomControl: true,
      zoomControlOptions: { position: google.maps.ControlPosition.LEFT_BOTTOM },
      styles: MAP_STYLES,
      gestureHandling: "greedy",
    });
    mapInstance.current = map;

    // User location marker
    new google.maps.Marker({
      position: { lat: defaultLat, lng: defaultLng },
      map,
      title: "You are here",
      icon: {
        url: buildUserDot(),
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 20),
      },
      zIndex: 1000,
    });

    placeMarkers(map, CARDS, null);
  }, [defaultLat, defaultLng]);

  const placeMarkers = (
    map: google.maps.Map,
    cards: CardItem[],
    sel: number | null,
  ) => {
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current.clear();
    cards.forEach((card) => {
      const isSel = card.id === sel;
      const color = MARKER_COLORS[card.category] ?? "#16a34a";
      const url = buildMarkerSvg(card.shopIcon, color, isSel);
      const W = isSel ? 52 : 44;
      const H = isSel ? 62 : 52;
      const marker = new google.maps.Marker({
        position: { lat: card.lat, lng: card.lng },
        map,
        title: card.title,
        icon: {
          url,
          scaledSize: new google.maps.Size(W, H),
          anchor: new google.maps.Point(W / 2, H),
        },
        zIndex: isSel ? 100 : 1,
      });
      marker.addListener("click", () => {
        handleSelect(card.id, map);
        setPanelOpen(true);
      });
      markersRef.current.set(card.id, marker);
    });
  };

  const handleSelect = (id: number, map?: google.maps.Map) => {
    const m = map ?? mapInstance.current;
    setSelectedId(id);
    const vis =
      activeFilter === "All"
        ? CARDS
        : CARDS.filter((c) => c.category === activeFilter);
    if (m) {
      const card = CARDS.find((c) => c.id === id);
      if (card) {
        m.panTo({ lat: card.lat, lng: card.lng });
        m.setZoom(15);
      }
      placeMarkers(m, vis, id);
    }
    setTimeout(() => {
      cardRefs.current
        .get(id)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 120);
  };

  // Re-render markers on filter change
  useEffect(() => {
    if (!mapInstance.current) return;
    placeMarkers(mapInstance.current, filtered, selectedId);
  }, [activeFilter]);

  return (
    <div
      className='relative w-full h-screen overflow-hidden'
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');`}</style>

      {/* Map fills the screen */}
      <div ref={mapRef} className='absolute inset-0 w-full h-full' />

      {/* Top center label */}
      <div className='absolute top-4 left-4 right-16 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md shadow-lg rounded-2xl px-4 py-2.5 border border-white/60 max-w-xs'>
        <span className='text-blue-500 text-base'>📍</span>
        <div>
          <p className='text-sm font-bold text-gray-900 leading-tight'>
            Rego Park, Queens
          </p>
          <p className='text-[10px] text-gray-400 font-medium'>
            {filtered.length} places nearby
          </p>
        </div>
      </div>

      {/* Toggle (hamburger / X) */}
      <button
        onClick={() => setPanelOpen((p) => !p)}
        className='absolute top-4 right-4 z-30 w-11 h-11 flex items-center justify-center bg-white shadow-xl rounded-2xl border border-gray-100 hover:bg-gray-50 active:scale-95 transition-all duration-200'
        aria-label='Toggle panel'
      >
        <HamburgerX open={panelOpen} />
      </button>

      {/* ── Side Panel ── */}
      <div
        className={`absolute top-0 right-0 h-full z-20 flex flex-col transition-transform duration-500 ease-[cubic-bezier(.77,0,.18,1)]
          ${panelOpen ? "translate-x-0" : "translate-x-full"}
          w-[360px] sm:w-[390px]`}
        style={{
          background: "rgba(255,255,255,0.98)",
          backdropFilter: "blur(24px)",
          borderLeft: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
        }}
      >
        {/* Header */}
        <div className='px-5 pt-6 pb-3'>
          <div className='flex items-center justify-between mb-1'>
            <div>
              <h2 className='text-[18px] font-bold text-gray-900 tracking-tight'>
                Explore Nearby
              </h2>
              <p className='text-[11px] text-gray-400 font-medium mt-0.5'>
                {filtered.length} result{filtered.length !== 1 ? "s" : ""} · tap
                a pin to explore
              </p>
            </div>
            <button
              onClick={() => setPanelOpen(false)}
              className='w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all'
            >
              <CloseX />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className='px-5 pb-3'>
          <div
            className='flex gap-2 overflow-x-auto'
            style={{ scrollbarWidth: "none" }}
          >
            {FILTERS.map(({ label, icon }) => {
              const active = activeFilter === label;
              return (
                <button
                  key={label}
                  onClick={() => {
                    setActiveFilter(label);
                    setSelectedId(null);
                  }}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95
                    ${
                      active
                        ? "bg-gray-900 text-white shadow-md"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800"
                    }`}
                >
                  <span className='w-3.5 h-3.5 flex-shrink-0'>{icon}</span>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className='h-px bg-gray-100 mx-5 mb-1' />

        {/* Scrollable cards */}
        <div
          className='flex-1 overflow-y-auto px-4 py-3 space-y-3'
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#e5e7eb transparent",
          }}
        >
          {filtered.length === 0 && (
            <div className='flex flex-col items-center justify-center py-20'>
              <span className='text-5xl mb-3'>🗺</span>
              <p className='text-sm text-gray-400 font-medium'>
                No results for this filter
              </p>
            </div>
          )}

          {filtered.map((card, i) => {
            const isSel = selectedId === card.id;
            return (
              <div
                key={card.id}
                ref={(el) => {
                  if (el) cardRefs.current.set(card.id, el);
                }}
                onClick={() => handleSelect(card.id)}
                style={{ animationFillMode: "both" }}
                className={`rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300
                  ${
                    isSel
                      ? "ring-2 ring-gray-900 shadow-xl scale-[1.01]"
                      : "border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200"
                  }`}
              >
                {/* Image row */}
                <div className='relative h-[160px] overflow-hidden bg-gray-100'>
                  <img
                    src={card.image}
                    alt={card.title}
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent' />

                  {/* Tag badge */}
                  <span
                    className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm ${TAG_STYLES[card.tag] ?? ""}`}
                    style={{ background: "rgba(255,255,255,0.88)" }}
                  >
                    {card.tag}
                  </span>

                  {/* Shop icon bubble */}
                  <div className='absolute bottom-3 right-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-xl shadow-md border border-white/50'>
                    {card.shopIcon}
                  </div>

                  {/* Arrow indicator linking to map */}
                  {isSel && (
                    <div className='absolute top-3 right-3 flex items-center gap-1 bg-gray-900/80 text-white text-[10px] font-bold px-2 py-1 rounded-lg backdrop-blur-sm'>
                      <MapArrow /> On map
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className='p-4 bg-white'>
                  <h3 className='font-bold text-gray-900 text-[15px] leading-tight mb-2'>
                    {card.title}
                  </h3>

                  <div className='flex items-center gap-3 text-[11px] text-gray-400 font-semibold mb-2.5'>
                    <span className='flex items-center gap-1 text-emerald-600'>
                      <PinArrow /> {card.distance}
                    </span>
                    {card.rating > 0 && (
                      <span className='flex items-center gap-1'>
                        <span className='text-amber-400 text-xs'>★</span>
                        <span className='text-gray-700'>{card.rating}</span>
                      </span>
                    )}
                  </div>

                  <p className='text-[12px] text-gray-500 leading-relaxed line-clamp-2 mb-3.5'>
                    {card.description}
                  </p>

                  <div className='flex gap-2'>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Quote requested: ${card.title}`);
                      }}
                      className='flex-1 bg-gray-900 hover:bg-gray-700 text-white text-[12px] font-bold py-2.5 rounded-xl transition-all active:scale-[0.97]'
                    >
                      Request Quote
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Saved: ${card.title}`);
                      }}
                      className='w-10 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 hover:text-gray-800 transition-all active:scale-95'
                    >
                      <BookmarkSvg />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Map styles (warm muted palette)
───────────────────────────────────────────── */
const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#eeebe4" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#5c5a54" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f1ea" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#3a3830" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road.arterial",
    elementType: "labels.text.fill",
    stylers: [{ color: "#767066" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#e0d9cc" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#cfc8bb" }],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [{ color: "#a09890" }],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [{ color: "#ddd6c8" }],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [{ color: "#e8e4dc" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#b3cde8" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#5a84a8" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#cde8b8" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#5a9040" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#e4dfda" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text",
    stylers: [{ visibility: "off" }],
  },
];

/* ─────────────────────────────────────────────
   SVG icon sub-components
───────────────────────────────────────────── */
function HamburgerX({ open }: { open: boolean }) {
  return (
    <div className='w-5 h-[18px] flex flex-col justify-between'>
      <span
        className={`block h-0.5 rounded-full bg-gray-700 origin-left transition-all duration-300 ${open ? "rotate-[42deg] translate-y-[2px]" : ""}`}
      />
      <span
        className={`block h-0.5 rounded-full bg-gray-700 transition-all duration-300 ${open ? "opacity-0 scale-x-0" : ""}`}
      />
      <span
        className={`block h-0.5 rounded-full bg-gray-700 origin-left transition-all duration-300 ${open ? "-rotate-[42deg] -translate-y-[2px]" : ""}`}
      />
    </div>
  );
}
function CloseX() {
  return (
    <svg
      className='w-4 h-4'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth={2.5}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M6 18L18 6M6 6l12 12'
      />
    </svg>
  );
}
function AllIcon() {
  return (
    <svg
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth={2.5}
      className='w-full h-full'
    >
      <circle cx='12' cy='12' r='9' />
      <circle cx='12' cy='12' r='3' fill='currentColor' />
    </svg>
  );
}
function CalIcon() {
  return (
    <svg
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth={2}
      className='w-full h-full'
    >
      <rect x='3' y='4' width='18' height='18' rx='3' />
      <path d='M16 2v4M8 2v4M3 10h18' />
    </svg>
  );
}
function TagIcon() {
  return (
    <svg
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth={2}
      className='w-full h-full'
    >
      <path d='M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z' />
      <circle cx='7' cy='7' r='1.5' fill='currentColor' />
    </svg>
  );
}
function WrenchIcon() {
  return (
    <svg
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth={2}
      className='w-full h-full'
    >
      <path d='M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z' />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth={2}
      className='w-full h-full'
    >
      <path d='M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0' />
    </svg>
  );
}
function PinArrow() {
  return (
    <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 24 24'>
      <path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z' />
    </svg>
  );
}
function MapArrow() {
  return (
    <svg
      className='w-3 h-3'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth={2.5}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M17 8l4 4m0 0l-4 4m4-4H3'
      />
    </svg>
  );
}
function BookmarkSvg() {
  return (
    <svg
      className='w-4 h-4'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth={2}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
      />
    </svg>
  );
}

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useEffect, useRef, useState, useCallback } from "react";

// // ── Types ────────────────────────────────────────────────────────────────────
// type FilterType = "All" | "Events" | "Deals" | "Services" | "Alerts";

// interface CardItem {
//   id: number;
//   title: string;
//   category: FilterType;
//   image: string;
//   distance: string;
//   rating: number;
//   tag: string;
//   description: string;
//   lat: number;
//   lng: number;
// }

// // ── Mock data ────────────────────────────────────────────────────────────────
// const CARDS: CardItem[] = [
//   {
//     id: 1,
//     title: "Cozy Coffee Spot",
//     category: "Deals",
//     image:
//       "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80",
//     distance: "2.3 miles",
//     rating: 4.9,
//     tag: "Deals",
//     description:
//       "Artisan espresso crafted from single-origin beans. Enjoy our signature cinnamon latte in a warm, sunlit corner surrounded by good books.",
//     lat: 40.7282,
//     lng: -73.8803,
//   },
//   {
//     id: 2,
//     title: "Live Jazz Night",
//     category: "Events",
//     image:
//       "https://images.unsplash.com/photo-1501386761578-eaa54b4e9d57?w=600&q=80",
//     distance: "1.1 miles",
//     rating: 4.7,
//     tag: "Events",
//     description:
//       "Saturday nights come alive with live jazz, craft cocktails, and a crowd that knows how to move. Doors open at 8 PM — no cover before 9.",
//     lat: 40.7328,
//     lng: -73.8753,
//   },
//   {
//     id: 3,
//     title: "Quick Bike Repair",
//     category: "Services",
//     image:
//       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
//     distance: "0.8 miles",
//     rating: 4.8,
//     tag: "Services",
//     description:
//       "Flat tire? Chain slipped? Our certified mechanics get you back on the road in under 30 minutes — most repairs under $20.",
//     lat: 40.7255,
//     lng: -73.8833,
//   },
//   {
//     id: 4,
//     title: "Flash Sale: 50% Off",
//     category: "Deals",
//     image:
//       "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
//     distance: "3.0 miles",
//     rating: 4.5,
//     tag: "Deals",
//     description:
//       "Today only — half price on all outerwear. Dozens of styles, all sizes in stock. First come, first served at the Atlas Street location.",
//     lat: 40.731,
//     lng: -73.878,
//   },
//   {
//     id: 5,
//     title: "Road Closure – Queens Blvd",
//     category: "Alerts",
//     image:
//       "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80",
//     distance: "0.5 miles",
//     rating: 0,
//     tag: "Alerts",
//     description:
//       "Queens Blvd between 63rd Dr and Woodhaven is closed until 6 PM for utility work. Expect detours via Junction Blvd.",
//     lat: 40.727,
//     lng: -73.877,
//   },
//   {
//     id: 6,
//     title: "Yoga in the Park",
//     category: "Events",
//     image:
//       "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&q=80",
//     distance: "1.6 miles",
//     rating: 4.6,
//     tag: "Events",
//     description:
//       "Free Sunday morning yoga at Juniper Valley Park. All levels welcome. Bring your mat, we supply the good vibes and post-stretch smoothies.",
//     lat: 40.73,
//     lng: -73.882,
//   },
// ];

// // ── Filter config ────────────────────────────────────────────────────────────
// const FILTERS: { label: FilterType; icon: string }[] = [
//   { label: "All", icon: "◎" },
//   { label: "Events", icon: "🗓" },
//   { label: "Deals", icon: "🏷" },
//   { label: "Services", icon: "⚙" },
//   { label: "Alerts", icon: "🔔" },
// ];

// const TAG_COLORS: Record<string, string> = {
//   Deals: "bg-emerald-100 text-emerald-700",
//   Events: "bg-violet-100 text-violet-700",
//   Services: "bg-sky-100 text-sky-700",
//   Alerts: "bg-rose-100 text-rose-700",
// };

// // ── Component ────────────────────────────────────────────────────────────────
// export default function MapExplorer({
//   googleApiKey = "AIzaSyDltI2vV-mbS5Qy-gz2lPMTf7RAbR4tZRs",
//   defaultLat = 40.7282,
//   defaultLng = -73.8803,
// }: {
//   googleApiKey: string;
//   defaultLat?: number;
//   defaultLng?: number;
// }) {
//   const mapRef = useRef<HTMLDivElement>(null);
//   const mapInstanceRef = useRef<google.maps.Map | null>(null);
//   const markersRef = useRef<google.maps.Marker[]>([]);

//   const [panelOpen, setPanelOpen] = useState(true);
//   const [activeFilter, setActiveFilter] = useState<FilterType>("All");
//   const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);

//   const filtered = CARDS.filter(
//     (c) => activeFilter === "All" || c.category === activeFilter,
//   );

//   // ── Load Google Maps ──────────────────────────────────────────────────────
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     if ((window as any).google?.maps) {
//       initMap();
//       return;
//     }
//     const script = document.createElement("script");
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}`;
//     script.async = true;
//     script.defer = true;
//     script.onload = initMap;
//     document.head.appendChild(script);
//   }, []);

//   const initMap = useCallback(() => {
//     if (!mapRef.current) return;
//     const map = new google.maps.Map(mapRef.current, {
//       center: { lat: defaultLat, lng: defaultLng },
//       zoom: 14,
//       disableDefaultUI: true,
//       zoomControl: true,
//       styles: MAP_STYLES,
//     });
//     mapInstanceRef.current = map;
//     addMarkers(map, CARDS);
//   }, [defaultLat, defaultLng]);

//   const addMarkers = (map: google.maps.Map, cards: CardItem[]) => {
//     markersRef.current.forEach((m) => m.setMap(null));
//     markersRef.current = cards.map((card) => {
//       const marker = new google.maps.Marker({
//         position: { lat: card.lat, lng: card.lng },
//         map,
//         title: card.title,
//         icon: {
//           path: google.maps.SymbolPath.CIRCLE,
//           scale: 10,
//           fillColor: "#16a34a",
//           fillOpacity: 1,
//           strokeColor: "#fff",
//           strokeWeight: 2,
//         },
//       });
//       marker.addListener("click", () => {
//         setSelectedCard(card);
//         setPanelOpen(true);
//       });
//       return marker;
//     });
//   };

//   // Re-render markers when filter changes
//   useEffect(() => {
//     if (!mapInstanceRef.current) return;
//     addMarkers(mapInstanceRef.current, filtered);
//   }, [activeFilter]);

//   return (
//     <div className='relative w-full h-screen font-sans overflow-hidden'>
//       {/* ── Map ── */}
//       <div ref={mapRef} className='absolute inset-0 w-full h-full' />

//       {/* ── Toggle button (top-right) ── */}
//       <button
//         onClick={() => setPanelOpen((p) => !p)}
//         className='absolute top-4 right-4 z-30 flex items-center gap-2 bg-white shadow-lg rounded-full px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all'
//         aria-label='Toggle panel'
//       >
//         <MenuIcon open={panelOpen} />
//         <span className='hidden sm:inline'>
//           {panelOpen ? "Hide Panel" : "Explore"}
//         </span>
//       </button>

//       {/* ── Slide-in Panel ── */}
//       <div
//         className={`absolute top-0 right-0 h-full z-20 flex flex-col bg-white shadow-2xl transition-all duration-500 ease-[cubic-bezier(.77,0,.18,1)]
//           ${panelOpen ? "translate-x-0" : "translate-x-full"}
//           w-[360px] sm:w-[400px]`}
//       >
//         {/* Header */}
//         <div className='flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100'>
//           <div>
//             <h2 className='text-lg font-bold text-gray-900 tracking-tight'>
//               Nearby
//             </h2>
//             <p className='text-xs text-gray-400 mt-0.5'>
//               {filtered.length} place{filtered.length !== 1 ? "s" : ""} found
//             </p>
//           </div>
//           <button
//             onClick={() => setPanelOpen(false)}
//             className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition'
//             aria-label='Close panel'
//           >
//             ✕
//           </button>
//         </div>

//         {/* Filter Pills */}
//         <div className='flex gap-2 px-4 py-3 overflow-x-auto scrollbar-none border-b border-gray-100'>
//           {FILTERS.map(({ label, icon }) => (
//             <button
//               key={label}
//               onClick={() => {
//                 setActiveFilter(label);
//                 setSelectedCard(null);
//               }}
//               className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200
//                 ${
//                   activeFilter === label
//                     ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
//                     : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                 }`}
//             >
//               <span className='text-base leading-none'>{icon}</span>
//               {label}
//             </button>
//           ))}
//         </div>

//         {/* Cards List */}
//         <div className='flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-200'>
//           {filtered.length === 0 && (
//             <div className='text-center py-16 text-gray-400'>
//               <p className='text-4xl mb-3'>🔍</p>
//               <p className='font-medium'>No results for this filter</p>
//             </div>
//           )}

//           {filtered.map((card) => (
//             <div
//               key={card.id}
//               onClick={() => {
//                 setSelectedCard(card);
//                 mapInstanceRef.current?.panTo({ lat: card.lat, lng: card.lng });
//               }}
//               className={`rounded-2xl overflow-hidden border cursor-pointer transition-all duration-200 hover:shadow-md
//                 ${
//                   selectedCard?.id === card.id
//                     ? "border-emerald-500 shadow-lg shadow-emerald-100 ring-1 ring-emerald-300"
//                     : "border-gray-100 hover:border-gray-200"
//                 }`}
//             >
//               {/* Image */}
//               <div className='relative h-44 overflow-hidden'>
//                 <img
//                   src={card.image}
//                   alt={card.title}
//                   className='w-full h-full object-cover transition-transform duration-500 hover:scale-105'
//                 />
//                 {/* Gradient overlay */}
//                 <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent' />
//                 {/* Map pins on image */}
//                 <div className='absolute top-3 left-3 flex gap-1.5'>
//                   {[...Array(3)].map((_, i) => (
//                     <span
//                       key={i}
//                       className='text-emerald-400 text-xl drop-shadow'
//                       style={{
//                         transform: `translateY(${i % 2 === 0 ? 0 : -4}px)`,
//                       }}
//                     >
//                       📍
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               {/* Body */}
//               <div className='p-4'>
//                 <div className='flex items-start justify-between gap-2 mb-2'>
//                   <h3 className='font-bold text-gray-900 text-base leading-snug'>
//                     {card.title}
//                   </h3>
//                   <span
//                     className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${TAG_COLORS[card.tag] ?? "bg-gray-100 text-gray-600"}`}
//                   >
//                     {card.tag}
//                   </span>
//                 </div>

//                 <div className='flex items-center gap-3 text-xs text-gray-500 mb-3'>
//                   <span className='flex items-center gap-1'>
//                     <span className='text-emerald-500'>📍</span> {card.distance}
//                   </span>
//                   {card.rating > 0 && (
//                     <span className='flex items-center gap-1'>
//                       <span className='text-amber-400'>★</span>
//                       <span className='font-semibold text-gray-700'>
//                         {card.rating}
//                       </span>
//                     </span>
//                   )}
//                 </div>

//                 <p className='text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4'>
//                   {card.description}
//                 </p>

//                 <div className='flex gap-2'>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       alert(`Quote requested for: ${card.title}`);
//                     }}
//                     className='flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors active:scale-95'
//                   >
//                     Request Quote
//                   </button>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       alert(`Saved: ${card.title}`);
//                     }}
//                     className='px-4 py-2.5 text-sm font-semibold text-emerald-700 border border-emerald-300 rounded-xl hover:bg-emerald-50 transition-colors'
//                   >
//                     Save
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Hamburger / X icon ───────────────────────────────────────────────────────
// function MenuIcon({ open }: { open: boolean }) {
//   return (
//     <div className='w-5 h-4 flex flex-col justify-between relative'>
//       <span
//         className={`block h-0.5 bg-gray-700 rounded transition-all duration-300 origin-center
//           ${open ? "rotate-45 translate-y-[7px]" : ""}`}
//       />
//       <span
//         className={`block h-0.5 bg-gray-700 rounded transition-all duration-300
//           ${open ? "opacity-0 scale-x-0" : ""}`}
//       />
//       <span
//         className={`block h-0.5 bg-gray-700 rounded transition-all duration-300 origin-center
//           ${open ? "-rotate-45 -translate-y-[9px]" : ""}`}
//       />
//     </div>
//   );
// }

// // ── Custom Map Styles (muted/clean) ──────────────────────────────────────────
// const MAP_STYLES: google.maps.MapTypeStyle[] = [
//   { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
//   { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
//   { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
//   { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
//   {
//     featureType: "road",
//     elementType: "geometry",
//     stylers: [{ color: "#ffffff" }],
//   },
//   {
//     featureType: "road.arterial",
//     elementType: "labels.text.fill",
//     stylers: [{ color: "#757575" }],
//   },
//   {
//     featureType: "road.highway",
//     elementType: "geometry",
//     stylers: [{ color: "#dadada" }],
//   },
//   {
//     featureType: "water",
//     elementType: "geometry",
//     stylers: [{ color: "#c9d4e8" }],
//   },
//   {
//     featureType: "poi.park",
//     elementType: "geometry",
//     stylers: [{ color: "#d8e8c8" }],
//   },
//   {
//     featureType: "transit.station",
//     elementType: "geometry",
//     stylers: [{ color: "#eeeeee" }],
//   },
// ];
