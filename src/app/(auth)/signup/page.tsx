import SignupForm from "@/components/auth/SignupForm";

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
          <div className='w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg'>
            <svg
              className='w-12 h-12 text-white'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z' />
            </svg>
          </div>
          <h1 className='text-4xl font-bold text-green-500'>Jurnee</h1>
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
          <a
            href='/login'
            className='text-green-500 font-semibold hover:underline'
          >
            Sign in
          </a>
        </p>
      </div>
    </main>
  );
}
