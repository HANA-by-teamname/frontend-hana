'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '@/lib/api/auth';

interface SignupFormProps {
  presetEmail: string;
  provider: string | null;
}

export default function SignupForm({ presetEmail, provider }: SignupFormProps) {
  const router = useRouter();

  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [birthdate, setBirthdate] = useState('2002-11-09');
  const [school, setSchool] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState<'ko' | 'en' | 'zh' | 'ja' | 'vi'>('ko');
  const [password, setPassword] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [thirdPartyAgreed, setThirdPartyAgreed] = useState(false);
  const [error, setError] = useState('');

  const isSocial = !!provider;

  const canSubmit = !!(
    presetEmail &&
    (isSocial || password) &&
    nickname &&
    gender &&
    birthdate &&
    school &&
    nativeLanguage &&
    termsAgreed &&
    privacyAgreed
  );

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError('');

    const passwordToSend = isSocial
      ? `social-${provider}-${Date.now()}`
      : password;

    try {
      const result = await signup({
        email: presetEmail,
        password: passwordToSend,
        nickname,
        gender,
        birthdate,
        school,
        native_language: nativeLanguage,
        terms_agreement: termsAgreed,
        privacy_agreement: privacyAgreed,
        marketing_agreement: marketingAgreed,
        third_party_agreement: thirdPartyAgreed,
      });

      localStorage.setItem('token', result.token);
      router.push('/home');
    } catch (e: any) {
      setError(e.message || '회원가입에 실패했습니다.');
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col justify-center items-center font-pretendard px-5">
      <div className="w-full max-w-md">
        <h2 className="text font-bold text-center pt-8 mb-6 text">회원가입</h2>

        <div className="space-y-5">
          {/* 이메일 */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">이메일</label>
            <input
              type="email"
              value={presetEmail}
              readOnly
              className="w-full border-b py-2 text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
            />
          </div>

          {/* 비밀번호 */}
          {!isSocial && (
            <div>
              <label className="block text-xs text-gray-700 mb-1">비밀번호</label>
              <input
                type="password"
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b py-2 text-sm"
              />
            </div>
          )}

          {/* 이름 */}
          <div>
            <label className="block text-xs text-gray-700 mb-1">이름 (Name 또는 중국어로 이름)</label>
            <input
              placeholder="이름"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full border-b py-2 text-sm"
            />
          </div>

          {/* 성별 */}
          <div>
            <label className="block text-xs text-gray-700 mb-1">성별</label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`flex-1 py-2 border rounded ${gender === 'male' ? 'bg-gray-100' : ''}`}
              >
                남자
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`flex-1 py-2 border rounded ${gender === 'female' ? 'bg-gray-100' : ''}`}
              >
                여자
              </button>
            </div>
          </div>

          {/* 생년월일 */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">생년월일</label>
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full border-b py-2 text-sm"
            />
          </div>

          {/* 학교 */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">학교명</label>
            <input
              placeholder="학교"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full border-b py-2 text-sm"
            />
          </div>

          {/* 자국어 */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">자국어 (Native Language)</label>
            <select
              value={nativeLanguage}
              onChange={(e) => setNativeLanguage(e.target.value as any)}
              className="w-full border-b py-2 text-sm"
            >
              <option value="ko">한국어</option>
              <option value="en">영어</option>
              <option value="zh">중국어</option>
              <option value="ja">일본어</option>
              <option value="vi">베트남어</option>
            </select>
          </div>

          {/* 약관 동의 */}
          <div className="text-sm space-y-2 pt-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={termsAgreed} onChange={(e) => setTermsAgreed(e.target.checked)} />
              <span>[필수] 이용약관 동의</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={privacyAgreed} onChange={(e) => setPrivacyAgreed(e.target.checked)} />
              <span>[필수] 개인정보처리방침 동의</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={marketingAgreed} onChange={(e) => setMarketingAgreed(e.target.checked)} />
              <span>[선택] 마케팅 정보 수신 동의</span>
            </label>
            <label className="flex items-center space-x-2 pb-4">
              <input type="checkbox" checked={thirdPartyAgreed} onChange={(e) => setThirdPartyAgreed(e.target.checked)} />
              <span>[선택] 제3자 정보제공 동의</span>
            </label>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {/* 시작하기 버튼 */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full py-2 rounded-md font-semibold mt-4 transition ${
              canSubmit ? 'bg-sky-500 text-white' : 'bg-sky-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            시작하기
          </button>
        </div>
      </div>
    </main>
  );
}
