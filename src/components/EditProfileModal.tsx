'use client';

import { useState } from 'react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    displayName: string;
    username: string;
    bio: string;
    avatar: string;
  };
  onSave: (profile: { displayName: string; username: string; bio: string; avatar: string }) => void;
}

const AVATAR_OPTIONS = ['✨', '💜', '🌟', '🦋', '🌙', '☀️', '🌈', '🔮', '🕯️', '🌸', '🦉', '🌊', '🔥', '💫', '🌺', '🍀'];

export default function EditProfileModal({ isOpen, onClose, profile, onSave }: EditProfileModalProps) {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [isSaving, setIsSaving] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSave({ displayName, username, bio, avatar });
    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          z-index: 300;
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
        
        .modal-content {
          width: 100%;
          max-width: 420px;
          max-height: 90vh;
          background: linear-gradient(180deg, #1a1a2e 0%, #151525 100%);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          overflow-y: auto;
          animation: scaleIn 0.3s ease;
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .modal-header {
          padding: 24px 24px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .header-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.95);
        }
        
        .close-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.2rem;
          cursor: pointer;
        }
        
        .avatar-section {
          padding: 24px;
          text-align: center;
        }
        
        .current-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.5) 0%, rgba(236, 72, 153, 0.5) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          margin: 0 auto 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 4px solid rgba(255, 255, 255, 0.1);
        }
        
        .current-avatar:hover {
          transform: scale(1.05);
          border-color: rgba(139, 92, 246, 0.5);
        }
        
        .change-avatar-text {
          font-size: 0.9rem;
          color: #a78bfa;
          cursor: pointer;
        }
        
        .avatar-picker {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 8px;
          margin-top: 16px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
        }
        
        .avatar-option {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .avatar-option:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .avatar-option.selected {
          border-color: #a78bfa;
          background: rgba(139, 92, 246, 0.2);
        }
        
        .form-section {
          padding: 0 24px 24px;
        }
        
        .input-group {
          margin-bottom: 20px;
        }
        
        .input-label {
          display: block;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 8px;
          font-weight: 500;
        }
        
        .input-field {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.95);
          font-size: 1rem;
          font-family: inherit;
          transition: all 0.2s ease;
        }
        
        .input-field:focus {
          outline: none;
          border-color: rgba(139, 92, 246, 0.5);
          background: rgba(255, 255, 255, 0.08);
        }
        
        .input-field::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
        
        .textarea-field {
          resize: none;
          min-height: 100px;
        }
        
        .char-count {
          text-align: right;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
          margin-top: 6px;
        }
        
        .char-count.warning {
          color: #fbbf24;
        }
        
        .char-count.error {
          color: #f87171;
        }
        
        .username-prefix {
          position: relative;
        }
        
        .username-prefix .input-field {
          padding-left: 28px;
        }
        
        .username-prefix::before {
          content: '@';
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.4);
          font-size: 1rem;
        }
        
        .modal-footer {
          padding: 16px 24px 24px;
          display: flex;
          gap: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .cancel-btn {
          flex: 1;
          padding: 14px;
          border-radius: 50px;
          background: rgba(255, 255, 255, 0.08);
          border: none;
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
        }
        
        .save-btn {
          flex: 2;
          padding: 14px;
          border-radius: 50px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border: none;
          color: white;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .save-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .save-btn:not(:disabled):hover {
          transform: scale(1.02);
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
        }
        
        .anonymous-note {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: rgba(139, 92, 246, 0.1);
          border-radius: 12px;
          margin-bottom: 20px;
        }
        
        .anonymous-note-text {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
        }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="header-title">Edit Profile</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          
          <div className="avatar-section">
            <div className="current-avatar" onClick={() => setShowAvatarPicker(!showAvatarPicker)}>
              {avatar}
            </div>
            <span className="change-avatar-text" onClick={() => setShowAvatarPicker(!showAvatarPicker)}>
              Tap to change avatar
            </span>
            
            {showAvatarPicker && (
              <div className="avatar-picker">
                {AVATAR_OPTIONS.map((option) => (
                  <div
                    key={option}
                    className={`avatar-option ${avatar === option ? 'selected' : ''}`}
                    onClick={() => {
                      setAvatar(option);
                      setShowAvatarPicker(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="form-section">
            <div className="anonymous-note">
              <span>🔒</span>
              <span className="anonymous-note-text">Your real identity stays private. Only your display name is visible.</span>
            </div>
            
            <div className="input-group">
              <label className="input-label">Display Name</label>
              <input
                type="text"
                className="input-field"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Anonymous Star"
                maxLength={30}
              />
              <div className={`char-count ${displayName.length > 25 ? (displayName.length > 28 ? 'error' : 'warning') : ''}`}>
                {displayName.length}/30
              </div>
            </div>
            
            <div className="input-group">
              <label className="input-label">Username</label>
              <div className="username-prefix">
                <input
                  type="text"
                  className="input-field"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="anonymous_star"
                  maxLength={20}
                />
              </div>
            </div>
            
            <div className="input-group">
              <label className="input-label">Bio</label>
              <textarea
                className="input-field textarea-field"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share a little about your journey..."
                maxLength={160}
              />
              <div className={`char-count ${bio.length > 140 ? (bio.length > 155 ? 'error' : 'warning') : ''}`}>
                {bio.length}/160
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
            <button 
              className="save-btn" 
              onClick={handleSave}
              disabled={!displayName.trim() || !username.trim() || isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
