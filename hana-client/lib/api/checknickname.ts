export async function checkNickname(nickname: string): Promise<boolean> {
  const backendURL = process.env.NEXT_PUBLIC_API_URL!;
  const res = await fetch(`${backendURL}/users/check-nickname?nickname=${encodeURIComponent(nickname)}`);
  if (!res.ok) throw new Error('중복 확인 중 오류가 발생했습니다.');
  const data = await res.json();
  return data.exists;
}
