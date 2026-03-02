import baseAPI from "@/redux/api/api";

const commentAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getCommentsByPostId: builder.query({
      query: (postId) => ({
        url: `/comments/${postId}`,
      }),
    }),

    createComment: builder.mutation({
      query: (body) => ({
        url: "/comments",
        method: "POST",
        body,
      }),
    }),

    createReply: builder.mutation({
      query: (body) => ({
        url: "/replies",
        method: "POST",
        body,
      }),
    }),

    likeComment: builder.mutation({
      query: (body) => ({
        url: `/like/comment`,
        method: "POST",
        body,
      }),
    }),

    likeReply: builder.mutation({
      query: (body) => ({
        url: `/like/reply`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetCommentsByPostIdQuery,
  useCreateCommentMutation,
  useCreateReplyMutation,
  useLikeCommentMutation,
  useLikeReplyMutation,
} = commentAPI;

export default commentAPI;
