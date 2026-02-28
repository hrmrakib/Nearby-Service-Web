/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCreateReportMutation } from "@/redux/features/report/reportAPI";
import { useState } from "react";
import { toast } from "sonner";

export default function ReportModal({
  postId,
  open,
  onClose,
  onSubmit,
}: {
  postId: string;
  open: boolean;
  onClose?: () => void;
  onSubmit?: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [createReportMutation, { isLoading }] = useCreateReportMutation();

  if (!open) return null;

  const handleSubmit = async () => {
    if (!reason.trim()) return;

    try {
      const res = await createReportMutation({
        postId,
        description: reason,
      }).unwrap();

      if (res?.success) {
        toast.success("Report submitted successfully.");
        onSubmit?.(reason);
        onClose?.();
      }
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-2xl w-full max-w-lg mx-4 p-6'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-base font-bold text-gray-900'>
            Why you are reporting this post?
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <svg
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <line x1='18' y1='6' x2='6' y2='18' />
              <line x1='6' y1='6' x2='18' y2='18' />
            </svg>
          </button>
        </div>

        {/* Textarea */}
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder='Start writing...'
          rows={8}
          className='w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none resize-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all'
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!reason.trim() || isLoading}
          className='mt-4 w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-2xl transition-colors'
        >
          Submit
        </button>
      </div>
    </div>
  );
}
