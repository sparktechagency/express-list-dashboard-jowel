import { api } from "../api/baseApi";


const aboutUsApi = api.injectEndpoints({


  endpoints: (builder) => ({
    createAboutUs: builder.mutation({
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
          url: `/about-us-contact-us-terms-and-conditions/aboutUs/${id}`,
          method: "PATCH",
            body: data,
        };
      },
    }),
  
  }),
});

export const { 
     useCreateAboutUsMutation,
    useGetAboutUsQuery, 
    useUpdateAboutUsMutation, 
} = aboutUsApi;