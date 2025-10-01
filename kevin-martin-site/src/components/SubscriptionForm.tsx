'use client';

import { useState, FormEvent } from 'react';

export default function SubscriptionForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Successfully subscribed!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again.');
      console.error('Subscription error:', error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === 'loading'}
          className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-3 py-1 bg-[#60a5fa] hover:bg-[#3b82f6] text-white text-sm rounded transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? '...' : 'subscribe'}
        </button>
      </form>
      {message && (
        <span className={`text-xs ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </span>
      )}
    </div>
  );
}
