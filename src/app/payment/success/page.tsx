"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import Link from "next/link";
import { CheckCircle, Home } from "lucide-react";

export default function PaymentSuccess() {
  const [counter, setCounter] = useState(5);

  useEffect(() => {
    // 🎉 Fire confetti once
    confetti({
      particleCount: 200,
      spread: 80,
      origin: { y: 0.6 },
    });

    // ⏳ Countdown + redirect
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev === 1) {
          window.location.href = "/";
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='min-h-screen flex items-center justify-center bg-green-50 p-6'>
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className='bg-white shadow-lg rounded-2xl p-10 max-w-md text-center'
      >
        <CheckCircle className='w-20 h-20 text-green-600 mx-auto' />

        <h1 className='text-3xl font-bold mt-6 text-green-700'>
          Payment Successful!
        </h1>

        <p className='text-gray-600 mt-3'>
          Your payment has been confirmed. Thank you for your purchase!
        </p>

        {/* Transaction Details */}
        <div className='mt-6 bg-green-100 border-l-4 border-green-600 p-4 rounded-xl text-left'>
          <p>
            <strong>Transaction ID:</strong> TXN-9876543210
          </p>
          <p>
            <strong>Amount Paid:</strong> 5000 BDT
          </p>
          <p>
            <strong>Status:</strong> Completed
          </p>
        </div>

        <Link
          href='/'
          className='mt-6 inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition'
        >
          <Home className='w-5 h-5' />
          Go to Home
        </Link>

        <p className='text-sm text-gray-500 mt-3'>
          Redirecting in <span className='font-bold'>{counter}</span> seconds...
        </p>
      </motion.div>
    </div>
  );
}
