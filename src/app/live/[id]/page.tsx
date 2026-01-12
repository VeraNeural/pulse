'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LiveRoomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [handRaised, setHandRaised] = useState(false);
  const [floatingReactions, setFloatingReactions] = useState<{ id: number; emoji: string; x: number }[]>([]);

  const roomTitle = searchParams.get('title') || 'Live Room';
  const topic = searchParams.get('topic') || 'openmic';
  const isHost = true; // Mock: current user is host

  const TOPIC_LABELS: Record<string, { name: string; emoji: string }> = {
    anxiety: { name: 'Anxiety Support', emoji: '🫂' },
    latenight: { name: 'Late Night Talks', emoji: '🌙' },
    gratitude: { name: 'Gratitude Circle', emoji: '✨' },
    openmic: { name: 'Open Mic', emoji: '🎤' },
    recovery: { name: 'Recovery Journey', emoji: '💪' },
  };

  const REACTIONS = ['🫂', '💪', '🕯️', '💜'];

  const SPEAKERS = [
    { id: '1', name: 'You', avatar: '✨', isSpeaking: true, isHost: true },
    { id: '2', name: 'Night Owl', avatar: '🦉', isSpeaking: false, isHost: false },
    { id: '3', name: 'Gentle Soul', avatar: '💜', isSpeaking: false, isHost: false },
  ];

  const handleReaction = (emoji: string) => {
    const id = Date.now();
    const x = Math.random() * 80 + 10; // Random position between 10% and 90%
    setFloatingReactions(prev => [...prev, { id, emoji, x }]);
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== id));
    }, 3000);
  };

  const handleLeave = () => {
    router.back();
  };

  const handleEndLive = () => {
    if (confirm('Are you sure you want to end this live session?')) {
      router.push('/');
    }
  };

  return (
    <>
      <style jsx>{`
        .live-page {
          min-height: 100vh;
          min-height: 100dvh;
          background: linear-gradient(180deg, #1a0f2e 0%, #0f0f1a 100%);
          position: relative;
          overflow: hidden;
        }
        .ambient-glow {
          position: absolute;
          top: -50%;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .header {
          position: relative;
          padding: calc(env(safe-area-inset-top, 0px) + 20px) 20px 20px;
          text-align: center;
        }
        .live-indicator {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 50px;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          margin-bottom: 16px;
        }
        .live-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ef4444;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
        .live-text {
          font-size: 0.9rem;
          font-weight: 700;
          color: #ef4444;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .room-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 12px;
          line-height: 1.3;
        }
        .room-meta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 8px;
        }
        .topic-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 50px;
          background: rgba(139, 92, 246, 0.15);
          border: 1px solid rgba(139, 92, 246, 0.3);
          font-size: 0.85rem;
          color: #a78bfa;
        }
        .listener-count {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
        }
        .speakers-section {
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
        }
        .speakers-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 24px;
        }
        .speaker {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          position: relative;
        }
        .speaker-avatar-wrapper {
          position: relative;
        }
        .speaker-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(236, 72, 153, 0.4) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          border: 3px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        .speaker.speaking .speaker-avatar {
          border-color: #a78bfa;
          box-shadow: 0 0 30px rgba(167, 139, 250, 0.5), 0 0 60px rgba(167, 139, 250, 0.3);
          animation: speakingGlow 2s ease-in-out infinite;
        }
        @keyframes speakingGlow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .host-badge {
          position: absolute;
          bottom: -4px;
          right: -4px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          border: 2px solid #0f0f1a;
        }
        .speaker-name {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
        }
        .reactions-container {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 100;
        }
        .floating-reaction {
          position: absolute;
          bottom: 120px;
          font-size: 2rem;
          animation: floatUp 3s ease-out forwards;
        }
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-400px) scale(1.5);
            opacity: 0;
          }
        }
        .bottom-controls {
          position: fixed;
          bottom: calc(70px + env(safe-area-inset-bottom, 0px));
          left: 0;
          right: 0;
          padding: 20px;
          background: linear-gradient(180deg, transparent 0%, rgba(15, 15, 26, 0.95) 20%, rgba(15, 15, 26, 0.98) 100%);
          backdrop-filter: blur(20px);
        }
        .reaction-bar {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .reaction-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .reaction-btn:active {
          transform: scale(1.2);
          background: rgba(255, 255, 255, 0.15);
        }
        .action-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        .action-btn {
          flex: 1;
          max-width: 160px;
          padding: 16px;
          border-radius: 16px;
          border: none;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }
        .raise-hand-btn {
          background: rgba(139, 92, 246, 0.15);
          border: 1px solid rgba(139, 92, 246, 0.4);
          color: #a78bfa;
        }
        .raise-hand-btn.active {
          background: rgba(139, 92, 246, 0.3);
          border-color: #a78bfa;
        }
        .leave-btn {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }
        .end-live-btn {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #ef4444;
        }
      `}</style>

      <div className="live-page">
        <div className="ambient-glow" />
        
        <div className="reactions-container">
          {floatingReactions.map((reaction) => (
            <div 
              key={reaction.id} 
              className="floating-reaction" 
              style={{ left: `${reaction.x}%` }}
            >
              {reaction.emoji}
            </div>
          ))}
        </div>

        <header className="header">
          <div className="live-indicator">
            <div className="live-dot" />
            <span className="live-text">Live</span>
          </div>
          <h1 className="room-title">{roomTitle}</h1>
          <div className="room-meta">
            <div className="topic-badge">
              <span>{TOPIC_LABELS[topic]?.emoji || '🎤'}</span>
              <span>{TOPIC_LABELS[topic]?.name || 'Open Mic'}</span>
            </div>
            <span className="listener-count">👥 23 listening</span>
          </div>
        </header>

        <div className="speakers-section">
          <div className="speakers-grid">
            {SPEAKERS.map((speaker) => (
              <div key={speaker.id} className={`speaker ${speaker.isSpeaking ? 'speaking' : ''}`}>
                <div className="speaker-avatar-wrapper">
                  <div className="speaker-avatar">{speaker.avatar}</div>
                  {speaker.isHost && <div className="host-badge">👑</div>}
                </div>
                <span className="speaker-name">{speaker.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bottom-controls">
          <div className="reaction-bar">
            {REACTIONS.map((emoji) => (
              <button 
                key={emoji} 
                className="reaction-btn"
                onClick={() => handleReaction(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="action-buttons">
            {!isHost && (
              <button 
                className={`action-btn raise-hand-btn ${handRaised ? 'active' : ''}`}
                onClick={() => setHandRaised(!handRaised)}
              >
                <span>{handRaised ? '✋' : '🖐️'}</span>
                <span>{handRaised ? 'Hand Raised' : 'Raise Hand'}</span>
              </button>
            )}
            {isHost && (
              <button className="action-btn end-live-btn" onClick={handleEndLive}>
                <span>⏹️</span>
                <span>End Live</span>
              </button>
            )}
            <button className="action-btn leave-btn" onClick={handleLeave}>
              <span>🚪</span>
              <span>Leave</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
