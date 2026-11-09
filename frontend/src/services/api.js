import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ENDPOINTS } from '../constants/apiEndpoints';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: 'include',
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  endpoints: (builder) => ({
    health: builder.query({
      query: () => ({
        url: ENDPOINTS.HEALTH,
        method: 'GET',
      }),
    }),

    googleAuth: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.GOOGLE_AUTH,
        method: 'POST',
        body,
      }),
    }),

    getMe: builder.query({
      query: () => ({
        url: ENDPOINTS.ME,
        method: 'GET',
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: ENDPOINTS.LOGOUT,
        method: 'POST',
      }),
    }),

    purchase: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.PURCHASE,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['INVESTMENT_DETAILS', 'INVESTMENT_PERFORMANCE'],
    }),

    sell: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.SELL,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['INVESTMENT_DETAILS', 'INVESTMENT_PERFORMANCE'],
    }),

    setCustomSellingPrice: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.SET_CUSTOM_SELLING_PRICE,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['INVESTMENT_DETAILS', 'SELLING_PRICE_PERFORMANCE'],
    }),

    getDetails: builder.query({
      query: ({ sellPriceOverride }) => ({
        url: ENDPOINTS.GET_DETAILS,
        method: 'GET',
        params: { sellPriceOverride },
      }),
      providesTags: ['INVESTMENT_DETAILS'],
    }),

    getPerformance: builder.query({
      query: ({ sellPriceOverride }) => ({
        url: ENDPOINTS.GET_PERFORMANCE,
        method: 'GET',
        params: { sellPriceOverride },
      }),
      providesTags: ['INVESTMENT_PERFORMANCE'],
    }),

    getSellingPricePerformance: builder.query({
      query: ({ scope } = {}) => ({
        url: ENDPOINTS.GET_SELLING_PRICE_PERFORMANCE,
        method: 'GET',
        params: { scope },
      }),
      providesTags: ['SELLING_PRICE_PERFORMANCE'],
    }),
  }),
});

export const {
  useHealthQuery,
  useGoogleAuthMutation,
  useGetMeQuery,
  useLogoutMutation,
  usePurchaseMutation,
  useSellMutation,
  useSetCustomSellingPriceMutation,
  useGetDetailsQuery,
  useGetPerformanceQuery,
  useGetSellingPricePerformanceQuery,
} = api;
