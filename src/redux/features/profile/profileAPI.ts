import baseAPI from "@/redux/api/api";

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
      query: () => ({
        url: "/post/my-post",
        method: "GET",
      }),
    }),

    getAttendingEvent: builder.query({
      query: () => ({
        url: "/post/my-join-event",
        method: "GET",
      }),
    }),

    getSavedPost: builder.query({
      query: () => ({
        url: "/save/my-saved-post",
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
} = profileAPI;
export default profileAPI;
