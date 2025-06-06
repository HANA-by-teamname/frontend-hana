export async function checkNickname(nickname: string): Promise<boolean> {
  const res = await fetch(`http://localhost:4000/users/check-nickname?nickname=${encodeURIComponent(nickname)}`);
  if (!res.ok) throw new Error('중복 확인 중 오류가 발생했습니다.');
  const data = await res.json();
  return data.exists;
}
