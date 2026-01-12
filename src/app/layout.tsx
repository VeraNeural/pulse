'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import './globals.css';
import { Post, SAMPLE_POSTS } from '@/lib/data';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';

// Global Coins Context
interface CoinsContextType {
  coins: number;
  addCoins: (amount: number) => void;
  subtractCoins: (amount: number) => void;
}

const CoinsContext = createContext<CoinsContextType | null>(null);

export function useCoins() {
  const context = useContext(CoinsContext);
  if (!context) {
    throw new Error('useCoins must be used within CoinsProvider');
  }
  return context;
}

// Global Posts Context
interface PostsContextType {
  posts: Post[];
  addPost: (post: Post) => void;
}

const PostsContext = createContext<PostsContextType | null>(null);

export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts must be used within PostsProvider');
  }
  return context;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [coins, setCoins] = useState(250);
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);

  const addCoins = (amount: number) => {
    setCoins(prev => prev + amount);
  };

  const subtractCoins = (amount: number) => {
    setCoins(prev => Math.max(0, prev - amount));
  };

  const addPost = (post: Post) => {
    setPosts(prev => [post, ...prev]);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home', path: '/' },
    { id: 'discover', icon: '🔍', label: 'Discover', path: '/discover' },
    { id: 'create', icon: '+', label: 'Create', path: '/create' },
    { id: 'notifications', icon: '🔔', label: 'Alerts', path: '/notifications' },
    { id: 'profile', icon: '👤', label: 'Profile', path: '/profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  return (
    <html lang="en">
      <head>
        <title>Pulse - Feel Humanity&apos;s Heartbeat</title>
        <meta name="description" content="Share your story. Find your people. Heal together." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0f0f1a" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <CoinsContext.Provider value={{ coins, addCoins, subtractCoins }}>
            <PostsContext.Provider value={{ posts, addPost }}>
              <AuthGuard>
                <div className="app-container">
                  <main className="main-content">
                    {children}
                  </main>

          {mounted && (
            <nav className="bottom-nav">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={`nav-item ${isActive(item.path) ? 'active' : ''} ${item.id === 'create' ? 'create-btn' : ''}`}
                  onClick={() => router.push(item.path)}
                >
                  {item.id === 'create' ? (
                    <span className="create-icon">{item.icon}</span>
                  ) : (
                    <>
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-label">{item.label}</span>
                    </>
                  )}
                </button>
              ))}
            </nav>
          )}
          </div>
              </AuthGuard>
          </PostsContext.Provider>
        </CoinsContext.Provider>
        </AuthProvider>

        <style jsx global>{`
          .app-container {
            min-height: 100vh;
            min-height: 100dvh;
            display: flex;
            flex-direction: column;
            background: linear-gradient(180deg, #0f0f1a 0%, #151525 50%, #1a1a2e 100%);
          }
          .main-content {
            flex: 1;
            padding-bottom: calc(60px + env(safe-area-inset-bottom, 0px));
            overflow-y: auto;
          }
          .bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: calc(60px + env(safe-area-inset-bottom, 0px));
            padding-bottom: env(safe-area-inset-bottom, 0px);
            background: rgba(15, 15, 26, 0.95);
            backdrop-filter: blur(25px);
            border-top: 0.5px solid rgba(255, 255, 255, 0.05);
            display: flex;
            justify-content: space-around;
            align-items: center;
            z-index: 100;
          }
          .nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 3px;
            padding: 6px 12px;
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.5);
            cursor: pointer;
            transition: all 0.2s ease;
            -webkit-tap-highlight-color: transparent;
          }
          .nav-item:hover {
            color: rgba(255, 255, 255, 0.8);
          }
          .nav-item.active {
            color: #a78bfa;
          }
          .nav-icon {
            font-size: 1.2rem;
          }
          .nav-label {
            font-size: 0.55rem;
            font-weight: 500;
            letter-spacing: 0.02em;
          }
          .nav-item.create-btn {
            padding: 0;
          }
          .create-icon {
            width: 42px;
            height: 42px;
            border-radius: 14px;
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #ec4899 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.6rem;
            font-weight: 300;
            color: white;
            box-shadow: 0 3px 18px rgba(139, 92, 246, 0.35);
            transition: all 0.3s ease;
          }
          .nav-item.create-btn:hover .create-icon {
            transform: scale(1.05);
            box-shadow: 0 6px 30px rgba(139, 92, 246, 0.5);
          }
          ::-webkit-scrollbar {
            width: 6px;
          }
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
          }
        `}</style>
      </body>
    </html>
  );
}
