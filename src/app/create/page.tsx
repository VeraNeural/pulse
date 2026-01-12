'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MOODS, SAMPLE_POSTS } from '@/lib/data';
import { usePosts } from '../layout';

type MediaType = 'text' | 'photo' | 'video' | 'audio';

export default function CreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const responseToId = searchParams.get('responseTo');
  const { addPost } = usePosts();
  const [mode, setMode] = useState<'post' | 'live'>('post');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>('text');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPosting, setIsPosting] = useState(false);
  
  // Response state
  const [originalPost, setOriginalPost] = useState<typeof SAMPLE_POSTS[0] | null>(null);
  
  // Live room state
  const [roomTitle, setRoomTitle] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const LIVE_TOPICS = [
    { id: 'anxiety', name: 'Anxiety Support', emoji: '🫂' },
    { id: 'latenight', name: 'Late Night Talks', emoji: '🌙' },
    { id: 'gratitude', name: 'Gratitude Circle', emoji: '✨' },
    { id: 'openmic', name: 'Open Mic', emoji: '🎤' },
    { id: 'recovery', name: 'Recovery Journey', emoji: '💪' },
  ];

  const DAILY_PROMPTS = [
    "What's one thing you're struggling with right now?",
    "Share a small win from today",
    "What would you tell your younger self?",
    "What's something you've never told anyone?",
    "Who helped you this week? (Don't name them, just share what they did)",
    "What are you grateful for today?",
    "What did you learn about yourself this week?"
  ];

  const getDailyPrompt = () => {
    const dayOfWeek = new Date().getDay(); // 0 = Sunday
    return DAILY_PROMPTS[dayOfWeek];
  };

  const handlePromptClick = () => {
    setContent(getDailyPrompt() + ' #DailyPrompt\n\n');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
      setMediaType(type);
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setMediaType('audio');
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    (window as unknown as { recordingInterval: ReturnType<typeof setInterval> }).recordingInterval = interval;
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    clearInterval((window as unknown as { recordingInterval: ReturnType<typeof setInterval> }).recordingInterval);
    setMediaPreview('recorded');
  };

  const handleClearMedia = () => {
    setMediaPreview(null);
    setMediaType('text');
    setRecordingTime(0);
  };

  const handlePost = async () => {
    if (!content.trim() && !mediaPreview) return;
    setIsPosting(true);
    
    // Extract hashtags from content
    const tagMatches = content.match(/#\w+/g) || [];
    const tags = tagMatches.map(tag => tag.slice(1));
    
    // Create new post object
    const newPost = {
      id: Date.now().toString(),
      author: {
        id: 'me',
        name: 'Anonymous Star',
        displayName: 'Anonymous Star',
        avatar: '✨',
        isAnonymous: true,
      },
      content: content.trim(),
      mood: selectedMood as 'hopeful' | 'anxious' | 'grateful' | 'struggling' | 'celebrating' | 'reflecting' | undefined,
      tags,
      media: mediaPreview ? {
        type: mediaType === 'photo' ? 'image' : mediaType === 'video' ? 'video' : 'audio',
        url: mediaPreview,
        duration: mediaType === 'audio' ? formatTime(recordingTime) : undefined,
      } as { type: 'image' | 'video' | 'audio'; url: string; duration?: string } : undefined,
      reactions: {
        hug: 0,
        strength: 0,
        light: 0,
        love: 0,
      },
      commentCount: 0,
      createdAt: 'Just now',
      views: 0,
      spotlightViews: 100,
      isBoosted: false,
      boostLevel: 'none' as const,
      isResponse: !!originalPost,
      responseToId: originalPost?.id,
      responseToAuthor: originalPost?.author.displayName,
      responseToPreview: originalPost?.content,
      responseCount: 0,
    };
    
    addPost(newPost);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsPosting(false);
    router.push('/');
  };

  const handleStartLive = () => {
    if (!roomTitle.trim() || !selectedTopic) return;
    const roomId = Date.now().toString();
    router.push(`/live/${roomId}?title=${encodeURIComponent(roomTitle)}&topic=${selectedTopic}`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const canPost = content.trim() || mediaPreview;
  const canGoLive = roomTitle.trim() && selectedTopic;

  return (
    <>
      <style jsx>{`
        .create-page { min-height: 100vh; min-height: 100dvh; background: linear-gradient(180deg, #0f0f1a 0%, #151525 100%); }
        .header { position: fixed; top: 0; left: 0; right: 0; z-index: 50; background: rgba(15, 15, 26, 0.95); backdrop-filter: blur(25px); border-bottom: 0.5px solid rgba(255, 255, 255, 0.05); padding: calc(env(safe-area-inset-top, 0px) + 10px) 16px 10px; }
        .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .close-btn { width: 36px; height: 36px; border-radius: 50%; background: rgba(255, 255, 255, 0.1); border: none; color: rgba(255, 255, 255, 0.8); font-size: 1.2rem; cursor: pointer; }
        .header-title { font-size: 0.95rem; font-weight: 600; color: rgba(255, 255, 255, 0.95); letter-spacing: 0.01em; }
        .post-btn { padding: 8px 22px; border-radius: 50px; background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); border: none; color: white; font-size: 0.8rem; font-weight: 600; cursor: pointer; letter-spacing: 0.02em; }
        .post-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .mode-tabs { display: flex; gap: 6px; }
        .mode-tab { padding: 7px 16px; border-radius: 50px; background: transparent; border: 0.5px solid rgba(255, 255, 255, 0.08); color: rgba(255, 255, 255, 0.6); font-size: 0.8rem; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 6px; letter-spacing: 0.01em; }
        .mode-tab.active { background: rgba(139, 92, 246, 0.15); border-color: rgba(139, 92, 246, 0.4); color: #a78bfa; }
        .content { padding: calc(env(safe-area-inset-top, 0px) + 130px) 16px 200px; }
        .author-preview { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
        .avatar { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, rgba(139, 92, 246, 0.5) 0%, rgba(236, 72, 153, 0.5) 100%); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
        .author-info { display: flex; flex-direction: column; gap: 2px; }
        .author-name { font-size: 0.85rem; font-weight: 600; color: rgba(255, 255, 255, 0.95); letter-spacing: 0.01em; }
        .privacy-selector { display: flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 50px; background: rgba(255, 255, 255, 0.08); border: none; color: rgba(255, 255, 255, 0.6); font-size: 0.8rem; cursor: pointer; }
        .daily-prompt-card { margin-bottom: 16px; padding: 14px; border-radius: 14px; background: linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(251, 191, 36, 0.05) 100%); border: 0.5px solid rgba(212, 175, 55, 0.25); cursor: pointer; transition: all 0.2s ease; }
        .daily-prompt-card:hover { background: linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(251, 191, 36, 0.08) 100%); border-color: rgba(212, 175, 55, 0.4); }
        .prompt-label { font-size: 0.68rem; color: #d4af37; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
        .prompt-text { font-size: 0.9rem; color: rgba(255, 255, 255, 0.95); font-weight: 500; line-height: 1.4; letter-spacing: 0.01em; }
        .compose-textarea { width: 100%; min-height: 140px; padding: 0; background: transparent; border: none; color: rgba(255, 255, 255, 0.95); font-size: 1rem; line-height: 1.5; resize: none; font-family: inherit; letter-spacing: 0.01em; }
        .compose-textarea::placeholder { color: rgba(255, 255, 255, 0.3); }
        .compose-textarea:focus { outline: none; }
        .char-count { text-align: right; font-size: 0.8rem; color: rgba(255, 255, 255, 0.4); margin-top: 8px; }
        .char-count.warning { color: #fbbf24; }
        .char-count.error { color: #f87171; }
        .media-preview { margin: 20px 0; border-radius: 16px; overflow: hidden; position: relative; background: rgba(0, 0, 0, 0.3); }
        .preview-image, .preview-video { width: 100%; max-height: 400px; object-fit: cover; display: block; }
        .audio-preview { padding: 20px; background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.1) 100%); display: flex; align-items: center; gap: 16px; }
        .audio-icon { width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
        .audio-info { flex: 1; }
        .audio-label { font-size: 0.95rem; color: rgba(255, 255, 255, 0.9); margin-bottom: 4px; }
        .audio-duration { font-size: 0.85rem; color: rgba(255, 255, 255, 0.5); }
        .remove-media-btn { position: absolute; top: 12px; right: 12px; width: 36px; height: 36px; border-radius: 50%; background: rgba(0, 0, 0, 0.6); border: none; color: white; font-size: 1.2rem; cursor: pointer; }
        .recording-ui { margin: 20px 0; padding: 30px; border-radius: 20px; background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(236, 72, 153, 0.1) 100%); border: 1px solid rgba(239, 68, 68, 0.3); text-align: center; }
        .recording-indicator { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 20px; }
        .recording-dot { width: 12px; height: 12px; border-radius: 50%; background: #ef4444; animation: blink 1s ease-in-out infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .recording-text { font-size: 1rem; color: #ef4444; font-weight: 500; }
        .recording-time { font-size: 2.5rem; font-weight: 700; color: rgba(255, 255, 255, 0.95); margin-bottom: 20px; }
        .stop-recording-btn { padding: 14px 40px; border-radius: 50px; background: #ef4444; border: none; color: white; font-size: 1rem; font-weight: 600; cursor: pointer; }
        .mood-section { margin: 24px 0; }
        .section-label { font-size: 0.85rem; color: rgba(255, 255, 255, 0.5); margin-bottom: 12px; }
        .mood-options { display: flex; flex-wrap: wrap; gap: 8px; }
        .mood-option { display: flex; align-items: center; gap: 6px; padding: 10px 16px; border-radius: 50px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.7); font-size: 0.9rem; cursor: pointer; }
        .mood-option:hover { background: rgba(255, 255, 255, 0.08); }
        .mood-option.selected { background: rgba(139, 92, 246, 0.15); border-color: rgba(139, 92, 246, 0.4); color: #a78bfa; }
        .bottom-bar { position: fixed; bottom: calc(60px + env(safe-area-inset-bottom, 0px)); left: 0; right: 0; background: rgba(15, 15, 26, 0.95); backdrop-filter: blur(25px); border-top: 0.5px solid rgba(255, 255, 255, 0.05); padding: 10px 16px; }
        .media-buttons { display: flex; gap: 6px; }
        .media-btn { display: flex; align-items: center; gap: 6px; padding: 9px 14px; border-radius: 10px; background: rgba(255, 255, 255, 0.05); border: 0.5px solid rgba(255, 255, 255, 0.08); color: rgba(255, 255, 255, 0.7); font-size: 0.8rem; cursor: pointer; letter-spacing: 0.01em; }
        .media-btn.active { background: rgba(139, 92, 246, 0.15); border-color: rgba(139, 92, 246, 0.4); color: #a78bfa; }
        .media-btn-icon { font-size: 1.2rem; }
        .hidden-input { display: none; }
        .live-setup { display: flex; flex-direction: column; gap: 24px; }
        .live-input-group { display: flex; flex-direction: column; gap: 8px; }
        .live-input { width: 100%; padding: 16px; background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; color: rgba(255, 255, 255, 0.95); font-size: 1rem; font-family: inherit; }
        .live-input:focus { outline: none; border-color: rgba(139, 92, 246, 0.4); }
        .live-input::placeholder { color: rgba(255, 255, 255, 0.4); }
        .topic-options { display: flex; flex-direction: column; gap: 10px; }
        .topic-option { display: flex; align-items: center; gap: 14px; padding: 16px; border-radius: 16px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); cursor: pointer; transition: all 0.2s ease; }
        .topic-option:hover { background: rgba(255, 255, 255, 0.08); }
        .topic-option.selected { background: rgba(139, 92, 246, 0.15); border-color: rgba(139, 92, 246, 0.4); }
        .topic-emoji { font-size: 2rem; }
        .topic-name { font-size: 1rem; font-weight: 500; color: rgba(255, 255, 255, 0.9); }
        .start-live-btn { width: 100%; padding: 18px; border-radius: 16px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border: none; color: white; font-size: 1.1rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 12px; }
        .start-live-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .posting-overlay { position: fixed; inset: 0; background: rgba(15, 15, 26, 0.9); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 200; }
        .posting-spinner { width: 60px; height: 60px; border-radius: 50%; border: 3px solid rgba(139, 92, 246, 0.2); border-top-color: #8b5cf6; animation: spin 1s linear infinite; margin-bottom: 20px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .posting-text { font-size: 1.1rem; color: rgba(255, 255, 255, 0.8); margin-bottom: 30px; }
        .boost-prompt { text-align: center; background: linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(251, 191, 36, 0.05) 100%); border: 0.5px solid rgba(212, 175, 55, 0.3); border-radius: 16px; padding: 20px; max-width: 280px; margin: 0 16px; animation: fadeIn 0.5s ease-out 1s both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .boost-prompt-icon { font-size: 2.5rem; margin-bottom: 10px; }
        .boost-prompt-title { font-size: 0.95rem; font-weight: 600; color: #d4af37; margin-bottom: 6px; letter-spacing: 0.01em; }
        .boost-prompt-text { font-size: 0.75rem; color: rgba(255, 255, 255, 0.6); line-height: 1.4; letter-spacing: 0.01em; }
        .response-preview-card { margin-bottom: 16px; padding: 14px; border-radius: 14px; background: rgba(139, 92, 246, 0.08); border: 0.5px solid rgba(139, 92, 246, 0.2); }
        .response-preview-header { font-size: 0.7rem; color: #a78bfa; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
        .response-original-author { font-size: 0.75rem; color: rgba(255, 255, 255, 0.6); margin-bottom: 6px; }
        .response-original-content { font-size: 0.8rem; color: rgba(255, 255, 255, 0.8); line-height: 1.4; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }
      `}</style>

      <div className="create-page">
        <header className="header">
          <div className="header-top">
            <button className="close-btn" onClick={() => router.back()}>×</button>
            <span className="header-title">{mode === 'post' ? 'Create Post' : 'Go Live'}</span>
            <button 
              className="post-btn" 
              disabled={(mode === 'post' && (!canPost || isPosting)) || (mode === 'live' && !canGoLive)} 
              onClick={mode === 'post' ? handlePost : handleStartLive}
            >
              {mode === 'post' ? (isPosting ? 'Posting...' : 'Post') : 'Start'}
            </button>
          </div>
          <div className="mode-tabs">
            <button className={`mode-tab ${mode === 'post' ? 'active' : ''}`} onClick={() => setMode('post')}>
              <span>📝</span>
              <span>Post</span>
            </button>
            <button className={`mode-tab ${mode === 'live' ? 'active' : ''}`} onClick={() => setMode('live')}>
              <span>🎙️</span>
              <span>Go Live</span>
            </button>
          </div>
        </header>

        <div className="content">
          {mode === 'post' ? (
            <>
              {originalPost && (
                <div className="response-preview-card">
                  <div className="response-preview-header">
                    <span>↩️</span>
                    <span>Your response to</span>
                  </div>
                  <div className="response-original-author">@{originalPost.author.displayName}</div>
                  <div className="response-original-content">{originalPost.content}</div>
                </div>
              )}

              <div className="author-preview">
            <div className="avatar">✨</div>
            <div className="author-info">
              <span className="author-name">Anonymous Star</span>
              <button className="privacy-selector">
                <span>🌍</span>
                <span>Everyone</span>
                <span>▾</span>
              </button>
            </div>
          </div>

          <div className="daily-prompt-card" onClick={handlePromptClick}>
            <div className="prompt-label">✨ Today's Prompt</div>
            <div className="prompt-text">{getDailyPrompt()}</div>
          </div>

          <textarea
            className="compose-textarea"
            placeholder="What's on your mind? Share your thoughts, wins, or ask for support..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={500}
          />
          <div className={`char-count ${content.length > 450 ? (content.length > 480 ? 'error' : 'warning') : ''}`}>
            {content.length}/500
          </div>

          {mediaPreview && !isRecording && (
            <div className="media-preview">
              {mediaType === 'photo' && <img src={mediaPreview} alt="Preview" className="preview-image" />}
              {mediaType === 'video' && <video src={mediaPreview} className="preview-video" controls />}
              {mediaType === 'audio' && (
                <div className="audio-preview">
                  <div className="audio-icon">🎙️</div>
                  <div className="audio-info">
                    <div className="audio-label">Voice Note</div>
                    <div className="audio-duration">{formatTime(recordingTime)}</div>
                  </div>
                </div>
              )}
              <button className="remove-media-btn" onClick={handleClearMedia}>×</button>
            </div>
          )}

          {isRecording && (
            <div className="recording-ui">
              <div className="recording-indicator">
                <div className="recording-dot" />
                <span className="recording-text">Recording</span>
              </div>
              <div className="recording-time">{formatTime(recordingTime)}</div>
              <button className="stop-recording-btn" onClick={handleStopRecording}>Stop Recording</button>
            </div>
          )}

          <div className="mood-section">
            <div className="section-label">How are you feeling?</div>
            <div className="mood-options">
              {MOODS.map((mood) => (
                <button
                  key={mood.id}
                  className={`mood-option ${selectedMood === mood.id ? 'selected' : ''}`}
                  onClick={() => setSelectedMood(selectedMood === mood.id ? null : mood.id)}
                >
                  <span>{mood.emoji}</span>
                  <span>{mood.label}</span>
                </button>
              ))}
            </div>
          </div>
            </>
          ) : (
            <div className="live-setup">
              <div className="live-input-group">
                <div className="section-label">Room Title</div>
                <input
                  type="text"
                  className="live-input"
                  placeholder="e.g. Late Night Check-In"
                  value={roomTitle}
                  onChange={(e) => setRoomTitle(e.target.value)}
                  maxLength={60}
                />
              </div>

              <div className="live-input-group">
                <div className="section-label">Choose a Topic</div>
                <div className="topic-options">
                  {LIVE_TOPICS.map((topic) => (
                    <button
                      key={topic.id}
                      className={`topic-option ${selectedTopic === topic.id ? 'selected' : ''}`}
                      onClick={() => setSelectedTopic(topic.id)}
                    >
                      <span className="topic-emoji">{topic.emoji}</span>
                      <span className="topic-name">{topic.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button className="start-live-btn" disabled={!canGoLive} onClick={handleStartLive}>
                <span>🔴</span>
                <span>Start Live Session</span>
              </button>
            </div>
          )}
        </div>

        <div className="bottom-bar">
          <div className="media-buttons">
            <button className={`media-btn ${mediaType === 'photo' ? 'active' : ''}`} onClick={() => fileInputRef.current?.click()}>
              <span className="media-btn-icon">📷</span>
              <span>Photo</span>
            </button>
            <button className={`media-btn ${mediaType === 'video' ? 'active' : ''}`} onClick={() => videoInputRef.current?.click()}>
              <span className="media-btn-icon">🎥</span>
              <span>Video</span>
            </button>
            <button className={`media-btn ${mediaType === 'audio' || isRecording ? 'active' : ''}`} onClick={isRecording ? handleStopRecording : handleStartRecording}>
              <span className="media-btn-icon">{isRecording ? '⏹' : '🎙️'}</span>
              <span>{isRecording ? 'Stop' : 'Voice'}</span>
            </button>
          </div>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden-input" onChange={(e) => handleFileSelect(e, 'photo')} />
        <input ref={videoInputRef} type="file" accept="video/*" className="hidden-input" onChange={(e) => handleFileSelect(e, 'video')} />

        {isPosting && (
          <div className="posting-overlay">
            <div className="posting-spinner" />
            <span className="posting-text">Sharing your pulse...</span>
            <div className="boost-prompt">
              <div className="boost-prompt-icon">🎉</div>
              <div className="boost-prompt-title">Your post will be seen by 100 people!</div>
              <div className="boost-prompt-text">Want more views? Boost it to reach thousands</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
