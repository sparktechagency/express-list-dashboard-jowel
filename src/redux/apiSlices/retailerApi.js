import { api } from "../api/baseApi";

const retailerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Create a retailer (POST)
    createRetailer: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/admin/users",
        body: data,
      }),
      invalidatesTags: ["Retailers"], // Refetch retailers after creation
    }),

    // Get all retailers (GET)
    getRetailers: builder.query({
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
          url: "/retailers",
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
      providesTags: ["Retailers"],
    }),

    // Get a specific retailer by ID (GET)
    getRetailerById: builder.query({
      query: (id) => ({
        method: "GET",
        url: `/retailer/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Retailer", id }],
    }),

    // Update a retailer (PATCH)
    updateRetailer: builder.mutation({
      query: ({ id, data }) => ({
        method: "PATCH",
        url: `/admin/users/${id}`,
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Retailer", id },
        "Retailers",
      ],
    }),

    // Delete a retailer (DELETE)
    deleteRetailer: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `/retailers/${id}`,
      }),
      invalidatesTags: ["Retailers"], // Refetch retailer list after deletion
    }),
  }),
});

export const {
  useCreateRetailerMutation,
  useGetRetailersQuery,
  useGetRetailerByIdQuery,
  useUpdateRetailerMutation,
  useDeleteRetailerMutation,
} = retailerApi;
