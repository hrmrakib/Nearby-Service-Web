import baseAPI from "@/redux/api/api";

const offerAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    createOffer: builder.mutation({
      query: (body) => ({
        url: "/offer",
        method: "POST",
        body,
      }),
    }),

    acceptOffer: builder.mutation({
      query: (body) => ({
        url: `/offer/complete`,
        method: "POST",
        body,
      }),
    }),

    rejectOffer: builder.mutation({
      query: (body) => ({
        url: `/offer/reject`,
        method: "POST",
        body,
      }),
    }),

    getAllOffers: builder.query({
      query: ({ page, limit, search }) => {
        const queryParams = new URLSearchParams();
        if (page) queryParams.set("page", page.toString());
        if (limit) queryParams.set("limit", limit.toString());
        if (search) queryParams.set("search", search);

        return {
          url: `/offer?${queryParams.toString()}`,
        };
      },
    }),
  }),
});

export const {
  useCreateOfferMutation,
  useAcceptOfferMutation,
  useRejectOfferMutation,
  useGetAllOffersQuery,
} = offerAPI;
export default offerAPI;
