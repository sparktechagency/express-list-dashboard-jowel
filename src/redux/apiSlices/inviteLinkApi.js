import { api } from "../api/baseApi";


const inviteLinkApi = api.injectEndpoints({
  endpoints: (builder) => ({
    crateInviteLinks: builder.mutation({
      query: (data) => {
        return {
          url: '/invite-link/create',
          method: "POST",
            body: data,
        };
      },
    }),
    getInviteLinks: builder.query({
      query: () => {
        return {
          url: "/invite-link",
          method: "GET",
        };
      },
    }),
    UpdateInviteLinks: builder.mutation({
      query: ({id,data}) => {
        return {
          url: `/invite-link/update/${id}`,
          method: "PATCH",
            body: data,
        };
      },
    }),
    delete: builder.mutation({
      query: (id) => {
        return {
          url: `/invite-link/${id}`,
          method: "DELETE",

        };
      },
    }),
  }),
});

export const { 
    
useCrateInviteLinksMutation,
useGetInviteLinksQuery, 
useUpdateInviteLinksMutation, 
useDeleteMutation
} = inviteLinkApi;
