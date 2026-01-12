'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LIVE_ROOMS = [
  { id: '1', host: { name: 'Healing Heart', avatar: '💜' }, title: 'Late Night Check-In', topic: 'Late Night Talks', listeners: 23, topicEmoji: '🌙' },
  { id: '2', host: { name: 'Mindful Soul', avatar: '🧘' }, title: 'Anxiety Support Circle', topic: 'Anxiety Support', listeners: 18, topicEmoji: '🫂' },
  { id: '3', host: { name: 'Sunrise Seeker', avatar: '🌅' }, title: 'Morning Gratitude', topic: 'Gratitude Circle', listeners: 31, topicEmoji: '✨' },
];

const TRENDING_TAGS = [
  { tag: 'healing', posts: 12500 },
  { tag: 'anxiety', posts: 8900 },
  { tag: 'gratitude', posts: 7600 },
  { tag: 'smallwins', posts: 6200 },
  { tag: 'support', posts: 5800 },
  { tag: 'mentalhealth', posts: 5400 },
  { tag: 'selfcare', posts: 4900 },
  { tag: 'hope', posts: 4200 },
];

const SUGGESTED_PEOPLE = [
  { id: '1', name: 'Healing Heart', followers: '12.5K', avatar: '💜', isVerified: true },
  { id: '2', name: 'Mindful Soul', followers: '8.2K', avatar: '🧘', isVerified: false },
  { id: '3', name: 'Sunrise Seeker', followers: '15.1K', avatar: '🌅', isVerified: true },
  { id: '4', name: 'Gentle Light', followers: '6.8K', avatar: '🕯️', isVerified: false },
  { id: '5', name: 'Night Owl', followers: '9.4K', avatar: '🦉', isVerified: false },
];

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'trending' | 'people' | 'tags'>('trending');
  const router = useRouter();

  const FRESH_VOICES_POSTS = [
    { id: '1', author: 'Anonymous Butterfly', avatar: '🦋', content: 'First time sharing here... today I finally told someone about my anxiety.', reactions: 2 },
    { id: '2', author: 'Night Owl', avatar: '🦉', content: '3am thoughts: Healing isn\'t linear. Yesterday I felt on top of the world...', reactions: 3 },
    { id: '3', author: 'Quiet Storm', avatar: '🌧️', content: 'New here. Just needed a safe space to say: I\'m struggling but I\'m still here.', reactions: 1 },
  ];

  return (
    <>
      <style jsx>{`
        .discover-page { min-height: 100vh; min-height: 100dvh; }
        .header { position: fixed; top: 0; left: 0; right: 0; z-index: 50; background: rgba(15, 15, 26, 0.95); backdrop-filter: blur(25px); padding: calc(env(safe-area-inset-top, 0px) + 10px) 16px 12px; }
        .header-title { font-size: 1.3rem; font-weight: 700; color: rgba(255, 255, 255, 0.95); margin-bottom: 12px; letter-spacing: 0.01em; }
        .search-bar { display: flex; align-items: center; gap: 10px; padding: 11px 16px; background: rgba(255, 255, 255, 0.06); border: 0.5px solid rgba(255, 255, 255, 0.08); border-radius: 14px; margin-bottom: 12px; }
        .search-bar:focus-within { border-color: rgba(139, 92, 246, 0.4); }
        .search-icon { font-size: 1rem; color: rgba(255, 255, 255, 0.4); }
        .search-input { flex: 1; background: transparent; border: none; color: rgba(255, 255, 255, 0.95); font-size: 0.9rem; letter-spacing: 0.01em; }
        .search-input::placeholder { color: rgba(255, 255, 255, 0.4); }
        .search-input:focus { outline: none; }
        .tabs { display: flex; gap: 6px; }
        .tab { padding: 7px 16px; border-radius: 50px; background: transparent; border: 0.5px solid rgba(255, 255, 255, 0.08); color: rgba(255, 255, 255, 0.6); font-size: 0.8rem; font-weight: 500; cursor: pointer; letter-spacing: 0.01em; }
        .tab.active { background: rgba(139, 92, 246, 0.15); border-color: rgba(139, 92, 246, 0.4); color: #a78bfa; }
        .content { padding: calc(env(safe-area-inset-top, 0px) + 180px) 16px 100px; }
        .section { margin-bottom: 32px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .section-title { font-size: 1.1rem; font-weight: 600; color: rgba(255, 255, 255, 0.95); }
        .see-all { font-size: 0.9rem; color: #a78bfa; background: transparent; border: none; cursor: pointer; }
        .quick-tags { display: flex; flex-wrap: wrap; gap: 10px; }
        .quick-tag { padding: 12px 20px; border-radius: 50px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.8); font-size: 0.9rem; cursor: pointer; transition: all 0.2s ease; }
        .quick-tag:hover { background: rgba(139, 92, 246, 0.1); border-color: rgba(139, 92, 246, 0.3); color: #a78bfa; }
        .trending-tags { display: flex; flex-direction: column; gap: 12px; }
        .trending-tag { display: flex; align-items: center; gap: 16px; padding: 16px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 16px; cursor: pointer; transition: all 0.2s ease; }
        .trending-tag:hover { background: rgba(255, 255, 255, 0.06); transform: translateX(4px); }
        .tag-rank { width: 32px; height: 32px; border-radius: 8px; background: rgba(139, 92, 246, 0.15); display: flex; align-items: center; justify-content: center; font-size: 0.9rem; font-weight: 700; color: #a78bfa; }
        .tag-info { flex: 1; }
        .tag-name { font-size: 1rem; font-weight: 600; color: rgba(255, 255, 255, 0.95); margin-bottom: 2px; }
        .tag-count { font-size: 0.85rem; color: rgba(255, 255, 255, 0.5); }
        .tag-trend { color: #34d399; font-size: 0.85rem; }
        .people-list { display: flex; flex-direction: column; gap: 12px; }
        .person-card { display: flex; align-items: center; gap: 14px; padding: 14px 16px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 16px; cursor: pointer; }
        .person-card:hover { background: rgba(255, 255, 255, 0.06); }
        .person-avatar { width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(236, 72, 153, 0.4) 100%); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
        .person-info { flex: 1; }
        .person-name { display: flex; align-items: center; gap: 6px; font-size: 1rem; font-weight: 600; color: rgba(255, 255, 255, 0.95); margin-bottom: 2px; }
        .verified-badge { font-size: 0.8rem; }
        .person-followers { font-size: 0.85rem; color: rgba(255, 255, 255, 0.5); }
        .follow-btn { padding: 10px 20px; border-radius: 50px; background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); border: none; color: white; font-size: 0.85rem; font-weight: 600; cursor: pointer; }
        .live-section { background: linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(251, 191, 36, 0.03) 100%); border: 0.5px solid rgba(212, 175, 55, 0.2); border-radius: 16px; padding: 16px; margin-bottom: 20px; }
        .live-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
        .live-pulse { width: 8px; height: 8px; border-radius: 50%; background: #ef4444; animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.2); opacity: 0.8; } }
        .live-title { font-size: 1.05rem; font-weight: 700; color: #d4af37; letter-spacing: 0.01em; }
        .live-rooms { display: flex; flex-direction: column; gap: 12px; }
        .live-room-card { display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(255, 255, 255, 0.03); border: 0.5px solid rgba(255, 255, 255, 0.06); border-radius: 14px; cursor: pointer; transition: all 0.2s ease; }
        .live-room-card:hover { background: rgba(255, 255, 255, 0.06); transform: translateX(4px); }
        .host-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(236, 72, 153, 0.4) 100%); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; border: 2px solid rgba(239, 68, 68, 0.5); position: relative; }
        .live-badge { position: absolute; top: -3px; right: -3px; padding: 2px 5px; border-radius: 5px; background: #ef4444; font-size: 0.6rem; font-weight: 700; color: white; text-transform: uppercase; letter-spacing: 0.02em; }
        .room-info { flex: 1; }
        .room-title { font-size: 0.9rem; font-weight: 600; color: rgba(255, 255, 255, 0.95); margin-bottom: 3px; letter-spacing: 0.01em; }
        .room-meta { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; color: rgba(255, 255, 255, 0.5); }
        .room-topic { display: flex; align-items: center; gap: 4px; }
        .join-btn { padding: 8px 18px; border-radius: 50px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border: none; color: white; font-size: 0.75rem; font-weight: 600; cursor: pointer; flex-shrink: 0; letter-spacing: 0.02em; }
        .fresh-voices-section { background: linear-gradient(135deg, rgba(52, 211, 153, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%); border: 1px solid rgba(52, 211, 153, 0.2); border-radius: 20px; padding: 20px; margin-bottom: 24px; }
        .fresh-voices-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .fresh-voices-title { font-size: 1.2rem; font-weight: 700; color: rgba(255, 255, 255, 0.95); }
        .fresh-voices-subtitle { font-size: 0.85rem; color: #34d399; margin-bottom: 16px; }
        .fresh-post { padding: 14px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; margin-bottom: 10px; cursor: pointer; transition: all 0.2s ease; }
        .fresh-post:hover { background: rgba(255, 255, 255, 0.06); }
        .fresh-post:last-child { margin-bottom: 0; }
        .fresh-post-author { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .fresh-post-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, rgba(52, 211, 153, 0.4) 0%, rgba(16, 185, 129, 0.4) 100%); display: flex; align-items: center; justify-content: center; font-size: 1rem; }
        .fresh-post-name { font-size: 0.9rem; font-weight: 600; color: rgba(255, 255, 255, 0.95); display: flex; align-items: center; gap: 6px; }
        .fresh-badge-small { padding: 2px 6px; border-radius: 50px; background: rgba(52, 211, 153, 0.15); border: 1px solid rgba(52, 211, 153, 0.3); font-size: 0.65rem; color: #34d399; }
        .fresh-post-content { font-size: 0.85rem; color: rgba(255, 255, 255, 0.8); line-height: 1.4; margin-bottom: 8px; }
        .fresh-post-meta { font-size: 0.75rem; color: rgba(255, 255, 255, 0.4); }
      `}</style>

      <div className="discover-page">
        <header className="header">
          <h1 className="header-title">Discover</h1>
          
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search posts, people, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="tabs">
            <button className={`tab ${activeTab === 'trending' ? 'active' : ''}`} onClick={() => setActiveTab('trending')}>Trending</button>
            <button className={`tab ${activeTab === 'people' ? 'active' : ''}`} onClick={() => setActiveTab('people')}>People</button>
            <button className={`tab ${activeTab === 'tags' ? 'active' : ''}`} onClick={() => setActiveTab('tags')}>Tags</button>
          </div>
        </header>

        <div className="content">
          <div className="live-section">
            <div className="live-header">
              <div className="live-pulse" />
              <h2 className="live-title">Live Now</h2>
            </div>
            <div className="live-rooms">
              {LIVE_ROOMS.map((room) => (
                <div 
                  key={room.id} 
                  className="live-room-card"
                  onClick={() => router.push(`/live/${room.id}?title=${encodeURIComponent(room.title)}&topic=${room.topic.toLowerCase().replace(' ', '')}`)}
                >
                  <div className="host-avatar">
                    {room.host.avatar}
                    <div className="live-badge">Live</div>
                  </div>
                  <div className="room-info">
                    <div className="room-title">{room.title}</div>
                    <div className="room-meta">
                      <div className="room-topic">
                        <span>{room.topicEmoji}</span>
                        <span>{room.topic}</span>
                      </div>
                      <span>•</span>
                      <span>👥 {room.listeners}</span>
                    </div>
                  </div>
                  <button className="join-btn">Join</button>
                </div>
              ))}
            </div>
          </div>

          <div className="fresh-voices-section">
            <div className="fresh-voices-header">
              <h2 className="fresh-voices-title">🌱 Fresh Voices</h2>
            </div>
            <div className="fresh-voices-subtitle">New to Pulse - welcome them</div>
            {FRESH_VOICES_POSTS.map((post) => (
              <div key={post.id} className="fresh-post">
                <div className="fresh-post-author">
                  <div className="fresh-post-avatar">{post.avatar}</div>
                  <div className="fresh-post-name">
                    {post.author}
                    <span className="fresh-badge-small">New</span>
                  </div>
                </div>
                <div className="fresh-post-content">{post.content}</div>
                <div className="fresh-post-meta">💜 {post.reactions} reactions</div>
              </div>
            ))}
          </div>

          <div className="section">
            <div className="quick-tags">
              {['#healing', '#anxiety', '#gratitude', '#smallwins', '#hope'].map((tag) => (
                <button key={tag} className="quick-tag">{tag}</button>
              ))}
            </div>
          </div>

          {activeTab === 'trending' && (
            <div className="section">
              <div className="section-header">
                <h2 className="section-title">🔥 Trending Now</h2>
                <button className="see-all">See all</button>
              </div>
              <div className="trending-tags">
                {TRENDING_TAGS.map((item, index) => (
                  <div key={item.tag} className="trending-tag">
                    <div className="tag-rank">{index + 1}</div>
                    <div className="tag-info">
                      <div className="tag-name">#{item.tag}</div>
                      <div className="tag-count">{item.posts.toLocaleString()} posts</div>
                    </div>
                    <span className="tag-trend">↑ Trending</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'people' && (
            <div className="section">
              <div className="section-header">
                <h2 className="section-title">💜 Suggested for you</h2>
                <button className="see-all">See all</button>
              </div>
              <div className="people-list">
                {SUGGESTED_PEOPLE.map((person) => (
                  <div key={person.id} className="person-card">
                    <div className="person-avatar">{person.avatar}</div>
                    <div className="person-info">
                      <div className="person-name">
                        {person.name}
                        {person.isVerified && <span className="verified-badge">✓</span>}
                      </div>
                      <div className="person-followers">{person.followers} supporters</div>
                    </div>
                    <button className="follow-btn">Support</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tags' && (
            <div className="section">
              <div className="section-header">
                <h2 className="section-title">Browse by feeling</h2>
              </div>
              <div className="quick-tags">
                {['😰 #anxiety', '🌟 #hope', '🙏 #grateful', '💪 #recovery', '🌙 #latenight', '☀️ #newday', '💭 #thoughts', '❤️‍🩹 #healing', '🎉 #smallwins', '🤝 #support'].map((tag) => (
                  <button key={tag} className="quick-tag">{tag}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
