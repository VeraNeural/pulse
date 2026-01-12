'use client';

import { useState } from 'react';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    isAnonymous: boolean;
  };
  content: string;
  time: string;
  likes: number;
  isLiked: boolean;
}

interface CommentsProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_COMMENTS: Comment[] = [
  {
    id: '1',
    author: { name: 'Gentle Soul', avatar: '💜', isAnonymous: true },
    content: 'This really resonates with me. Thank you for sharing your journey 💜',
    time: '2h ago',
    likes: 24,
    isLiked: false,
  },
  {
    id: '2',
    author: { name: 'Night Owl', avatar: '🦉', isAnonymous: true },
    content: 'You are so brave! Sending you all the strength 💪',
    time: '1h ago',
    likes: 18,
    isLiked: true,
  },
  {
    id: '3',
    author: { name: 'Sunrise Seeker', avatar: '🌅', isAnonymous: true },
    content: 'I needed to hear this today. We\'re all in this together.',
    time: '45m ago',
    likes: 12,
    isLiked: false,
  },
  {
    id: '4',
    author: { name: 'Healing Heart', avatar: '❤️', isAnonymous: true },
    content: 'Your words give me hope. Keep going! 🌟',
    time: '30m ago',
    likes: 8,
    isLiked: false,
  },
];

export default function Comments({ postId, isOpen, onClose }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(SAMPLE_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = (commentId: string) => {
    setComments(comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          likes: c.isLiked ? c.likes - 1 : c.likes + 1,
          isLiked: !c.isLiked,
        };
      }
      return c;
    }));
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const comment: Comment = {
      id: Date.now().toString(),
      author: { name: 'Anonymous Star', avatar: '✨', isAnonymous: true },
      content: newComment,
      time: 'Just now',
      likes: 0,
      isLiked: false,
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        .comments-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 200;
          animation: fadeIn 0.2s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .comments-sheet {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          max-height: 70vh;
          background: #1a1a2e;
          border-radius: 24px 24px 0 0;
          z-index: 201;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        
        .sheet-header {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .sheet-handle {
          width: 40px;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .sheet-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
        }
        
        .close-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.2rem;
          cursor: pointer;
        }
        
        .comments-list {
          flex: 1;
          overflow-y: auto;
          padding: 16px 20px;
        }
        
        .comment-item {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }
        
        .comment-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(236, 72, 153, 0.4) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        
        .comment-content {
          flex: 1;
        }
        
        .comment-author {
          font-size: 0.9rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 4px;
        }
        
        .comment-text {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.5;
          margin-bottom: 8px;
        }
        
        .comment-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .comment-time {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
        }
        
        .comment-like {
          display: flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 20px;
          transition: all 0.2s ease;
        }
        
        .comment-like:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        
        .comment-like.liked {
          color: #ec4899;
        }
        
        .comment-reply {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
          cursor: pointer;
        }
        
        .comment-input-container {
          padding: 16px 20px;
          padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          gap: 12px;
          align-items: flex-end;
        }
        
        .input-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.5) 0%, rgba(236, 72, 153, 0.5) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
        }
        
        .input-wrapper {
          flex: 1;
          display: flex;
          align-items: flex-end;
          gap: 8px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 8px 16px;
        }
        
        .comment-input {
          flex: 1;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.95);
          font-size: 0.95rem;
          resize: none;
          max-height: 100px;
          font-family: inherit;
        }
        
        .comment-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        
        .comment-input:focus {
          outline: none;
        }
        
        .send-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border: none;
          color: white;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        
        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .send-btn:not(:disabled):hover {
          transform: scale(1.05);
        }
        
        .empty-comments {
          text-align: center;
          padding: 40px 20px;
          color: rgba(255, 255, 255, 0.5);
        }
        
        .empty-emoji {
          font-size: 3rem;
          margin-bottom: 12px;
        }
        
        .empty-text {
          font-size: 0.95rem;
        }
      `}</style>

      <div className="comments-overlay" onClick={onClose} />
      
      <div className="comments-sheet">
        <div className="sheet-handle" />
        
        <div className="sheet-header">
          <span className="sheet-title">Comments ({comments.length})</span>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="comments-list">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-avatar">{comment.author.avatar}</div>
                <div className="comment-content">
                  <div className="comment-author">{comment.author.name}</div>
                  <p className="comment-text">{comment.content}</p>
                  <div className="comment-actions">
                    <span className="comment-time">{comment.time}</span>
                    <button 
                      className={`comment-like ${comment.isLiked ? 'liked' : ''}`}
                      onClick={() => handleLike(comment.id)}
                    >
                      {comment.isLiked ? '❤️' : '🤍'} {comment.likes}
                    </button>
                    <button className="comment-reply">Reply</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-comments">
              <div className="empty-emoji">💬</div>
              <p className="empty-text">No comments yet. Be the first!</p>
            </div>
          )}
        </div>
        
        <div className="comment-input-container">
          <div className="input-avatar">✨</div>
          <div className="input-wrapper">
            <textarea
              className="comment-input"
              placeholder="Add a supportive comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={1}
            />
          </div>
          <button 
            className="send-btn" 
            onClick={handleSubmit}
            disabled={!newComment.trim() || isSubmitting}
          >
            {isSubmitting ? '...' : '↑'}
          </button>
        </div>
      </div>
    </>
  );
}
