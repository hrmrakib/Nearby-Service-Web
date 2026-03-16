import baseAPI from "@/redux/api/api";

const clientBookingAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getCompletedBookings: builder.query({
      query: () => ({
        url: "/offer/completed",
        method: "GET",
      }),
    }),

    getInCompletingBookings: builder.query({
      query: () => ({
        url: "/offer/incompleted",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCompletedBookingsQuery, useGetInCompletingBookingsQuery } =
  clientBookingAPI;
export default clientBookingAPI;
