import baseAPI from "@/redux/api/api";

const saveAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    toggleSave: builder.mutation({
      query: (body) => ({
        url: "/save/save-toggle",
        method: "POST",
        body,
      }),
      //   invalidatesTags: ["Post"],
    }),
  }),
});

export const { useToggleSaveMutation } = saveAPI;
export default saveAPI;
