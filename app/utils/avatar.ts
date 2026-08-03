export interface CharacterInfo {
  id: string
  num: number
  name: string
  title: string
  category: 'novice' | 'pixel_rpg' | 'heroes' | 'beasts' | 'cyber' | 'cosmic'
  emoji: string
  color: string
  bgGradient: string
  description: string
  image: string
  classId?: 'archer' | 'mage' | 'swordsman' | 'warrior'
  className?: string
  tier?: 1 | 2 | 3 | 4
  tierName?: string
  isNovice?: boolean
}

export const CHARACTER_CATEGORIES = [
  { id: 'all', label: '🔥 全部角色' },
  { id: 'novice', label: '🌱 初學者選單 (4大職業)' },
  { id: 'pixel_rpg', label: '👾 像素職業進階 (16種型態)' },
  { id: 'heroes', label: '⚔️ 英雄傳奇' },
  { id: 'beasts', label: '🐾 靈獸神寵' },
  { id: 'cyber', label: '🤖 賽博科幻' },
  { id: 'cosmic', label: '🌌 宇宙星空' },
] as const

/**
  4大職業初學者角色 (使用者加入遊戲時可選擇)
 */
export const NOVICE_CHARACTERS: CharacterInfo[] = [
  {
    id: 'archer-1',
    num: 101,
    name: '初階弓手',
    title: 'Novice Archer',
    category: 'novice',
    emoji: '🏹',
    color: '#10B981',
    bgGradient: 'from-emerald-600/30 to-teal-600/30',
    description: '身手敏捷的初階弓箭手，攜帶皮甲與短弓，充滿準確度與探險潛力。',
    image: '/avatars/archer-1.png',
    classId: 'archer',
    className: '弓箭手',
    tier: 1,
    tierName: '初學者',
    isNovice: true,
  },
  {
    id: 'mage-1',
    num: 102,
    name: '見習法師',
    title: 'Apprentice Mage',
    category: 'novice',
    emoji: '🧙‍♂️',
    color: '#3B82F6',
    bgGradient: 'from-blue-600/30 to-indigo-600/30',
    description: '戴著魔法尖帽的新手法師，手持木質魔杖，剛開始探索奧秘元素魔法。',
    image: '/avatars/mage-1.png',
    classId: 'mage',
    className: '法師',
    tier: 1,
    tierName: '初學者',
    isNovice: true,
  },
  {
    id: 'swordsman-1',
    num: 103,
    name: '實習劍士',
    title: 'Trainee Swordsman',
    category: 'novice',
    emoji: '🗡️',
    color: '#EAB308',
    bgGradient: 'from-yellow-500/30 to-amber-600/30',
    description: '熱情奔放的新手劍士，手持單手鐵劍與輕便胸甲，立志成為近戰劍神。',
    image: '/avatars/swordsman-1.png',
    classId: 'swordsman',
    className: '劍士',
    tier: 1,
    tierName: '初學者',
    isNovice: true,
  },
  {
    id: 'warrior-1',
    num: 104,
    name: '新手戰士',
    title: 'Novice Warrior',
    category: 'novice',
    emoji: '🪓',
    color: '#F97316',
    bgGradient: 'from-orange-600/30 to-red-600/30',
    description: '勇猛堅韌的部落新手戰士，手持小手斧與圓木盾，前線衝鋒無所畏懼。',
    image: '/avatars/warrior-1.png',
    classId: 'warrior',
    className: '戰士',
    tier: 1,
    tierName: '初學者',
    isNovice: true,
  },
]

/**
 * 像素四大職業 16 種進階型態完整清單
 */
export const PIXEL_RPG_CHARACTERS: CharacterInfo[] = [
  // 🏹 弓箭手系列 (Archer)
  NOVICE_CHARACTERS[0],
  {
    id: 'archer-2',
    num: 105,
    name: '精銳獵手',
    title: 'Elite Marksman',
    category: 'pixel_rpg',
    emoji: '🎯',
    color: '#059669',
    bgGradient: 'from-emerald-500/30 to-green-700/30',
    description: '精通長弓與森林匿蹤的游俠，箭無虛發，精準穿透遠方目標。',
    image: '/avatars/archer-2.png',
    classId: 'archer',
    className: '弓箭手',
    tier: 2,
    tierName: '進階型態',
  },
  {
    id: 'archer-3',
    num: 106,
    name: '風暴游俠',
    title: 'Storm Ranger',
    category: 'pixel_rpg',
    emoji: '⚡',
    color: '#06B6D4',
    bgGradient: 'from-cyan-500/30 to-teal-600/30',
    description: '掌握疾風與雷光射速的強大游俠，能於瞬息之間發射狂暴箭雨。',
    image: '/avatars/archer-3.png',
    classId: 'archer',
    className: '弓箭手',
    tier: 3,
    tierName: '專家型態',
  },
  {
    id: 'archer-4',
    num: 107,
    name: '鷹眼神射手',
    title: 'Apex Master Archer',
    category: 'pixel_rpg',
    emoji: '🦅',
    color: '#F59E0B',
    bgGradient: 'from-amber-400/30 to-yellow-600/30',
    description: '煥發神聖金光與鷹羽羽翼的終極大師，擁有視界萬里的鷹眼靈氣。',
    image: '/avatars/archer-4.png',
    classId: 'archer',
    className: '弓箭手',
    tier: 4,
    tierName: '大師型態',
  },

  // 🧙‍♂️ 法師系列 (Mage)
  NOVICE_CHARACTERS[1],
  {
    id: 'mage-2',
    num: 108,
    name: '元素導師',
    title: 'Elemental Spellcaster',
    category: 'pixel_rpg',
    emoji: '🔥',
    color: '#6366F1',
    bgGradient: 'from-indigo-600/30 to-blue-600/30',
    description: '掌控水火與冰霜雙重元素魔法，能在戰場上施加強大的範圍魔法。',
    image: '/avatars/mage-2.png',
    classId: 'mage',
    className: '法師',
    tier: 2,
    tierName: '進階型態',
  },
  {
    id: 'mage-3',
    num: 109,
    name: '大魔法師',
    title: 'Archmage',
    category: 'pixel_rpg',
    emoji: '🔮',
    color: '#8B5CF6',
    bgGradient: 'from-purple-600/30 to-indigo-700/30',
    description: '身穿紫金奧術長袍，手持紫晶水晶法杖，精通深奧咒術與法術鎖定。',
    image: '/avatars/mage-3.png',
    classId: 'mage',
    className: '法師',
    tier: 3,
    tierName: '專家型態',
  },
  {
    id: 'mage-4',
    num: 110,
    name: '奧術主宰',
    title: 'Supreme Arcane Master',
    category: 'pixel_rpg',
    emoji: '🌌',
    color: '#EC4899',
    bgGradient: 'from-fuchsia-600/30 to-purple-600/30',
    description: '尊戴璀璨魔法王冠，懸浮銀河星辰符文與古老魔導書的大師傳奇。',
    image: '/avatars/mage-4.png',
    classId: 'mage',
    className: '法師',
    tier: 4,
    tierName: '大師型態',
  },

  // ⚔️ 劍士系列 (Swordsman)
  NOVICE_CHARACTERS[2],
  {
    id: 'swordsman-2',
    num: 111,
    name: '佩劍騎士',
    title: 'Knight Swordsman',
    category: 'pixel_rpg',
    emoji: '🛡️',
    color: '#38BDF8',
    bgGradient: 'from-sky-500/30 to-blue-600/30',
    description: '身穿亮銀精鋼鎧甲與緋紅披風，以高潔騎士精神揮舞騎士長劍。',
    image: '/avatars/swordsman-2.png',
    classId: 'swordsman',
    className: '劍士',
    tier: 2,
    tierName: '進階型態',
  },
  {
    id: 'swordsman-3',
    num: 112,
    name: '狂暴劍聖',
    title: 'Sword Master',
    category: 'pixel_rpg',
    emoji: '💥',
    color: '#EF4444',
    bgGradient: 'from-red-600/30 to-orange-600/30',
    description: '綁著頭巾的熱血劍狂，手持熾熱火焰符文巨劍，展現極致斬擊爆發力。',
    image: '/avatars/swordsman-3.png',
    classId: 'swordsman',
    className: '劍士',
    tier: 3,
    tierName: '專家型態',
  },
  {
    id: 'swordsman-4',
    num: 113,
    name: '疾風劍神',
    title: 'Wind God Swordmaster',
    category: 'pixel_rpg',
    emoji: '👑',
    color: '#F59E0B',
    bgGradient: 'from-amber-400/30 to-yellow-500/30',
    description: '身穿黃金戰甲，周身環繞無數飛劍與青藍風暴劍氣，達至人劍合一境地。',
    image: '/avatars/swordsman-4.png',
    classId: 'swordsman',
    className: '劍士',
    tier: 4,
    tierName: '大師型態',
  },

  // 🪓 戰士系列 (Warrior)
  NOVICE_CHARACTERS[3],
  {
    id: 'warrior-2',
    num: 114,
    name: '重裝戰士',
    title: 'Heavy Armor Warrior',
    category: 'pixel_rpg',
    emoji: '⚙️',
    color: '#64748B',
    bgGradient: 'from-slate-600/30 to-zinc-600/30',
    description: '配備刺角重鎧與雙刃戰斧，前線擋下猛烈攻擊的防護坦克。',
    image: '/avatars/warrior-2.png',
    classId: 'warrior',
    className: '戰士',
    tier: 2,
    tierName: '進階型態',
  },
  {
    id: 'warrior-3',
    num: 115,
    name: '鋼鐵守護者',
    title: 'Iron Guardian',
    category: 'pixel_rpg',
    emoji: '🛡️',
    color: '#0EA5E9',
    bgGradient: 'from-sky-600/30 to-cyan-600/30',
    description: '手持雷霆巨鎚與鋼鐵堡壘巨盾，戰場上不動如山的守護專家。',
    image: '/avatars/warrior-3.png',
    classId: 'warrior',
    className: '戰士',
    tier: 3,
    tierName: '專家型態',
  },
  {
    id: 'warrior-4',
    num: 116,
    name: '泰坦戰神',
    title: 'Titan War God',
    category: 'pixel_rpg',
    emoji: '🔥',
    color: '#DC2626',
    bgGradient: 'from-red-600/30 to-amber-600/30',
    description: '身披熔岩神鎧與黃金戰斧，擁有毀天滅地力量的傳奇戰神。',
    image: '/avatars/warrior-4.png',
    classId: 'warrior',
    className: '戰士',
    tier: 4,
    tierName: '大師型態',
  },
]

export const CHARACTERS: CharacterInfo[] = [
  // 🌱 初學者四大職業 + 👾 像素職業進階型態
  ...PIXEL_RPG_CHARACTERS.filter((c, idx, self) => self.findIndex((t) => t.id === c.id) === idx),

  // ⚔️ 英雄傳奇 (Heroes)
  {
    id: 'char-1',
    num: 1,
    name: '星際先鋒',
    title: 'Pioneer Captain',
    category: 'heroes',
    emoji: '⚡',
    color: '#3B82F6',
    bgGradient: 'from-blue-600/30 to-indigo-600/30',
    description: '擁有極限探險精神的前鋒戰士，帶領隊伍衝破重重考驗',
    image: '/avatars/char-1.png',
  },
  {
    id: 'char-2',
    num: 2,
    name: '賽博極客',
    title: 'Cyber Architect',
    category: 'cyber',
    emoji: '🤖',
    color: '#06B6D4',
    bgGradient: 'from-cyan-600/30 to-blue-600/30',
    description: '精通系統重構與數據流控的科技天才，解鎖所有關鍵要塞',
    image: '/avatars/char-2.png',
  },
  {
    id: 'char-3',
    num: 3,
    name: '聖光騎士',
    title: 'Aegis Paladin',
    category: 'heroes',
    emoji: '🛡️',
    color: '#F59E0B',
    bgGradient: 'from-amber-500/30 to-yellow-600/30',
    description: '堅不可摧的團隊防禦核心，無懼任何關卡考驗與阻礙',
    image: '/avatars/char-3.png',
  },
  {
    id: 'char-4',
    num: 4,
    name: '奧術導師',
    title: 'Arcane Sage',
    category: 'heroes',
    emoji: '🧙‍♂️',
    color: '#8B5CF6',
    bgGradient: 'from-purple-600/30 to-indigo-600/30',
    description: '掌控演算法與智慧奧秘的智囊，精準推演最佳獲勝路徑',
    image: '/avatars/char-4.png',
  },
  {
    id: 'char-5',
    num: 5,
    name: '影之忍者',
    title: 'Shadow Assassin',
    category: 'cyber',
    emoji: '🥷',
    color: '#EC4899',
    bgGradient: 'from-pink-600/30 to-rose-600/30',
    description: '疾風般的極致敏捷專家，於暗影中快速超越對手',
    image: '/avatars/char-5.png',
  },
  {
    id: 'char-6',
    num: 6,
    name: '宇宙冒險家',
    title: 'Cosmic Voyager',
    category: 'cosmic',
    emoji: '🚀',
    color: '#10B981',
    bgGradient: 'from-emerald-600/30 to-teal-600/30',
    description: '勇於跨越星際邊界的開拓者，探索未知棋盤領域',
    image: '/avatars/char-6.png',
  },

  // 🐾 靈獸神寵 (Beasts)
  {
    id: 'char-7',
    num: 7,
    name: '靈狐策劃',
    title: 'Mystic Fox',
    category: 'beasts',
    emoji: '🦊',
    color: '#F97316',
    bgGradient: 'from-orange-600/30 to-amber-600/30',
    description: '機智靈敏的策劃高手，以巧妙靈動策略掌控全場節奏',
    image: '/avatars/char-7.png',
  },
  {
    id: 'char-8',
    num: 8,
    name: '霸氣獅王',
    title: 'Cyber Lion King',
    category: 'beasts',
    emoji: '🦁',
    color: '#EAB308',
    bgGradient: 'from-yellow-500/30 to-amber-600/30',
    description: '萬獸之王者，擁有無與倫比的領導氣場與破關決心',
    image: '/avatars/char-8.png',
  },
  {
    id: 'char-9',
    num: 9,
    name: '龍之守護',
    title: 'Dragon Guardian',
    category: 'beasts',
    emoji: '🐉',
    color: '#EF4444',
    bgGradient: 'from-red-600/30 to-rose-600/30',
    description: '傳承熾熱龍魂的守護者，源源不絕的爆發潛力能量',
    image: '/avatars/char-9.png',
  },
  {
    id: 'char-10',
    num: 10,
    name: '霓虹酷貓',
    title: 'Neon Panther',
    category: 'beasts',
    emoji: '🐱',
    color: '#06B6D4',
    bgGradient: 'from-cyan-500/30 to-sky-600/30',
    description: '靈敏炫酷的夜行戰士，在光影閃爍間敏捷移動',
    image: '/avatars/char-10.png',
  },
  {
    id: 'char-11',
    num: 11,
    name: '功夫熊貓',
    title: 'Zen Master Panda',
    category: 'beasts',
    emoji: '🐼',
    color: '#84CC16',
    bgGradient: 'from-lime-600/30 to-emerald-600/30',
    description: '以柔克剛的深厚武學宗師，沉著面對各項高難度考驗',
    image: '/avatars/char-11.png',
  },
  {
    id: 'char-12',
    num: 12,
    name: '智慧獵鷹',
    title: 'Cyber Falcon',
    category: 'beasts',
    emoji: '🦉',
    color: '#6366F1',
    bgGradient: 'from-indigo-600/30 to-violet-600/30',
    description: '俯瞰全場的高空戰略家，精準捕捉獲取高分的每次契機',
    image: '/avatars/char-12.png',
  },

  // 🌌 宇宙幻境 (Cosmic & Magic)
  {
    id: 'char-13',
    num: 13,
    name: '水晶精靈',
    title: 'Crystal Sorceress',
    category: 'cosmic',
    emoji: '💎',
    color: '#EC4899',
    bgGradient: 'from-fuchsia-600/30 to-pink-600/30',
    description: '煥發璀璨寶石光彩的精靈，將積分轉換為極致奇蹟',
    image: '/avatars/char-13.png',
  },
  {
    id: 'char-14',
    num: 14,
    name: '夢幻獨角獸',
    title: 'Cosmic Unicorn',
    category: 'cosmic',
    emoji: '🦄',
    color: '#A855F7',
    bgGradient: 'from-purple-500/30 to-pink-500/30',
    description: '帶來幸運與光芒的傳奇星寵，解鎖驚喜連連的破關獎勵',
    image: '/avatars/char-14.png',
  },
  {
    id: 'char-15',
    num: 15,
    name: '雷霆領主',
    title: 'Thunder Overlord',
    category: 'cyber',
    emoji: '⚡',
    color: '#3B82F6',
    bgGradient: 'from-blue-600/30 to-cyan-600/30',
    description: '掌控強大電流爆發力的戰將，短時間內創造亮眼成績',
    image: '/avatars/char-15.png',
  },
  {
    id: 'char-16',
    num: 16,
    name: '全明星王者',
    title: 'All-Star Champion',
    category: 'heroes',
    emoji: '👑',
    color: '#EAB308',
    bgGradient: 'from-amber-400/30 to-yellow-600/30',
    description: '星光熠熠的全明星殿堂霸主，象徵至高無上的頂尖榮譽',
    image: '/avatars/char-16.png',
  },

  // ⚙️ 新設計角色 (17 ~ 24)
  {
    id: 'char-17',
    num: 17,
    name: '像素黑客',
    title: 'Pixel Matrix Hacker',
    category: 'cyber',
    emoji: '👾',
    color: '#10B981',
    bgGradient: 'from-emerald-500/30 to-cyan-600/30',
    description: '穿梭於數字位元間的復古黑客，突破傳統限制的破關專家',
    image: '/avatars/char-17.png',
  },
  {
    id: 'char-18',
    num: 18,
    name: '烈焰鳳凰',
    title: 'Flame Phoenix',
    category: 'beasts',
    emoji: '🔥',
    color: '#EF4444',
    bgGradient: 'from-red-500/30 to-orange-600/30',
    description: '浴火重生的傳奇神鳥，越戰越勇、展翅凌駕巔峰榜首',
    image: '/avatars/char-18.png',
  },
  {
    id: 'char-19',
    num: 19,
    name: '霜雪女皇',
    title: 'Frost Empress',
    category: 'cosmic',
    emoji: '❄️',
    color: '#38BDF8',
    bgGradient: 'from-sky-400/30 to-blue-600/30',
    description: '掌控絕對零度與靜謐智慧的戰術家，冷靜破解繁複難題',
    image: '/avatars/char-19.png',
  },
  {
    id: 'char-20',
    num: 20,
    name: '機甲泰坦',
    title: 'Mecha Vanguard',
    category: 'cyber',
    emoji: '⚙️',
    color: '#94A3B8',
    bgGradient: 'from-slate-500/30 to-zinc-600/30',
    description: '配備先進科幻推進器的重裝機甲，穩健踏出每一步驟',
    image: '/avatars/char-20.png',
  },
  {
    id: 'char-21',
    num: 21,
    name: '星雲漫遊者',
    title: 'Nebula Stargazer',
    category: 'cosmic',
    emoji: '🌌',
    color: '#8B5CF6',
    bgGradient: 'from-violet-600/30 to-fuchsia-600/30',
    description: '漫遊於深空星雲的流浪詩人，帶來未知而絢麗的探索驚喜',
    image: '/avatars/char-21.png',
  },
  {
    id: 'char-22',
    num: 22,
    name: '神射鷹眼',
    title: 'Apex Marksman',
    category: 'heroes',
    emoji: '🎯',
    color: '#F97316',
    bgGradient: 'from-orange-500/30 to-red-600/30',
    description: '百發百中的遠程精準執行者，鎖定目標即勢在必得',
    image: '/avatars/char-22.png',
  },
  {
    id: 'char-23',
    num: 23,
    name: '炫音節奏師',
    title: 'Sonic DJ Master',
    category: 'cyber',
    emoji: '🎵',
    color: '#F43F5E',
    bgGradient: 'from-rose-500/30 to-pink-600/30',
    description: '引領全場歡樂氣氛的聲光大師，讓每一次挑戰都充滿熱血',
    image: '/avatars/char-23.png',
  },
  {
    id: 'char-24',
    num: 24,
    name: '黃金 MVP',
    title: 'Golden Legend',
    category: 'heroes',
    emoji: '🏆',
    color: '#F59E0B',
    bgGradient: 'from-amber-400/30 to-yellow-500/30',
    description: '榮膺全場最高榮譽的金牌成就王者，展現無與倫比的亮眼實力',
    image: '/avatars/char-24.png',
  },
]

/**
 * Normalizes avatar input into a valid image URL
 */
export function getAvatarUrl(avatarId?: string): string {
  if (!avatarId || !avatarId.trim()) {
    return '/avatars/char-1.png'
  }

  const trimmed = avatarId.trim()

  // Full URL or Data URI
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed
  }

  // Path starting with '/'
  if (trimmed.startsWith('/')) {
    return trimmed
  }

  // Already has extension
  if (/\.(png|jpg|jpeg|svg|webp)$/i.test(trimmed)) {
    return `/avatars/${trimmed}`
  }

  // Normal character ID (e.g. archer-1, char-1)
  return `/avatars/${trimmed}.png`
}

/**
 * Retrieves character metadata by ID, fallback to default character if not found
 */
export function getCharacterMeta(avatarId?: string): CharacterInfo {
  if (!avatarId || !avatarId.trim()) {
    return CHARACTERS.find((c) => c.id === 'char-1') || NOVICE_CHARACTERS[0]
  }

  const cleanId = avatarId.trim().replace(/\.(png|jpg|jpeg|svg|webp)$/i, '')
  const found = CHARACTERS.find((c) => c.id === cleanId)

  if (found) {
    return found
  }

  // Try extracting number
  const match = cleanId.match(/char-(\d+)/)
  if (match) {
    const num = parseInt(match[1], 10)
    const index = (num - 1) % CHARACTERS.length
    if (CHARACTERS[index]) {
      return {
        ...CHARACTERS[index],
        id: cleanId,
        num,
      }
    }
  }

  // Fallback
  return {
    id: avatarId,
    num: 1,
    name: '玩家角色',
    title: 'Player Avatar',
    category: 'novice',
    emoji: '👤',
    color: '#3B82F6',
    bgGradient: 'from-blue-600/30 to-indigo-600/30',
    description: '全明星挑戰賽精彩角色',
    image: getAvatarUrl(avatarId),
  }
}

/**
 * Returns an inline SVG string fallback for a player avatar
 */
export function getAvatarSvgFallback(avatarId?: string, name?: string): string {
  const meta = getCharacterMeta(avatarId)
  const initial = name ? name.trim().charAt(0).toUpperCase() : meta.emoji || '★'

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
      <defs>
        <linearGradient id="grad-${meta.id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${meta.color}" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#0F172A" stop-opacity="0.95"/>
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="24" fill="url(#grad-${meta.id})" stroke="${meta.color}" stroke-width="2" stroke-opacity="0.5"/>
      <text x="50" y="58" font-family="sans-serif" font-size="38" font-weight="bold" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">
        ${initial}
      </text>
    </svg>
  `.trim()
}

