import { api } from "../api/baseApi";


const appleInviteLinkApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createAppleInviteLinks: builder.mutation({
      query: (data) => {
        return {
          url: '/applink-generated/create',
          method: "POST",
            body: data,
        };
      },
    }),
    getAppleInviteLinks: builder.query({
      query: () => {
        return {
          url: "/applink-generated/ios",
          method: "GET",
        };
      },
    }),
  
  }),
});

export const { 
    
  useCreateAppleInviteLinksMutation,
  useGetAppleInviteLinksQuery

} = appleInviteLinkApi;
