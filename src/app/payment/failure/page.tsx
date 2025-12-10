"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { XCircle, RefreshCcw, Home } from "lucide-react";

export default function PaymentFail() {
  const [counter, setCounter] = useState(7);

  useEffect(() => {
    // ⏳ Countdown + redirect
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev === 1) {
          window.location.href = "/payment";
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='min-h-screen flex items-center justify-center bg-red-50 p-6'>
      <motion.div
        initial={{ x: -10 }}
        animate={{ x: [-10, 10, -10, 10, 0] }} // 🔴 Shake
        transition={{ duration: 0.6 }}
        className='bg-white shadow-lg rounded-2xl p-10 max-w-md text-center'
      >
        <XCircle className='w-20 h-20 text-red-600 mx-auto' />

        <h1 className='text-3xl font-bold mt-6 text-red-700'>
          Payment Failed!
        </h1>

        <p className='text-gray-600 mt-3'>
          Something went wrong while processing your payment.
        </p>

        {/* Transaction Details */}
        <div className='mt-6 bg-red-100 border-l-4 border-red-600 p-4 rounded-xl text-left'>
          <p>
            <strong>Transaction ID:</strong> TXN-FAILED-4587
          </p>
          <p>
            <strong>Amount:</strong> 5000 BDT
          </p>
          <p>
            <strong>Status:</strong> Failed
          </p>
        </div>

        <div className='mt-6 flex justify-center gap-4'>
          <Link
            href='/payment'
            className='inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition'
          >
            <RefreshCcw className='w-5 h-5' />
            Retry
          </Link>

          <Link
            href='/'
            className='inline-flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition'
          >
            <Home className='w-5 h-5' />
            Home
          </Link>
        </div>

        <p className='text-sm text-gray-500 mt-3'>
          Redirecting in <span className='font-bold'>{counter}</span> seconds...
        </p>
      </motion.div>
    </div>
  );
}
