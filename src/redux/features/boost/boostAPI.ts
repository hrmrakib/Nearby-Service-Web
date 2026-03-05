import baseAPI from "@/redux/api/api";

const boostAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getBoostList: build.query({
      query: (body) => ({
        url: "/boast/boast-list",
        method: "POST",
        body,
      }),
    }),

    createBoostPaymentIntent: build.mutation({
      query: (body) => ({
        url: "/payments/stripe-intent-boost",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetBoostListQuery, useCreateBoostPaymentIntentMutation } =
  boostAPI;
export default boostAPI;
