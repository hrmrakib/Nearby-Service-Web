import baseAPI from "@/redux/api/api";

const supportAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    createSupport: builder.mutation({
      query: (data) => ({
        url: "/support",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateSupportMutation } = supportAPI;
export default supportAPI;
