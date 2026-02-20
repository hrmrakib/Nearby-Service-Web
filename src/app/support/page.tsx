"use client";

import { useState, ChangeEvent, FormEvent } from "react";

interface FormState {
  name: string;
  email: string;
  subject: string;
  description: string;
  transactionId: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;
type SubmitStatus = "idle" | "loading" | "success";

export default function SupportPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    description: "",
    transactionId: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!form.subject.trim()) newErrors.subject = "Subject is required.";
    if (!form.description.trim())
      newErrors.description = "Description is required.";
    return newErrors;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setStatus("loading");
    // Replace with your actual API call, e.g. fetch("/api/support", { method: "POST", body: JSON.stringify(form) })
    await new Promise<void>((resolve) => setTimeout(resolve, 1500));
    setStatus("success");
    setForm({
      name: "",
      email: "",
      subject: "",
      description: "",
      transactionId: "",
    });
  };

  const inputBase =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100";
  const errorInput = "border-red-400 focus:border-red-400 focus:ring-red-100";

  return (
    <main className='min-h-screen bg-gray-100 flex items-center justify-center px-4 py-6'>
      <div className='w-full max-w-lg'>
        <div className='rounded-3xl bg-white shadow-xl px-6 py-10 sm:px-10'>
          {/* Header */}
          <div className='mb-8 text-center'>
            <div className='inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-green-50 mb-4'>
              <svg
                className='w-6 h-6 text-green-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z'
                />
              </svg>
            </div>
            <h1 className='text-2xl font-bold text-gray-900 tracking-tight'>
              Support
            </h1>
            <p className='mt-1 text-sm text-gray-500'>
              We&apos;ll get back to you as soon as possible.
            </p>
          </div>

          {/* Success State */}
          {status === "success" ? (
            <div className='flex flex-col items-center gap-4 py-8 text-center'>
              <div className='w-16 h-16 rounded-full bg-green-50 flex items-center justify-center'>
                <svg
                  className='w-8 h-8 text-green-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2.5}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
              <h2 className='text-xl font-semibold text-gray-800'>
                Ticket Submitted!
              </h2>
              <p className='text-sm text-gray-500 max-w-xs'>
                Thank you for reaching out. Our support team will review your
                request and respond shortly.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className='mt-2 rounded-xl bg-green-500 hover:bg-green-600 active:scale-95 transition px-6 py-2.5 text-sm font-semibold text-white'
              >
                Submit Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className='space-y-5'>
              {/* Name */}
              <div>
                <label className='block text-base font-bold text-gray-700 mb-1.5'>
                  Name
                </label>
                <input
                  type='text'
                  name='name'
                  value={form.name}
                  onChange={handleChange}
                  placeholder='Enter your name'
                  className={`${inputBase} ${errors.name ? errorInput : ""} text-[#9CA3AF] text-base!`}
                />
                {errors.name && (
                  <p className='mt-1 text-xs text-red-500'>{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className='block text-base font-bold text-gray-700 mb-1.5'>
                  Email
                </label>
                <input
                  type='email'
                  name='email'
                  value={form.email}
                  onChange={handleChange}
                  placeholder='Enter your email'
                  className={`${inputBase} ${errors.email ? errorInput : ""} text-[#9CA3AF] text-base!`}
                />
                {errors.email && (
                  <p className='mt-1 text-xs text-red-500'>{errors.email}</p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className='block text-base font-bold text-gray-700 mb-1.5'>
                  Subject
                </label>
                <input
                  type='text'
                  name='subject'
                  value={form.subject}
                  onChange={handleChange}
                  placeholder='Enter subject'
                  className={`${inputBase} ${errors.subject ? errorInput : ""} text-[#9CA3AF] text-base!`}
                />
                {errors.subject && (
                  <p className='mt-1 text-xs text-red-500'>{errors.subject}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className='block text-base font-bold text-gray-700 mb-1.5'>
                  Description
                </label>
                <textarea
                  name='description'
                  value={form.description}
                  onChange={handleChange}
                  placeholder='What went wrong?'
                  rows={4}
                  className={`${inputBase} resize-none ${errors.description ? errorInput : ""} text-[#9CA3AF] text-base!`}
                />
                {errors.description && (
                  <p className='mt-1 text-xs text-red-500'>
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Transaction ID */}
              <div>
                <label className='block text-base font-bold text-gray-700 mb-1.5'>
                  Transaction ID{" "}
                  <span className='text-gray-400 font-normal'>(optional)</span>
                </label>
                <input
                  type='text'
                  name='transactionId'
                  value={form.transactionId}
                  onChange={handleChange}
                  placeholder='Enter transaction id'
                  className={inputBase + " text-[#9CA3AF] text-base!"}
                />
              </div>

              {/* Submit */}
              <button
                type='submit'
                disabled={status === "loading"}
                className='w-full rounded-xl bg-green-500 hover:bg-green-600 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-150 py-3.5 text-sm font-semibold text-white flex items-center justify-center gap-2'
              >
                {status === "loading" ? (
                  <>
                    <svg
                      className='animate-spin w-4 h-4 text-white'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      />
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8v8H4z'
                      />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
