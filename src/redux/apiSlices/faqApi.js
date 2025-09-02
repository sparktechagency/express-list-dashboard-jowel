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
          url: "/faq/all",
          method: "GET",
        };
      },
    }),
    updateFaq: builder.mutation({


      query: ({id,data}) => {
        return {
          url: `/faq/update/${id}`,

          method: "PATCH",
            body: data,
        };
      },
    }),

    deleteFaq: builder.mutation({
      query: (id) => ({
        url: `/faq/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Faq'],
    }),

  
  }),
});

export const { 
    useCreateFaqMutation,
    useGetFaqQuery,
    useUpdateFaqMutation,
    useDeleteFaqMutation,


} = faqApi;

