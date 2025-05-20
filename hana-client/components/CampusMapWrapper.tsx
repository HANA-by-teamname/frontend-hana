'use client';

import dynamic from 'next/dynamic';

const CampusMap = dynamic(() => import('./CampusMap'), {
  ssr: false, // ❗️ 핵심: SSR 비활성화
  loading: () => <div>지도를 불러오는 중...</div>,
});

export default CampusMap;
