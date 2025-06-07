// lib/api/favorite.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const addFavorite = async (feed_id: string, token: string) => {
  const res = await fetch(`${BASE_URL}/favorites/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ feed_id }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error('좋아요 추가 실패');
  }
};

export const deleteFavorite = async (feed_id: string, token: string) => {
  const res = await fetch(`${BASE_URL}/favorites/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ feed_id }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error('좋아요 삭제 실패');
  }
};

export const getFavoriteList = async (token: string) => {
  const res = await fetch(`${BASE_URL}/favorites/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok || !data.feeds) {
    throw new Error('관심 목록 불러오기 실패');
  }

  return data.feeds.map((feed: any) => ({
    id: feed.feed_id,
    title: feed.title,
    category: feed.faculty,
    date: feed.date,
    liked: true,
    url: feed.link,
  }));
};
