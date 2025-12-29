/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers) => {
    if (typeof window === "undefined") return headers;

    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const customBaseQuery: BaseQueryFn<
  FetchArgs | string,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  const isAuthError =
    result.error &&
    (result?.error?.status === 401 ||
      result?.error?.status === 402 ||
      result?.error?.status === 403);

  if (isAuthError) {
    const token = localStorage.getItem("accessToken");

    if (token) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }

    return result;

    // const refreshArgs: FetchArgs = {
    //   url: "/auth/refresh-token",
    //   method: "POST",
    //   credentials: "include",
    // };

    // const refreshResult = await baseQuery(refreshArgs, api, extraOptions);

    // if (refreshResult?.data) {
    //   const newAccessToken = (refreshResult?.data as any)?.accessToken;

    //   if (typeof window !== "undefined" && newAccessToken) {
    //     localStorage.setItem("accessToken", newAccessToken);
    //     await saveTokens(newAccessToken);
    //   }

    //   result = await baseQuery(args, api, extraOptions);

    //   return result;
    // }
  }

  return result;
};

export const baseAPI = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  tagTypes: ["Post"],
  endpoints: () => ({}),
});

export default baseAPI;

export type TList = {
  page?: number;
  limit?: number;
  search?: string;
};
