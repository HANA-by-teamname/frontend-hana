'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '@/lib/api/auth';
import { getFaculties } from '@/lib/api/getfaculty';
import { checkNickname } from '@/lib/api/checknickname';

interface SignupFormProps {
  presetEmail: string;
  provider: string | null;
}

export default function SignupForm({ presetEmail, provider }: SignupFormProps) {
  const router = useRouter();

  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(null);
  const [nicknameCheckLoading, setNicknameCheckLoading] = useState(false);
  const [nicknameError, setNicknameError] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [birthdate, setBirthdate] = useState('2002-11-09');
  const [faculties, setFaculties] = useState<string[]>([]);
  const [faculty, setFaculty] = useState('');
  const [selectedDataSources, setSelectedDataSources] = useState<string[]>([]);
  const [allDataSourcesSelected, setAllDataSourcesSelected] = useState(false);
  const [nativeLanguage, setNativeLanguage] = useState<'ko' | 'en' | 'zh' | 'ja' | 'vi'>('ko');
  const [password, setPassword] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [thirdPartyAgreed, setThirdPartyAgreed] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = !!(
    presetEmail &&
    password &&
    name &&
    nickname &&
    nicknameAvailable === true &&
    gender &&
    birthdate &&
    faculty &&
    selectedDataSources.length > 0 &&
    nativeLanguage &&
    termsAgreed &&
    privacyAgreed
  );

  useEffect(() => {
    getFaculties().then(setFaculties);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!nickname) {
        setNicknameAvailable(null);
        return;
      }
      try {
        setNicknameCheckLoading(true);
        const exists = await checkNickname(nickname);
        setNicknameAvailable(!exists);
        setNicknameError(exists ? '이미 사용 중인 닉네임입니다.' : '');
      } catch {
        setNicknameAvailable(null);
        setNicknameError('중복 확인 중 오류가 발생했습니다.');
      } finally {
        setNicknameCheckLoading(false);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [nickname]);

  useEffect(() => {
    if (selectAll) {
      setTermsAgreed(true);
      setPrivacyAgreed(true);
      setMarketingAgreed(true);
      setThirdPartyAgreed(true);
    } else {
      setTermsAgreed(false);
      setPrivacyAgreed(false);
      setMarketingAgreed(false);
      setThirdPartyAgreed(false);
    }
  }, [selectAll]);

  const toggleDataSource = (f: string) => {
    if (selectedDataSources.includes(f)) {
      const updated = selectedDataSources.filter(item => item !== f);
      setSelectedDataSources(updated);
      setAllDataSourcesSelected(false);
    } else {
      const updated = [...selectedDataSources, f];
      setSelectedDataSources(updated);
      if (updated.length === faculties.length) setAllDataSourcesSelected(true);
    }
  };

  const toggleAllDataSources = () => {
    if (allDataSourcesSelected) {
      setSelectedDataSources([]);
      setAllDataSourcesSelected(false);
    } else {
      setSelectedDataSources([...faculties]);
      setAllDataSourcesSelected(true);
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError('');

    const passwordToSend = password;

    try {
      const result = await signup({
        email: presetEmail,
        password: passwordToSend,
        name,
        nickname,
        gender,
        birthdate,
        faculty,
        data_sources: selectedDataSources,
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
        <h2 className="text font-bold text-center pt-8 mb-6">회원가입</h2>

        <div className="space-y-5">
          <div>
            <label className="block text-xs py-1 text-gray-500 mb-1">이메일</label>
            <input
              type="email"
              value={presetEmail}
              readOnly
              className="w-full border-b py-2 text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs py-1 text-gray-700 mb-1">비밀번호 / Password / 密码</label>
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs py-1 text-gray-700 mb-1">이름 / Name / 姓名</label>
            <input
              placeholder="ex. 홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-b py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs py-1 text-gray-700 mb-1">닉네임 / Nickname / 昵称</label>
            <input
              placeholder="ex. honggildong"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full border-b py-2 text-sm"
            />
            {nicknameCheckLoading && <p className="text-xs text-gray-400">확인 중...</p>}
            {nicknameError && <p className="text-xs text-red-500">{nicknameError}</p>}
            {nicknameAvailable === true && <p className="text-xs text-green-500">사용 가능한 닉네임입니다.</p>}
          </div>

          <div>
            <label className="block text-xs py-1 text-gray-700 mb-1">성별 / Gender / 性别</label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`flex-1 py-2 text-s border rounded transition ${gender === 'male' ? 'bg-gray-100' : ''}`}
              >
                남자 / Male / 男
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`flex-1 py-2 text-s border rounded transition ${gender === 'female' ? 'bg-gray-100' : ''}`}
              >
                여자 / Female / 女
              </button>
            </div>
          </div>

          <div>
            <label className="block py-1 text-xs text-gray-500 mb-1">생년월일 / Birthdate / 出生日期</label>
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full border-b py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs py-1 text-gray-700 mb-1">학부 / Faculty</label>
            <input
              type="text"
              placeholder="ex. 소프트웨어학부"
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              className="w-full border-b py-2 text-sm"
            />
          </div>

          <div>
            <label className="block py-1 text-xs text-gray-500 mb-1"> 관심 정보 조회 / Select Data Sources</label>
            <div className="flex flex-wrap gap-2 mb-2">
              <button
                type="button"
                onClick={toggleAllDataSources}
                className={`px-3 py-1 rounded border text-sm transition ${
                  allDataSourcesSelected ? 'bg-gray-200 font-semibold' : 'bg-white'
                }`}
              >
                전체 선택 / Select All / 全选
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {faculties.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleDataSource(f)}
                  className={`px-3 py-1 rounded border text-sm transition ${
                    selectedDataSources.includes(f) ? 'bg-gray-200 font-semibold' : 'bg-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs py-1 text-gray-500 mb-1">자국어 / Native Language / 母语</label>
            <select
              value={nativeLanguage}
              onChange={(e) => setNativeLanguage(e.target.value as any)}
              className="w-full border-b py-2 text-sm"
            >
              <option value="ko">한국어 / Korean / 韩语</option>
              <option value="en">영어 / English / 英语</option>
              <option value="zh">중국어 / Chinese / 中文</option>
              <option value="ja">일본어 / Japanese / 日语</option>
              <option value="vi">베트남어 / Vietnamese / 越南语</option>
            </select>
          </div>

          <div className="text-sm py-1 pt-3">
            <label className="block text-xs text-black py-1 mb-1">약관 동의 / Terms Agreement / 同意条款</label>
            <span className="block text-xs text-gray-400 mb-2 cursor-pointer">약관 보러가기 &gt;</span>
            <label className="flex items-center space-x-3 mb-2">
              <input type="checkbox" checked={selectAll} onChange={(e) => setSelectAll(e.target.checked)} />
              <span className="text-s text-blue-900">전체 선택 / Select All / 全选</span>
            </label>
            <hr className="my-2 border-gray-200" />
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input type="checkbox" checked={termsAgreed} onChange={(e) => setTermsAgreed(e.target.checked)} />
                <span>[필수] 이용약관 동의 / Agree to Terms / 同意使用条款</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" checked={privacyAgreed} onChange={(e) => setPrivacyAgreed(e.target.checked)} />
                <span>[필수] 개인정보 동의 / Privacy Policy / 隐私政策</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" checked={marketingAgreed} onChange={(e) => setMarketingAgreed(e.target.checked)} />
                <span>[선택] 마케팅 동의 / Marketing Info / 营销信息</span>
              </label>
              <label className="flex items-center space-x-3 pb-4">
                <input type="checkbox" checked={thirdPartyAgreed} onChange={(e) => setThirdPartyAgreed(e.target.checked)} />
                <span>[선택] 제3자 정보제공 동의 / Third Party / 第三方信息</span>
              </label>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

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