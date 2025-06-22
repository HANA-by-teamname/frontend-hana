// lib/api/getfaculty.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function getFaculties(): Promise<string[]> {
  try {
    const res = await fetch(`${BASE_URL}/faculties`);
    if (!res.ok) {
      throw new Error('Failed to fetch faculty list');
    }

    const data = await res.json();
    return data.faculties; // ← 서버에서 { faculties: [...] } 형태로 응답
  } catch (error) {
    console.error('[getFaculties] Error:', error);
    return [];
  }
}