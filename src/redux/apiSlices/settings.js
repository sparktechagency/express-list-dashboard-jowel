import { api } from "../api/baseApi";


const contactUsApi = api.injectEndpoints({

  endpoints: (builder) => ({
    crateContactUs: builder.mutation({
      query: (data) => {
        return {
          url: '/about-us-contact-us-terms-and-conditions/contactUs',
          method: "POST",
            body: data,
        };
      },
    }),
    getContactUs: builder.query({
      query: () => {
        return {
          url: "/about-us-contact-us-terms-and-conditions/contactUs",
          method: "GET",
        };
      },
    }),
    updateContactUs: builder.mutation({

      query: ({id,data}) => {
        return {
          url: `/about-us-contact-us-terms-and-conditions/contactUs`,
          method: "PATCH",
            body: data,
        };
      },
    }),
  
  }),
});

export const { 
    useCrateContactUsMutation,
    useGetContactUsQuery, 
    useUpdateContactUsMutation, 
} = contactUsApi;