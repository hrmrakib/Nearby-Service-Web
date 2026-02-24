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
  }),
});

export const { useGetCommentsByPostIdQuery, useCreateCommentMutation } =
  commentAPI;

export default commentAPI;
