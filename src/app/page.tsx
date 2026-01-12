'use client';

import { useState, useEffect } from 'react';
import PostCard from '@/components/PostCard';
import SpotlightQueue from '@/components/SpotlightQueue';
import { Post } from '@/lib/data';
import { BuyCoinsModal } from '../components/CoinsModal';
import { VeraUpsellBanner } from '../components/VeraUpsell';
import { useCoins, usePosts } from './layout';
import { useAuth } from '@/contexts/AuthContext';

export default function FeedPage() {
  const { profile } = useAuth();
  const { posts: allPosts } = usePosts();
  const [posts, setPosts] = useState<Post[]>(allPosts);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'foryou' | 'following' | 'unseen'>('foryou');
  const [isBuyCoinsOpen, setIsBuyCoinsOpen] = useState(false);
  const [showVeraBanner, setShowVeraBanner] = useState(true);
  const [showLiftBanner, setShowLiftBanner] = useState(false);
  const { coins, addCoins, subtractCoins } = useCoins();

  useEffect(() => {
    setPosts(allPosts);
  }, [allPosts]);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
    
    // Check if we should show lift banner today
    if (typeof window !== 'undefined') {
      const lastShown = localStorage.getItem('liftBannerShown');
      const today = new Date().toDateString();
      if (lastShown !== today) {
        setShowLiftBanner(true);
      }
    }
  }, []);

  const handleDismissLiftBanner = () => {
    setShowLiftBanner(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('liftBannerShown', new Date().toDateString());
    }
  };

  const handleSpotlightSeen = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, spotlightViews: Math.max(0, post.spotlightViews - 1), views: post.views + 1 }
        : post
    ));
  };

  const handleBoost = (postId: string, boostId: string, cost: number, views: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            spotlightViews: post.spotlightViews + views,
            isBoosted: true,
            boostLevel: boostId as 'boost' | 'spotlight' | 'mega'
          }
        : post
    ));
  };

  const getFilteredPosts = () => {
    if (activeFilter === 'unseen') {
      return posts.filter(post => {
        const totalReactions = post.reactions.hug + post.reactions.strength + post.reactions.light + post.reactions.love;
        return totalReactions < 5;
      });
    }
    return posts;
  };

  const filteredPosts = getFilteredPosts();

  const handleReaction = (postId: string, reaction: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const wasReacted = post.userReaction === reaction;
        return {
          ...post,
          reactions: {
            ...post.reactions,
            [reaction]: wasReacted 
              ? post.reactions[reaction as keyof typeof post.reactions] - 1 
              : post.reactions[reaction as keyof typeof post.reactions] + 1,
          },
          userReaction: wasReacted ? null : reaction,
          views: post.views + 1,
        };
      }
      return post;
    }));
  };

  return (
    <>
      <style jsx>{`
        .feed-page {
          min-height: 100vh;
          min-height: 100dvh;
        }
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: linear-gradient(180deg, 
            rgba(15, 15, 26, 0.98) 0%, 
            rgba(15, 15, 26, 0.9) 70%,
            transparent 100%);
          padding: calc(env(safe-area-inset-top, 0px) + 10px) 12px 12px;
          backdrop-filter: blur(25px);
        }
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .logo-icon {
          font-size: 1.5rem;
          animation: heartbeat 2s ease-in-out infinite;
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1); }
          75% { transform: scale(1.1); }
        }
        .logo-text {
          font-size: 1.2rem;
          font-weight: 600;
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 0.02em;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .coin-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border-radius: 50px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(251, 191, 36, 0.08) 100%);
          border: 0.5px solid rgba(212, 175, 55, 0.25);
          color: #d4af37;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
        }
        .coin-btn:hover {
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.25) 0%, rgba(245, 158, 11, 0.2) 100%);
        }
        .user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.5) 0%, rgba(236, 72, 153, 0.5) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
          cursor: pointer;
          transition: transform 0.2s ease;
          border: 1.5px solid rgba(139, 92, 246, 0.3);
        }
        .user-avatar:hover {
          transform: scale(1.05);
        }
        .filter-tabs {
          display: flex;
          gap: 8px;
        }
        .filter-tab {
          padding: 6px 14px;
          border-radius: 50px;
          background: transparent;
          border: 0.5px solid rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.02em;
        }
        .filter-tab:hover {
          border-color: rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.8);
        }
        .filter-tab.active {
          background: rgba(139, 92, 246, 0.15);
          border-color: rgba(139, 92, 246, 0.4);
          color: #a78bfa;
        }
        .lift-banner {
          margin: 16px;
          padding: 16px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
          border: 1px solid rgba(139, 92, 246, 0.3);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .lift-banner-content {
          flex: 1;
        }
        .lift-banner-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 4px;
        }
        .lift-banner-text {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
        }
        .lift-banner-dismiss {
          padding: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          font-size: 1.2rem;
        }
        .unseen-header {
          padding: 16px;
          text-align: center;
          color: #a78bfa;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .heartbeat-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          overflow: hidden;
        }
        .heartbeat-wave {
          position: absolute;
          top: 0;
          left: -100%;
          width: 200%;
          height: 100%;
          background: linear-gradient(90deg,
            transparent 0%,
            transparent 40%,
            rgba(139, 92, 246, 0.5) 45%,
            rgba(236, 72, 153, 0.8) 50%,
            rgba(139, 92, 246, 0.5) 55%,
            transparent 60%,
            transparent 100%);
          animation: heartbeatWave 2s ease-in-out infinite;
        }
        @keyframes heartbeatWave {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); }
        }
        .feed {
          padding: calc(env(safe-area-inset-top, 0px) + 120px) 0 20px;
        }
        .posts-container {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          gap: 16px;
        }
        .loading-pulse {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
          animation: pulse 1s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        .loading-text {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9rem;
        }
      `}</style>

      <div className="feed-page">
        <header className="header">
          <div className="header-content">
            <div className="logo">
              <span className="logo-icon">💓</span>
              <span className="logo-text">Pulse</span>
            </div>
            <div className="header-actions">
              <button className="coin-btn" onClick={() => setIsBuyCoinsOpen(true)}>
                <span>🪙</span>
                <span>{coins}</span>
              </button>
              {profile && (
                <div className="user-avatar" title={profile.display_name}>
                  {profile.avatar || profile.display_name[0].toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className="filter-tabs">
            <button 
              className={`filter-tab ${activeFilter === 'foryou' ? 'active' : ''}`}
              onClick={() => setActiveFilter('foryou')}
            >
              For You
            </button>
            <button 
              className={`filter-tab ${activeFilter === 'following' ? 'active' : ''}`}
              onClick={() => setActiveFilter('following')}
            >
              Following
            </button>
            <button 
              className={`filter-tab ${activeFilter === 'unseen' ? 'active' : ''}`}
              onClick={() => setActiveFilter('unseen')}
            >
              Unseen
            </button>
          </div>

          <div className="heartbeat-line">
            <div className="heartbeat-wave" />
          </div>
        </header>

        <div className="feed">
          {showLiftBanner && (
            <div className="lift-banner">
              <div className="lift-banner-content">
                <div className="lift-banner-title">🌱 Daily Challenge: Lift someone up today</div>
                <div className="lift-banner-text">Send support to a post with few reactions</div>
              </div>
              <button className="lift-banner-dismiss" onClick={handleDismissLiftBanner}>×</button>
            </div>
          )}

          <SpotlightQueue 
            posts={posts}
            onPostSeen={handleSpotlightSeen}
          />

          {activeFilter === 'unseen' && (
            <div className="unseen-header">
              Give these posts some love 💜
            </div>
          )}

          {isLoading ? (
            <div className="loading">
              <div className="loading-pulse" />
              <span className="loading-text">Loading your pulse...</span>
            </div>
          ) : (
            <div className="posts-container">
              {filteredPosts.map((post, index) => {
                // Find all response posts for this post
                const responsePosts = posts.filter(p => p.responseToId === post.id);
                
                return (
                  <div key={post.id}>
                    <PostCard
                      post={post}
                      onReaction={handleReaction}
                      onBoost={handleBoost}
                      isOwnPost={post.author.id === 'me'}
                      responsePosts={responsePosts}
                    />
                    {index === 2 && showVeraBanner && (
                      <VeraUpsellBanner
                        onDismiss={() => setShowVeraBanner(false)}
                        onLearnMore={() => console.log('Learn more about Vera')}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <BuyCoinsModal
          isOpen={isBuyCoinsOpen}
          onClose={() => setIsBuyCoinsOpen(false)}
          balance={coins}
          onPurchase={addCoins}
        />
      </div>
    </>
  );
}
