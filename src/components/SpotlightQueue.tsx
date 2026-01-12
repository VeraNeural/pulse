'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/lib/data';

interface SpotlightQueueProps {
  posts: Post[];
  onPostSeen: (postId: string) => void;
}

export default function SpotlightQueue({ posts, onPostSeen }: SpotlightQueueProps) {
  const [seenPosts, setSeenPosts] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load seen posts from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const seen = localStorage.getItem('spotlightSeen');
      if (seen) {
        setSeenPosts(new Set(JSON.parse(seen)));
      }
    }
  }, []);

  // Filter posts that have spotlightViews and haven't been seen
  const spotlightPosts = posts
    .filter(post => post.spotlightViews > 0 && !seenPosts.has(post.id))
    .slice(0, 3);

  if (spotlightPosts.length === 0) return null;

  const currentPost = spotlightPosts[currentIndex];

  const handleSeen = () => {
    const newSeenPosts = new Set(seenPosts);
    newSeenPosts.add(currentPost.id);
    setSeenPosts(newSeenPosts);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('spotlightSeen', JSON.stringify([...newSeenPosts]));
    }
    
    onPostSeen(currentPost.id);
    
    // Move to next post with animation
    if (currentIndex < spotlightPosts.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
    }
  };

  const MOOD_COLORS: Record<string, { bg: string; border: string; text: string }> = {
    hopeful: { bg: 'rgba(167, 139, 250, 0.15)', border: 'rgba(167, 139, 250, 0.4)', text: '#a78bfa' },
    anxious: { bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.4)', text: '#fbbf24' },
    grateful: { bg: 'rgba(52, 211, 153, 0.15)', border: 'rgba(52, 211, 153, 0.4)', text: '#34d399' },
    struggling: { bg: 'rgba(156, 163, 175, 0.15)', border: 'rgba(156, 163, 175, 0.4)', text: '#9ca3af' },
    celebrating: { bg: 'rgba(251, 113, 133, 0.15)', border: 'rgba(251, 113, 133, 0.4)', text: '#fb7185' },
    reflecting: { bg: 'rgba(96, 165, 250, 0.15)', border: 'rgba(96, 165, 250, 0.4)', text: '#60a5fa' },
  };

  const moodColors = currentPost.mood ? MOOD_COLORS[currentPost.mood] : null;

  return (
    <>
      <style jsx>{`
        .spotlight-section {
          margin: 16px 16px 20px;
          animation: slideIn 0.4s ease-out;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .spotlight-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .spotlight-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #d4af37;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        .spotlight-count {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 0.01em;
        }
        .spotlight-card {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(251, 191, 36, 0.03) 100%);
          border: 0.5px solid rgba(212, 175, 55, 0.3);
          border-radius: 14px;
          padding: 12px;
          position: relative;
          overflow: hidden;
          animation: cardAppear 0.5s ease-out;
        }
        @keyframes cardAppear {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .spotlight-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
          animation: glow 3s ease-in-out infinite;
        }
        @keyframes glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .spotlight-content {
          position: relative;
          z-index: 1;
        }
        .author-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.4) 0%, rgba(251, 191, 36, 0.3) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }
        .author-info {
          flex: 1;
        }
        .author-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
          letter-spacing: 0.01em;
        }
        .post-time {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.4);
        }
        .mood-badge {
          padding: 4px 10px;
          border-radius: 50px;
          font-size: 0.7rem;
          font-weight: 500;
          text-transform: capitalize;
        }
        .post-content {
          font-size: 0.85rem;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 10px;
          letter-spacing: 0.01em;
        }
        .spotlight-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 0.5px solid rgba(212, 175, 55, 0.2);
        }
        .waiting-text {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          color: #d4af37;
          font-weight: 500;
          letter-spacing: 0.01em;
        }
        .action-buttons {
          display: flex;
          gap: 6px;
        }
        .seen-btn {
          padding: 6px 14px;
          border-radius: 50px;
          background: rgba(212, 175, 55, 0.15);
          border: 0.5px solid rgba(212, 175, 55, 0.3);
          color: #d4af37;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.02em;
        }
        .seen-btn:hover {
          background: rgba(212, 175, 55, 0.25);
          transform: scale(1.02);
        }
        .react-btn {
          padding: 6px 10px;
          border-radius: 50px;
          background: rgba(139, 92, 246, 0.15);
          border: 0.5px solid rgba(139, 92, 246, 0.3);
          color: #a78bfa;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .react-btn:hover {
          background: rgba(139, 92, 246, 0.25);
          transform: scale(1.05);
        }
        .progress-dots {
          display: flex;
          gap: 4px;
          justify-content: center;
          margin-top: 8px;
        }
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.3);
          transition: all 0.2s ease;
        }
        .dot.active {
          background: #d4af37;
          width: 18px;
          border-radius: 3px;
        }
      `}</style>

      <div className="spotlight-section">
        <div className="spotlight-header">
          <div className="spotlight-title">
            <span>🌟</span>
            <span>Spotlight - New Voices</span>
          </div>
          <div className="spotlight-count">
            {currentIndex + 1} of {spotlightPosts.length}
          </div>
        </div>

        <div className="spotlight-card">
          <div className="spotlight-glow" />
          <div className="spotlight-content">
            <div className="author-row">
              <div className="avatar">
                {currentPost.author.isAnonymous ? '✨' : currentPost.author.avatar || currentPost.author.displayName[0]}
              </div>
              <div className="author-info">
                <div className="author-name">{currentPost.author.displayName}</div>
                <div className="post-time">{currentPost.createdAt}</div>
              </div>
              {currentPost.mood && moodColors && (
                <div
                  className="mood-badge"
                  style={{
                    background: moodColors.bg,
                    border: `0.5px solid ${moodColors.border}`,
                    color: moodColors.text,
                  }}
                >
                  {currentPost.mood}
                </div>
              )}
            </div>

            <div className="post-content">{currentPost.content}</div>

            <div className="spotlight-meta">
              <div className="waiting-text">
                <span>✨</span>
                <span>{currentPost.spotlightViews} people waiting to see this</span>
              </div>
              <div className="action-buttons">
                <button className="react-btn" onClick={handleSeen}>
                  💜
                </button>
                <button className="seen-btn" onClick={handleSeen}>
                  Seen
                </button>
              </div>
            </div>
          </div>
        </div>

        {spotlightPosts.length > 1 && (
          <div className="progress-dots">
            {spotlightPosts.map((_, index) => (
              <div key={index} className={`dot ${index === currentIndex ? 'active' : ''}`} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
