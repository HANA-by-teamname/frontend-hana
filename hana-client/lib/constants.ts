const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

// constants.ts (리팩토링된 버전)
export const LOGIN_ENDPOINT = '/users/login';
export const SIGNUP_ENDPOINT = '/users/signup';
export const CHECK_NICKNAME_ENDPOINT = '/users/check-nickname';
export const USER_ME_ENDPOINT = '/users/me';
export const UPDATE_DATASOURCES_ENDPOINT = '/users/me/data_sources';
export const FACULTIES_ENDPOINT = '/faculties';
export const SEARCH_FEED_ENDPOINT = '/feeds/search';
