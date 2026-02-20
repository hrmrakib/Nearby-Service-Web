"use client";

import { useState, useRef } from "react";

type Comment = {
  id: number;
  author: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
  liked: boolean;
  media?: { type: "image" | "video"; src: string };
  replies: Reply[];
  showReplies: boolean;
  replyInput: string;
};

type Reply = {
  id: number;
  author: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
  liked: boolean;
};

const AVATAR = "https://i.pravatar.cc/40?img=12";

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 1,
    author: "Jacob Jones",
    avatar: AVATAR,
    time: "1 hr Ago",
    text: "Amazing experience! The DJ kept the energy high all night long. We had a blast, and the venue was perfect for our group size. Highly recommend!",
    likes: 4,
    liked: false,
    media: {
      type: "video",
      src: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=600&q=80",
    },
    replies: [],
    showReplies: false,
    replyInput: "",
  },
  {
    id: 2,
    author: "Jacob Jones",
    avatar: AVATAR,
    time: "1 hr Ago",
    text: "Amazing experience! The DJ kept the energy high all night long. We had a blast, and the venue was perfect for our group size. Highly recommend!",
    likes: 4,
    liked: false,
    media: undefined,
    replies: [
      {
        id: 21,
        author: "Jacob Jones",
        avatar: AVATAR,
        time: "1 hr Ago",
        text: "Amazing experience! The DJ kept the energy high all night long. We had a blast, and the venue was perfect for our group size. Highly recommend!",
        likes: 4,
        liked: false,
      },
      {
        id: 22,
        author: "Jacob Jones",
        avatar: AVATAR,
        time: "1 hr Ago",
        text: "Amazing experience! The DJ kept the energy high all night long. We had a blast, and the venue was perfect for our group size. Highly recommend!",
        likes: 4,
        liked: false,
      },
    ],
    showReplies: true,
    replyInput: "",
  },
  {
    id: 3,
    author: "Jacob Jones",
    avatar: AVATAR,
    time: "1 hr Ago",
    text: "Amazing experience! The DJ kept the energy high all night long. We had a blast, and the venue was perfect for our group size. Highly recommend!",
    likes: 4,
    liked: false,
    media: undefined,
    replies: [],
    showReplies: false,
    replyInput: "",
  },
];

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width='14'
    height='14'
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

const ChatIcon = () => (
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
    <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' />
  </svg>
);

const ImageIcon = () => (
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

export default function CommentsSection() {
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState("");
  const [videoPlaying, setVideoPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replyFileRef = useRef<HTMLInputElement>(null);

  const updateComment = (id: number, patch: Partial<Comment>) =>
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    );

  const updateReply = (
    commentId: number,
    replyId: number,
    patch: Partial<Reply>,
  ) =>
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: c.replies.map((r) =>
                r.id === replyId ? { ...r, ...patch } : r,
              ),
            }
          : c,
      ),
    );

  const handlePost = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now(),
      author: "Jacob Jones",
      avatar: AVATAR,
      time: "Just now",
      text: newComment.trim(),
      likes: 0,
      liked: false,
      replies: [],
      showReplies: false,
      replyInput: "",
    };
    setComments((prev) => [comment, ...prev]);
    setNewComment("");
  };

  const handleReplyPost = (commentId: number, text: string) => {
    if (!text.trim()) return;
    const reply: Reply = {
      id: Date.now(),
      author: "Jacob Jones",
      avatar: AVATAR,
      time: "Just now",
      text: text.trim(),
      likes: 0,
      liked: false,
    };
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: [...c.replies, reply],
              showReplies: true,
              replyInput: "",
            }
          : c,
      ),
    );
  };

  const totalCount = comments.reduce((acc, c) => acc + 1 + c.replies.length, 0);

  return (
    <div className='min-h-screen bg-gray-100 flex items-start justify-center p-4 pt-8'>
      <div className='w-full max-w-lg bg-white rounded-2xl shadow-sm p-4 sm:p-5'>
        {/* Header */}
        <h2 className='text-base font-bold text-gray-900 mb-3'>
          Comments ({totalCount})
        </h2>

        {/* New comment input */}
        <div className='flex gap-2 mb-5'>
          <div className='flex-1 flex items-center border border-gray-200 rounded-lg px-3 gap-2 bg-white'>
            <input
              type='text'
              placeholder='Add a Comment'
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePost()}
              className='flex-1 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent'
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className='text-gray-400 hover:text-gray-600 flex-shrink-0'
            >
              <ImageIcon />
            </button>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*,video/*'
              className='hidden'
            />
          </div>
          <button
            onClick={handlePost}
            className='px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors active:scale-95 flex-shrink-0'
          >
            Post
          </button>
        </div>

        {/* Comments list */}
        <div className='flex flex-col gap-5'>
          {comments.map((comment) => (
            <div key={comment.id}>
              {/* Comment */}
              <div className='flex gap-3'>
                <img
                  src={comment.avatar}
                  alt={comment.author}
                  className='w-9 h-9 rounded-full flex-shrink-0 object-cover'
                />
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='text-sm font-semibold text-gray-900'>
                      {comment.author}
                    </span>
                    <span className='text-xs text-green-500 font-medium'>
                      {comment.time}
                    </span>
                  </div>
                  <p className='text-sm text-gray-700 leading-relaxed mb-2'>
                    {comment.text}
                  </p>

                  {/* Media attachment */}
                  {comment.media && (
                    <div
                      className='relative rounded-xl overflow-hidden mb-2 cursor-pointer'
                      onClick={() => setVideoPlaying((v) => !v)}
                    >
                      <img
                        src={comment.media.src}
                        alt='media'
                        className='w-full object-cover max-h-56 sm:max-h-72'
                      />
                      {comment.media.type === "video" && !videoPlaying && (
                        <div className='absolute inset-0 flex items-center justify-center bg-black/20'>
                          <div className='w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-md'>
                            <svg
                              width='20'
                              height='20'
                              viewBox='0 0 24 24'
                              fill='currentColor'
                              className='text-gray-800 ml-1'
                            >
                              <polygon points='5 3 19 12 5 21 5 3' />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className='flex items-center gap-4'>
                    <button
                      onClick={() =>
                        updateComment(comment.id, {
                          liked: !comment.liked,
                          likes: comment.liked
                            ? comment.likes - 1
                            : comment.likes + 1,
                        })
                      }
                      className='flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors'
                    >
                      <HeartIcon filled={comment.liked} />
                      <span className={comment.liked ? "text-red-500" : ""}>
                        +{comment.likes}
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        updateComment(comment.id, {
                          showReplies: !comment.showReplies,
                        })
                      }
                      className='flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors'
                    >
                      <ChatIcon />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Replies section */}
              {comment.showReplies && (
                <div className='ml-12 mt-3 flex flex-col gap-4'>
                  {/* Existing replies */}
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className='flex gap-3'>
                      <img
                        src={reply.avatar}
                        alt={reply.author}
                        className='w-8 h-8 rounded-full flex-shrink-0 object-cover'
                      />
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 mb-1'>
                          <span className='text-sm font-semibold text-gray-900'>
                            {reply.author}
                          </span>
                          <span className='text-xs text-green-500 font-medium'>
                            {reply.time}
                          </span>
                        </div>
                        <p className='text-sm text-gray-700 leading-relaxed mb-2'>
                          {reply.text}
                        </p>
                        <div className='flex items-center gap-4'>
                          <button
                            onClick={() =>
                              updateReply(comment.id, reply.id, {
                                liked: !reply.liked,
                                likes: reply.liked
                                  ? reply.likes - 1
                                  : reply.likes + 1,
                              })
                            }
                            className='flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors'
                          >
                            <HeartIcon filled={reply.liked} />
                            <span className={reply.liked ? "text-red-500" : ""}>
                              +{reply.likes}
                            </span>
                          </button>
                          <button className='flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors'>
                            <ChatIcon />
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Reply input */}
                  <div className='flex gap-2'>
                    <div className='flex-1 flex items-center border border-gray-200 rounded-lg px-3 gap-2 bg-white'>
                      <input
                        type='text'
                        placeholder='Add Reply'
                        value={comment.replyInput}
                        onChange={(e) =>
                          updateComment(comment.id, {
                            replyInput: e.target.value,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleReplyPost(comment.id, comment.replyInput);
                          }
                        }}
                        className='flex-1 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent'
                      />
                      <button
                        onClick={() => replyFileRef.current?.click()}
                        className='text-gray-400 hover:text-gray-600 flex-shrink-0'
                      >
                        <ImageIcon />
                      </button>
                      <input
                        ref={replyFileRef}
                        type='file'
                        accept='image/*,video/*'
                        className='hidden'
                      />
                    </div>
                    <button
                      onClick={() =>
                        handleReplyPost(comment.id, comment.replyInput)
                      }
                      className='px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors active:scale-95 flex-shrink-0'
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className='border-b border-gray-100 mt-4' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
