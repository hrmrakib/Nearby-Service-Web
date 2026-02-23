import baseAPI from "@/redux/api/api";

const reviewAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getReviewsByPostId: builder.query({
      query: (postId) => ({
        url: `/review/post-reviews/${postId}`,
      }),
    }),
  }),
});

export const { useGetReviewsByPostIdQuery } = reviewAPI;

export default reviewAPI;
