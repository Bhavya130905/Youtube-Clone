import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_KEY = 'AIzaSyCL3c_DXOnPhpP44ayv7JCNdNF643ZhCR4';

export const youtubeApi = createApi({
  reducerPath: 'youtubeApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://www.googleapis.com/youtube/v3',
  }),
  endpoints: (builder) => ({
    searchVideos: builder.query({
      query: ({ query, language = 'en', relatedToVideoId }) => ({
        url: 'search',
        params: {
          part: 'snippet',
          type: 'video',
          maxResults: 10,
          key: API_KEY,
          relevanceLanguage: language,
          regionCode: language === 'hi' ? 'IN' : 'US',
          ...(query && { q: query }),
          ...(relatedToVideoId && { relatedToVideoId }),
        },
      }),
    }),
    videoDetails: builder.query({
      query: (videoId) => ({
        url: 'videos',
        params: {
          part: 'snippet,statistics,contentDetails',
          id: videoId,
          key: API_KEY,
        },
      }),
    }),
    channelDetails: builder.query({
      query: (channelId) => ({
        url: 'channels',
        params: {
          part: 'snippet,statistics',
          id: channelId,
          key: API_KEY,
        },
      }),
    }),
    comments: builder.query({
      query: (videoId) => ({
        url: 'commentThreads',
        params: {
          part: 'snippet',
          videoId,
          maxResults: 10,
          key: API_KEY,
          order: 'relevance',
        }
      })
    })
  })
})

export const { useSearchVideosQuery, useVideoDetailsQuery, useChannelDetailsQuery, useCommentsQuery} = youtubeApi;