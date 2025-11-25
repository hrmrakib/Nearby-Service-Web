/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!termsAccepted) {
      newErrors.terms = "You must accept the Terms and Conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccessMessage(
        "Account created successfully! Redirecting to login..."
      );
      setFormData({
        name: "",
        location: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setTermsAccepted(false);

      // Simulate redirect after success
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error: any) {
      setErrors({
        submit: "An error occurred. Please try again.",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-5'>
      {/* Name Field */}
      <div>
        <label
          htmlFor='name'
          className='block text-sm font-semibold text-gray-800 mb-2'
        >
          Name
        </label>
        <input
          type='text'
          id='name'
          name='name'
          placeholder='Enter your name'
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-green-400 ${
            errors.name
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-gray-50"
          }`}
        />
        {errors.name && (
          <p className='text-red-500 text-sm mt-1'>{errors.name}</p>
        )}
      </div>

      {/* Location Field */}
      <div>
        <label
          htmlFor='location'
          className='block text-sm font-semibold text-gray-800 mb-2'
        >
          Location
        </label>
        <input
          type='text'
          id='location'
          name='location'
          placeholder='Enter your location'
          value={formData.location}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-green-400 ${
            errors.location
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-gray-50"
          }`}
        />
        {errors.location && (
          <p className='text-red-500 text-sm mt-1'>{errors.location}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor='email'
          className='block text-sm font-semibold text-gray-800 mb-2'
        >
          Email
        </label>
        <input
          type='email'
          id='email'
          name='email'
          placeholder='Enter your email'
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-green-400 ${
            errors.email
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-gray-50"
          }`}
        />
        {errors.email && (
          <p className='text-red-500 text-sm mt-1'>{errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label
          htmlFor='password'
          className='block text-sm font-semibold text-gray-800 mb-2'
        >
          Password
        </label>
        <div className='relative'>
          <input
            type={showPassword ? "text" : "password"}
            id='password'
            name='password'
            placeholder='Create new password'
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-green-400 pr-10 ${
              errors.password
                ? "border-red-500 bg-red-50"
                : "border-gray-300 bg-gray-50"
            }`}
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className='text-red-500 text-sm mt-1'>{errors.password}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label
          htmlFor='confirmPassword'
          className='block text-sm font-semibold text-gray-800 mb-2'
        >
          Confirm Password
        </label>
        <div className='relative'>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id='confirmPassword'
            name='confirmPassword'
            placeholder='Re-enter password'
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-green-400 pr-10 ${
              errors.confirmPassword
                ? "border-red-500 bg-red-50"
                : "border-gray-300 bg-gray-50"
            }`}
          />
          <button
            type='button'
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className='text-red-500 text-sm mt-1'>{errors.confirmPassword}</p>
        )}
      </div>

      {/* Terms Checkbox */}
      <div className='flex items-start gap-3 pt-2'>
        <input
          type='checkbox'
          id='terms'
          checked={termsAccepted}
          onChange={(e) => {
            setTermsAccepted(e.target.checked);
            if (e.target.checked && errors.terms) {
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.terms;
                return newErrors;
              });
            }
          }}
          className='w-5 h-5 mt-0.5 accent-green-500 rounded cursor-pointer'
        />
        <label htmlFor='terms' className='text-sm text-gray-600'>
          I&apos;ve read and agree with the{" "}
          <a href='#' className='text-green-500 font-semibold hover:underline'>
            Terms and Conditions
          </a>{" "}
          and the{" "}
          <a href='#' className='text-green-500 font-semibold hover:underline'>
            Privacy Policy
          </a>
        </label>
      </div>
      {errors.terms && <p className='text-red-500 text-sm'>{errors.terms}</p>}

      {/* Error Message */}
      {errors.submit && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm'>
          {errors.submit}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className='bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm'>
          {successMessage}
        </div>
      )}

      {/* Sign Up Button */}
      <button
        type='submit'
        disabled={isLoading}
        className='w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 mt-6'
      >
        {isLoading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}
