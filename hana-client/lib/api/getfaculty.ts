// lib/api/getfaculty.ts

export async function getFaculties(): Promise<string[]> {
  try {
    const res = await fetch('http://localhost:4000/faculties');
    if (!res.ok) {
      throw new Error('Failed to fetch faculty list');
    }

    const data = await res.json();
    return data.faculties; // ← 서버에서 { faculties: ['소프트웨어학부', '경영학부', ...] } 형태로 응답
  } catch (error) {
    console.error('[getFaculties] Error:', error);
    return [];
  }
}
