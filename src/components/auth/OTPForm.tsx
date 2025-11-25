/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "@/redux/features/auth/authAPI";
import { toast } from "sonner";

export function OTPForm() {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]); // 4 digits
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const [verifyOtpMutation] = useVerifyOtpMutation();
  const searchParams = useSearchParams();
  const [resendOtpMutation] = useResendOtpMutation();

  const email = searchParams.get("email");
  const type = searchParams.get("type");

  // Handle resend countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (resendTimer === 0 && !canResend) setCanResend(true);
  }, [resendTimer, canResend]);

  // Auto focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handle input change
  const handleInputChange = (index: number, value: string) => {
    setError("");

    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    // Move to next
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    setOtp(newOtp);
  };

  // Handle backspace navigation
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste (auto-fill all 4)
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);

    if (pasted.length === 4) {
      setOtp(pasted.split(""));
      inputRefs.current[3]?.focus();
      setError("");
    }
  };

  // Submit OTP
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.some((d) => !d)) {
      setError("Please enter all 4 digits");
      return;
    }

    setIsLoading(true);

    try {
      const res = await verifyOtpMutation({
        email: email as string,
        oneTimeCode: Number(otp.join("")),
      }).unwrap();

      if (res?.success) {
        toast.success(res.message);
        localStorage.setItem("accessToken", res?.data?.accessToken);
        if (type === "signup") {
          router.push("/login");
        } else if (type === "forgot-password") {
          router.push("/reset-password");
        }
      }
    } catch (err: any) {
      setError("Verification failed. Please try again.");
      toast.error(err?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setResendTimer(100);
    setCanResend(false);
    inputRefs.current[0]?.focus();
    setOtp(["", "", "", ""]);
    setError("");

    try {
      const res = await resendOtpMutation({
        email,
      }).unwrap();

      if (res?.success) {
        toast.success(res?.message);
      }
    } catch (error: any) {
      toast.error(error?.data?.message);
    } finally {
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-lg p-8'>
      <h1 className='text-3xl font-bold text-center text-gray-900 mb-8'>
        Verify Email
      </h1>

      <form onSubmit={handleVerify} className='space-y-6'>
        <div className='flex justify-center gap-3'>
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
              className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-semibold rounded-lg 
              border-2 ${
                digit
                  ? "border-gray-300 bg-gray-50"
                  : "border-gray-200 bg-white"
              }
              ${
                error
                  ? "border-red-500"
                  : "focus:border-green-500 focus:ring-2 focus:ring-green-100"
              }`}
            />
          ))}
        </div>

        {error && <p className='text-center text-red-500 text-sm'>{error}</p>}

        <button
          type='submit'
          disabled={isLoading || otp.some((d) => !d)}
          className='w-full bg-green-500 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg'
        >
          {isLoading ? "Verifying..." : "Verify"}
        </button>
      </form>

      <div className='text-center mt-6'>
        <p className='text-gray-600 text-sm'>
          Didn’t get the code?{" "}
          <button
            onClick={handleResend}
            disabled={!canResend}
            className={`font-semibold ${
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
