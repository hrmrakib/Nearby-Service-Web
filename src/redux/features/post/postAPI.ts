import baseAPI from "@/redux/api/api";

const postAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllPost: builder.query({
      query: ({
        category,
        subcategory,
        lat,
        lng,
        maxDistance,
        minPrice,
        maxPrice,
        date,
        search,
      }) => {
        const queryParams = new URLSearchParams();

        if (category) queryParams.append("category", category);
        if (subcategory) queryParams.append("subcategory", subcategory);
        if (lat && lng && maxDistance)
          queryParams.append("maxDistance", maxDistance.toString());
        if (minPrice) queryParams.append("minPrice", minPrice.toString());
        if (maxPrice) queryParams.append("maxPrice", maxPrice.toString());
        if (date) queryParams.append("date", date);
        if (search) queryParams.append("search", search);
        
        return {
          url: `/post/all-post?${queryParams.toString()}`,
          method: "GET",
        };
      },
    }),

    createEventPost: builder.mutation({
      query: (body) => ({
        url: "/post/event",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Post"],
    }),

    createDealPost: builder.mutation({
      query: (body) => ({
        url: "/post/deal",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Post"],
    }),

    createAlertPost: builder.mutation({
      query: (body) => ({
        url: "/post/alert/others",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Post"],
    }),

    createAlertMissingPersonPost: builder.mutation({
      query: (body) => ({
        url: "/post/alert/missing-person",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Post"],
    }),

    // ? service post api

    createServicePostForFoodAndBeverage: builder.mutation({
      query: (body) => ({
        url: "/post/service/food-beverage",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Post"],
    }),

    createServicePostForEntertainment: builder.mutation({
      query: (body) => ({
        url: "/post/service/entertainment",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Post"],
    }),

    createServicePostForPersonalHome: builder.mutation({
      query: (body) => ({
        url: "/post/service/home",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Post"],
    }),
    
    createServicePostForVenues: builder.mutation({
      query: (body) => ({
        url: "/post/service/venue",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const {
  useGetAllPostQuery,
  useCreateEventPostMutation,
  useCreateDealPostMutation,
  useCreateAlertPostMutation,
  useCreateAlertMissingPersonPostMutation,

  useCreateServicePostForFoodAndBeverageMutation,
  useCreateServicePostForEntertainmentMutation,
  useCreateServicePostForPersonalHomeMutation,
  useCreateServicePostForVenuesMutation,
} = postAPI;
export default postAPI;
