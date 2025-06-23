import { api } from "../api/baseApi";


const overviewApi = api.injectEndpoints({
  endpoints: (builder) => ({
    cardStatic: builder.query({
      query: () => {
        return {
          url: '/dashboard-statistics',
          method: "GET",
        };
      },
    }),
    retailerLineCart: builder.query({
      query: () => {
        return {
          url: "/retailers/monthly",
          method: "GET",
        };
      },
    }),
    wholesalerLineChart: builder.query({
      query: () => {
        return {
          url: "/wholesalers/monthly",
          method: "GET",
        };
      },
    }),
    subscriberBarChart: builder.query({
      query: () => {
        return {
          url: "/flutter-wave-package/transactions",
          method: "GET",
        };
      },
    }),
  }),
});

export const { useCardStaticQuery, useRetailerLineCartQuery, useWholesalerLineChartQuery, useSubscriberBarChartQuery } = overviewApi;
