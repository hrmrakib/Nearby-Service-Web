import baseAPI from "@/redux/api/api";

const boastAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getBoastList: build.query({
      query: (body) => ({
        url: "/boast/boast-list",
        method: "POST",
        body,
      }),
    }),

    createBoastPaymentIntent: build.mutation({
      query: (body) => ({
        url: "/payments/intent",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetBoastListQuery, useCreateBoastPaymentIntentMutation } =
  boastAPI;
export default boastAPI;
