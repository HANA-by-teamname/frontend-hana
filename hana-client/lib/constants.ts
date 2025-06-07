export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export const LOGIN_ENDPOINT = `${BASE_URL}/auth/login`;
export const SIGNUP_ENDPOINT = `${BASE_URL}/auth/signup`;
export const CHECK_NICKNAME_ENDPOINT = `${BASE_URL}/users/check-nickname`;
export const USER_ME_ENDPOINT = `${BASE_URL}/users/me`;
export const UPDATE_DATASOURCES_ENDPOINT = `${BASE_URL}/users/me/data_sources`;
export const FACULTIES_ENDPOINT = `${BASE_URL}/faculties`;
export const SEARCH_FEED_ENDPOINT = `${BASE_URL}/feeds/search`;
