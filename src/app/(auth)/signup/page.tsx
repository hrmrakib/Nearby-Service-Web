import SignupForm from "@/components/auth/SignupForm";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Sign Up - Jurnee",
  description:
    "Create a new Jurnee account to discover local events and connect with your community",
};

export default function SignupPage() {
  return (
    <main className='min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-12'>
      <div className='w-full max-w-md'>
        {/* Logo Section */}
        <div className='flex flex-col items-center mb-8'>
          <div className='w-32 h-32 flex items-center justify-center'>
            <Image src='/logo.png' alt='Jurnee Logo' width={100} height={100} />
          </div>
        </div>

        {/* Form Card */}
        <div className='bg-white rounded-2xl shadow-lg p-8 md:p-10'>
          <h2 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
            Create a new account
          </h2>
          <SignupForm />
        </div>

        {/* Sign In Link */}
        <p className='text-center mt-6 text-gray-600'>
          Already have an account?{" "}
          <Link
            href='/login'
            className='text-green-500 font-semibold hover:underline'
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
