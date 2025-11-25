"use client";

import { Suspense } from "react";
import { OTPForm } from "@/components/auth/OTPForm";

export default function VerifyPage() {
  return (
    <main className='min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8'>
      <div className='w-full max-w-md'>
        <Suspense fallback={<div>Loading...</div>}>
          <OTPForm />
        </Suspense>
      </div>
    </main>
  );
}
