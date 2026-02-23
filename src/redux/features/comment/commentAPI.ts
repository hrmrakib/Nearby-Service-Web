import baseAPI from "@/redux/api/api";

const commentAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getCommentsByPostId: builder.query({
      query: (postId) => ({
        url: `/comments/${postId}`,
      }),
    }),
  }),
});

export const { useGetCommentsByPostIdQuery } = commentAPI;

export default commentAPI;
