import { api } from "../api/baseApi";


const aboutUsApi = api.injectEndpoints({


  endpoints: (builder) => ({
    crateAboutUs: builder.mutation({
      query: (data) => {
        return {
          url: '/about-us-contact-us-terms-and-conditions/aboutUs',
          method: "POST",
            body: data,
        };
      },
    }),
    getAboutUs: builder.query({
      query: () => {
        return {
          url: "/about-us-contact-us-terms-and-conditions/aboutUs",
          method: "GET",
        };
      },
    }),
    updateAboutUs: builder.mutation({

      query: ({id,data}) => {
        return {
          url: `/about-us-contact-us-terms-and-conditions/aboutUs`,
          method: "PATCH",
            body: data,
        };
      },
    }),
  
  }),
});

export const { 
    useCrateAboutUsMutation,
    useGetAboutUsQuery, 
    useUpdateAboutUsMutation, 

} = aboutUsApi;