// lib/api.ts
export async function getMockFeed() {
  const res = await fetch('/mocks/feed.json');
  return res.json();
}
