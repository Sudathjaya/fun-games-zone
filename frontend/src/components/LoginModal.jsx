import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginModal({ onClose }) {
  const { signInWithGoogle, signInWithFacebook } = useAuth();
  const [loading, setLoading] = useState(null); // 'google' | 'facebook' | null
  const [error, setError] = useState('');

  async function handleGoogle() {
    setLoading('google'); setError('');
    try {
      await signInWithGoogle();
      onClose();
    } catch (e) {
      setError(e.code === 'auth/popup-closed-by-user' ? '' : 'Sign-in failed. Please try again.');
    } finally { setLoading(null); }
  }

  async function handleFacebook() {
    setLoading('facebook'); setError('');
    try {
      await signInWithFacebook();
      onClose();
    } catch (e) {
      setError(e.code === 'auth/popup-closed-by-user' ? '' : 'Sign-in failed. Please try again.');
    } finally { setLoading(null); }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-white/20 rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl">
        {/* Header */}
        <div className="text-4xl mb-3">🎮</div>
        <h2 className="text-white text-2xl font-black mb-1">Join Fun Games Zone</h2>
        <p className="text-white/60 text-sm mb-6">
          Sign in to save your scores, track progress, and compete on leaderboards!
        </p>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={!!loading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100
                     text-gray-800 font-bold py-3 rounded-2xl mb-3 transition-all hover:scale-105
                     disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
        >
          {loading === 'google' ? (
            <span className="animate-spin text-xl">⟳</span>
          ) : (
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.2 7.3-10.5 7.3-17.3z"/>
              <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.8 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.6H2.6v6.2C6.6 42.8 14.7 48 24 48z"/>
              <path fill="#FBBC05" d="M10.8 28.9c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4v-6.2H2.6C.9 17.2 0 20.5 0 24s.9 6.8 2.6 9.7l8.2-4.8z"/>
              <path fill="#EA4335" d="M24 9.6c3.4 0 6.5 1.2 8.9 3.5l6.6-6.6C35.8 2.6 30.4 0 24 0 14.7 0 6.6 5.2 2.6 12.8l8.2 4.8C12.7 12.1 17.9 9.6 24 9.6z"/>
            </svg>
          )}
          Continue with Google
        </button>

        {/* Facebook */}
        <button
          onClick={handleFacebook}
          disabled={!!loading}
          className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500
                     text-white font-bold py-3 rounded-2xl mb-4 transition-all hover:scale-105
                     disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
        >
          {loading === 'facebook' ? (
            <span className="animate-spin text-xl">⟳</span>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.27h3.32l-.53 3.5h-2.79V24C19.62 23.1 24 18.1 24 12.07z"/>
            </svg>
          )}
          Continue with Facebook
        </button>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        {/* Skip */}
        <button onClick={onClose} className="text-white/40 hover:text-white/70 text-sm transition-colors">
          Continue as guest →
        </button>
      </div>
    </div>
  );
}
