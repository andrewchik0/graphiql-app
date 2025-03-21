import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = 'https://countries.trevorblades.com';

export interface IQuery {
  queryString: string;
  variables: object;
  headers: object;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),
  endpoints(builder) {
    return {
      fetchResult: builder.query({
        query: (query: IQuery) => ({
          url: '/',
          method: 'POST',

          headers: {
            ...query.headers,
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            query: query.queryString,
            variables: query.variables,
          }),
        }),
      }),
    };
  },
});

export const { useFetchResultQuery, useLazyFetchResultQuery } = apiSlice;
