import { api } from "../api/baseApi";

const wholesalerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Create a wholesaler (POST)
    createWholesaler: builder.mutation({
      query: (data) => ({
        method: "POST",
        url: "/admin/users",
        body: data,
      }),
      invalidatesTags: ["Wholesalers"], // Refetch wholesalers after creation
    }),

    // Get all wholesalers (GET)
    getWholesalers: builder.query({
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
          url: "/wholesalers",
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
      providesTags: ["Wholesalers"],
    }),

    // Get a specific wholesaler by ID (GET)
    getWholesalerById: builder.query({
      query: (id) => ({
        method: "GET",
        url: `/wholesaler/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Wholesaler", id }],
    }),

    // Update a wholesaler (PATCH)
    updateWholesaler: builder.mutation({
      query: ({ id, data }) => ({
        method: "PATCH",
        url: `/admin/users/${id}`,
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Wholesaler", id },
        "Wholesalers",
      ],
    }),

    // Delete a wholesaler (DELETE)
    deleteWholesaler: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `/admin/users/${id}`,
      }),
      invalidatesTags: ["Wholesalers"],
    }),
  }),
});

export const {
  useCreateWholesalerMutation,
  useGetWholesalersQuery,
  useGetWholesalerByIdQuery,
  useUpdateWholesalerMutation,
  useDeleteWholesalerMutation,
} = wholesalerApi;
