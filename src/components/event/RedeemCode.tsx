"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

interface RedeemCodeProps {
  discount?: string;
  collection?: string;
  validFrom?: string;
  validTo?: string;
  code?: string;
}

export default function RedeemCode({
  discount = "50%",
  collection = "All Summer Collection",
  validFrom = "July 15",
  validTo = "July 30, 2025",
  code = "DEAL-BDL-ZYZ555",
}: RedeemCodeProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) {
    return (
      <div className='bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4'>
        <button
          onClick={() => setIsOpen(true)}
          className='px-6 py-3 bg-emerald-600 text-white rounded-2xl font-semibold text-sm shadow-lg hover:bg-emerald-700 active:scale-95 transition-all duration-150'
        >
          Show Offer
        </button>
      </div>
    );
  }

  return (
    <div className='bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4'>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black/20 backdrop-blur-sm'
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div
        className={`
          relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-auto
          overflow-hidden
          transition-all duration-500 ease-out
          ${mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}
        `}
        style={{
          boxShadow:
            "0 25px 50px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)",
        }}
      >
        {/* Top accent bar */}
        <div className='h-1 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400' />

        {/* Header */}
        <div className='flex items-center justify-between px-5 pt-4 pb-2'>
          <div className='w-8' />
          <span
            className='text-sm font-semibold tracking-widest uppercase text-gray-400'
            style={{
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.12em",
            }}
          >
            Redeem Code
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className='w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:scale-90 transition-all duration-150 text-gray-500'
            aria-label='Close'
          >
            <svg width='14' height='14' viewBox='0 0 14 14' fill='none'>
              <path
                d='M1 1l12 12M13 1L1 13'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
              />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className='px-6 pb-8 flex flex-col items-center gap-6'>
          {/* Offer Text */}
          <div className='text-center mt-2'>
            <div className='inline-flex items-center gap-2 mb-3'>
              <span className='text-4xl'>☀️</span>
            </div>
            <h2
              className='text-2xl font-black text-gray-900 leading-tight'
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {discount} Off on
              <br />
              <span className='text-emerald-600'>{collection}</span>
            </h2>
          </div>

          {/* Divider */}
          <div className='w-full flex items-center gap-3'>
            <div className='flex-1 h-px bg-gray-100' />
            <div className='w-1.5 h-1.5 rounded-full bg-gray-200' />
            <div className='flex-1 h-px bg-gray-100' />
          </div>

          {/* Validity */}
          <div className='flex flex-col items-center gap-1.5'>
            <span
              className='text-xs font-medium uppercase tracking-widest text-gray-400'
              style={{ letterSpacing: "0.15em" }}
            >
              Valid Through
            </span>
            <div className='flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full'>
              <svg
                width='14'
                height='14'
                viewBox='0 0 16 16'
                fill='none'
                className='text-emerald-600'
              >
                <rect
                  x='1'
                  y='2'
                  width='14'
                  height='13'
                  rx='2'
                  stroke='currentColor'
                  strokeWidth='1.5'
                />
                <path
                  d='M1 6h14M5 1v2M11 1v2'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                />
              </svg>
              <span className='text-sm font-semibold text-emerald-700'>
                {validFrom} – {validTo}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className='w-full flex items-center gap-3'>
            <div className='flex-1 h-px bg-gray-100' />
            <div className='w-1.5 h-1.5 rounded-full bg-gray-200' />
            <div className='flex-1 h-px bg-gray-100' />
          </div>

          {/* Code Section */}
          <div className='w-full flex flex-col items-center gap-3'>
            <span
              className='text-xs font-medium uppercase tracking-widest text-gray-400'
              style={{ letterSpacing: "0.15em" }}
            >
              Show this at Checkout
            </span>
            <button
              onClick={handleCopy}
              className={`
                w-full relative flex items-center justify-between px-5 py-4 rounded-2xl
                border-2 border-dashed transition-all duration-300 group
                ${
                  copied
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-emerald-200 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50"
                }
              `}
            >
              <span
                className={`text-lg font-black tracking-wider transition-colors duration-300 ${
                  copied
                    ? "text-emerald-600"
                    : "text-emerald-500 group-hover:text-emerald-600"
                }`}
                style={{ fontFamily: "'DM Mono', 'Courier New', monospace" }}
              >
                {code}
              </span>
              <span
                className={`
                  flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all duration-300
                  ${
                    copied
                      ? "bg-emerald-500 text-white"
                      : "bg-white text-gray-400 group-hover:text-emerald-500 shadow-sm border border-gray-100"
                  }
                `}
              >
                {copied ? (
                  <>
                    <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
                      <path
                        d='M2 6l3 3 5-5'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
                      <rect
                        x='3.5'
                        y='3.5'
                        width='7'
                        height='7'
                        rx='1'
                        stroke='currentColor'
                        strokeWidth='1.5'
                      />
                      <path
                        d='M8.5 3.5V2.5A1 1 0 007.5 1.5h-5a1 1 0 00-1 1v5a1 1 0 001 1H3.5'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                      />
                    </svg>
                    Copy
                  </>
                )}
              </span>
            </button>
          </div>

          {/* QR Code */}
          <div className='flex flex-col items-center gap-3'>
            <div
              className='p-3 bg-white rounded-2xl shadow-md border border-gray-100'
              style={{ lineHeight: 0 }}
            >
              <QRCodeSVG
                value={code}
                size={160}
                bgColor='#ffffff'
                fgColor='#111111'
                level='M'
                style={{ borderRadius: "8px" }}
              />
            </div>
            <p className='text-xs text-gray-400 font-medium'>
              Scan to apply at checkout
            </p>
          </div>
        </div>
      </div>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@500;600&display=swap');
      `}</style>
    </div>
  );
}
