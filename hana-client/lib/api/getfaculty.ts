import { FACULTIES_ENDPOINT } from '@/lib/constants';

export async function getFaculties(): Promise<string[]> {
  try {
    const res = await fetch(FACULTIES_ENDPOINT);
    if (!res.ok) {
      throw new Error('Failed to fetch faculty list');
    }

    const data = await res.json();
    return data.faculties;
  } catch (error) {
    console.error('[getFaculties] Error:', error);
    return [];
  }
}
