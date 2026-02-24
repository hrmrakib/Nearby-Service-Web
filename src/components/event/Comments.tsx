"use client";

import { useCreateCommentMutation } from "@/redux/features/comment/commentAPI";
import formatDate from "@/utils/formatDate";
import Image from "next/image";
import { useState, useRef } from "react";
import { toast } from "sonner";

type MediaAttachment = { url: string; type: "image" | "video" };

type Comment = {
  _id: string;
  userId: string;
  postId: string;
  like: number;
  content: string;
  image: string;
  video: string;
  createdAt: string;
  updatedAt: string;
};

const ImgIcon = () => (
  <svg
    width='18'
    height='18'
    viewBox='0 0 24 24'
    fill='none'
    stroke='#9ca3af'
    strokeWidth='1.8'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <rect x='3' y='3' width='18' height='18' rx='2' />
    <circle cx='8.5' cy='8.5' r='1.5' />
    <polyline points='21 15 16 10 5 21' />
  </svg>
);

const XIcon = () => (
  <svg
    width='12'
    height='12'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2.5'
    strokeLinecap='round'
  >
    <line x1='18' y1='6' x2='6' y2='18' />
    <line x1='6' y1='6' x2='18' y2='18' />
  </svg>
);

function fileToAttachment(file: File): MediaAttachment {
  return {
    url: URL.createObjectURL(file),
    type: file.type.startsWith("video") ? "video" : "image",
  };
}

export default function CommentsSection({
  comments,
  id,
  postId,
}: {
  comments: Comment[];
  id?: string;
  postId?: string | undefined;
}) {
  const [newComment, setNewComment] = useState("");
  const [newCommentMedia, setNewCommentMedia] = useState<
    MediaAttachment | undefined
  >();
  const [newCommentFile, setNewCommentFile] = useState<File | undefined>();
  const topFileRef = useRef<HTMLInputElement>(null);
  const [createCommentMutation] = useCreateCommentMutation();

  const clearMedia = () => {
    setNewCommentMedia(undefined);
    setNewCommentFile(undefined);
  };

  const handlePost = async () => {
    if (!newComment.trim() && !newCommentFile) return;

    try {
      const formData = new FormData();
      const data = {
        postId,
        like: 1,
        content: newComment,
      };

      formData.append("data", JSON.stringify(data));
      formData.append("content", newComment);

      if (newCommentFile) {
        formData.append("image", newCommentFile); // ✅ real File object
      }

      const res = await createCommentMutation(formData).unwrap();
      console.log({ res });

      if (res?.success) {
        toast.success(res?.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setNewComment("");
      clearMedia();
    }
  };

  return (
    <div id={id} className='bg-gray-100 flex items-start justify-center'>
      <div className='w-full bg-white rounded-2xl shadow-sm p-4 sm:p-5'>
        {/* Header */}
        <h2 className='text-base font-bold text-gray-900 mb-3'>
          Comments ({comments?.length})
        </h2>

        {/* New comment input */}
        <div className='mb-5'>
          {newCommentMedia && (
            <div className='relative inline-block mb-2'>
              <Image
                src={newCommentMedia.url}
                alt='preview'
                width={200}
                height={200}
                className='w-20 h-20 rounded-lg object-cover border border-gray-200'
              />
              <button
                onClick={clearMedia} // ✅ clears both media and file
                className='absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-700 text-white rounded-full flex items-center justify-center hover:bg-gray-900'
              >
                <XIcon />
              </button>
            </div>
          )}

          <div className='flex gap-2'>
            <div className='flex-1 flex items-center border border-gray-200 rounded-lg px-3 gap-2 bg-white focus-within:border-green-300 focus-within:ring-1 focus-within:ring-green-300 transition-all'>
              <input
                type='text'
                placeholder='Add a Comment'
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePost()}
                className='flex-1 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent'
              />
              <button
                onClick={() => topFileRef.current?.click()}
                className='text-gray-400 hover:text-gray-600 flex-shrink-0'
              >
                <ImgIcon />
              </button>
              <input
                ref={topFileRef}
                type='file'
                accept='image/*,video/*'
                className='hidden'
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setNewCommentFile(f); // ✅ store File
                    setNewCommentMedia(fileToAttachment(f)); // ✅ store preview
                  }
                  e.target.value = "";
                }}
              />
            </div>
            <button
              onClick={handlePost}
              className='px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors active:scale-95 flex-shrink-0'
            >
              Post
            </button>
          </div>
        </div>

        {/* Comments list */}
        <div className='flex flex-col gap-5'>
          {comments?.map((comment: Comment) => (
            <div key={comment._id} className='flex gap-3'>
              <div className='flex-1 min-w-0 pb-2'>
                <div className='flex items-center gap-2 mb-1'>
                  <span className='text-xs text-green-500 font-medium'>
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className='text-sm text-gray-700 leading-relaxed mb-2'>
                  {comment?.content}
                </p>

                {/* ✅ Only render image if it exists */}
                {comment.image && (
                  <Image
                    src={comment.image}
                    alt='comment image'
                    width={1440}
                    height={480}
                    className='h-64 rounded-lg object-cover border border-gray-200'
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// "use client";

// import formatDate from "@/utils/formatDate";
// import Image from "next/image";
// import { useState, useRef } from "react";

// type MediaAttachment = { url: string; type: "image" | "video" };

// type Comment = {
//   _id: string;
//   userId: string;
//   postId: string;
//   like: number;
//   content: string;
//   image: string;
//   video: string;
//   createdAt: string;
//   updatedAt: string;
// };

// const ImgIcon = () => (
//   <svg
//     width='18'
//     height='18'
//     viewBox='0 0 24 24'
//     fill='none'
//     stroke='#9ca3af'
//     strokeWidth='1.8'
//     strokeLinecap='round'
//     strokeLinejoin='round'
//   >
//     <rect x='3' y='3' width='18' height='18' rx='2' />
//     <circle cx='8.5' cy='8.5' r='1.5' />
//     <polyline points='21 15 16 10 5 21' />
//   </svg>
// );

// const XIcon = () => (
//   <svg
//     width='12'
//     height='12'
//     viewBox='0 0 24 24'
//     fill='none'
//     stroke='currentColor'
//     strokeWidth='2.5'
//     strokeLinecap='round'
//   >
//     <line x1='18' y1='6' x2='6' y2='18' />
//     <line x1='6' y1='6' x2='18' y2='18' />
//   </svg>
// );

// function fileToAttachment(file: File): MediaAttachment {
//   return {
//     url: URL.createObjectURL(file),
//     type: file.type.startsWith("video") ? "video" : "image",
//   };
// }

// export default function CommentsSection({
//   comments,
//   id,
//   postId,
// }: {
//   comments: Comment[];
//   id?: string;
//   postId?: string;
// }) {
//   const [newComment, setNewComment] = useState("");
//   const [newCommentMedia, setNewCommentMedia] = useState<
//     MediaAttachment | undefined
//   >();
//   const [newCommentFile, setNewCommentFile] = useState<File | undefined>();
//   const topFileRef = useRef<HTMLInputElement>(null);

//   const handlePost = async () => {
//     if (!newComment.trim() && !newCommentMedia) return;

//     try {
//       const formData = new FormData();

//       const data = {
//         postId,
//         // like: 1,
//         content: "Absolutely loved this post. Super helpful!",
//       };

//       if (newCommentMedia) {
//         formData.append("image", newCommentMedia.url);
//       }
//     } catch (error) {
//     } finally {
//       setNewComment("");
//       setNewCommentMedia(undefined);
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setNewCommentFile(file);
//       setNewCommentMedia(fileToAttachment(file));
//     }
//   };

//   return (
//     <div id='comments' className='bg-gray-100 flex items-start justify-center'>
//       <div className='w-full bg-white rounded-2xl shadow-sm p-4 sm:p-5'>
//         {/* Header */}
//         <h2 className='text-base font-bold text-gray-900 mb-3'>
//           Comments ({comments?.length})
//         </h2>

//         {/* Top-level new comment input */}
//         <div className='mb-5'>
//           {newCommentMedia && (
//             <div className='relative inline-block mb-2'>
//               <Image
//                 src={newCommentMedia.url}
//                 alt='preview'
//                 width={200}
//                 height={200}
//                 className='w-20 h-20 rounded-lg object-cover border border-gray-200'
//               />
//               <button
//                 onClick={() => setNewCommentMedia(undefined)}
//                 className='absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-700 text-white rounded-full flex items-center justify-center hover:bg-gray-900'
//               >
//                 <XIcon />
//               </button>
//             </div>
//           )}

//           {/* Post a comment */}
//           <div className='flex gap-2'>
//             <div className='flex-1 flex items-center border border-gray-200 rounded-lg px-3 gap-2 bg-white focus-within:border-green-300 focus-within:ring-1 focus-within:ring-green-300 transition-all'>
//               <input
//                 type='text'
//                 placeholder='Add a Comment'
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handlePost()}
//                 className='flex-1 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent'
//               />
//               <button
//                 onClick={() => topFileRef.current?.click()}
//                 className='text-gray-400 hover:text-gray-600 flex-shrink-0'
//               >
//                 <ImgIcon />
//               </button>
//               <input
//                 ref={topFileRef}
//                 type='file'
//                 accept='image/*,video/*'
//                 className='hidden'
//                 onChange={(e) => {
//                   const f = e.target.files?.[0];
//                   if (f) setNewCommentMedia(fileToAttachment(f));
//                   e.target.value = "";
//                 }}
//               />
//             </div>
//             <button
//               onClick={handlePost}
//               className='px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors active:scale-95 flex-shrink-0'
//             >
//               Post
//             </button>
//           </div>
//         </div>

//         {/* Comments list */}
//         <div className='flex flex-col gap-5'>
//           {comments.map((comment: Comment) => {
//             return (
//               <div key={comment._id}>
//                 <div className='flex gap-0'>
//                   <div
//                     className='flex flex-col items-center mr-3 flex-shrink-0'
//                     style={{ width: 36 }}
//                   >
//                     {/* <Image
//                       src={comment.avatar}
//                       alt={comment.author}
//                       className='w-9 h-9 rounded-full object-cover z-10'
//                     /> */}
//                   </div>

//                   <div className='flex-1 min-w-0 pb-2'>
//                     <div className='flex items-center gap-2 mb-1'>
//                       <span className='text-sm font-semibold text-gray-900'>
//                         {/* {comment.author} */}
//                       </span>
//                       <span className='text-xs text-green-500 font-medium'>
//                         {formatDate(comment.createdAt)}
//                       </span>
//                     </div>
//                     <p className='text-sm text-gray-700 leading-relaxed mb-2'>
//                       {comment?.content}
//                     </p>

//                     <Image
//                       src={comment.image}
//                       alt='preview'
//                       width={1440}
//                       height={480}
//                       className='h-64 rounded-lg object-cover border border-gray-200'
//                     />

//                     {/* Actions */}
//                     <div className='flex items-center gap-4'>
//                       {/* <button className='flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors'>
//                         <HeartIcon filled={comment.liked} />
//                         <span className={comment.liked ? "text-red-500" : ""}>
//                           +{comment.likes}
//                         </span>
//                       </button> */}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }
