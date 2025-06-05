// lib/api.ts
export async function getMockFeed() {
  const res = await fetch('/mocks/feed.json');
  return res.json();
}

interface SearchRequest {
  keyword: string;
  faculty: string[];
  sort: '정확도순' | '최신순' | '인기순';
  token: string;
}

export async function searchFeeds({ keyword, faculty, sort, token }: SearchRequest) {
  const res = await fetch('http://localhost:4000/feeds/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      keyword,
      faculty,
      sort,
    }),
  });

  if (!res.ok) {
    throw new Error('검색 실패');
  }

  const data = await res.json();
  return data.feeds; // or data.result depending on backend
}

