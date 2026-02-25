"use client";

import {
  useCreateCommentMutation,
  useGetCommentsByPostIdQuery,
} from "@/redux/features/comment/commentAPI";
import React, { useState, useRef } from "react";
import { toast } from "sonner";

interface ApiUser {
  _id: string;
  name: string;
  image: string;
}

interface ApiReply {
  _id: string;
  commentId: string;
  like: number;
  content: string;
  image: string;
  video: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  user: ApiUser;
  liked: boolean;
  reply: ApiReply[];
}

interface ApiComment {
  _id: string;
  postId: string;
  like: number;
  content: string;
  image: string;
  video: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  user: ApiUser;
  liked: boolean;
  reply: ApiReply[];
}

interface Reply {
  _id: string;
  commentId: string;
  like: number;
  content: string;
  image: string;
  video: string;
  createdAt: string;
  user: ApiUser;
  liked: boolean;
}

interface Comment {
  _id: string;
  postId: string;
  like: number;
  content: string;
  image: string;
  video: string;
  createdAt: string;
  user: ApiUser;
  liked: boolean;
  reply: Reply[];
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width='15'
      height='15'
      viewBox='0 0 24 24'
      fill={filled ? "#ef4444" : "none"}
      stroke={filled ? "#ef4444" : "currentColor"}
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
    </svg>
  );
}

function ReplyIcon() {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <polyline points='9 17 4 12 9 7' />
      <path d='M20 18v-2a4 4 0 0 0-4-4H4' />
    </svg>
  );
}

function ImageIcon() {
  return (
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
      <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
      <circle cx='8.5' cy='8.5' r='1.5' />
      <polyline points='21 15 16 10 5 21' />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width='44' height='44' viewBox='0 0 24 24'>
      <circle
        cx='12'
        cy='12'
        r='11'
        fill='rgba(0,0,0,0.45)'
        stroke='rgba(255,255,255,0.8)'
        strokeWidth='1.5'
      />
      <polygon points='10 8 16 12 10 16 10 8' fill='white' />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <line x1='22' y1='2' x2='11' y2='13' />
      <polygon points='22 2 15 22 11 13 2 9 22 2' />
    </svg>
  );
}

function MediaDisplay({ image, video }: { image: string; video: string }) {
  const hasVideo = Boolean(video);
  const hasImage = Boolean(image);
  if (!hasVideo && !hasImage) return null;

  return (
    <div className='relative mt-2 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 max-w-xs'>
      {hasVideo ? (
        <>
          <video
            src={video}
            className='w-full max-h-60 object-cover'
            poster={image || undefined}
          />
          <div className='absolute inset-0 flex items-center justify-center'>
            <PlayIcon />
          </div>
        </>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt='comment media'
          className='w-full max-h-60 object-cover'
        />
      )}
    </div>
  );
}

interface CommentInputProps {
  postId?: string;
  placeholder?: string;
  type: "comment" | "reply";
  onPost: (content: string, image: string, video: string) => void;
  autoFocus?: boolean;
}

function CommentInput({
  postId,
  placeholder = "Write a comment...",
  type,
  onPost,
  autoFocus = false,
}: CommentInputProps) {
  const [text, setText] = useState("");
  const [mediaPreview, setMediaPreview] = useState<string>("");
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [createCommentMutation, { isLoading }] = useCreateCommentMutation();

  console.log({ type });

  React.useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    const type = file.type.startsWith("video") ? "video" : "image";
    setMediaPreview(URL.createObjectURL(file));
    setMediaType(type);
  };

  const removeMedia = () => {
    setMediaPreview("");
    setMediaType(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handlePost = async () => {
    if (!text.trim() && !mediaPreview) return;

    try {
      const formData = new FormData();
      const data = {
        postId,
        like: 1,
        content: text,
      };

      formData.append("data", JSON.stringify(data));

      if (uploadedFile) {
        formData.append("image", uploadedFile);
      }

      const res = await createCommentMutation(formData).unwrap();

      if (res?.success) {
        toast.success(res?.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setText("");
      setUploadedFile(null);
      removeMedia();
    }
    // const imageUrl = mediaType === "image" ? mediaPreview : "";
    // const videoUrl = mediaType === "video" ? mediaPreview : "";
  };

  const canPost = text.trim().length > 0 || Boolean(mediaPreview);

  return (
    <div className='flex flex-col gap-2'>
      {mediaPreview && (
        <div className='relative inline-block self-start'>
          <div className='relative rounded-xl overflow-hidden border border-gray-200 w-20 h-16'>
            {mediaType === "video" ? (
              <video
                src={mediaPreview}
                className='w-full h-full object-cover'
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mediaPreview}
                alt='preview'
                className='w-full h-full object-cover'
              />
            )}
          </div>
          <button
            onClick={removeMedia}
            className='absolute -top-1.5 -right-1.5 bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none hover:bg-black transition-colors shadow'
          >
            ×
          </button>
        </div>
      )}
      <div className='flex items-center gap-2'>
        <div className='flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3.5 py-2.5 focus-within:border-green-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-100 transition-all duration-200'>
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handlePost();
              }
            }}
            placeholder={placeholder}
            className='flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none min-w-0'
          />
          <button
            onClick={() => fileRef.current?.click()}
            className='text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0'
            title='Attach photo or video'
          >
            <ImageIcon />
          </button>
          <input
            ref={fileRef}
            type='file'
            accept='image/*,video/*'
            onChange={handleFile}
            className='hidden'
          />
        </div>
        <button
          onClick={handlePost}
          disabled={!canPost || isLoading}
          className='flex items-center gap-1.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white disabled:text-gray-400 font-semibold text-sm px-4 py-2.5 rounded-2xl transition-all duration-150 flex-shrink-0 active:scale-95'
        >
          <SendIcon />
          <span className='hidden sm:inline'>Post</span>
        </button>
      </div>
    </div>
  );
}

interface ReplyCardProps {
  reply: Reply;
  onLike: (replyId: string) => void;
}

function ReplyCard({ reply, onLike }: ReplyCardProps) {
  // console.log({ reply });

  const likeCount = reply.liked ? reply.like + 1 : reply.like;

  return (
    <div className='flex gap-2.5 mt-3 pl-3 sm:pl-4'>
      {/* Thread indicator line */}
      <div className='relative flex-shrink-0' style={{ width: 2 }}>
        <div className='absolute inset-0 bg-gray-200 rounded-full' />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={reply.user.image}
        alt={reply.user.name}
        className='w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-white'
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.user.name)}&background=e5e7eb&color=374151&size=32`;
        }}
      />
      <div className='flex-1 min-w-0'>
        <div className='bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-3 py-2.5'>
          <div className='flex items-center gap-2 mb-0.5'>
            <span className='font-semibold text-gray-900 text-xs'>
              {reply.user.name}
            </span>
            <span className='text-xs text-gray-400'>
              {formatTimeAgo(reply.createdAt)}
            </span>
          </div>
          {reply.content && (
            <p className='text-sm text-gray-700 leading-relaxed'>
              {reply.content}
            </p>
          )}
          <MediaDisplay image={reply.image} video={reply.video} />
        </div>
        {/* Like only — Reply button intentionally hidden at this level */}
        <div className='flex items-center gap-3 mt-1 pl-1'>
          <button
            onClick={() => onLike(reply._id)}
            className={`flex items-center gap-1 text-xs font-medium transition-all duration-150 active:scale-90 ${reply.liked ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}
          >
            <HeartIcon filled={reply.liked} />
            {likeCount > 0 && <span>{likeCount}</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

interface CommentCardProps {
  comment: Comment;
  onLike: (commentId: string) => void;
  onLikeReply: (commentId: string, replyId: string) => void;
  onReply: (
    commentId: string,
    content: string,
    image: string,
    video: string,
  ) => void;
}

function CommentCard({
  comment,
  onLike,
  onLikeReply,
  onReply,
}: CommentCardProps) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const likeCount = comment.liked ? comment.like + 1 : comment.like;

  return (
    <div className='flex items-start gap-3'>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={comment.user.image}
        alt={comment.user.name}
        className='w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-white shadow-sm'
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user.name)}&background=e5e7eb&color=374151&size=40`;
        }}
      />
      <div className='flex-1 min-w-0'>
        {/* Bubble */}
        <div className='bg-gray- rounded-2xl rounded-tl-sm px-4'>
          <div className='flex items-center gap-2 mb-1'>
            <span className='font-semibold text-gray-900 text-sm'>
              {comment.user.name}
            </span>
            <span className='text-xs text-gray-400'>
              {formatTimeAgo(comment.createdAt)}
            </span>
          </div>
          {comment.content && (
            <p className='text-sm text-gray-700 leading-relaxed'>
              {comment.content}
            </p>
          )}
          <MediaDisplay image={comment.image} video={comment.video} />
        </div>

        {/* Action bar */}
        <div className='flex items-center gap-4 mt-1.5 pl-4'>
          <button
            onClick={() => onLike(comment._id)}
            className={`flex items-center gap-1.5 text-xs font-medium transition-all duration-150 active:scale-90 ${comment.liked ? "text-red-500" : "text-gray-500 hover:text-red-400"}`}
          >
            <HeartIcon filled={comment.liked} />
            {likeCount > 0 && <span>{likeCount}</span>}
          </button>
          {/* Reply button shown only at top-level (comment), hidden in replies */}
          <button
            onClick={() => setShowReplyInput((v) => !v)}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${showReplyInput ? "text-green-600" : "text-gray-500 hover:text-green-600"}`}
          >
            <ReplyIcon />
            <span>Reply</span>
            {comment.reply.length > 0 && (
              <span className='text-gray-400 font-normal'>
                ({comment.reply.length})
              </span>
            )}
          </button>
        </div>

        {/* Replies list */}
        {comment.reply.length > 0 && (
          <div className='mt-2 space-y-0'>
            {comment.reply.map((reply) => (
              <ReplyCard
                key={reply._id}
                reply={reply}
                onLike={(replyId) => onLikeReply(comment._id, replyId)}
              />
            ))}
          </div>
        )}

        {/* Inline reply input */}
        {showReplyInput && (
          <div className='mt-3'>
            <CommentInput
              // postId={postId}
              placeholder={`Reply to ${comment.user.name}...`}
              type='reply'
              autoFocus
              onPost={(content, image, video) => {
                if (!content && !image && !video) return;
                onReply(comment._id, content, image, video);
                setShowReplyInput(false);
                console.log("replied", { content, image, video });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

interface CommentSectionProps {
  id?: string;
  postId?: string;
  /** Pass your API response data here */
  initialData?: ApiComment[];
}

export default function CommentSection({
  id,
  postId = "699c1df44bdd6c4865a77fa2",
}: CommentSectionProps) {
  const { data: commentData, isLoading } = useGetCommentsByPostIdQuery(postId);

  const comments = commentData?.data || [];

  const handleLikeComment = (commentId: string) => {};

  const handleLikeReply = (commentId: string, replyId: string) => {};

  const handleReply = (
    commentId: string,
    content: string,
    image: string,
    video: string,
  ) => {};

  const handlePostComment = () => {};

  return (
    <div className='min-h-screen flex items-start justify-center'>
      <div className='w-full'>
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
          {/* Header */}
          <div className='flex items-center gap-2.5 px-4 sm:px-5 py-4 border-b border-gray-100'>
            <h2 className='font-bold text-gray-900 text-base'>Comments</h2>
            <span className='bg-green-50 text-green-600 border border-green-200 text-xs font-bold px-2 py-0.5 rounded-full'>
              {comments.length}
            </span>
          </div>

          {/* New comment composer */}
          <div className='px-4 sm:px-5 py-4 border-b border-gray-100'>
            <CommentInput
              postId={postId}
              placeholder='Share your thoughts...'
              type='comment'
              onPost={handlePostComment}
            />
          </div>

          {/* Comments */}
          <div className='divide-y divide-gray-50'>
            {comments.length === 0 ? (
              <p className='py-12 text-center text-sm text-gray-400'>
                No comments yet — be the first!
              </p>
            ) : (
              comments.map((comment: ApiComment) => (
                <div key={comment._id} className='px-4 sm:px-5 py-4'>
                  <CommentCard
                    comment={comment}
                    onLike={handleLikeComment}
                    onLikeReply={handleLikeReply}
                    onReply={handleReply}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
