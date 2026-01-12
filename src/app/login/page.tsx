'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .login-page {
          min-height: 100vh;
          min-height: 100dvh;
          background: linear-gradient(180deg, #0f0f1a 0%, #151525 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .login-container {
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
          margin-bottom: 24px;
          text-align: center;
          letter-spacing: 0.01em;
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
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
        }
        .divider-line {
          flex: 1;
          height: 0.5px;
          background: rgba(255, 255, 255, 0.1);
        }
        .divider-text {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .google-btn {
          width: 100%;
          padding: 14px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .google-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .google-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
      `}</style>

      <div className="login-page">
        <div className="login-container">
          <div className="logo">
            <div className="logo-icon">💜</div>
            <div className="logo-text">Pulse</div>
            <div className="logo-tagline">Your safe space for healing</div>
          </div>

          <form className="form-card" onSubmit={handleSignIn}>
            <h1 className="form-title">Welcome Back</h1>

            {error && <div className="error-message">{error}</div>}

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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <span className="loading-spinner" />
              ) : (
                'Sign In'
              )}
            </button>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">or</span>
              <div className="divider-line" />
            </div>

            <button
              type="button"
              className="google-btn"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
              Continue with Google
            </button>
          </form>

          <div className="footer-text">
            Don't have an account?{' '}
            <a className="footer-link" onClick={() => router.push('/signup')}>
              Create Account
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
