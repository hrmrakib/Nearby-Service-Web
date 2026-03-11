"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, X, Calendar, Clock, Tag, ChevronRight } from "lucide-react";

interface ServiceItem {
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface Order {
  id: string;
  orderNumber: string;
  title: string;
  category: string;
  date: string;
  time: string;
  description: string;
  image: string;
  serviceItems: ServiceItem[];
  priceSummary: { service: number; discount: number; total: number };
}

const ORDERS: Order[] = [
  {
    id: "1",
    orderNumber: "#64145XXXXXXXXXXXXX",
    title: "Cozy Coffee Spot",
    category: "Food & Beverage",
    date: "January 19, 2026",
    time: "09:30 AM – 11:00 PM",
    description:
      "Experience the warmth and comfort of our curated coffee selection. Sourced from the finest single-origin farms, each cup is a journey through rich aromas and complex flavors. Our baristas craft every beverage with precision and care, ensuring a memorable experience from the first sip to the last.",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop",
    serviceItems: [
      { name: "Signature Latte", quantity: 2, unitPrice: 8, lineTotal: 16 },
      { name: "Artisan Pastry", quantity: 3, unitPrice: 6, lineTotal: 18 },
    ],
    priceSummary: { service: 34, discount: 4, total: 30 },
  },
  {
    id: "2",
    orderNumber: "#64145XXXXXXXXXXXXX",
    title: "DJ Performance",
    category: "Entertainment / Live Events",
    date: "January 19, 2026",
    time: "08:00 PM – 02:00 AM",
    description:
      "An electrifying live DJ set blending genres from deep house to techno. The performance features state-of-the-art sound equipment and immersive lighting design. Guests are taken on a sonic journey through carefully curated tracks that build energy throughout the night.",
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop",
    serviceItems: [
      { name: "DJ Set (4 Hours)", quantity: 1, unitPrice: 400, lineTotal: 400 },
      {
        name: "Sound Equipment Setup",
        quantity: 1,
        unitPrice: 150,
        lineTotal: 150,
      },
    ],
    priceSummary: { service: 550, discount: 50, total: 500 },
  },
  {
    id: "3",
    orderNumber: "#64145XXXXXXXXXXXXX",
    title: "Plumbing Services",
    category: "Personal / Home Services",
    date: "July 30, 2025",
    time: "09:30 AM – 11:00 PM",
    description:
      "Professional plumbing services for residential and commercial properties. Our licensed plumbers handle everything from emergency repairs to routine maintenance. We use high-quality materials and follow industry best practices to ensure long-lasting solutions for every job.",
    image:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=400&fit=crop",
    serviceItems: [
      { name: "Pipe Replacement", quantity: 2, unitPrice: 100, lineTotal: 200 },
      { name: "Drain Cleaning", quantity: 1, unitPrice: 150, lineTotal: 150 },
    ],
    priceSummary: { service: 350, discount: 50, total: 300 },
  },
];

function OrderCard({
  order,
  index,
  onClick,
}: {
  order: Order;
  index: number;
  onClick: (o: Order) => void;
}) {
  return (
    <button
      onClick={() => onClick(order)}
      className='w-full text-left group'
      style={{
        animation: `fadeSlideUp 0.4s ease both`,
        animationDelay: `${index * 80}ms`,
      }}
    >
      <div className='bg-white rounded-2xl flex items-center gap-3 p-3 border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 hover:-translate-y-0.5 transition-all duration-300'>
        {/* Thumbnail */}
        <div className='relative w-[72px] h-[72px] sm:w-20 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100'>
          <img
            src={order.image}
            alt={order.title}
            className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
          />
        </div>

        {/* Text */}
        <div className='flex-1 min-w-0'>
          <p className='font-semibold text-slate-800 text-[15px] leading-snug truncate group-hover:text-emerald-700 transition-colors duration-200 mb-1.5'>
            {order.title}
          </p>
          <div className='flex items-center gap-1.5'>
            <Calendar
              size={12}
              strokeWidth={2.5}
              className='text-emerald-500 flex-shrink-0'
            />
            <span className='text-xs text-emerald-600 font-medium'>
              {order.date}
            </span>
          </div>
        </div>

        {/* Arrow */}
        <div className='flex-shrink-0 w-7 h-7 rounded-full bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center transition-colors duration-200'>
          <ChevronRight
            size={14}
            strokeWidth={2.5}
            className='text-slate-400 group-hover:text-emerald-500 transition-colors duration-200'
          />
        </div>
      </div>
    </button>
  );
}

function OrderDetailModal({
  order,
  onClose,
}: {
  order: Order | null;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (order) {
      setExpanded(false);
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [order]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  if (!order) return null;

  const SHORT = 160;
  const isLong = order.description.length > SHORT;

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      className='fixed inset-0 z-50 flex items-end sm:items-center justify-center transition-all duration-300'
      style={{
        background: visible ? "rgba(15,23,42,0.5)" : "transparent",
        backdropFilter: visible ? "blur(4px)" : "none",
      }}
    >
      <div
        className='bg-white w-full sm:max-w-lg sm:mx-4 sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-out'
        style={{
          maxHeight: "92dvh",
          transform: visible
            ? "translateY(0) scale(1)"
            : "translateY(2rem) scale(0.97)",
          opacity: visible ? 1 : 0,
        }}
      >
        {/* Drag pill */}
        <div className='sm:hidden flex justify-center pt-3 pb-1 flex-shrink-0'>
          <div className='w-10 h-1 rounded-full bg-slate-200' />
        </div>

        {/* Header bar */}
        <div className='flex items-center justify-between px-5 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex-shrink-0'>
          <span className='text-[13px] font-semibold text-slate-500 tracking-widest uppercase'>
            Order Details
          </span>
          <button
            onClick={handleClose}
            className='w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors'
            aria-label='Close'
          >
            <X size={15} strokeWidth={2.5} className='text-slate-500' />
          </button>
        </div>

        {/* Scrollable body */}
        <div className='overflow-y-auto flex-1 overscroll-contain'>
          {/* Hero */}
          <div className='relative w-full h-44 sm:h-52 bg-slate-100'>
            <img
              src={order.image}
              alt={order.title}
              className='w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent' />
            <div className='absolute bottom-3 left-5'>
              <span className='inline-flex items-center gap-1 bg-white/20 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full border border-white/30'>
                <Tag size={10} />
                {order.category}
              </span>
            </div>
          </div>

          <div className='px-5 sm:px-6 py-5 space-y-5'>
            {/* Title + order no */}
            <div>
              <h1 className='text-[22px] sm:text-2xl font-bold text-slate-900 leading-tight mb-1'>
                {order.title}
              </h1>
              <p className='text-[11px] font-mono text-slate-400 tracking-wider'>
                {order.orderNumber}
              </p>
            </div>

            {/* Meta pills */}
            <div className='flex flex-wrap gap-2'>
              <div className='flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full'>
                <Calendar size={12} strokeWidth={2.5} />
                {order.date}
              </div>
              <div className='flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-full'>
                <Clock size={12} strokeWidth={2.5} />
                {order.time}
              </div>
            </div>

            {/* Description */}
            <p className='text-sm text-slate-600 leading-relaxed'>
              {expanded || !isLong
                ? order.description
                : `${order.description.slice(0, SHORT)}...`}
              {isLong && (
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className='ml-1 text-emerald-600 font-semibold hover:text-emerald-700'
                >
                  {expanded ? "Show less" : "Read more"}
                </button>
              )}
            </p>

            <div className='border-t border-dashed border-slate-200' />

            {/* Service Items */}
            <div>
              <h2 className='text-base font-bold text-slate-900 mb-4'>
                Service Items Breakdown
              </h2>
              <div className='space-y-4'>
                {order.serviceItems.map((item, i) => (
                  <div key={i}>
                    <p className='font-semibold text-slate-800 text-sm mb-2.5'>
                      {item.name}
                    </p>
                    <div className='bg-slate-50 rounded-xl p-3 space-y-1.5'>
                      <div className='flex justify-between text-sm'>
                        <span className='text-slate-500'>Quantity</span>
                        <span className='font-medium text-slate-700'>
                          {item.quantity}
                        </span>
                      </div>
                      <div className='flex justify-between text-sm'>
                        <span className='text-slate-500'>Unit Price</span>
                        <span className='font-medium text-slate-700'>
                          ${item.unitPrice}
                        </span>
                      </div>
                      <div className='h-px bg-slate-200' />
                      <div className='flex justify-between text-sm'>
                        <span className='text-slate-600 font-medium'>
                          Line Total
                        </span>
                        <span className='font-bold text-slate-900'>
                          ${item.lineTotal}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='border-t border-dashed border-slate-200' />

            {/* Price Summary */}
            <div>
              <h2 className='text-base font-bold text-slate-900 mb-3'>
                Price Summary
              </h2>
              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-slate-500'>Service:</span>
                  <span className='text-slate-700'>
                    ${order.priceSummary.service}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-slate-500'>Discount:</span>
                  <span className='text-emerald-600 font-medium'>
                    − ${order.priceSummary.discount}
                  </span>
                </div>
                <div className='h-px bg-slate-200 my-1' />
                <div className='flex justify-between text-[16px] font-bold'>
                  <span className='text-slate-900'>Total:</span>
                  <span className='text-slate-900'>
                    ${order.priceSummary.total}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className='pb-1'>
              <button className='w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold rounded-2xl transition-all duration-150 text-sm tracking-wide shadow-sm shadow-emerald-200'>
                Reorder
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default function OrdersPage() {
  const [selected, setSelected] = useState<Order | null>(null);

  return (
    <div className='min-h-screen bg-slate-50'>
      {/* Header */}
      <header className='sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100'>
        <div className='max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3'>
          <button className='w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors'>
            <ArrowLeft size={18} strokeWidth={2.5} className='text-slate-700' />
          </button>
          <h1 className='text-[15px] font-bold text-slate-900 tracking-tight'>
            Orders
          </h1>
        </div>
      </header>

      {/* List */}
      <main className='max-w-2xl mx-auto px-4 sm:px-6 py-5'>
        <div className='space-y-3'>
          {ORDERS.map((order, i) => (
            <OrderCard
              key={order.id}
              order={order}
              index={i}
              onClick={setSelected}
            />
          ))}
        </div>
      </main>

      {/* Modal */}
      <OrderDetailModal order={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
