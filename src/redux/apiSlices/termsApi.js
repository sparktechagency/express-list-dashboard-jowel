import { api } from "../api/baseApi";

const termsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createTerms: builder.mutation({
      query: (data) => ({
        url: '/about-us-contact-us-terms-and-conditions/termsAndConditions',
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Terms'],
    }),
    
    getTerms: builder.query({
      query: () => ({
        url: "/about-us-contact-us-terms-and-conditions/termsAndConditions",
        method: "GET",
      }),
      providesTags: ['Terms'],
    }),
    
    updateTerms: builder.mutation({
      query: (data) => ({
        url: `/about-us-contact-us-terms-and-conditions/termsAndConditions`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ['Terms'],
    }),
  }),
});

export const {
  useCreateTermsMutation, // Fixed typo: was "useCrateTermsMutation"
  useGetTermsQuery,
  useUpdateTermsMutation,
} = termsApi;