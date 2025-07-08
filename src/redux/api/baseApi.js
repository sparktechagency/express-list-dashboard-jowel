import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.10.7.46:5006/api/v1",
    prepareHeaders: (headers) => {
      headers.set("ngrok-skip-browser-warning", "true");
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
export const imageUrl = "http://10.10.7.46:5006";