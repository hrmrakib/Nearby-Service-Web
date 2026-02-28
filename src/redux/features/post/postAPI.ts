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
        page,
        limit,
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
        if (page) queryParams.append("page", page.toString());
        if (limit) queryParams.append("limit", limit.toString());

        return {
          url: `/post/all-post?${queryParams.toString()}`,
          method: "GET",
        };
      },
    }),

    getPostDetailById: builder.query({
      query: (id) => ({
        url: `/post/relevant/${id}`,
        method: "GET",
      }),
      providesTags: ["Post"],
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

    myProvidedServices: builder.query({
      query: ({ page, limit }) => ({
        url: `/post/my-service?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),

    attendEvent: builder.mutation({
      query: (postId) => ({
        url: `/post/event/join/${postId}`,
        method: "POST",
      }),
      invalidatesTags: ["Post"],
    }),

    myJoinedEvents: builder.query({
      query: ({ page, limit }) => ({
        url: `/post/my-join-event?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),

    userJoinedEvents: builder.query({
      query: ({ eventId, page, limit }) => ({
        url: `/post/user-join-event/${eventId}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllPostQuery,
  useGetPostDetailByIdQuery,
  useCreateEventPostMutation,
  useCreateDealPostMutation,
  useCreateAlertPostMutation,
  useCreateAlertMissingPersonPostMutation,

  useCreateServicePostForFoodAndBeverageMutation,
  useCreateServicePostForEntertainmentMutation,
  useCreateServicePostForPersonalHomeMutation,
  useCreateServicePostForVenuesMutation,

  useMyProvidedServicesQuery,

  useAttendEventMutation,
  useMyJoinedEventsQuery,
  useUserJoinedEventsQuery,
} = postAPI;
export default postAPI;
