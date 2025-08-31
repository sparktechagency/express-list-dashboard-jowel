import { api } from "../api/baseApi";

const authSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    otpVerify: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/otp-verify",
          body: data,
        };
      },
    }),
    login: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/login",
          body: data,
        };
      },
      transformResponse: (data) => {
        return data;
      },
      transformErrorResponse: ({ data }) => {
        const { message } = data;
        return message;
      },
    }),
    forgotPassword: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/forgot-password",
          body: data,
        };
      },
    }),
    resetPassword: builder.mutation({
      query: (value) => {
        return {
          method: "POST",
          url: "/auth/reset-password",
          body: value,
        };
      },
    }),
    changePassword: builder.mutation({
      query: (data) => {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token not found in localStorage");
        }

        return {
          method: "POST",
          url: "/auth/change-password",
          body: data,
          headers: {
            Authorization: `Bearer ${token}`, // No JSON.parse() here if token is a plain JWT string
          },
        };
      },
    }),

    updateProfile: builder.mutation({
      query: (data) => {
        return {
          method: "PATCH",
          url: "/user/profile",
          body: data,
        };
      },
    }),

    getLoginuser: builder.query({
      query: (data) => {
        return {
          method: "GET",
          url: "/user/profile",
          body: data,
        };
      },
    }),
  }),
});

export const {
    useOtpVerifyMutation,
    useLoginMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
    useUpdateProfileMutation,
    useGetLoginuserQuery,
} = authSlice;
