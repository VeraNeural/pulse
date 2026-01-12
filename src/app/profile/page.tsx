'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EditProfileModal from '../../components/EditProfileModal';
import { VeraUpsellModal } from '../../components/VeraUpsell';
import { PulsePlusModal } from '../../components/PulsePlusModal';

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'posts' | 'gifts' | 'about'>('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVeraModalOpen, setIsVeraModalOpen] = useState(false);
  const [isPulsePlusModalOpen, setIsPulsePlusModalOpen] = useState(false);
  const [quietMode, setQuietMode] = useState(false);
  const [isPulsePlus, setIsPulsePlus] = useState(false);
  const [isVeraPremium, setIsVeraPremium] = useState(false);

  // Load quiet mode on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      setQuietMode(localStorage.getItem('quietMode') === 'true');
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsPulsePlus(localStorage.getItem('pulseplus_active') === 'true');
    setIsVeraPremium(localStorage.getItem('vera_premium_active') === 'true');
  }, []);

  const isFreeUser = !isPulsePlus && !isVeraPremium;

  const toggleQuietMode = () => {
    const newValue = !quietMode;
    setQuietMode(newValue);
    if (typeof window !== 'undefined') {
      localStorage.setItem('quietMode', newValue.toString());
    }
  };

  const [profile, setProfile] = useState({
    displayName: 'Anonymous Star',
    username: 'anonymous_star',
    bio: 'Healing one day at a time ✨ Sharing my journey to help others feel less alone.',
    avatar: '✨',
    joinedAt: 'January 2026',
    stats: { posts: 24, supporters: 1248, supporting: 89, coinsEarned: 3420, totalViews: 12567 },
    badges: [
      { id: 'early', emoji: '🐦', name: 'Early Bird' },
      { id: 'storyteller', emoji: '📖', name: 'Storyteller' },
    ],
  });

  const handleSaveProfile = (updatedProfile: { displayName: string; username: string; bio: string; avatar: string }) => {
    setProfile(prev => ({
      ...prev,
      ...updatedProfile,
    }));
    setIsEditModalOpen(false);
  };

  return (
    <>
      <style jsx>{`
        .profile-page { min-height: 100vh; min-height: 100dvh; }
        .header-bg { position: absolute; top: 0; left: 0; right: 0; height: 200px; background: linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.2) 50%, rgba(59, 130, 246, 0.2) 100%); mask-image: linear-gradient(180deg, black 0%, transparent 100%); -webkit-mask-image: linear-gradient(180deg, black 0%, transparent 100%); }
        .settings-btn { position: fixed; top: calc(env(safe-area-inset-top, 0px) + 12px); right: 16px; z-index: 50; width: 44px; height: 44px; border-radius: 50%; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border: none; color: rgba(255, 255, 255, 0.8); font-size: 1.2rem; cursor: pointer; }
        .profile-section { position: relative; padding: calc(env(safe-area-inset-top, 0px) + 60px) 16px 0; text-align: center; }
        .avatar { width: 88px; height: 88px; border-radius: 50%; background: linear-gradient(135deg, rgba(139, 92, 246, 0.5) 0%, rgba(236, 72, 153, 0.5) 100%); display: flex; align-items: center; justify-content: center; font-size: 2.6rem; margin: 0 auto 12px; border: 3px solid rgba(255, 255, 255, 0.08); box-shadow: 0 0 35px rgba(139, 92, 246, 0.25); }
        .display-name { font-size: 1.3rem; font-weight: 700; color: rgba(255, 255, 255, 0.95); margin-bottom: 3px; letter-spacing: 0.01em; }
        .username { font-size: 0.8rem; color: rgba(255, 255, 255, 0.5); margin-bottom: 10px; letter-spacing: 0.01em; }
        .bio { font-size: 0.85rem; color: rgba(255, 255, 255, 0.7); max-width: 280px; margin: 0 auto 12px; line-height: 1.5; letter-spacing: 0.01em; }
        .joined { font-size: 0.8rem; color: rgba(255, 255, 255, 0.4); display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 20px; }
        .views-message { font-size: 0.75rem; color: #d4af37; margin-bottom: 16px; display: flex; align-items: center; justify-content: center; gap: 4px; letter-spacing: 0.01em; }
        .action-buttons { display: flex; justify-content: center; gap: 12px; margin-bottom: 24px; }
        .edit-btn { padding: 9px 28px; border-radius: 50px; background: transparent; border: 0.5px solid rgba(255, 255, 255, 0.15); color: rgba(255, 255, 255, 0.9); font-size: 0.8rem; font-weight: 500; cursor: pointer; letter-spacing: 0.01em; }
        .share-btn { width: 44px; height: 44px; border-radius: 50%; background: rgba(255, 255, 255, 0.08); border: none; color: rgba(255, 255, 255, 0.7); font-size: 1.1rem; cursor: pointer; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(255, 255, 255, 0.04); border-radius: 14px; overflow: hidden; margin: 0 16px 20px; }
        .stat-item { padding: 14px 8px; background: rgba(15, 15, 26, 0.8); text-align: center; }
        .stat-value { font-size: 1.2rem; font-weight: 700; color: rgba(255, 255, 255, 0.95); margin-bottom: 3px; }
        .stat-label { font-size: 0.68rem; color: rgba(255, 255, 255, 0.5); text-transform: uppercase; letter-spacing: 0.05em; }
        .badges-section { padding: 0 16px; margin-bottom: 24px; }
        .badges-row { display: flex; justify-content: center; gap: 10px; }
        .badge { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 50px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); }
        .badge-emoji { font-size: 1.1rem; }
        .badge-name { font-size: 0.85rem; color: rgba(255, 255, 255, 0.8); }
        .wallet-card { margin: 0 16px 20px; padding: 16px; background: linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(251, 191, 36, 0.08) 100%); border: 0.5px solid rgba(212, 175, 55, 0.25); border-radius: 16px; display: flex; justify-content: space-between; align-items: center; }
        .wallet-info { display: flex; align-items: center; gap: 12px; }
        .wallet-icon { width: 42px; height: 42px; border-radius: 10px; background: rgba(212, 175, 55, 0.18); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; }
        .wallet-balance { font-size: 1.3rem; font-weight: 700; color: #d4af37; }
        .wallet-label { font-size: 0.72rem; color: rgba(255, 255, 255, 0.5); letter-spacing: 0.01em; }
        .add-coins-btn { padding: 8px 18px; border-radius: 50px; background: #d4af37; border: none; color: #1a1a2e; font-size: 0.75rem; font-weight: 600; cursor: pointer; letter-spacing: 0.02em; }
        .quiet-mode-card { margin: 0 16px 20px; padding: 14px; border-radius: 14px; background: rgba(139, 92, 246, 0.08); border: 0.5px solid rgba(139, 92, 246, 0.2); display: flex; justify-content: space-between; align-items: center; }
        .quiet-mode-info { flex: 1; }
        .quiet-mode-label { font-size: 0.85rem; font-weight: 600; color: rgba(255, 255, 255, 0.95); margin-bottom: 3px; letter-spacing: 0.01em; }
        .quiet-mode-desc { font-size: 0.72rem; color: rgba(255, 255, 255, 0.5); letter-spacing: 0.01em; }
        .quiet-toggle { width: 52px; height: 28px; border-radius: 50px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); position: relative; cursor: pointer; transition: all 0.3s ease; }
        .quiet-toggle.active { background: #8b5cf6; border-color: #8b5cf6; }
        .quiet-toggle-knob { width: 22px; height: 22px; border-radius: 50%; background: white; position: absolute; top: 2px; left: 2px; transition: all 0.3s ease; }
        .quiet-toggle.active .quiet-toggle-knob { left: 26px; }
        .tabs { display: flex; border-bottom: 1px solid rgba(255, 255, 255, 0.1); margin: 0 16px; }
        .tab { flex: 1; padding: 14px; background: transparent; border: none; color: rgba(255, 255, 255, 0.5); font-size: 0.9rem; cursor: pointer; position: relative; }
        .tab.active { color: #a78bfa; }
        .tab.active::after { content: ''; position: absolute; bottom: -1px; left: 20%; right: 20%; height: 2px; background: linear-gradient(90deg, #8b5cf6, #a855f7); border-radius: 2px; }
        .tab-content { padding: 20px 16px 100px; }
        .empty-state { text-align: center; padding: 40px 20px; }
        .empty-emoji { font-size: 3rem; margin-bottom: 12px; }
        .empty-title { font-size: 1.1rem; color: rgba(255, 255, 255, 0.9); margin-bottom: 8px; }
        .empty-text { color: rgba(255, 255, 255, 0.5); font-size: 0.9rem; margin-bottom: 20px; }
        .create-post-btn { padding: 14px 32px; border-radius: 50px; background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); border: none; color: white; font-size: 0.95rem; font-weight: 600; cursor: pointer; }

        .upgrade-wrap { margin: 0 16px 20px; }
        .upgrade-status { margin: 0 16px 20px; padding: 14px; border-radius: 14px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); text-align: center; }
        .status-title { font-size: 0.85rem; font-weight: 700; color: rgba(255, 255, 255, 0.92); margin-bottom: 6px; }
        .status-sub { font-size: 0.78rem; color: rgba(255, 255, 255, 0.6); }
        .upgrade-buttons { display: grid; grid-template-columns: 1fr; gap: 10px; }
        .upgrade-btn { width: 100%; padding: 14px 16px; border-radius: 16px; background: rgba(139, 92, 246, 0.08); border: 0.5px solid rgba(139, 92, 246, 0.25); color: rgba(255, 255, 255, 0.92); text-align: left; cursor: pointer; }
        .upgrade-btn.secondary { background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.12); }
        .upgrade-title { font-size: 0.9rem; font-weight: 700; margin-bottom: 4px; }
        .upgrade-sub { font-size: 0.78rem; color: rgba(255, 255, 255, 0.6); }
      `}</style>

      <div className="profile-page">
        <div className="header-bg" />
        <button className="settings-btn">⚙️</button>
        <div className="profile-section">
          <div className="avatar">{profile.avatar}</div>
          <h1 className="display-name">{profile.displayName}</h1>
          <p className="username">@{profile.username}</p>
          <p className="bio">{profile.bio}</p>
          <span className="joined">📅 Joined {profile.joinedAt}</span>
          <div className="views-message">
            <span>👁</span>
            <span>Your posts have been seen {profile.stats.totalViews.toLocaleString()} times</span>
          </div>
          <div className="action-buttons">
            <button className="edit-btn" onClick={() => setIsEditModalOpen(true)}>Edit Profile</button>
            <button className="share-btn">↗</button>
          </div>
        </div>
        <div className="stats-grid">
          <div className="stat-item"><div className="stat-value">{quietMode ? '•••' : profile.stats.posts}</div><div className="stat-label">Posts</div></div>
          <div className="stat-item"><div className="stat-value">{quietMode ? '•••' : profile.stats.supporters.toLocaleString()}</div><div className="stat-label">Supporters</div></div>
          <div className="stat-item"><div className="stat-value">{quietMode ? '•••' : profile.stats.supporting}</div><div className="stat-label">Supporting</div></div>
        </div>
        <div className="badges-section">
          <div className="badges-row">
            {profile.badges.map((badge) => (<div key={badge.id} className="badge"><span className="badge-emoji">{badge.emoji}</span><span className="badge-name">{badge.name}</span></div>))}
          </div>
        </div>
        <div className="wallet-card">
          <div className="wallet-info">
            <div className="wallet-icon">🪙</div>
            <div><div className="wallet-balance">{profile.stats.coinsEarned.toLocaleString()}</div><div className="wallet-label">Coins earned</div></div>
          </div>
          <button className="add-coins-btn">+ Add Coins</button>
        </div>
        <div className="quiet-mode-card">
          <div className="quiet-mode-info">
            <div className="quiet-mode-label">🤫 Quiet Mode</div>
            <div className="quiet-mode-desc">Hide all numbers and counts</div>
          </div>
          <button className={`quiet-toggle ${quietMode ? 'active' : ''}`} onClick={toggleQuietMode}>
            <div className="quiet-toggle-knob" />
          </button>
        </div>

        {isFreeUser ? (
          <div className="upgrade-wrap">
            <div className="upgrade-buttons">
              <button className="upgrade-btn" onClick={() => setIsPulsePlusModalOpen(true)}>
                <div className="upgrade-title">Upgrade to Pulse+ - $2.99/mo</div>
                <div className="upgrade-sub">Unlimited posts + Spotlight priority</div>
              </button>
              <button className="upgrade-btn secondary" onClick={() => setIsVeraModalOpen(true)}>
                <div className="upgrade-title">Get VERA Premium - $8/mo</div>
                <div className="upgrade-sub">Full Sanctuary + Pulse+ + VERA AI</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="upgrade-status">
            <div className="status-title">Subscription Active</div>
            <div className="status-sub">
              {isVeraPremium ? 'VERA Premium — $8/mo' : 'Pulse+ — $2.99/mo'}
            </div>
          </div>
        )}
        <div className="tabs">
          <button className={`tab ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>Posts</button>
          <button className={`tab ${activeTab === 'gifts' ? 'active' : ''}`} onClick={() => setActiveTab('gifts')}>Gifts</button>
          <button className={`tab ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>About</button>
        </div>
        <div className="tab-content">
          {activeTab === 'posts' && (<div className="empty-state"><div className="empty-emoji">📝</div><h3 className="empty-title">Share your first post</h3><p className="empty-text">Your story could help someone today</p><button className="create-post-btn" onClick={() => router.push('/create')}>Create Post</button></div>)}
          {activeTab === 'gifts' && (<div className="empty-state"><div className="empty-emoji">🎁</div><h3 className="empty-title">No gifts yet</h3><p className="empty-text">Gifts you receive will appear here</p></div>)}
          {activeTab === 'about' && (<div className="empty-state"><div className="empty-emoji">ℹ️</div><h3 className="empty-title">Coming soon</h3><p className="empty-text">More profile details coming soon</p></div>)}
        </div>

        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profile={profile}
          onSave={handleSaveProfile}
        />

        <VeraUpsellModal
          isOpen={isVeraModalOpen}
          onClose={() => setIsVeraModalOpen(false)}
          onSubscribe={() => {
            setIsVeraModalOpen(false);
          }}
        />

        <PulsePlusModal
          isOpen={isPulsePlusModalOpen}
          onClose={() => setIsPulsePlusModalOpen(false)}
          onVeraPremium={() => setIsVeraModalOpen(true)}
        />
      </div>
    </>
  );
}
