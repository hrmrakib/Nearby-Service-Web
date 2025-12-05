import baseAPI from "@/redux/api/api";

const likeAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    toggleLike: builder.mutation({
      query: (body) => ({
        url: "/like/like-toggle",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const { useToggleLikeMutation } = likeAPI;
export default likeAPI;
