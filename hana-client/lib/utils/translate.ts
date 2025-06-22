const translations: Record<string, Record<string, string>> = {
  '학사일정': {
    en: 'Academic Schedule', 
    ja: '学事日程', 
    zh: '学事日程', 
    vi: 'Lịch học tập',
  },
  '우리학교 지도': {
    en: 'Campus Map', 
    ja: 'キャンパスマップ', 
    zh: '校园地图', 
    vi: 'Bản đồ trường',
  },
  
  '오늘 강의': {
    en: "Today's Classes", ja: '今日の授業', zh: '今日课程', vi: 'Lớp học hôm nay',
  },
  '오늘 수업이 없어요.': {
    en: 'No classes today.', ja: '今日は授業がありません。', zh: '今天没有课程。', vi: 'Hôm nay không có lớp.',
  },
  '오늘의 학식': {
    en: "Today's Meals", ja: '本日の学食', zh: '今日食堂', vi: 'Bữa ăn hôm nay',
  },
  '교수님': {
    en: 'Professor', ja: '教授', zh: '教授', vi: 'Giáo sư',
  },
  '310관 지하식당 점심': {
    en: 'Bldg. 310 Basement Cafeteria - Lunch', ja: '310館 地下食堂 昼食', zh: '310号馆 地下食堂 午餐', vi: 'Nhà ăn tầng hầm tòa 310 - Bữa trưa',
  },
  '303관 학생회관 점심': {
    en: 'Bldg. 303 Student Center - Lunch', ja: '303館 学生会館 昼食', zh: '303号馆 学生会馆 午餐', vi: 'Nhà ăn hội sinh viên tòa 303 - Bữa trưa',
  },
  '김치찌개': {
    en: 'Kimchi stew', ja: 'キムチチゲ', zh: '泡菜锅', vi: 'Canh kim chi',
  },
  '순두부찌개': {
    en: 'Soft tofu stew', ja: '純豆腐チゲ', zh: '嫩豆腐汤', vi: 'Canh đậu hũ non',
  },
  '치킨가스': {
    en: 'Chicken cutlet', ja: 'チキンカツ', zh: '炸鸡排', vi: 'Gà chiên xù',
  },
  '기름떡볶이': {
    en: 'Oil-based tteokbokki', ja: '油トッポッキ', zh: '油炒年糕', vi: 'Tteokbokki xào dầu',
  },
  '두부무침': {
    en: 'Seasoned tofu', ja: '豆腐の和え物', zh: '拌豆腐', vi: 'Đậu phụ trộn',
  },
  '잡채': {
    en: 'Japchae (glass noodles)', ja: 'チャプチェ', zh: '杂菜粉丝', vi: 'Miến trộn Hàn Quốc',
  },
  '돈까스': {
    en: 'Pork cutlet', ja: 'トンカツ', zh: '炸猪排', vi: 'Thịt heo chiên xù',
  },
  '계란말이': {
    en: 'Rolled omelette', ja: '卵焼き', zh: '煎蛋卷', vi: 'Trứng cuộn',
  },
  '된장국': {
    en: 'Soybean paste soup', ja: '味噌汁', zh: '大酱汤', vi: 'Canh tương đậu',
  },
  '샐러드': {
    en: 'Salad', ja: 'サラダ', zh: '沙拉', vi: 'Salad',
  },
  '단무지': {
    en: 'Pickled radish', ja: 'たくあん', zh: '腌黄萝卜', vi: 'Củ cải muối',
  },
};

export function t(text: string, lang: string, fallback = 'ko'): string {
  if (lang === fallback) return text;
  return translations[text]?.[lang] || text;
}
