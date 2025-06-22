'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { t } from '@/lib/utils/translate';
import forworkList from '@/lib/data/forworkList'; // JSON 말고 ts로 바꾸는 게 좋음

interface ForWorkSectionProps {
  nativeLanguage: string;
  translateOn: boolean;
}

export default function ForWorkSection({ nativeLanguage, translateOn }: ForWorkSectionProps) {
  const [jobs, setJobs] = useState(forworkList); // 이미 배열이라 slice 사용 가능

  useEffect(() => {
    setJobs(forworkList);
  }, [translateOn, nativeLanguage]);

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold mb-3 text-gray-700 flex items-center gap-2 justify-between">
  <span className="flex items-center gap-2">
    <Image src="/images/Forwork.svg" alt="forwork icon" width={20} height={20} />
    {translateOn ? t('한국에서 취업하기', nativeLanguage) : '한국에서 취업하기'}
  </span>

  <Link
    href="https://forwork-xi.vercel.app/"
    target="_blank"
    className="text-[11px] text-gray-400 underline whitespace-nowrap hover:text-gray-500 transition"
  >
    {translateOn
      ? t('더 많은 채용 정보가 궁금하다면?', nativeLanguage)
      : '더 많은 채용 정보가 궁금하다면?'} →
  </Link>
</h3>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {jobs.slice(0, 5).map((job, i) => (
          <Link href={job.link} key={i} target="_blank">
            <div className="flex-shrink-0 w-[200px] rounded-xl overflow-hidden bg-white shadow border">
              <Image
                src={job.image.startsWith('/') ? job.image : `/${job.image}`}
                alt={job.title[nativeLanguage] || job.title.ko}
                width={200}
                height={120}
                className="w-full h-[120px] object-cover"
              />
              <div className="p-3 text-sm space-y-1">
                <p className="font-semibold text-gray-800">
                  {job.title[nativeLanguage] || job.title.ko}
                </p>
                <p className="text-xs text-gray-500">{job.company}</p>
                <p className="text-xs text-gray-700">
                  {job.description[nativeLanguage] || job.description.ko}
                </p>
                <p className="text-xs text-right text-gray-400 mt-1">{job.date}</p>
              </div>
            </div>
          </Link>
        ))}

        {/* 마지막 항목: 더보기 */}
        <Link href="https://forwork-xi.vercel.app/" target="_blank">
          <div className="flex-shrink-0 w-[200px] h-[180px] rounded-xl border border-gray-300 bg-gray-100 flex flex-col justify-center items-center text-sm text-gray-600">
            <Image
              src="/icons/Categories.svg"
              alt="더보기"
              width={36}
              height={36}
              className="mb-2"
            />
            {translateOn ? t('더보기...', nativeLanguage) : '더보기...'}
          </div>
        </Link>
      </div>
    </section>
  );
}
