'use client';

import { useAuth } from '@/contexts/AuthContext';

interface PulsePlusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVeraPremium: () => void;
}

const PULSE_PLUS_PRICE_ID = 'price_1SohlCF8aJ0BDqA3Oj0bwCsb';

export function PulsePlusModal({ isOpen, onClose, onVeraPremium }: PulsePlusModalProps) {
  const { user } = useAuth();

  const handleSubscribe = async () => {
    try {
      if (!user) return;

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: PULSE_PLUS_PRICE_ID,
          mode: 'subscription',
          userId: user.id,
        }),
      });

      const { url, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.78);
          backdrop-filter: blur(10px);
          z-index: 350;
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

        .modal {
          width: 100%;
          max-width: 420px;
          background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
          border-radius: 28px;
          border: 1px solid rgba(139, 92, 246, 0.28);
          overflow: hidden;
          position: relative;
        }

        .header {
          padding: 22px 20px 16px;
          text-align: center;
          background: linear-gradient(180deg, rgba(139, 92, 246, 0.18) 0%, transparent 100%);
        }

        .close-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: none;
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.2rem;
          cursor: pointer;
        }

        .title {
          font-size: 1.35rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.95);
          margin: 0 0 10px;
          letter-spacing: 0.01em;
        }

        .price {
          display: inline-flex;
          align-items: baseline;
          gap: 6px;
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(139, 92, 246, 0.14);
          border: 1px solid rgba(139, 92, 246, 0.28);
          color: rgba(255, 255, 255, 0.95);
        }

        .price-amount {
          font-size: 1.6rem;
          font-weight: 800;
        }

        .price-period {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .body {
          padding: 16px 20px 18px;
        }

        .features {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin: 0 0 16px;
          padding: 0;
          list-style: none;
        }

        .feature {
          display: flex;
          gap: 10px;
          align-items: center;
          padding: 10px 12px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .check {
          color: #a78bfa;
          font-weight: 800;
        }

        .text {
          color: rgba(255, 255, 255, 0.82);
          font-size: 0.92rem;
        }

        .subscribe-btn {
          width: 100%;
          padding: 14px 16px;
          border-radius: 999px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #ec4899 100%);
          border: none;
          color: white;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .subscribe-btn:hover {
          transform: scale(1.01);
        }

        .bottom-link {
          margin-top: 12px;
          text-align: center;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .link {
          color: #a78bfa;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>

          <div className="header">
            <h2 className="title">Upgrade to Pulse+</h2>
            <div className="price">
              <span className="price-amount">$2.99</span>
              <span className="price-period">/month</span>
            </div>
          </div>

          <div className="body">
            <ul className="features">
              <li className="feature"><span className="check">✓</span><span className="text">Unlimited posts (no daily limit)</span></li>
              <li className="feature"><span className="check">✓</span><span className="text">Custom profile badge</span></li>
              <li className="feature"><span className="check">✓</span><span className="text">Priority in Spotlight Queue</span></li>
              <li className="feature"><span className="check">✓</span><span className="text">Access to exclusive hashtags</span></li>
            </ul>

            <button className="subscribe-btn" onClick={handleSubscribe}>
              Upgrade to Pulse+ 💜
            </button>

            <div className="bottom-link">
              Want more?{' '}
              <span
                className="link"
                onClick={() => {
                  onClose();
                  onVeraPremium();
                }}
              >
                Get VERA Premium for $8/mo
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
