'use client';

import { useState } from 'react';
import { BOOST_OPTIONS } from '@/lib/data';

interface BoostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentViews: number;
  balance: number;
  onBoost: (boostId: string, cost: number, views: number) => void;
  onBuyCoins: () => void;
}

export default function BoostModal({ 
  isOpen, 
  onClose, 
  currentViews, 
  balance, 
  onBoost, 
  onBuyCoins 
}: BoostModalProps) {
  const [selectedBoost, setSelectedBoost] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBoost = () => {
    const boost = BOOST_OPTIONS.find(b => b.id === selectedBoost);
    if (boost && balance >= boost.cost) {
      onBoost(boost.id, boost.cost, boost.views);
      onClose();
    }
  };

  const selectedBoostOption = BOOST_OPTIONS.find(b => b.id === selectedBoost);
  const canAfford = selectedBoostOption ? balance >= selectedBoostOption.cost : false;

  return (
    <>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 15, 26, 0.9);
          backdrop-filter: blur(10px);
          z-index: 200;
          display: flex;
          align-items: flex-end;
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal-content {
          width: 100%;
          background: linear-gradient(180deg, #1a1a2e 0%, #151525 100%);
          border-radius: 24px 24px 0 0;
          padding: 20px 16px calc(env(safe-area-inset-bottom, 0px) + 20px);
          animation: slideUp 0.3s ease-out;
          max-height: 85vh;
          overflow-y: auto;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .modal-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.95);
          letter-spacing: 0.01em;
        }
        .close-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .close-btn:hover {
          background: rgba(255, 255, 255, 0.15);
        }
        .current-stats {
          background: rgba(255, 255, 255, 0.03);
          border: 0.5px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .stat {
          text-align: center;
        }
        .stat-value {
          font-size: 1.3rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.95);
        }
        .stat-label {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 2px;
        }
        .section-title {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
        }
        .boost-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }
        .boost-card {
          background: rgba(255, 255, 255, 0.03);
          border: 0.5px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .boost-card:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateX(2px);
        }
        .boost-card.selected {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(251, 191, 36, 0.08) 100%);
          border-color: rgba(212, 175, 55, 0.4);
        }
        .boost-card.featured {
          border-color: rgba(212, 175, 55, 0.3);
        }
        .featured-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          padding: 3px 8px;
          border-radius: 50px;
          background: linear-gradient(135deg, #d4af37 0%, #fbbf24 100%);
          font-size: 0.65rem;
          font-weight: 600;
          color: #1a1a2e;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        .boost-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .boost-icon {
          font-size: 1.8rem;
        }
        .boost-info {
          flex: 1;
        }
        .boost-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 2px;
          letter-spacing: 0.01em;
        }
        .boost-views {
          font-size: 0.75rem;
          color: #d4af37;
          font-weight: 500;
        }
        .boost-cost {
          font-size: 1rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.95);
        }
        .boost-description {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.4;
          letter-spacing: 0.01em;
        }
        .balance-section {
          background: rgba(212, 175, 55, 0.08);
          border: 0.5px solid rgba(212, 175, 55, 0.25);
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .balance-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 2px;
        }
        .balance-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: #d4af37;
        }
        .buy-coins-btn {
          padding: 6px 14px;
          border-radius: 50px;
          background: transparent;
          border: 0.5px solid rgba(212, 175, 55, 0.3);
          color: #d4af37;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.02em;
        }
        .buy-coins-btn:hover {
          background: rgba(212, 175, 55, 0.1);
        }
        .boost-btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          background: linear-gradient(135deg, #d4af37 0%, #fbbf24 100%);
          border: none;
          color: #1a1a2e;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        .boost-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
        }
        .boost-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .insufficient-funds {
          text-align: center;
          padding: 8px;
          font-size: 0.75rem;
          color: #f87171;
          margin-top: 8px;
        }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">🚀 Boost Your Post</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>

          <div className="current-stats">
            <div className="stat">
              <div className="stat-value">👁 {currentViews.toLocaleString()}</div>
              <div className="stat-label">Current Views</div>
            </div>
          </div>

          <div className="section-title">Choose Your Boost</div>
          
          <div className="boost-options">
            {BOOST_OPTIONS.map((boost) => (
              <div
                key={boost.id}
                className={`boost-card ${selectedBoost === boost.id ? 'selected' : ''} ${boost.featured ? 'featured' : ''}`}
                onClick={() => setSelectedBoost(boost.id)}
              >
                {boost.featured && <div className="featured-badge">Popular</div>}
                
                <div className="boost-header">
                  <div className="boost-icon">{boost.icon}</div>
                  <div className="boost-info">
                    <div className="boost-name">{boost.name}</div>
                    <div className="boost-views">+{boost.views.toLocaleString()} views</div>
                  </div>
                  <div className="boost-cost">🪙 {boost.cost}</div>
                </div>
                
                <div className="boost-description">
                  {boost.id === 'boost' && 'Get 500 more guaranteed views on your post'}
                  {boost.id === 'spotlight' && 'Featured in spotlight queue for 1 hour + 1000 views'}
                  {boost.id === 'mega' && '2000 guaranteed views + notify all your followers'}
                </div>
              </div>
            ))}
          </div>

          <div className="balance-section">
            <div>
              <div className="balance-label">Your Balance</div>
              <div className="balance-value">🪙 {balance.toLocaleString()}</div>
            </div>
            <button className="buy-coins-btn" onClick={onBuyCoins}>
              + Buy Coins
            </button>
          </div>

          <button
            className="boost-btn"
            disabled={!selectedBoost || !canAfford}
            onClick={handleBoost}
          >
            {selectedBoost && !canAfford ? 'Insufficient Coins' : 'Boost Now'}
          </button>

          {selectedBoost && !canAfford && (
            <div className="insufficient-funds">
              You need {selectedBoostOption!.cost - balance} more coins
            </div>
          )}
        </div>
      </div>
    </>
  );
}
