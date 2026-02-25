import baseAPI from "@/redux/api/api";

const momentsAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getMoments: builder.query({
      query: ({ id, params }) => ({
        url: `/post/moment/${id}/${params}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetMomentsQuery } = momentsAPI;

export default momentsAPI;
