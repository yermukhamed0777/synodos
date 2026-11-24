'use client';

import { useState } from 'react';

type Status = 'idle' | 'loading' | 'error' | 'done';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setStatus('error');
      setMessage('Enter a valid email address so we can reach you.');
      return;
    }
    setStatus('loading');
    // Demo behaviour: stored locally until a real backend is connected.
    window.setTimeout(() => {
      try {
        const prior = JSON.parse(window.localStorage.getItem('synodos_waitlist') ?? '[]') as string[];
        if (!prior.includes(value)) window.localStorage.setItem('synodos_waitlist', JSON.stringify([...prior, value]));
        setStatus('done');
        setMessage('You’re on the list. We’ll reach out when your spot is ready.');
      } catch {
        setStatus('error');
        setMessage('Could not save locally. Please try again or email hello@synodos.app.');
      }
    }, 650);
  };

  if (status === 'done') {
    return (
      <div className="form-ok" role="status" aria-live="polite">
        <i aria-hidden="true">✓</i>
        <div>
          <strong>You’re on the list.</strong>
          <div className="form-note">{message} Saved on this device for now.</div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="waitlist-email">Email address</label>
        <input
          id="waitlist-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          aria-invalid={status === 'error'}
          aria-describedby="waitlist-error"
          onChange={(e) => { setEmail(e.target.value); if (status === 'error') { setStatus('idle'); setMessage(''); } }}
          disabled={status === 'loading'}
        />
        <span className="field-error" id="waitlist-error" role="alert">{status === 'error' ? message : ''}</span>
      </div>
      <button type="submit" className="btn btn--primary" disabled={status === 'loading'} style={{ width: '100%', marginTop: 8 }}>
        {status === 'loading' ? 'Saving…' : 'Request access'} <span aria-hidden="true">→</span>
      </button>
      <p className="form-note">Demo form — entries are saved in this browser only. No email is sent yet.</p>
    </form>
  );
}
