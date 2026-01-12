'use client';

import { useState } from 'react';

interface Notification {
  id: string;
  type: 'reaction' | 'gift' | 'comment' | 'follow' | 'mention';
  user: { name: string; avatar: string };
  content: string;
  postPreview?: string;
  giftEmoji?: string;
  coinValue?: number;
  time: string;
  isRead: boolean;
}

const SAMPLE_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'gift', user: { name: 'Gentle Soul', avatar: '💜' }, content: 'sent you a gift', giftEmoji: '🌟', coinValue: 250, time: '2m ago', isRead: false },
  { id: '2', type: 'reaction', user: { name: 'Night Owl', avatar: '🦉' }, content: 'sent you 🫂', postPreview: 'Today I finally told someone about my anxiety...', time: '15m ago', isRead: false },
  { id: '3', type: 'comment', user: { name: 'Healing Heart', avatar: '❤️' }, content: 'commented on your post', postPreview: 'This is so beautiful. Thank you for sharing 💜', time: '1h ago', isRead: false },
  { id: '4', type: 'follow', user: { name: 'Sunrise Seeker', avatar: '🌅' }, content: 'started supporting you', time: '2h ago', isRead: true },
  { id: '5', type: 'reaction', user: { name: 'Moonbeam', avatar: '🌙' }, content: 'sent you 💜', postPreview: 'Small win today: I got out of bed...', time: '3h ago', isRead: true },
  { id: '6', type: 'gift', user: { name: 'Starlight', avatar: '⭐' }, content: 'sent you a gift', giftEmoji: '🕯️', coinValue: 50, time: '5h ago', isRead: true },
];

export default function NotificationsPage() {
  const [notifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'gifts' | 'mentions'>('all');

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'gifts') return n.type === 'gift';
    if (activeFilter === 'mentions') return n.type === 'mention' || n.type === 'comment';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      <style jsx>{`
        .notifications-page { min-height: 100vh; min-height: 100dvh; }
        .header { position: fixed; top: 0; left: 0; right: 0; z-index: 50; background: rgba(15, 15, 26, 0.95); backdrop-filter: blur(25px); padding: calc(env(safe-area-inset-top, 0px) + 10px) 16px 12px; border-bottom: 0.5px solid rgba(255, 255, 255, 0.05); }
        .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .header-title { font-size: 1.3rem; font-weight: 700; color: rgba(255, 255, 255, 0.95); display: flex; align-items: center; gap: 8px; letter-spacing: 0.01em; }
        .unread-badge { padding: 3px 9px; border-radius: 50px; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); font-size: 0.72rem; font-weight: 600; letter-spacing: 0.02em; }
        .mark-read-btn { background: transparent; border: none; color: #a78bfa; font-size: 0.8rem; cursor: pointer; letter-spacing: 0.01em; }
        .filters { display: flex; gap: 6px; }
        .filter { padding: 6px 14px; border-radius: 50px; background: transparent; border: 0.5px solid rgba(255, 255, 255, 0.08); color: rgba(255, 255, 255, 0.6); font-size: 0.75rem; cursor: pointer; letter-spacing: 0.01em; }
        .filter.active { background: rgba(139, 92, 246, 0.15); border-color: rgba(139, 92, 246, 0.4); color: #a78bfa; }
        .content { padding: calc(env(safe-area-inset-top, 0px) + 130px) 0 100px; }
        .notification-item { display: flex; gap: 12px; padding: 12px 16px; border-bottom: 0.5px solid rgba(255, 255, 255, 0.03); cursor: pointer; transition: background 0.2s ease; }
        .notification-item:hover { background: rgba(255, 255, 255, 0.03); }
        .notification-item.unread { background: rgba(139, 92, 246, 0.05); }
        .avatar { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(236, 72, 153, 0.4) 100%); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
        .notification-content { flex: 1; min-width: 0; }
        .notification-text { font-size: 0.85rem; color: rgba(255, 255, 255, 0.9); margin-bottom: 3px; letter-spacing: 0.01em; }
        .notification-text strong { font-weight: 600; }
        .post-preview { font-size: 0.75rem; color: rgba(255, 255, 255, 0.5); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px; letter-spacing: 0.01em; }
        .notification-time { font-size: 0.72rem; color: rgba(255, 255, 255, 0.4); letter-spacing: 0.01em; }
        .gift-indicator { display: flex; align-items: center; gap: 6px; margin-top: 6px; padding: 6px 10px; background: linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(251, 191, 36, 0.08) 100%); border: 0.5px solid rgba(212, 175, 55, 0.25); border-radius: 8px; width: fit-content; }
        .gift-emoji { font-size: 1.1rem; }
        .gift-value { font-size: 0.75rem; color: #d4af37; font-weight: 600; letter-spacing: 0.02em; }
        .unread-dot { width: 8px; height: 8px; border-radius: 50%; background: #8b5cf6; flex-shrink: 0; margin-top: 6px; }
      `}</style>

      <div className="notifications-page">
        <header className="header">
          <div className="header-top">
            <h1 className="header-title">
              Notifications
              {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
            </h1>
            <button className="mark-read-btn">Mark all read</button>
          </div>
          <div className="filters">
            <button className={`filter ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>All</button>
            <button className={`filter ${activeFilter === 'gifts' ? 'active' : ''}`} onClick={() => setActiveFilter('gifts')}>🎁 Gifts</button>
            <button className={`filter ${activeFilter === 'mentions' ? 'active' : ''}`} onClick={() => setActiveFilter('mentions')}>💬 Mentions</button>
          </div>
        </header>

        <div className="content">
          {filteredNotifications.map((notification) => (
            <div key={notification.id} className={`notification-item ${!notification.isRead ? 'unread' : ''}`}>
              <div className="avatar">{notification.user.avatar}</div>
              <div className="notification-content">
                <p className="notification-text">
                  <strong>{notification.user.name}</strong> {notification.content}
                </p>
                {notification.postPreview && <p className="post-preview">{notification.postPreview}</p>}
                {notification.type === 'gift' && (
                  <div className="gift-indicator">
                    <span className="gift-emoji">{notification.giftEmoji}</span>
                    <span className="gift-value">+{notification.coinValue} coins</span>
                  </div>
                )}
                <span className="notification-time">{notification.time}</span>
              </div>
              {!notification.isRead && <div className="unread-dot" />}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
