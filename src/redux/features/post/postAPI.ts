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
  }),
});

export const { useGetAllPostQuery } = postAPI;
export default postAPI;
