"use client";

import { useState, useRef } from "react";

type MediaAttachment = { url: string; type: "image" | "video" };

type Reply = {
  id: number;
  author: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
  liked: boolean;
  media?: MediaAttachment;
  showReplyInput: boolean;
  replyInput: string;
  pendingMedia?: MediaAttachment;
};

type Comment = {
  id: number;
  author: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
  liked: boolean;
  media?: MediaAttachment;
  replies: Reply[];
  showReplies: boolean;
  showReplyInput: boolean;
  replyInput: string;
  pendingMedia?: MediaAttachment;
};

const AVATAR = "https://i.pravatar.cc/40?img=12";

const makeReply = (overrides: Partial<Reply> = {}): Reply => ({
  id: Date.now() + Math.random(),
  author: "Jacob Jones",
  avatar: AVATAR,
  time: "Just now",
  text: "",
  likes: 0,
  liked: false,
  showReplyInput: false,
  replyInput: "",
  ...overrides,
});

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
      url: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=600&q=80",
      type: "image",
    },
    replies: [],
    showReplies: false,
    showReplyInput: false,
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
    replies: [
      makeReply({
        id: 21,
        time: "1 hr Ago",
        text: "Amazing experience! The DJ kept the energy high all night long. We had a blast, and the venue was perfect for our group size. Highly recommend!",
        likes: 4,
      }),
      makeReply({
        id: 22,
        time: "1 hr Ago",
        text: "Amazing experience! The DJ kept the energy high all night long. We had a blast, and the venue was perfect for our group size. Highly recommend!",
        likes: 4,
      }),
    ],
    showReplies: true,
    showReplyInput: false,
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
    replies: [],
    showReplies: false,
    showReplyInput: false,
    replyInput: "",
  },
];

// ── Icons ──────────────────────────────────────────────────────────────────────
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

// ── Curved thread connector drawn with SVG ─────────────────────────────────────
// Draws a vertical line from top, curves right to point at the reply avatar centre
const CurvedConnector = ({ isLast }: { isLast: boolean }) => (
  <svg
    width='28'
    height='100%'
    viewBox='0 0 28 60'
    preserveAspectRatio='none'
    className='absolute left-0 top-0 w-7 pointer-events-none'
    style={{ height: "100%" }}
  >
    {/* Straight vertical segment */}
    <line x1='14' y1='0' x2='14' y2='34' stroke='#d1d5db' strokeWidth='1.5' />
    {/* Curved elbow into the reply */}
    <path
      d='M14,34 Q14,48 28,48'
      fill='none'
      stroke='#d1d5db'
      strokeWidth='1.5'
    />
    {/* Continue straight down for non-last items */}
    {!isLast && (
      <line
        x1='14'
        y1='34'
        x2='14'
        y2='100%'
        stroke='#d1d5db'
        strokeWidth='1.5'
      />
    )}
  </svg>
);

// ── File → object URL helper ──────────────────────────────────────────────────
function fileToAttachment(file: File): MediaAttachment {
  return {
    url: URL.createObjectURL(file),
    type: file.type.startsWith("video") ? "video" : "image",
  };
}

// ── Shared Reply Input ─────────────────────────────────────────────────────────
function ReplyInput({
  value,
  pendingMedia,
  onChange,
  onPost,
  onCancel,
  onMedia,
  onRemoveMedia,
  inputRef,
}: {
  value: string;
  pendingMedia?: MediaAttachment;
  onChange: (v: string) => void;
  onPost: () => void;
  onCancel: () => void;
  onMedia: (m: MediaAttachment) => void;
  onRemoveMedia: () => void;
  inputRef?: (el: HTMLInputElement | null) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className='mt-3'>
      {pendingMedia && (
        <div className='relative inline-block mb-2'>
          <img
            src={pendingMedia.url}
            alt='preview'
            className='h-20 rounded-lg object-cover border border-gray-200'
          />
          <button
            onClick={onRemoveMedia}
            className='absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-700 text-white rounded-full flex items-center justify-center hover:bg-gray-900'
          >
            <XIcon />
          </button>
        </div>
      )}
      <div className='flex gap-2'>
        <div className='flex-1 flex items-center border border-green-300 rounded-lg px-3 gap-2 bg-white focus-within:ring-1 focus-within:ring-green-400 transition-all'>
          <input
            ref={inputRef}
            type='text'
            placeholder='Add Reply'
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onPost();
              if (e.key === "Escape") onCancel();
            }}
            className='flex-1 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent'
          />
          <button
            onClick={() => fileRef.current?.click()}
            className='text-gray-400 hover:text-gray-600 flex-shrink-0'
          >
            <ImgIcon />
          </button>
          <input
            ref={fileRef}
            type='file'
            accept='image/*,video/*'
            className='hidden'
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onMedia(fileToAttachment(f));
              e.target.value = "";
            }}
          />
        </div>
        <button
          onClick={onPost}
          className='px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors active:scale-95 flex-shrink-0'
        >
          Post
        </button>
      </div>
    </div>
  );
}

// ── Media preview inside a comment/reply ──────────────────────────────────────
function MediaPreview({ media }: { media: MediaAttachment }) {
  const [playing, setPlaying] = useState(false);
  if (media.type === "video") {
    return playing ? (
      <video
        src={media.url}
        controls
        autoPlay
        className='w-full rounded-xl mb-2 max-h-64 object-cover'
      />
    ) : (
      <div
        className='relative rounded-xl overflow-hidden mb-2 cursor-pointer'
        onClick={() => setPlaying(true)}
      >
        <img
          src={media.url}
          alt='video thumb'
          className='w-full object-cover max-h-56 sm:max-h-72'
        />
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
      </div>
    );
  }
  return (
    <img
      src={media.url}
      alt='attachment'
      className='w-full rounded-xl mb-2 max-h-64 object-cover'
    />
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function CommentsSection() {
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState("");
  const [newCommentMedia, setNewCommentMedia] = useState<
    MediaAttachment | undefined
  >();
  const topFileRef = useRef<HTMLInputElement>(null);
  const focusRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // ── Patch helpers ──────────────────────────────────────────────────────────
  const patchComment = (id: number, patch: Partial<Comment>) =>
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    );

  const patchReply = (
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

  // ── Toggle reply input for a top-level comment ─────────────────────────────
  const toggleCommentReplyInput = (commentId: number, shown: boolean) => {
    patchComment(commentId, {
      showReplyInput: !shown,
      replyInput: "",
      pendingMedia: undefined,
      showReplies: true,
    });
    if (!shown)
      setTimeout(() => focusRefs.current[`c-${commentId}`]?.focus(), 50);
  };

  // ── Toggle reply input for a nested reply ─────────────────────────────────
  const toggleReplyInput = (
    commentId: number,
    replyId: number,
    shown: boolean,
  ) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              showReplyInput: false,
              replies: c.replies.map((r) =>
                r.id === replyId
                  ? {
                      ...r,
                      showReplyInput: !shown,
                      replyInput: "",
                      pendingMedia: undefined,
                    }
                  : { ...r, showReplyInput: false },
              ),
            }
          : c,
      ),
    );
    if (!shown)
      setTimeout(() => focusRefs.current[`r-${replyId}`]?.focus(), 50);
  };

  // ── Post top-level comment ─────────────────────────────────────────────────
  const handlePost = () => {
    if (!newComment.trim() && !newCommentMedia) return;
    setComments((prev) => [
      {
        id: Date.now(),
        author: "Jacob Jones",
        avatar: AVATAR,
        time: "Just now",
        text: newComment.trim(),
        likes: 0,
        liked: false,
        media: newCommentMedia,
        replies: [],
        showReplies: false,
        showReplyInput: false,
        replyInput: "",
      },
      ...prev,
    ]);
    setNewComment("");
    setNewCommentMedia(undefined);
  };

  // ── Post reply to a comment ────────────────────────────────────────────────
  const postCommentReply = (
    commentId: number,
    text: string,
    media?: MediaAttachment,
  ) => {
    if (!text.trim() && !media) return;
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: [...c.replies, makeReply({ text: text.trim(), media })],
              showReplies: true,
              showReplyInput: false,
              replyInput: "",
              pendingMedia: undefined,
            }
          : c,
      ),
    );
  };

  // ── Post reply to a nested reply ───────────────────────────────────────────
  const postNestedReply = (
    commentId: number,
    replyId: number,
    text: string,
    media?: MediaAttachment,
  ) => {
    if (!text.trim() && !media) return;
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: [
                ...c.replies.map((r) =>
                  r.id === replyId
                    ? {
                        ...r,
                        showReplyInput: false,
                        replyInput: "",
                        pendingMedia: undefined,
                      }
                    : r,
                ),
                makeReply({ text: text.trim(), media }),
              ],
            }
          : c,
      ),
    );
  };

  const totalCount = comments.reduce((acc, c) => acc + 1 + c.replies.length, 0);

  return (
    <div className='bg-gray-100 flex items-start justify-center'>
      <div className='w-full bg-white rounded-2xl shadow-sm p-4 sm:p-5'>
        {/* Header */}
        <h2 className='text-base font-bold text-gray-900 mb-3'>
          Comments ({totalCount})
        </h2>

        {/* Top-level new comment input */}
        <div className='mb-5'>
          {newCommentMedia && (
            <div className='relative inline-block mb-2'>
              <img
                src={newCommentMedia.url}
                alt='preview'
                className='h-20 rounded-lg object-cover border border-gray-200'
              />
              <button
                onClick={() => setNewCommentMedia(undefined)}
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
                  if (f) setNewCommentMedia(fileToAttachment(f));
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
          {comments.map((comment) => {
            const hasThread =
              (comment.showReplies && comment.replies.length > 0) ||
              comment.showReplyInput;
            return (
              <div key={comment.id}>
                {/* ── Top-level comment ── */}
                <div className='flex gap-0'>
                  {/* Avatar + vertical line */}
                  <div
                    className='flex flex-col items-center mr-3 flex-shrink-0'
                    style={{ width: 36 }}
                  >
                    <img
                      src={comment.avatar}
                      alt={comment.author}
                      className='w-9 h-9 rounded-full object-cover z-10'
                    />
                    {hasThread && (
                      <div className='w-px bg-gray-200 flex-1 mt-1' />
                    )}
                  </div>

                  <div className='flex-1 min-w-0 pb-2'>
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

                    {comment.media && <MediaPreview media={comment.media} />}

                    {/* Actions */}
                    <div className='flex items-center gap-4'>
                      <button
                        onClick={() =>
                          patchComment(comment.id, {
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
                          toggleCommentReplyInput(
                            comment.id,
                            comment.showReplyInput,
                          )
                        }
                        className={`flex items-center gap-1 text-xs transition-colors ${comment.showReplyInput ? "text-green-500" : "text-gray-500 hover:text-gray-700"}`}
                      >
                        <ChatIcon />
                        <span>Reply</span>
                      </button>
                    </div>

                    {comment.showReplyInput && (
                      <ReplyInput
                        value={comment.replyInput}
                        pendingMedia={comment.pendingMedia}
                        onChange={(v) =>
                          patchComment(comment.id, { replyInput: v })
                        }
                        onPost={() =>
                          postCommentReply(
                            comment.id,
                            comment.replyInput,
                            comment.pendingMedia,
                          )
                        }
                        onCancel={() =>
                          patchComment(comment.id, {
                            showReplyInput: false,
                            replyInput: "",
                            pendingMedia: undefined,
                          })
                        }
                        onMedia={(m) =>
                          patchComment(comment.id, { pendingMedia: m })
                        }
                        onRemoveMedia={() =>
                          patchComment(comment.id, { pendingMedia: undefined })
                        }
                        inputRef={(el) => {
                          focusRefs.current[`c-${comment.id}`] = el;
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* ── Nested replies with curved connector lines ── */}
                {comment.showReplies && comment.replies.length > 0 && (
                  <div className='ml-9 flex flex-col'>
                    {comment.replies.map((reply, idx) => {
                      const isLast = idx === comment.replies.length - 1;
                      return (
                        <div key={reply.id} className='flex'>
                          {/* Curved connector column */}
                          <div
                            className='relative flex-shrink-0'
                            style={{ width: 40 }}
                          >
                            {/* Vertical line segment that runs through non-last items */}
                            {!isLast && (
                              <div
                                className='absolute bg-gray-200'
                                style={{
                                  left: 13,
                                  top: 48,
                                  bottom: 0,
                                  width: 1.5,
                                }}
                              />
                            )}
                            {/* SVG curved elbow */}
                            <svg
                              width='40'
                              height='48'
                              viewBox='0 0 40 48'
                              fill='none'
                              className='flex-shrink-0'
                            >
                              {/* Vertical drop from parent line */}
                              <line
                                x1='14'
                                y1='0'
                                x2='14'
                                y2='30'
                                stroke='#d1d5db'
                                strokeWidth='1.5'
                              />
                              {/* Curved elbow to avatar */}
                              <path
                                d='M14,30 Q14,44 28,44'
                                fill='none'
                                stroke='#d1d5db'
                                strokeWidth='1.5'
                                strokeLinecap='round'
                              />
                            </svg>
                          </div>

                          {/* Reply avatar + content */}
                          <div className='flex flex-1 min-w-0 gap-2 pb-4'>
                            <img
                              src={reply.avatar}
                              alt={reply.author}
                              className='w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1'
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
                              {reply.media && (
                                <MediaPreview media={reply.media} />
                              )}
                              <div className='flex items-center gap-4'>
                                <button
                                  onClick={() =>
                                    patchReply(comment.id, reply.id, {
                                      liked: !reply.liked,
                                      likes: reply.liked
                                        ? reply.likes - 1
                                        : reply.likes + 1,
                                    })
                                  }
                                  className='flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors'
                                >
                                  <HeartIcon filled={reply.liked} />
                                  <span
                                    className={
                                      reply.liked ? "text-red-500" : ""
                                    }
                                  >
                                    +{reply.likes}
                                  </span>
                                </button>
                                <button
                                  onClick={() =>
                                    toggleReplyInput(
                                      comment.id,
                                      reply.id,
                                      reply.showReplyInput,
                                    )
                                  }
                                  className={`flex items-center gap-1 text-xs transition-colors ${reply.showReplyInput ? "text-green-500" : "text-gray-500 hover:text-gray-700"}`}
                                >
                                  <ChatIcon />
                                  <span>Reply</span>
                                </button>
                              </div>

                              {reply.showReplyInput && (
                                <ReplyInput
                                  value={reply.replyInput}
                                  pendingMedia={reply.pendingMedia}
                                  onChange={(v) =>
                                    patchReply(comment.id, reply.id, {
                                      replyInput: v,
                                    })
                                  }
                                  onPost={() =>
                                    postNestedReply(
                                      comment.id,
                                      reply.id,
                                      reply.replyInput,
                                      reply.pendingMedia,
                                    )
                                  }
                                  onCancel={() =>
                                    patchReply(comment.id, reply.id, {
                                      showReplyInput: false,
                                      replyInput: "",
                                      pendingMedia: undefined,
                                    })
                                  }
                                  onMedia={(m) =>
                                    patchReply(comment.id, reply.id, {
                                      pendingMedia: m,
                                    })
                                  }
                                  onRemoveMedia={() =>
                                    patchReply(comment.id, reply.id, {
                                      pendingMedia: undefined,
                                    })
                                  }
                                  inputRef={(el) => {
                                    focusRefs.current[`r-${reply.id}`] = el;
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className='border-b border-gray-100 mt-2' />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
