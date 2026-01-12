export interface Author {
  id: string;
  name: string;
  displayName: string;
  avatar?: string;
  isAnonymous: boolean;
  isVerified?: boolean;
  isPulsePlus?: boolean;
  isNew?: boolean;
}

export interface Media {
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnail?: string;
  duration?: string;
  aspectRatio?: number;
}

export interface Post {
  id: string;
  author: Author;
  content: string;
  media?: Media;
  tags: string[];
  reactions: {
    hug: number;
    strength: number;
    light: number;
    love: number;
  };
  userReaction?: string | null;
  commentCount: number;
  createdAt: string;
  mood?: 'hopeful' | 'anxious' | 'grateful' | 'struggling' | 'celebrating' | 'reflecting';
  views: number;
  spotlightViews: number;
  isBoosted: boolean;
  boostLevel: 'none' | 'boost' | 'spotlight' | 'mega';
  isResponse: boolean;
  responseToId?: string;
  responseToAuthor?: string;
  responseToPreview?: string;
  responseCount?: number;
}

export const SAMPLE_POSTS: Post[] = [
  {
    id: '1',
    author: { 
      id: 'u1', 
      name: 'anonymous_butterfly', 
      displayName: 'Anonymous Butterfly', 
      isAnonymous: true,
      isNew: true
    },
    content: "Today I finally told someone about my anxiety. It felt like lifting a weight I didn't know I was carrying. To anyone else struggling in silence - you're not alone. 💜",
    tags: ['anxiety', 'breakthrough', 'healing'],
    reactions: { hug: 124, strength: 89, light: 56, love: 203 },
    commentCount: 34,
    createdAt: '2h ago',
    mood: 'hopeful',
    views: 472,
    spotlightViews: 73,
    isBoosted: false,
    boostLevel: 'none',
    isResponse: false,
    responseCount: 3,
  },
  {
    id: '2',
    author: { 
      id: 'u2', 
      name: 'gentle_soul', 
      displayName: 'Gentle Soul', 
      isAnonymous: true,
      isPulsePlus: true
    },
    content: "Small win today: I got out of bed, took a shower, and made breakfast. Some days that's enough. Proud of myself. ☀️",
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=800&h=600&fit=crop',
    },
    tags: ['smallwins', 'selfcare', 'progress'],
    reactions: { hug: 89, strength: 156, light: 34, love: 178 },
    commentCount: 21,
    createdAt: '4h ago',
    mood: 'celebrating',
    views: 1234,
    spotlightViews: 0,
    isBoosted: true,
    boostLevel: 'spotlight',
    isResponse: false,
    responseCount: 0,
  },
  {
    id: '3',
    author: { 
      id: 'u3', 
      name: 'night_owl', 
      displayName: 'Night Owl', 
      isAnonymous: true,
      isNew: true
    },
    content: "3am thoughts: Healing isn't linear. Yesterday I felt on top of the world. Today I'm back in bed. And that's okay. Tomorrow is a new page.",
    tags: ['healing', 'latenight', 'thoughts'],
    reactions: { hug: 234, strength: 67, light: 123, love: 145 },
    commentCount: 45,
    createdAt: '6h ago',
    mood: 'reflecting',
    views: 569,
    spotlightViews: 45,
    isBoosted: false,
    boostLevel: 'none',
    isResponse: true,
    responseToId: '1',
    responseToAuthor: 'Anonymous Butterfly',
    responseToPreview: 'Today I finally told someone about my anxiety. It felt like lifting a weight...',
    responseCount: 1,
  },
  {
    id: '4',
    author: { 
      id: 'u4', 
      name: 'sunrise_seeker', 
      displayName: 'Sunrise Seeker', 
      isAnonymous: true,
      isVerified: true
    },
    content: "Recorded this moment of peace this morning. Sometimes you just need to breathe. 🌅",
    media: {
      type: 'video',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800',
    },
    tags: ['peace', 'morning', 'nature', 'breathe'],
    reactions: { hug: 45, strength: 23, light: 189, love: 267 },
    commentCount: 89,
    createdAt: '8h ago',
    mood: 'grateful',
    views: 2156,
    spotlightViews: 0,
    isBoosted: true,
    boostLevel: 'boost',
    isResponse: false,
    responseCount: 0,
  },
  {
    id: '5',
    author: { 
      id: 'u5', 
      name: 'quiet_storm', 
      displayName: 'Quiet Storm', 
      isAnonymous: true 
    },
    content: "Voice note for anyone who needs it right now:",
    media: {
      type: 'audio',
      url: '/audio/encouragement.mp3',
      duration: '1:24',
    },
    tags: ['support', 'voicenote', 'youmatter'],
    reactions: { hug: 312, strength: 198, light: 156, love: 423 },
    commentCount: 67,
    createdAt: '12h ago',
    mood: 'hopeful',
    views: 1089,
    spotlightViews: 28,
    isBoosted: false,
    boostLevel: 'none',
    isResponse: false,
    responseCount: 0,
  },
  {
    id: '6',
    author: { 
      id: 'u6', 
      name: 'moonbeam', 
      displayName: 'Moonbeam', 
      isAnonymous: true 
    },
    content: "Gratitude list for today:\n\n☀️ Woke up breathing\n☕ Had warm coffee\n🌸 Saw a flower blooming\n💌 Got a text from an old friend\n\nWhat are you grateful for?",
    tags: ['gratitude', 'mindfulness', 'positivity'],
    reactions: { hug: 78, strength: 45, light: 234, love: 312 },
    commentCount: 156,
    createdAt: '1d ago',
    mood: 'grateful',
    views: 3421,
    spotlightViews: 0,
    isBoosted: false,
    boostLevel: 'none',
    isResponse: false,
    responseCount: 0,
  },
  {
    id: '7',
    author: { 
      id: 'u7', 
      name: 'healing_heart', 
      displayName: 'Healing Heart', 
      isAnonymous: true,
      isPulsePlus: true
    },
    content: "One year ago today, I couldn't get out of bed. Today, I ran my first 5K. To anyone in that dark place - please hold on. It does get better. I promise. 🏃‍♀️💜",
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&h=600&fit=crop',
    },
    tags: ['recovery', 'milestone', 'hope', 'mentalhealth'],
    reactions: { hug: 567, strength: 892, light: 345, love: 1203 },
    commentCount: 234,
    createdAt: '1d ago',
    mood: 'celebrating',
    views: 5678,
    spotlightViews: 0,
    isBoosted: true,
    boostLevel: 'mega',
    isResponse: false,
    responseCount: 0,
  },
];

export const MOODS = [
  { id: 'hopeful', label: 'Hopeful', emoji: '🌟' },
  { id: 'anxious', label: 'Anxious', emoji: '😰' },
  { id: 'grateful', label: 'Grateful', emoji: '🙏' },
  { id: 'struggling', label: 'Struggling', emoji: '💭' },
  { id: 'celebrating', label: 'Celebrating', emoji: '🎉' },
  { id: 'reflecting', label: 'Reflecting', emoji: '🌙' },
];

export const BOOST_OPTIONS = [
  { id: 'boost', name: 'Boost', views: 500, cost: 50, icon: '🚀' },
  { id: 'spotlight', name: 'Spotlight', views: 1000, cost: 200, icon: '⭐', featured: true },
  { id: 'mega', name: 'Mega Boost', views: 2000, cost: 500, icon: '💎', notify: true },
];

export const GIFTS = [
  { id: 'hug', emoji: '🫂', name: 'Hug', cost: 10 },
  { id: 'strength', emoji: '💪', name: 'Strength', cost: 25 },
  { id: 'light', emoji: '🕯️', name: 'Light', cost: 50 },
  { id: 'love', emoji: '💜', name: 'Love', cost: 100 },
  { id: 'supernova', emoji: '🌟', name: 'Supernova', cost: 250 },
  { id: 'rainbow', emoji: '🌈', name: 'Rainbow', cost: 500 },
];

export const COIN_PACKAGES = [
  { id: 'starter', coins: 100, price: 0.99, popular: false },
  { id: 'basic', coins: 500, price: 3.99, popular: true },
  { id: 'value', coins: 1000, price: 6.99, popular: false },
  { id: 'premium', coins: 2500, price: 14.99, popular: false },
  { id: 'ultimate', coins: 5000, price: 24.99, popular: false },
];
