import baseAPI from "@/redux/api/api";

const bookingAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getUpcomingBookings: build.query({
      query: () => ({
        url: "/bookings/upcoming",
        method: "GET",
      }),
    }),

    getPastBookings: build.query({
      query: () => ({
        url: "/bookings/past",
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
