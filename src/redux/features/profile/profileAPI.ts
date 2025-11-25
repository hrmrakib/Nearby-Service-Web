import baseAPI from "@/redux/api/api";

const profileAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
    }),
  }),
});
