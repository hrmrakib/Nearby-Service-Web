import React, { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent } from "../ui/card";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { useGetMyPostQuery } from "@/redux/features/profile/profileAPI";

export interface IPost {
  _id: string;
  image: string | null;
  title: string;
  description: string;
  address: string;
}

const LIMIT = 2;

const MyPost = () => {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<IPost[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { data, isLoading, isFetching } = useGetMyPostQuery(
    { page, limit: LIMIT },
    { refetchOnMountOrArgChange: false }
  );

  const hasMore = data?.data?.length === LIMIT;

  // Append new posts
  useEffect(() => {
    if (data?.data) {
      setAllPosts((prev) => {
        const ids = new Set(prev.map((p) => p._id));
        const newPosts = data.data.filter((post: IPost) => !ids.has(post._id));
        return [...prev, ...newPosts];
      });
    }
  }, [data]);

  // Callback to observe last element
  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetching) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [hasMore, isFetching]
  );

  if (isLoading && page === 1) {
    return (
      <div className='space-y-8'>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className='h-48 w-full' />
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {allPosts.map((post, index) => {
        const isLast = index === allPosts.length - 1;

        return (
          <Card
            key={post._id}
            ref={isLast ? lastPostRef : null}
            className='overflow-hidden py-0'
          >
            <div className='relative h-48'>
              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                fill
                className='object-cover'
              />
            </div>
            <CardContent className='p-4'>
              <h3 className='font-semibold text-xl'>{post.title}</h3>
              <div className='flex items-center gap-4 mb-3 text-sm'>
                <MapPin className='w-4 h-4 text-green-600' />
                <span>{post.address}</span>
              </div>
              <p className='text-sm text-gray-600 leading-relaxed'>
                {post.description}
              </p>
            </CardContent>
          </Card>
        );
      })}

      {isFetching && (
        <div className='space-y-6'>
          {[1, 2].map((i) => (
            <Skeleton key={i} className='h-48 w-full' />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPost;

// /* eslint-disable @typescript-eslint/no-explicit-any */

// import React, { useEffect, useRef, useState } from "react";
// import { Card, CardContent } from "../ui/card";
// import { MapPin } from "lucide-react";
// import Image from "next/image";
// import { Skeleton } from "../ui/skeleton";
// import { useGetMyPostQuery } from "@/redux/features/profile/profileAPI";

// export interface IPost {
//   _id: string;
//   author: string;
//   image: string | null;
//   media: string | null;
//   title: string;
//   description: string;
//   startDate: string;
//   startTime: string | null;
//   address: string;
//   location: {
//     type: string;
//     coordinates: [number, number];
//   };
//   hasTag: string[];
//   views: number;
//   likes: number;
//   endDate: string | null;
//   price: string | null;
//   category: string;
//   subcategory: string | null;
//   serviceType: string | null;
//   missingName: string | null;
//   missingAge: string | null;
//   clothingDescription: string | null;
//   lastSeenLocation: {
//     type: string;
//     coordinates: [number, number];
//   };
//   lastSeenDate: string | null;
//   contactInfo: string | null;
//   expireLimit: string | null;
//   capacity: number | null;
//   amenities: string | null;
//   licenses: string | null;
//   status: string;
//   boost: boolean;
//   attenders: any[];
//   isSaved: boolean;
//   totalSaved: number;
//   schedule: any[];
//   createdAt: string;
//   updatedAt: string;
// }

// const MyPost = () => {
//   const [page, setPage] = useState(1);
//   const [allPosts, setAllPosts] = useState<IPost[]>([]);
//   const limit = 2;
//   const { data, isLoading, isFetching } = useGetMyPostQuery(
//     { page, limit },
//     { refetchOnMountOrArgChange: false }
//   );

//   const lastPostRef = useRef(null);
//   const hasMore = data?.data?.length > 0;

//   // Append new posts whenever page changes
//   useEffect(() => {
//     if (data?.data) {
//       setAllPosts((prev) => [...prev, ...data.data]);
//     }
//   }, [data]);

//   // Intersection Observer
//   useEffect(() => {
//     if (!hasMore) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && !isFetching) {
//           setPage((p) => p + 1);
//         }
//       },
//       { threshold: 1 }
//     );

//     const ref = lastPostRef.current;
//     if (ref) observer.observe(ref);

//     return () => {
//       if (ref) observer.unobserve(ref);
//     };
//   }, [isFetching, hasMore]);

//   if (isLoading && page === 1) {
//     return (
//       <div className='space-y-8'>
//         {[1, 2, 3].map((i) => (
//           <Card key={i} className='overflow-hidden'>
//             <Skeleton className='h-48 w-full' />
//             <CardContent className='p-4 space-y-3'>
//               <Skeleton className='h-6 w-2/3' />
//               <Skeleton className='h-4 w-1/3' />
//               <Skeleton className='h-4 w-full' />
//               <Skeleton className='h-4 w-5/6' />
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className='space-y-8'>
//       {allPosts.map((post, index) => {
//         const isLast = index === allPosts.length - 1;
//         return (
//           <Card
//             key={post._id}
//             ref={isLast ? lastPostRef : null}
//             className='overflow-hidden py-0'
//           >
//             <div className='relative h-48'>
//               <Image
//                 src={post.image || "/placeholder.svg"}
//                 alt={post.title}
//                 fill
//                 className='object-cover'
//               />
//             </div>
//             <CardContent className='p-4'>
//               <div className='flex items-start justify-between mb-2'>
//                 <h3 className='font-semibold text-[#1F2937] text-2xl'>
//                   {post.title}
//                 </h3>
//               </div>
//               <div className='flex items-center gap-4 mb-3 text-sm text-[#4B5563]'>
//                 <MapPin className='w-4 h-4 text-[#15B826]' />
//                 <span>{post.address}</span>
//               </div>

//               <p className='text-sm text-[#4B5563] leading-relaxed'>
//                 {post.description}
//               </p>
//             </CardContent>
//           </Card>
//         );
//       })}

//       {/* Loader for next pages */}
//       {isFetching && (
//         <div className='space-y-8 mt-6'>
//           {[1, 2].map((i) => (
//             <Card key={i} className='overflow-hidden'>
//               <Skeleton className='h-48 w-full' />
//               <CardContent className='p-4 space-y-3'>
//                 <Skeleton className='h-6 w-2/3' />
//                 <Skeleton className='h-4 w-1/3' />
//                 <Skeleton className='h-4 w-full' />
//                 <Skeleton className='h-4 w-5/6' />
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyPost;
