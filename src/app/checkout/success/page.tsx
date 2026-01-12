'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const premium = searchParams.get('premium');
  const coins = searchParams.get('coins');

  useEffect(() => {
    // Refresh user data after successful payment
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }, []);

  return (
    <>
      <style jsx>{`
        .success-page {
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #0f0f1a 0%, #151525 100%);
          padding: 20px;
          text-align: center;
        }
        .success-icon {
          font-size: 5rem;
          margin-bottom: 24px;
          animation: celebrate 0.6s ease-out;
        }
        @keyframes celebrate {
          0% { transform: scale(0) rotate(-180deg); }
          60% { transform: scale(1.2) rotate(10deg); }
          100% { transform: scale(1) rotate(0); }
        }
        .success-title {
          color: #fff;
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 12px;
          letter-spacing: 0.01em;
        }
        .success-message {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
          margin-bottom: 36px;
          line-height: 1.5;
        }
        .coins-amount {
          color: #d4af37;
          font-weight: 600;
          font-size: 1.1rem;
        }
        .back-btn {
          padding: 14px 40px;
          border-radius: 50px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border: none;
          color: white;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.02em;
        }
        .back-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(139, 92, 246, 0.4);
        }
        .loading-note {
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.8rem;
          margin-top: 24px;
        }
      `}</style>

      <div className="success-page">
        {premium ? (
          <>
            <div className="success-icon">🏛️</div>
            <h1 className="success-title">Welcome to VERA Premium!</h1>
            <p className="success-message">Your Sanctuary is now fully unlocked</p>
          </>
        ) : (
          <>
            <div className="success-icon">🎉</div>
            <h1 className="success-title">Payment Successful!</h1>
            <p className="success-message">
              <span className="coins-amount">🪙 {coins} coins</span> have been added to your account
            </p>
          </>
        )}
        <button className="back-btn" onClick={() => router.push('/')}>
          Back to Pulse
        </button>
        <p className="loading-note">Refreshing your balance...</p>
      </div>
    </>
  );
}
