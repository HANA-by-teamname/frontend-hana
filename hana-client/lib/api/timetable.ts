// lib/api/timetable.ts

export interface Subject {
  name: string;
  day: string;
  start_time: string;
  end_time: string;
  professor?: string;
  location?: string;
}

// lib/api/timetable.ts

export async function deleteTimetable(subject: {
  name: string;
  day: string;
  start_time: string;
}) {
  const res = await fetch('/timetable/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`
    },
    body: JSON.stringify({
      subject: subject.name,
      day: subject.day,
      start_time: subject.start_time,
    })
  });

  if (!res.ok) {
    throw new Error('시간표 삭제에 실패했습니다.');
  }
  return res.json();
}
