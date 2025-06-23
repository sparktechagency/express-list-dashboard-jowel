import { api } from "../api/baseApi";

const subsriberApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubscriber: builder.query({
      query: (params = {}) => {
        const {
          page = 1,
          limit = 12,
          name = "",
          email = "",
          businessName = "",
          phone = "",
        } = params;

        return {
          method: "GET",
          url: "/flutter-wave-package/total-user-subscription",
          params: {
            page,
            limit,
            name,
            email,
            businessName,
            phone,
          },
        };
      },
      invalidatesTags: ["Subscriber"],
    }),
  }),
});

export const { useGetAllSubscriberQuery } = subsriberApi;
