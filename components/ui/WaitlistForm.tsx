'use client';

import { useState } from 'react';

type Status = 'idle' | 'loading' | 'error' | 'done';

const ENDPOINT = 'https://formsubmit.co/ajax/erm1ham3d2604@gmail.com';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setStatus('error');
      setMessage('Enter a valid email address so we can reach you.');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: value,
          name: 'Synodos waitlist',
          message: `New Synodos early-access request from ${value}`,
          _subject: 'Synodos — new early-access request',
          _template: 'table',
          _captcha: 'false',
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatus('done');
      setMessage('You’re on the list. We’ll email you when your spot is ready.');
    } catch {
      setStatus('error');
      setMessage('Could not submit right now. Please email hello@synodos.app directly.');
    }
  };

  if (status === 'done') {
    return (
      <div className="form-ok" role="status" aria-live="polite">
        <i aria-hidden="true">✓</i>
        <div>
          <strong>You’re on the list.</strong>
          <div className="form-note">{message}</div>
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
        {status === 'loading' ? 'Sending…' : 'Request access'} <span aria-hidden="true">→</span>
      </button>
      <p className="form-note">
        Your address is sent to our inbox via FormSubmit. First signup requires one confirmation
        click from the owner’s email. No tracking, no resale.
      </p>
    </form>
  );
}
