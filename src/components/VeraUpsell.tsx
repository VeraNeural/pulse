'use client';

import { useState } from 'react';

// VERA Upsell Banner - shows inline in feed
interface VeraBannerProps {
  onDismiss?: () => void;
  onLearnMore: () => void;
}

export function VeraUpsellBanner({ onDismiss, onLearnMore }: VeraBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <>
      <style jsx>{`
        .vera-banner {
          margin: 16px;
          padding: 20px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.1) 100%);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 20px;
          position: relative;
        }
        
        .dismiss-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: rgba(255, 255, 255, 0.5);
          font-size: 1rem;
          cursor: pointer;
        }
        
        .banner-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .banner-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          flex-shrink: 0;
        }
        
        .banner-text {
          flex: 1;
        }
        
        .banner-title {
          font-size: 1rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 4px;
        }
        
        .banner-subtitle {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.4;
        }
        
        .banner-btn {
          padding: 10px 20px;
          border-radius: 50px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border: none;
          color: white;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }
        
        .banner-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        }
      `}</style>

      <div className="vera-banner">
        <button 
          className="dismiss-btn" 
          onClick={() => {
            setDismissed(true);
            onDismiss?.();
          }}
        >
          ×
        </button>
        <div className="banner-content">
          <div className="banner-icon">🏛️</div>
          <div className="banner-text">
            <h3 className="banner-title">Unlock VERA Sanctuary</h3>
            <p className="banner-subtitle">7 healing rooms for deeper self-care. Meditation, journaling & more.</p>
          </div>
          <button className="banner-btn" onClick={onLearnMore}>
            Explore
          </button>
        </div>
      </div>
    </>
  );
}

// VERA Upsell Card - shows on profile
interface VeraCardProps {
  onSubscribe: () => void;
}

export function VeraUpsellCard({ onSubscribe }: VeraCardProps) {
  return (
    <>
      <style jsx>{`
        .vera-card {
          margin: 16px;
          padding: 24px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.15) 50%, rgba(59, 130, 246, 0.1) 100%);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 24px;
        }
        
        .card-header {
          text-align: center;
          margin-bottom: 20px;
        }
        
        .card-icon {
          font-size: 3rem;
          margin-bottom: 12px;
        }
        
        .card-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 4px;
        }
        
        .card-subtitle {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
        }
        
        .rooms-preview {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        
        .room-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
        }
        
        .features-list {
          margin-bottom: 24px;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .feature-item:last-child {
          border-bottom: none;
        }
        
        .feature-check {
          color: #34d399;
          font-size: 1rem;
        }
        
        .feature-text {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .pricing {
          text-align: center;
          margin-bottom: 20px;
        }
        
        .price {
          font-size: 2rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.95);
        }
        
        .price-period {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.5);
        }
        
        .subscribe-btn {
          width: 100%;
          padding: 16px;
          border-radius: 50px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #ec4899 100%);
          border: none;
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .subscribe-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 25px rgba(139, 92, 246, 0.4);
        }
        
        .includes-pulse {
          text-align: center;
          margin-top: 12px;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
        }
      `}</style>

      <div className="vera-card">
        <div className="card-header">
          <div className="card-icon">🏛️</div>
          <h3 className="card-title">VERA Sanctuary</h3>
          <p className="card-subtitle">Your personal healing space</p>
        </div>
        
        <div className="rooms-preview">
          <div className="room-icon">🧘</div>
          <div className="room-icon">📔</div>
          <div className="room-icon">📚</div>
          <div className="room-icon">🛏️</div>
          <div className="room-icon">🎨</div>
          <div className="room-icon">💆</div>
          <div className="room-icon">☯️</div>
        </div>
        
        <div className="features-list">
          <div className="feature-item">
            <span className="feature-check">✓</span>
            <span className="feature-text">7 Immersive healing rooms</span>
          </div>
          <div className="feature-item">
            <span className="feature-check">✓</span>
            <span className="feature-text">Unlimited AI journaling</span>
          </div>
          <div className="feature-item">
            <span className="feature-check">✓</span>
            <span className="feature-text">Guided meditations & sounds</span>
          </div>
          <div className="feature-item">
            <span className="feature-check">✓</span>
            <span className="feature-text">Pulse+ included (unlimited posts)</span>
          </div>
          <div className="feature-item">
            <span className="feature-check">✓</span>
            <span className="feature-text">Priority support access</span>
          </div>
        </div>
        
        <div className="pricing">
          <span className="price">$9.99</span>
          <span className="price-period">/month</span>
        </div>
        
        <button className="subscribe-btn" onClick={onSubscribe}>
          Unlock Sanctuary ✨
        </button>
        
        <p className="includes-pulse">Cancel anytime • Includes Pulse+</p>
      </div>
    </>
  );
}

// VERA Upsell Modal - full screen promo
interface VeraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

export function VeraUpsellModal({ isOpen, onClose, onSubscribe }: VeraModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          z-index: 400;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .modal-content {
          width: 100%;
          max-width: 440px;
          max-height: 90vh;
          background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
          border-radius: 32px;
          border: 1px solid rgba(139, 92, 246, 0.3);
          overflow-y: auto;
          animation: scaleIn 0.3s ease;
          position: relative;
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.3rem;
          cursor: pointer;
          z-index: 10;
        }
        
        .hero-section {
          padding: 40px 24px;
          text-align: center;
          background: linear-gradient(180deg, rgba(139, 92, 246, 0.2) 0%, transparent 100%);
        }
        
        .hero-icon {
          font-size: 5rem;
          margin-bottom: 20px;
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .hero-title {
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 12px;
        }
        
        .hero-subtitle {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.5;
        }
        
        .rooms-section {
          padding: 0 24px 24px;
        }
        
        .rooms-title {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 16px;
          text-align: center;
        }
        
        .rooms-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        
        .room-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        
        .room-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        
        .room-name {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.6);
          text-align: center;
        }
        
        .cta-section {
          padding: 24px;
          background: rgba(139, 92, 246, 0.1);
          border-top: 1px solid rgba(139, 92, 246, 0.2);
        }
        
        .price-display {
          text-align: center;
          margin-bottom: 20px;
        }
        
        .price-amount {
          font-size: 2.5rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.95);
        }
        
        .price-period {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.5);
        }
        
        .subscribe-btn {
          width: 100%;
          padding: 18px;
          border-radius: 50px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #ec4899 100%);
          border: none;
          color: white;
          font-size: 1.2rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 12px;
        }
        
        .subscribe-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 30px rgba(139, 92, 246, 0.5);
        }
        
        .terms {
          text-align: center;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
        }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose}>×</button>
          
          <div className="hero-section">
            <div className="hero-icon">🏛️</div>
            <h2 className="hero-title">VERA Sanctuary</h2>
            <p className="hero-subtitle">Your private space for healing, growth, and inner peace.</p>
          </div>
          
          <div className="rooms-section">
            <p className="rooms-title">7 Immersive Rooms</p>
            <div className="rooms-grid">
              <div className="room-item">
                <div className="room-icon">🧘</div>
                <span className="room-name">Zen</span>
              </div>
              <div className="room-item">
                <div className="room-icon">📔</div>
                <span className="room-name">Journal</span>
              </div>
              <div className="room-item">
                <div className="room-icon">📚</div>
                <span className="room-name">Library</span>
              </div>
              <div className="room-item">
                <div className="room-icon">🛏️</div>
                <span className="room-name">Bedroom</span>
              </div>
              <div className="room-item">
                <div className="room-icon">🎨</div>
                <span className="room-name">Studio</span>
              </div>
              <div className="room-item">
                <div className="room-icon">💆</div>
                <span className="room-name">Therapy</span>
              </div>
              <div className="room-item">
                <div className="room-icon">☯️</div>
                <span className="room-name">Balance</span>
              </div>
              <div className="room-item">
                <div className="room-icon">💓</div>
                <span className="room-name">Pulse+</span>
              </div>
            </div>
          </div>
          
          <div className="cta-section">
            <div className="price-display">
              <span className="price-amount">$9.99</span>
              <span className="price-period">/month</span>
            </div>
            <button className="subscribe-btn" onClick={onSubscribe}>
              Start Your Journey ✨
            </button>
            <p className="terms">7-day free trial • Cancel anytime</p>
          </div>
        </div>
      </div>
    </>
  );
}

// Inline text link for VERA
export function VeraInlineLink({ onClick }: { onClick: () => void }) {
  return (
    <span 
      onClick={onClick}
      style={{
        color: '#a78bfa',
        cursor: 'pointer',
        fontWeight: 500,
      }}
    >
      Unlock VERA Sanctuary →
    </span>
  );
}
