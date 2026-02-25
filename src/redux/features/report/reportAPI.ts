import baseAPI from "@/redux/api/api";

const reportAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    createReport: build.mutation({
      query: (body) => ({
        url: "/report/create-report",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateReportMutation } = reportAPI;
export default reportAPI;
