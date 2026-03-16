import baseAPI from "@/redux/api/api";

const bookingAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getUpcomingBookings: build.query({
      query: () => ({
        url: "/offer/upcoming",
        method: "GET",
      }),
    }),

    getPastBookings: build.query({
      query: () => ({
        url: "/offer/past",
        method: "GET",
      }),
    }),

    createBooking: build.mutation({
      query: (body) => ({
        url: "/booking/create-booking",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetUpcomingBookingsQuery,
  useGetPastBookingsQuery,
  useCreateBookingMutation,
} = bookingAPI;
export default bookingAPI;
