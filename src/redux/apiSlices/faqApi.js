import { api } from "../api/baseApi";



const faqApi = api.injectEndpoints({


  endpoints: (builder) => ({
    createFaq: builder.mutation({

      query: (data) => {
        return {
          url: '/faq/create',
          method: "POST",
            body: data,
        };
      },
    }),
    getFaq: builder.query({

      query: () => {
        return {
          url: "/faq/create",
          method: "GET",
        };
      },
    }),
    updateFaq: builder.mutation({


      query: ({id,data}) => {
        return {
          url: `/faq/create`,
          method: "PATCH",
            body: data,
        };
      },
    }),
  
  }),
});

export const { 
    useCreateFaqMutation,
    useGetFaqQuery,
    useUpdateFaqMutation,

} = faqApi;

