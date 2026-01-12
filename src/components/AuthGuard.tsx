'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const PUBLIC_ROUTES = ['/login', '/signup', '/auth/callback'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect if on public route or still loading
    if (PUBLIC_ROUTES.includes(pathname) || loading) {
      return;
    }

    // Redirect to login if not authenticated
    if (!user) {
      router.push('/login');
    }
  }, [user, loading, pathname, router]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <>
        <style jsx>{`
          .loading-screen {
            min-height: 100vh;
            min-height: 100dvh;
            background: linear-gradient(180deg, #0f0f1a 0%, #151525 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;
          }
          .loading-logo {
            font-size: 4rem;
            animation: pulse 1.5s ease-in-out infinite;
          }
          .loading-text {
            font-size: 0.95rem;
            color: rgba(255, 255, 255, 0.5);
            letter-spacing: 0.02em;
          }
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.8;
            }
            50% {
              transform: scale(1.05);
              opacity: 1;
            }
          }
        `}</style>
        <div className="loading-screen">
          <div className="loading-logo">💜</div>
          <div className="loading-text">Loading...</div>
        </div>
      </>
    );
  }

  // If on public route, show content
  if (PUBLIC_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  // If not authenticated, don't render (will redirect)
  if (!user) {
    return null;
  }

  // User is authenticated, show protected content
  return <>{children}</>;
}
