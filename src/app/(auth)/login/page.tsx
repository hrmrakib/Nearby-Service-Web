/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { saveTokens } from "@/service/authService";
import { userTrack } from "@/redux/features/auth/authSlice";
import { useDispatch } from "react-redux";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

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
    if (!password) {
      setError("Password is required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res?.ok) {
        const data = await res.json();
        console.log(data);
        dispatch(userTrack());
        await saveTokens(data?.data?.accessToken);
        localStorage.setItem("accessToken", data?.data?.accessToken);
        router.push("/");
      }
    } catch (err: any) {
      setError("Login failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log("[v0] Social login with:", provider);
    alert(`${provider} login not yet implemented`);
  };

  return (
    <div className='w-full h-screen grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
      <div className='hidden lg:flex flex-col items-center justify-center space-y-6'>
        <div className='w-32 h-32 flex items-center justify-center'>
          <Image src='/logo.svg' alt='Jurnee Logo' width={100} height={100} />
        </div>
        <h1 className='text-5xl font-bold text-[#15B826]'>Jurnee</h1>
        <p className='text-gray-600 text-center text-lg'>
          Discover local gems and connect with your community
        </p>
      </div>

      <div className='w-full max-w-md mx-auto lg:mx-0 bg-white rounded-2xl shadow-xl p-8 lg:p-10'>
        {/* Logo section for mobile */}
        <div className='lg:hidden flex flex-col items-center mb-8'>
          <div className='w-20 h-20 bg-gradient-to-br from-green-400 to-[#15B826] rounded-full flex items-center justify-center shadow-lg mb-4'>
            <svg
              className='w-10 h-10 text-white'
              viewBox='0 0 24 24'
              fill='currentColor'
            >
              <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z' />
            </svg>
          </div>
          <h2 className='text-3xl font-bold text-gray-900'>Jurnee</h2>
        </div>

        <h3 className='text-3xl font-bold text-gray-900 mb-8 text-center lg:text-left'>
          Login
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
              className='block text-sm font-medium text-gray-700'
            >
              Email
            </label>
            <Input
              id='email'
              type='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full h-11 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition'
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700'
              >
                Password
              </label>
            </div>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? "text" : "password"}
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full h-11 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition pr-12'
                disabled={loading}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition'
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className='w-5 h-5' />
                ) : (
                  <Eye className='w-5 h-5' />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className='flex justify-end'>
            <Link
              href='/forgot-password'
              className='text-sm font-medium text-[#15B826] hover:text-[#15B826] transition'
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <Button
            type='submit'
            disabled={loading}
            className='w-full h-11 bg-[#15B826] hover:bg-[#15B826] text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50'
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* Register Link */}
        <div className='mt-6 text-center'>
          <p className='text-gray-600 text-sm'>
            Not a member?{" "}
            <Link
              href='/signup'
              className='font-medium text-[#15B826] hover:text-[#15B826]'
            >
              Register now
            </Link>
          </p>
        </div>

        {/* Social Login */}
        <div className='mt-8 pt-8 border-t border-gray-200'>
          <p className='text-center text-sm text-gray-500 mb-4'>
            Or continue with
          </p>
          <div className='flex gap-4 justify-center'>
            <button
              type='button'
              onClick={() => handleSocialLogin("Google")}
              className='w-12 h-12 rounded-full bg-[#FF616D] hover:bg-[#ff3e4e] text-white flex items-center justify-center transition shadow-md hover:shadow-lg cursor-pointer'
              aria-label='Login with Google'
            >
              <svg className='w-6 h-6' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' />
                <path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' />
                <path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' />
                <path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' />
              </svg>
            </button>
            <button
              type='button'
              onClick={() => handleSocialLogin("Apple")}
              className='w-12 h-12 rounded-full bg-black hover:bg-gray-900 flex items-center justify-center transition shadow-md hover:shadow-lg'
              aria-label='Login with Apple'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='22'
                height='22'
                viewBox='0 0 24 24'
                fill='white'
              >
                <path
                  d='M16.365 1.43c0 1.14-.417 2.088-1.253 2.842-.836.75-1.795 1.18-2.878 1.29-.02-.13-.03-.32-.03-.57 
    0-1.09.477-2.03 1.43-2.82.477-.41.93-.69 1.36-.84.43-.16.83-.24 1.2-.24.07.13.12.27.15.42.03.15.05.32.05.52zm3.322 
    17.52c-.29.84-.71 1.62-1.27 2.34-.67.85-1.21 1.44-1.63 1.78-.65.58-1.35.88-2.1.89-.53 0-1.17-.15-1.94-.46-.78-.31-1.49-.46-2.14-.46-.68 
    0-1.41.15-2.18.46-.78.31-1.37.47-1.78.49-.72.03-1.44-.28-2.15-.93-.46-.4-1.03-1.05-1.72-1.96-.74-1.01-1.35-2.18-1.82-3.51-.5-1.42-.75-2.79-.75-4.11 
    0-1.52.33-2.83.98-3.93.48-.82 1.12-1.47 1.93-1.94.81-.47 1.69-.71 2.65-.72.52 0 1.2.17 2.05.51.84.34 1.39.51 1.65.51.18 
    0 .78-.19 1.8-.57.96-.35 1.78-.5 2.46-.46 1.82.15 3.19.87 4.11 2.15-1.63 1-2.44 2.4-2.44 4.2 0 1.4.5 2.57 1.5 3.5.45.43.95.76 1.5 1-.12.36-.25.72-.4 1.06z'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
