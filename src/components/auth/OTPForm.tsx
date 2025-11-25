/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export function OTPForm() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  // Handle resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (resendTimer === 0 && !canResend) {
      setCanResend(true);
    }
  }, [resendTimer, canResend]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleInputChange = (index: number, value: string) => {
    setError("");

    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    // Auto move to next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    setOtp(newOtp);
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .split("");

    if (pastedData.length >= 6) {
      const newOtp = pastedData.slice(0, 6);
      setOtp(newOtp as string[]);
      inputRefs.current[5]?.focus();
      setError("");
    }
  };

  // Handle verify submission
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp.some((digit) => !digit)) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const otpCode = otp.join("");
      console.log("[v0] OTP verification submitted:", otpCode);

      // Demo valid OTP:
      if (otpCode === "123456") {
        router.push("/dashboard");
      } else {
        setError("Invalid OTP. Please try again.");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (err: any) {
      setError("Verification failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResend = async () => {
    setCanResend(false);
    setResendTimer(60);
    setOtp(["", "", "", "", "", ""]);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("[v0] OTP resent to email");
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError("Failed to resend OTP. Please try again.");
      console.log(err);
      setCanResend(true);
    }
  };

  return (
    <div className='bg-white rounded-lg  shadow-lg p-8'>
      <h1 className='text-3xl font-bold text-center text-gray-900 mb-8'>
        Verify Email
      </h1>

      <form onSubmit={handleVerify} className='space-y-6'>
        <div className='flex justify-center gap-2 sm:gap-3'>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type='text'
              inputMode='numeric'
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-semibold rounded-lg border-2 
                ${
                  digit
                    ? "border-gray-300 bg-gray-50"
                    : "border-gray-200 bg-white"
                } 
                ${
                  error
                    ? "border-red-500"
                    : "focus:border-green-500 focus:ring-2 focus:ring-green-100"
                }
              `}
            />
          ))}
        </div>

        {error && (
          <div className='text-center text-red-500 text-sm font-medium'>
            {error}
          </div>
        )}

        <button
          type='submit'
          disabled={isLoading || otp.some((digit) => !digit)}
          className='w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors'
        >
          {isLoading ? "Verifying..." : "Verify"}
        </button>
      </form>

      <div className='text-center mt-6'>
        <p className='text-gray-600 text-sm'>
          Don&apos;t get the code?{" "}
          <button
            onClick={handleResend}
            disabled={!canResend}
            className={`font-semibold transition-colors ${
              canResend
                ? "text-green-500 hover:text-green-600"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            {canResend ? "Resend" : `Resend in ${resendTimer}s`}
          </button>
        </p>
      </div>
    </div>
  );
}
