'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session) {
          // Check if user profile exists
          const { data: existingProfile } = await supabase
            .from('users')
            .select('id')
            .eq('id', session.user.id)
            .single();

          // If no profile exists (new Google sign-up), create one
          if (!existingProfile) {
            await supabase.from('users').insert({
              id: session.user.id,
              email: session.user.email,
              display_name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
              avatar: session.user.user_metadata.avatar_url,
              is_anonymous: false,
              coins: 100,
            });
          }

          // Redirect to home
          router.push('/');
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        router.push('/login');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <>
      <style jsx>{`
        .callback-page {
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
      <div className="callback-page">
        <div className="loading-logo">💜</div>
        <div className="loading-text">Signing you in...</div>
      </div>
    </>
  );
}
