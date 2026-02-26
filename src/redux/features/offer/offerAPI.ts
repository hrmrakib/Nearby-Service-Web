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

export const { useCreateOfferMutation, useGetAllOffersQuery } = offerAPI;
export default offerAPI;
