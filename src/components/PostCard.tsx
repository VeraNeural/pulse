'use client';

import { useState, useRef } from 'react';
import { Post } from '@/lib/data';
import Comments from './Comments';
import { SendGiftModal } from './CoinsModal';
import BoostModal from './BoostModal';
import { useCoins } from '../app/layout';

interface PostCardProps {
  post: Post;
  onReaction: (postId: string, reaction: string) => void;
  onBoost?: (postId: string, boostId: string, cost: number, views: number) => void;
  isOwnPost?: boolean;
  responsePosts?: Post[];
  onShowOriginal?: (postId: string) => void;
}

const REACTIONS = [
  { id: 'hug', emoji: '🫂', label: 'Hug' },
  { id: 'strength', emoji: '💪', label: 'Strength' },
  { id: 'light', emoji: '🕯️', label: 'Light' },
  { id: 'love', emoji: '💜', label: 'Love' },
];

const MOOD_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  hopeful: { bg: 'rgba(167, 139, 250, 0.15)', border: 'rgba(167, 139, 250, 0.4)', text: '#a78bfa' },
  anxious: { bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.4)', text: '#fbbf24' },
  grateful: { bg: 'rgba(52, 211, 153, 0.15)', border: 'rgba(52, 211, 153, 0.4)', text: '#34d399' },
  struggling: { bg: 'rgba(156, 163, 175, 0.15)', border: 'rgba(156, 163, 175, 0.4)', text: '#9ca3af' },
  celebrating: { bg: 'rgba(251, 113, 133, 0.15)', border: 'rgba(251, 113, 133, 0.4)', text: '#fb7185' },
  reflecting: { bg: 'rgba(96, 165, 250, 0.15)', border: 'rgba(96, 165, 250, 0.4)', text: '#60a5fa' },
};

export default function PostCard({ post, onReaction, onBoost, isOwnPost = false, responsePosts = [], onShowOriginal }: PostCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
  const [showResponseThread, setShowResponseThread] = useState(false);
  const [quietMode, setQuietMode] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { coins, subtractCoins } = useCoins();

  // Check quiet mode on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      setQuietMode(localStorage.getItem('quietMode') === 'true');
    }
  });

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioToggle = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const moodColors = post.mood ? MOOD_COLORS[post.mood] : null;

  return (
    <>
      <style jsx>{`
        .post-card {
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 0.5px solid rgba(255, 255, 255, 0.05);
          padding: 12px;
          transition: background 0.2s ease;
        }
        .post-card:hover {
          background: rgba(255, 255, 255, 0.04);
        }
        .author-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        .author-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.5) 0%, rgba(236, 72, 153, 0.5) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .avatar:hover {
          transform: scale(1.05);
        }
        .author-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .author-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
          cursor: pointer;
          letter-spacing: 0.01em;
        }
        .author-name:hover {
          text-decoration: underline;
        }
        .author-name-wrapper {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .fresh-badge {
          padding: 2px 7px;
          border-radius: 50px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(251, 191, 36, 0.1) 100%);
          border: 0.5px solid rgba(212, 175, 55, 0.3);
          font-size: 0.65rem;
          color: #d4af37;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
          letter-spacing: 0.02em;
        }
        .post-time {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 0.01em;
        }
        .post-meta {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .views-counter {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 0.01em;
        }
        .boost-badge {
          padding: 2px 6px;
          border-radius: 50px;
          font-size: 0.65rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 3px;
          letter-spacing: 0.02em;
          animation: shimmer 2s ease-in-out infinite;
        }
        .boost-badge.boost {
          background: rgba(139, 92, 246, 0.15);
          border: 0.5px solid rgba(139, 92, 246, 0.3);
          color: #a78bfa;
        }
        .boost-badge.spotlight {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(251, 191, 36, 0.1) 100%);
          border: 0.5px solid rgba(212, 175, 55, 0.3);
          color: #d4af37;
        }
        .boost-badge.mega {
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%);
          border: 0.5px solid rgba(236, 72, 153, 0.3);
          color: #ec4899;
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        .mood-badge {
          padding: 5px 12px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: capitalize;
        }
        .more-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .more-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
        }
        .post-content {
          font-size: 0.9rem;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 10px;
          white-space: pre-wrap;
          word-wrap: break-word;
          letter-spacing: 0.01em;
        }
        .media-container {
          margin-bottom: 14px;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          background: rgba(0, 0, 0, 0.3);
        }
        .post-image {
          width: 100%;
          max-height: 500px;
          object-fit: cover;
          display: block;
        }
        .video-container {
          position: relative;
          cursor: pointer;
        }
        .post-video {
          width: 100%;
          max-height: 600px;
          object-fit: contain;
          background: #000;
          display: block;
        }
        .video-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.3);
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .video-container:hover .video-overlay {
          opacity: 1;
        }
        .video-container.paused .video-overlay {
          opacity: 1;
        }
        .play-btn {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }
        .mute-btn {
          position: absolute;
          bottom: 12px;
          right: 12px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          border: none;
          color: white;
          font-size: 1rem;
          cursor: pointer;
        }
        .audio-container {
          padding: 16px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .audio-play-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border: none;
          color: white;
          font-size: 1.3rem;
          cursor: pointer;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }
        .audio-play-btn:hover {
          transform: scale(1.05);
        }
        .audio-waveform {
          flex: 1;
          height: 40px;
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .waveform-bar {
          width: 3px;
          background: rgba(167, 139, 250, 0.5);
          border-radius: 2px;
        }
        .waveform-bar.active {
          background: #a78bfa;
        }
        .audio-duration {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          flex-shrink: 0;
        }
        .post-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 14px;
        }
        .post-tag {
          padding: 4px 10px;
          border-radius: 50px;
          background: rgba(139, 92, 246, 0.1);
          color: rgba(167, 139, 250, 0.8);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .post-tag:hover {
          background: rgba(139, 92, 246, 0.2);
        }
        .post-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .reactions {
          display: flex;
          gap: 4px;
        }
        .reaction-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 8px;
          border-radius: 50px;
          background: rgba(255, 255, 255, 0.03);
          border: 0.5px solid rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .reaction-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: scale(1.02);
        }
        .reaction-btn.active {
          background: rgba(167, 139, 250, 0.15);
          border-color: rgba(167, 139, 250, 0.4);
          color: #a78bfa;
        }
        .reaction-emoji {
          font-size: 1rem;
        }
        .secondary-actions {
          display: flex;
          gap: 8px;
        }
        .action-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 10px;
          border-radius: 50px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .action-btn:hover {
          color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.05);
        }
        .gift-btn {
          color: #fbbf24;
        }
        .gift-btn:hover {
          background: rgba(251, 191, 36, 0.1);
        }
        .boost-btn {
          color: #d4af37;
        }
        .boost-btn:hover {
          background: rgba(212, 175, 55, 0.1);
        }
        .response-preview {
          background: rgba(139, 92, 246, 0.08);
          border: 0.5px solid rgba(139, 92, 246, 0.2);
          border-radius: 12px;
          padding: 10px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .response-preview:hover {
          background: rgba(139, 92, 246, 0.12);
          border-color: rgba(139, 92, 246, 0.3);
        }
        .response-preview-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
        }
        .response-preview-text {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .response-thread {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 0.5px solid rgba(255, 255, 255, 0.05);
        }
        .response-thread-toggle {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: rgba(139, 92, 246, 0.08);
          border: none;
          border-radius: 50px;
          color: #a78bfa;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .response-thread-toggle:hover {
          background: rgba(139, 92, 246, 0.15);
        }
        @media (max-width: 480px) {
          .reactions {
            gap: 2px;
          }
          .reaction-btn {
            padding: 6px 8px;
          }
          .reaction-btn span:last-child {
            display: none;
          }
        }
      `}</style>

      <article className="post-card">
        {post.isResponse && post.responseToAuthor && post.responseToPreview && (
          <div className="response-preview" onClick={() => {
            // In real app: navigate to original post or open in modal
            alert(`View original post by ${post.responseToAuthor}`);
          }}>
            <div className="response-preview-header">
              <span>↩️</span>
              <span>Responding to @{post.responseToAuthor}</span>
            </div>
            <div className="response-preview-text">
              {post.responseToPreview.slice(0, 80)}{post.responseToPreview.length > 80 ? '...' : ''}
            </div>
          </div>
        )}

        <div className="author-row">
          <div className="author-info">
            <div className="avatar">
              {post.author.isAnonymous ? '✨' : post.author.avatar || post.author.displayName[0]}
            </div>
            <div className="author-details">
              <div className="author-name-wrapper">
                <span className="author-name">{post.author.displayName}</span>
                {post.author.isNew && (
                  <span className="fresh-badge">
                    <span>🌱</span>
                    <span>Fresh</span>
                  </span>
                )}
                {post.isBoosted && post.boostLevel !== 'none' && (
                  <span className={`boost-badge ${post.boostLevel}`}>
                    {post.boostLevel === 'boost' && '🚀'}
                    {post.boostLevel === 'spotlight' && '⭐'}
                    {post.boostLevel === 'mega' && '💎'}
                  </span>
                )}
              </div>
              <div className="post-meta">
                <span className="post-time">{post.createdAt}</span>
                <span>•</span>
                <span className="views-counter">
                  <span>👁</span>
                  <span>{post.views.toLocaleString()}</span>
                </span>
              </div>
            </div>
            {post.mood && moodColors && (
              <span 
                className="mood-badge"
                style={{
                  background: moodColors.bg,
                  border: `1px solid ${moodColors.border}`,
                  color: moodColors.text,
                }}
              >
                {post.mood}
              </span>
            )}
          </div>
          <button className="more-btn">⋯</button>
        </div>

        {post.content && (
          <p className="post-content">{post.content}</p>
        )}

        {post.media && (
          <div className="media-container">
            {post.media.type === 'image' && (
              <img src={post.media.url} alt="Post image" className="post-image" />
            )}
            {post.media.type === 'video' && (
              <div className={`video-container ${!isPlaying ? 'paused' : ''}`} onClick={handleVideoClick}>
                <video ref={videoRef} src={post.media.url} className="post-video" loop muted={isMuted} playsInline />
                <div className="video-overlay">
                  <div className="play-btn">{isPlaying ? '⏸' : '▶'}</div>
                </div>
                <button className="mute-btn" onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}>
                  {isMuted ? '🔇' : '🔊'}
                </button>
              </div>
            )}
            {post.media.type === 'audio' && (
              <div className="audio-container">
                <button className="audio-play-btn" onClick={handleAudioToggle}>
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <div className="audio-waveform">
                  {Array.from({ length: 40 }, (_, i) => (
                    <div
                      key={i}
                      className={`waveform-bar ${i < 20 ? 'active' : ''}`}
                      style={{ height: `${15 + Math.sin(i * 0.5) * 12 + Math.random() * 8}px` }}
                    />
                  ))}
                </div>
                <span className="audio-duration">{post.media.duration || '0:30'}</span>
                <audio ref={audioRef} src={post.media.url} />
              </div>
            )}
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag) => (
              <span key={tag} className="post-tag">#{tag}</span>
            ))}
          </div>
        )}

        <div className="post-actions">
          <div className="reactions">
            {REACTIONS.map((reaction) => (
              <button
                key={reaction.id}
                className={`reaction-btn ${post.userReaction === reaction.id ? 'active' : ''}`}
                onClick={() => onReaction(post.id, reaction.id)}
              >
                <span className="reaction-emoji">{reaction.emoji}</span>
                {!quietMode && <span>{post.reactions[reaction.id as keyof typeof post.reactions]}</span>}
              </button>
            ))}
          </div>
          <div className="secondary-actions">
            <button className="action-btn" onClick={() => setIsCommentsOpen(true)}>
              <span>💬</span>
              {!quietMode && <span>{post.commentCount}</span>}
            </button>
            <button 
              className="action-btn" 
              onClick={() => {
                // Navigate to create page with response param
                window.location.href = `/create?responseTo=${post.id}`;
              }}
            >
              <span>↩️</span>
              <span>Respond</span>
            </button>
            {!isOwnPost ? (
              <button className="action-btn gift-btn" onClick={() => setIsGiftModalOpen(true)}>
                <span>🎁</span>
              </button>
            ) : (
              <button className="action-btn boost-btn" onClick={() => setIsBoostModalOpen(true)}>
                <span>🚀</span>
                <span>Boost</span>
              </button>
            )}
            <button className="action-btn">
              <span>↗</span>
            </button>
          </div>
        </div>

        {responsePosts.length > 0 && (
          <div className="response-thread">
            <button 
              className="response-thread-toggle" 
              onClick={() => setShowResponseThread(!showResponseThread)}
            >
              <span>↩️</span>
              <span>{showResponseThread ? 'Hide' : 'See'} responses ({responsePosts.length})</span>
              <span>{showResponseThread ? '▲' : '▼'}</span>
            </button>
            {showResponseThread && (
              <div style={{ marginTop: '12px', paddingLeft: '16px', borderLeft: '2px solid rgba(139, 92, 246, 0.2)' }}>
                {responsePosts.map(responsePost => (
                  <div key={responsePost.id} style={{ 
                    marginBottom: '12px', 
                    padding: '12px', 
                    background: 'rgba(139, 92, 246, 0.05)', 
                    borderRadius: '12px',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                        @{responsePost.author.displayName}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.4)' }}>
                        {responsePost.createdAt}
                      </span>
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.4' }}>
                      {responsePost.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <Comments
          postId={post.id}
          isOpen={isCommentsOpen}
          onClose={() => setIsCommentsOpen(false)}
        />

        <SendGiftModal
          isOpen={isGiftModalOpen}
          onClose={() => setIsGiftModalOpen(false)}
          recipientName={post.author.displayName}
          balance={coins}
          onSend={(giftId, cost) => subtractCoins(cost)}
        />

        {isOwnPost && onBoost && (
          <BoostModal
            isOpen={isBoostModalOpen}
            onClose={() => setIsBoostModalOpen(false)}
            currentViews={post.views}
            balance={coins}
            onBoost={(boostId, cost, views) => {
              onBoost(post.id, boostId, cost, views);
              subtractCoins(cost);
            }}
            onBuyCoins={() => {
              setIsBoostModalOpen(false);
              // Navigate to buy coins - in a real app would open BuyCoinsModal
            }}
          />
        )}
      </article>
    </>
  );
}
