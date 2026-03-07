import baseAPI from "@/redux/api/api";

const communityGuidelineAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getCommunityGuidelines: builder.query({
      query: () => ({
        url: "/guidelines",
      }),
    }),
  }),
});

export const { useGetCommunityGuidelinesQuery } = communityGuidelineAPI;
export default communityGuidelineAPI;
