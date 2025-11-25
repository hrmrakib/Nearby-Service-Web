/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "@/redux/features/auth/authAPI";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotPasswordMutation] = useForgotPasswordMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setError("");

    // Validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);

    // Simulate API call
    try {
      const res = await forgotPasswordMutation({
        email,
      }).unwrap();

      if (res?.success) {
        toast.success(res?.message);
        router.push("/verify-otp?email=" + email + "&type=forgot-password");
      }
    } catch (err: any) {
      setError("Login failed. Please try again.");
      console.error(err);
      toast(err?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full h-screen flex items-center justify-center gap-8'>
      <div className='w-full max-w-md mx-auto lg:mx-0 bg-white rounded-2xl shadow-xl p-8 lg:p-10'>
        <h3 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
          Forgot Password
        </h3>

        {error && (
          <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm'>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className='space-y-6'>
          {/* Email Field */}
          <div className='space-y-2'>
            <label
              htmlFor='email'
              className='block text-lg font-medium text-gray-700'
            >
              Email
            </label>
            <Input
              id='email'
              type='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full h-12 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition'
              disabled={loading}
            />
          </div>

          {/* Login Button */}
          <Button
            type='submit'
            disabled={loading}
            className='w-full h-11 bg-[#15B826] hover:bg-[#15B826] text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50'
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </form>

        {/* Register Link */}
        <div className='mt-6 text-center'>
          <p className='text-gray-600 text-sm'>
            Remember your password? Please{" "}
            <Link
              href='/login'
              className='font-medium text-[#15B826] hover:text-[#15B826]'
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
