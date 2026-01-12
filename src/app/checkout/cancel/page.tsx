'use client';

import { useRouter } from 'next/navigation';

export default function CheckoutCancel() {
  const router = useRouter();

  return (
    <>
      <style jsx>{`
        .cancel-page {
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
        .cancel-icon {
          font-size: 5rem;
          margin-bottom: 24px;
          opacity: 0.8;
        }
        .cancel-title {
          color: #fff;
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 12px;
          letter-spacing: 0.01em;
        }
        .cancel-message {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
          margin-bottom: 36px;
          line-height: 1.5;
        }
        .back-btn {
          padding: 14px 40px;
          border-radius: 50px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
        }
        .back-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }
      `}</style>

      <div className="cancel-page">
        <div className="cancel-icon">😔</div>
        <h1 className="cancel-title">Payment Cancelled</h1>
        <p className="cancel-message">
          No worries! Your coins are waiting for you whenever you're ready.
        </p>
        <button className="back-btn" onClick={() => router.push('/')}>
          Back to Pulse
        </button>
      </div>
    </>
  );
}
