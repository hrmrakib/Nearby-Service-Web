import baseAPI from "@/redux/api/api";
import { get } from "http";

const profileAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
    }),

    updateProfile: builder.mutation({
      query: (body) => ({
        url: "/user/update-profile",
        method: "PATCH",
        body,
      }),
    }),

    getMyPost: builder.query({
      query: ({ page, limit }) => ({
        url: `/post/my-post?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),

    getAttendingEvent: builder.query({
      query: ({ page, limit }) => ({
        url: `/post/my-join-event?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),

    getSavedPost: builder.query({
      query: () => ({
        url: "/save/my-saved-post",
        method: "GET",
      }),
    }),

    getFollowers: builder.query({
      query: ({ page, limit }) => ({
        url: `/follower/my-followers?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
    getFollowing: builder.query({
      query: ({ page, limit }) => ({
        url: `/follower/my-following?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetMyPostQuery,
  useGetAttendingEventQuery,
  useGetSavedPostQuery,
  useGetFollowersQuery,
  useGetFollowingQuery,
} = profileAPI;
export default profileAPI;
