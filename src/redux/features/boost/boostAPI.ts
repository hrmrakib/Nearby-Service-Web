import baseAPI from "@/redux/api/api";

const boostAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getBoostedList: build.query({
      query: () => ({
        url: "/post/boosted",
        method: "GET",
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

export const { useGetBoostedListQuery, useCreateBoostPaymentIntentMutation } =
  boostAPI;
export default boostAPI;
