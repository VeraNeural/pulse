'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface CoinsModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onPurchase: (coins: number) => void;
}

const COIN_PACKAGES = [
  { id: 'starter', coins: 100, price: 0.99, priceId: 'price_1SohiDF8aJ0BDqA3uWEk7DCX', popular: false },
  { id: 'basic', coins: 500, price: 3.99, priceId: 'price_1SohiXF8aJ0BDqA3VZXAx9GC', popular: true },
  { id: 'value', coins: 1000, price: 6.99, priceId: 'price_1SohiqF8aJ0BDqA3LuHtCLfc', popular: false, bonus: 50 },
  { id: 'premium', coins: 2500, price: 14.99, priceId: 'price_1SohjgF8aJ0BDqA3bZvxRrG7', popular: false, bonus: 200 },
  { id: 'ultimate', coins: 5000, price: 24.99, priceId: 'price_1SohkAF8aJ0BDqA39VMRfN21', popular: false, bonus: 500 },
];

export function BuyCoinsModal({ isOpen, onClose, balance, onPurchase }: CoinsModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { user } = useAuth();

  const handlePurchase = async () => {
    if (!selectedPackage || !user) return;
    
    setIsPurchasing(true);
    
    const pkg = COIN_PACKAGES.find(p => p.id === selectedPackage);
    if (!pkg) {
      setIsPurchasing(false);
      return;
    }

    try {
      // Create Stripe checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: pkg.priceId,
          coins: pkg.coins + (pkg.bonus || 0),
          userId: user.id,
        }),
      });

      const { url, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      if (url) {
        // Redirect to Stripe checkout
        window.location.href = url;
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Failed to process payment. Please try again.');
      setIsPurchasing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          z-index: 300;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .modal-content {
          width: 100%;
          max-width: 400px;
          background: linear-gradient(180deg, #1a1a2e 0%, #151525 100%);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
          animation: scaleIn 0.3s ease;
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .modal-header {
          padding: 24px 24px 16px;
          text-align: center;
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%);
        }
        
        .header-icon {
          font-size: 3rem;
          margin-bottom: 12px;
        }
        
        .header-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 4px;
        }
        
        .balance-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 1.1rem;
          color: #fbbf24;
          font-weight: 600;
        }
        
        .packages-list {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .package-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .package-item:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.15);
        }
        
        .package-item.selected {
          background: rgba(251, 191, 36, 0.1);
          border-color: rgba(251, 191, 36, 0.5);
        }
        
        .package-item.popular {
          position: relative;
        }
        
        .popular-badge {
          position: absolute;
          top: -8px;
          right: 16px;
          padding: 4px 10px;
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
          color: white;
        }
        
        .package-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .package-icon {
          font-size: 1.5rem;
        }
        
        .package-coins {
          font-size: 1.1rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.95);
        }
        
        .package-bonus {
          font-size: 0.8rem;
          color: #34d399;
          margin-left: 8px;
        }
        
        .package-price {
          font-size: 1.1rem;
          font-weight: 600;
          color: #fbbf24;
        }
        
        .modal-footer {
          padding: 16px 24px 24px;
          display: flex;
          gap: 12px;
        }
        
        .cancel-btn {
          flex: 1;
          padding: 14px;
          border-radius: 50px;
          background: rgba(255, 255, 255, 0.08);
          border: none;
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
        }
        
        .purchase-btn {
          flex: 2;
          padding: 14px;
          border-radius: 50px;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          border: none;
          color: #1a1a2e;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .purchase-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .purchase-btn:not(:disabled):hover {
          transform: scale(1.02);
          box-shadow: 0 4px 20px rgba(251, 191, 36, 0.3);
        }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <div className="header-icon">🪙</div>
            <h2 className="header-title">Get Coins</h2>
            <div className="balance-display">
              <span>Balance:</span>
              <span>{balance.toLocaleString()} coins</span>
            </div>
          </div>
          
          <div className="packages-list">
            {COIN_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`package-item ${selectedPackage === pkg.id ? 'selected' : ''} ${pkg.popular ? 'popular' : ''}`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {pkg.popular && <span className="popular-badge">BEST VALUE</span>}
                <div className="package-info">
                  <span className="package-icon">🪙</span>
                  <span className="package-coins">
                    {pkg.coins.toLocaleString()}
                    {pkg.bonus && <span className="package-bonus">+{pkg.bonus} bonus!</span>}
                  </span>
                </div>
                <span className="package-price">${pkg.price}</span>
              </div>
            ))}
          </div>
          
          <div className="modal-footer">
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
            <button 
              className="purchase-btn" 
              onClick={handlePurchase}
              disabled={!selectedPackage || isPurchasing}
            >
              {isPurchasing ? 'Processing...' : 'Purchase'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Send Gift Modal
interface SendGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  balance: number;
  onSend: (giftId: string, cost: number) => void;
}

const GIFTS = [
  { id: 'hug', emoji: '🫂', name: 'Hug', cost: 10 },
  { id: 'strength', emoji: '💪', name: 'Strength', cost: 25 },
  { id: 'light', emoji: '🕯️', name: 'Light', cost: 50 },
  { id: 'love', emoji: '💜', name: 'Love', cost: 100 },
  { id: 'supernova', emoji: '🌟', name: 'Supernova', cost: 250 },
  { id: 'rainbow', emoji: '🌈', name: 'Rainbow', cost: 500 },
];

export function SendGiftModal({ isOpen, onClose, recipientName, balance, onSend }: SendGiftModalProps) {
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSend = async () => {
    if (!selectedGift) return;
    
    const gift = GIFTS.find(g => g.id === selectedGift);
    if (!gift || balance < gift.cost) return;
    
    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSend(selectedGift, gift.cost);
    setIsSending(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedGift(null);
      onClose();
    }, 2000);
  };

  const selectedGiftData = GIFTS.find(g => g.id === selectedGift);
  const canAfford = selectedGiftData ? balance >= selectedGiftData.cost : true;

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          z-index: 300;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .modal-content {
          width: 100%;
          max-width: 400px;
          background: linear-gradient(180deg, #1a1a2e 0%, #151525 100%);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
          animation: scaleIn 0.3s ease;
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .modal-header {
          padding: 24px 24px 16px;
          text-align: center;
        }
        
        .header-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 4px;
        }
        
        .header-subtitle {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.5);
        }
        
        .balance-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 12px;
          padding: 8px 16px;
          background: rgba(251, 191, 36, 0.1);
          border-radius: 50px;
          width: fit-content;
          margin-left: auto;
          margin-right: auto;
        }
        
        .balance-text {
          font-size: 0.9rem;
          color: #fbbf24;
          font-weight: 600;
        }
        
        .gifts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          padding: 16px 24px;
        }
        
        .gift-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px 8px;
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .gift-item:hover {
          background: rgba(255, 255, 255, 0.06);
        }
        
        .gift-item.selected {
          background: rgba(139, 92, 246, 0.15);
          border-color: rgba(139, 92, 246, 0.5);
        }
        
        .gift-item.disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        
        .gift-emoji {
          font-size: 2rem;
        }
        
        .gift-name {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }
        
        .gift-cost {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          color: #fbbf24;
          font-weight: 600;
        }
        
        .modal-footer {
          padding: 16px 24px 24px;
          display: flex;
          gap: 12px;
        }
        
        .cancel-btn {
          flex: 1;
          padding: 14px;
          border-radius: 50px;
          background: rgba(255, 255, 255, 0.08);
          border: none;
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
        }
        
        .send-btn {
          flex: 2;
          padding: 14px;
          border-radius: 50px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border: none;
          color: white;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .send-btn:not(:disabled):hover {
          transform: scale(1.02);
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
        }
        
        .insufficient {
          color: #f87171;
          font-size: 0.85rem;
          text-align: center;
          padding: 8px;
        }
        
        .success-overlay {
          position: absolute;
          inset: 0;
          background: rgba(15, 15, 26, 0.95);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          animation: fadeIn 0.3s ease;
        }
        
        .success-emoji {
          font-size: 4rem;
          animation: bounce 0.5s ease;
        }
        
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        .success-text {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.95);
          font-weight: 600;
        }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
          {showSuccess ? (
            <div className="success-overlay">
              <div className="success-emoji">{selectedGiftData?.emoji}</div>
              <div className="success-text">Gift sent to {recipientName}! 💜</div>
            </div>
          ) : (
            <>
              <div className="modal-header">
                <h2 className="header-title">Send a Gift</h2>
                <p className="header-subtitle">to {recipientName}</p>
                <div className="balance-row">
                  <span>🪙</span>
                  <span className="balance-text">{balance.toLocaleString()} coins</span>
                </div>
              </div>
              
              <div className="gifts-grid">
                {GIFTS.map((gift) => (
                  <div
                    key={gift.id}
                    className={`gift-item ${selectedGift === gift.id ? 'selected' : ''} ${balance < gift.cost ? 'disabled' : ''}`}
                    onClick={() => balance >= gift.cost && setSelectedGift(gift.id)}
                  >
                    <span className="gift-emoji">{gift.emoji}</span>
                    <span className="gift-name">{gift.name}</span>
                    <span className="gift-cost">🪙 {gift.cost}</span>
                  </div>
                ))}
              </div>
              
              {selectedGift && !canAfford && (
                <p className="insufficient">Not enough coins! Buy more to send this gift.</p>
              )}
              
              <div className="modal-footer">
                <button className="cancel-btn" onClick={onClose}>Cancel</button>
                <button 
                  className="send-btn" 
                  onClick={handleSend}
                  disabled={!selectedGift || !canAfford || isSending}
                >
                  {isSending ? 'Sending...' : selectedGiftData ? `Send ${selectedGiftData.emoji} (${selectedGiftData.cost})` : 'Select a gift'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
