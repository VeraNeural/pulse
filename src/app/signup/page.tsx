'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (displayName.trim().length < 2) {
      setError('Display name must be at least 2 characters');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password, displayName.trim());
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .signup-page {
          min-height: 100vh;
          min-height: 100dvh;
          background: linear-gradient(180deg, #0f0f1a 0%, #151525 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .signup-container {
          width: 100%;
          max-width: 380px;
        }
        .logo {
          text-align: center;
          margin-bottom: 40px;
        }
        .logo-icon {
          font-size: 3.5rem;
          margin-bottom: 12px;
        }
        .logo-text {
          font-size: 1.8rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.95);
          letter-spacing: 0.02em;
        }
        .logo-tagline {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 6px;
          letter-spacing: 0.01em;
        }
        .form-card {
          background: rgba(255, 255, 255, 0.03);
          border: 0.5px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 32px 28px;
          margin-bottom: 20px;
        }
        .form-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 8px;
          text-align: center;
          letter-spacing: 0.01em;
        }
        .form-subtitle {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 24px;
          text-align: center;
          line-height: 1.4;
        }
        .input-group {
          margin-bottom: 16px;
        }
        .input-label {
          display: block;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 8px;
          letter-spacing: 0.01em;
        }
        .input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.95);
          font-size: 0.95rem;
          font-family: inherit;
          transition: all 0.2s ease;
        }
        .input:focus {
          outline: none;
          border-color: rgba(139, 92, 246, 0.5);
          background: rgba(255, 255, 255, 0.08);
        }
        .input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 0.5px solid rgba(239, 68, 68, 0.3);
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 16px;
          font-size: 0.8rem;
          color: #f87171;
          text-align: center;
        }
        .submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.02em;
          margin-top: 8px;
        }
        .submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .footer-text {
          text-align: center;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
        }
        .footer-link {
          color: #a78bfa;
          text-decoration: none;
          font-weight: 500;
          cursor: pointer;
        }
        .footer-link:hover {
          text-decoration: underline;
        }
        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .welcome-note {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(236, 72, 153, 0.05) 100%);
          border: 0.5px solid rgba(139, 92, 246, 0.2);
          border-radius: 12px;
          padding: 12px 14px;
          margin-bottom: 20px;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
          line-height: 1.4;
        }
      `}</style>

      <div className="signup-page">
        <div className="signup-container">
          <div className="logo">
            <div className="logo-icon">💜</div>
            <div className="logo-text">Pulse</div>
            <div className="logo-tagline">Your safe space for healing</div>
          </div>

          <form className="form-card" onSubmit={handleSignUp}>
            <h1 className="form-title">Join Pulse</h1>
            <p className="form-subtitle">
              Create your account and start your healing journey
            </p>

            <div className="welcome-note">
              🎁 Get 100 coins to start gifting support to others!
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="input-group">
              <label className="input-label">Display Name</label>
              <input
                type="text"
                className="input"
                placeholder="How should we call you?"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                disabled={loading}
                maxLength={30}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                className="input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <span className="loading-spinner" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="footer-text">
            Already have an account?{' '}
            <a className="footer-link" onClick={() => router.push('/login')}>
              Sign In
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
