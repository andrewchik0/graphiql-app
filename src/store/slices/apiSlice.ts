import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = 'https://countries.trevorblades.com';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),
  endpoints(builder) {
    return {
      fetchResult: builder.query({
        query: ({ queryString, variables = {} }) => ({
          url: '/',
          method: 'POST',

          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            query: queryString,
            variables,
          }),
        }),
      }),
    };
  },
});

export const { useFetchResultQuery, useLazyFetchResultQuery } = apiSlice;
