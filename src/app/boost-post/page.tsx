// "use client";

// import { useState } from "react";
// import { ArrowLeft, MapPin, Star } from "lucide-react";
// import { Button } from "@/components/ui/button";

// interface Post {
//   id: string;
//   title: string;
//   image: string;
//   distance: number;
//   rating: number;
// }

// const SAMPLE_POST: Post = {
//   id: "1",
//   title: "Live Jazz Night",
//   image:
//     "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-NqutytnPTl9CsqXYEHudQxC4kIRnOK.png",
//   distance: 2.3,
//   rating: 4.9,
// };

// const REQUIREMENTS = [
//   "Post must have at least 1 clear photo",
//   "Complete title & description",
//   "Local relevance (within 25 miles)",
// ];

// const BOOST_PRICE = 5;

// export default function BoostPostPage() {
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);

//   const handleBoost = async () => {
//     setIsProcessing(true);
//     // Simulate payment processing
//     await new Promise((resolve) => setTimeout(resolve, 2000));
//     setIsProcessing(false);
//     setShowSuccess(true);
//     // Reset after 3 seconds
//     setTimeout(() => setShowSuccess(false), 3000);
//   };

//   const handleBack = () => {
//     window.history.back();
//   };

//   return (
//     <div className='min-h-screen bg-gray-50'>
//       {/* Header */}
//       <header className='sticky top-0 bg-white border-b border-gray-200 z-10'>
//         <div className='max-w-2xl mx-auto px-4 py-4 sm:py-6 flex items-center gap-3'>
//           <button
//             onClick={handleBack}
//             className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
//             aria-label='Go back'
//           >
//             <ArrowLeft className='w-6 h-6 text-gray-800' />
//           </button>
//           <h1 className='text-xl sm:text-2xl font-bold text-gray-900'>
//             Boost Post
//           </h1>
//         </div>
//       </header>

//       <main className='max-w-2xl mx-auto px-4 py-6 sm:py-8'>
//         {/* Description Section */}
//         <section className='mb-8'>
//           <p className='text-gray-600 text-base sm:text-lg leading-relaxed mb-8'>
//             Boost keeps your post on top of the feed for 24 hours. Flat fee: $
//             {BOOST_PRICE}.
//           </p>

//           {/* Requirements */}
//           <div className='space-y-4'>
//             <h2 className='text-sm font-semibold text-gray-900 uppercase tracking-wide'>
//               Requirements
//             </h2>
//             {REQUIREMENTS.map((requirement, index) => (
//               <div key={index} className='flex items-start gap-3'>
//                 <svg
//                   className='w-5 h-5 text-green-500 mt-0.5 flex-shrink-0'
//                   fill='currentColor'
//                   viewBox='0 0 20 20'
//                 >
//                   <path
//                     fillRule='evenodd'
//                     d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
//                     clipRule='evenodd'
//                   />
//                 </svg>
//                 <span className='text-gray-700 text-sm sm:text-base'>
//                   {requirement}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Post Card */}
//         <section className='mb-8'>
//           <div className='bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200'>
//             {/* Image */}
//             <div className='aspect-[4/3] sm:aspect-video overflow-hidden bg-gray-200'>
//               <img
//                 src={SAMPLE_POST.image}
//                 alt={SAMPLE_POST.title}
//                 className='w-full h-full object-cover'
//               />
//             </div>

//             {/* Content */}
//             <div className='p-4 sm:p-6'>
//               {/* Title */}
//               <h3 className='text-lg sm:text-xl font-bold text-gray-900 mb-4'>
//                 {SAMPLE_POST.title}
//               </h3>

//               {/* Meta Information */}
//               <div className='flex flex-wrap items-center gap-4 sm:gap-6'>
//                 <div className='flex items-center gap-1 text-gray-600 text-sm sm:text-base'>
//                   <MapPin className='w-4 h-4 sm:w-5 sm:h-5 text-gray-400' />
//                   <span>{SAMPLE_POST.distance} miles</span>
//                 </div>
//                 <div className='flex items-center gap-1 text-gray-600 text-sm sm:text-base'>
//                   <Star className='w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400' />
//                   <span>{SAMPLE_POST.rating}</span>
//                 </div>
//               </div>

//               {/* Boost Button */}
//               <Button
//                 onClick={handleBoost}
//                 disabled={isProcessing || showSuccess}
//                 className='w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 sm:py-4 text-base sm:text-lg rounded-xl transition-all'
//               >
//                 {showSuccess
//                   ? "✓ Boosted Successfully!"
//                   : isProcessing
//                     ? "Processing..."
//                     : `Boost Now - $${BOOST_PRICE}`}
//               </Button>

//               {/* Success Message */}
//               {showSuccess && (
//                 <div className='mt-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg'>
//                   <p className='text-green-800 text-sm sm:text-base font-medium'>
//                     Your post has been boosted! It will stay on top of the feed
//                     for 24 hours.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </section>

//         {/* Additional Info */}
//         <section className='bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6'>
//           <p className='text-blue-900 text-sm sm:text-base'>
//             <strong>💡 Tip:</strong> Boost your post during peak hours for
//             maximum visibility and engagement!
//           </p>
//         </section>
//       </main>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Star, MapPin, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function BoostPostPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleBoostPost = async () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert("Your post has been boosted!");
    }, 2000);
  };

  const requirements = [
    "Post must have at least 1 clear photo",
    "Complete title & description",
    "Local relevance (within 25 miles)",
  ];

  return (
    <div className='min-h- bg-transparent py-8 px-4'>
      <div className='max-w-md mx-auto space-y-6'>
        {/* Header Section */}
        <div className='relative text-center space-y-4'>
          <h1 className='text-2xl font-semibold text-gray-900'>
            <ArrowLeft
              className='absolute top-2 left-2 w-6 h-6 cursor-pointer'
              size={15}
              onClick={() => router.back()}
            />{" "}
            Boost Post
          </h1>
          <p className='text-gray-600 leading-relaxed'>
            Boost keeps your post on top of the feed for 24 hours. Flat fee: $5.
          </p>
        </div>

        {/* Requirements Section */}
        <div className='space-y-3'>
          {requirements.map((requirement, index) => (
            <div key={index} className='flex items-center gap-3'>
              <div className='flex-shrink-0'>
                <Check className='w-5 h-5 text-green-500' />
              </div>
              <span className='text-gray-700 text-sm'>{requirement}</span>
            </div>
          ))}
        </div>

        {/* Post Preview Card */}
        <Card className='overflow-hidden bg-white shadow-sm py-0'>
          <div className='relative aspect-[4/3] w-full'>
            <Image
              src='/event/1.jpg'
              alt='Live Jazz Night concert with crowd'
              fill
              className='object-cover'
              priority
            />
          </div>

          <div className='p-4 space-y-3'>
            <h3 className='text-lg font-medium text-gray-900'>
              Live Jazz Night
            </h3>

            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-1'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-4 h-4 fill-green-500 text-green-500'
                  />
                ))}
                <span className='text-sm text-gray-600 ml-1'>4.9</span>
              </div>

              <div className='flex items-center gap-1 text-gray-600'>
                <MapPin className='w-4 h-4' />
                <span className='text-sm'>2.3 miles</span>
              </div>
            </div>

            <Button
              onClick={handleBoostPost}
              disabled={isLoading}
              className='w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors'
            >
              {isLoading ? "Boosting..." : "Boost Now - $5"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
