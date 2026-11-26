'use client';

import { useState } from 'react';
import { emit } from '@/lib/events';
import { BASE_PATH } from '@/lib/site';

type Status = 'idle' | 'loading' | 'error' | 'done';

/** Set at build time. With no endpoint configured the form stays disabled. */
const ENDPOINT = process.env.NEXT_PUBLIC_WAITLIST_ENDPOINT ?? '';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  if (!ENDPOINT) {
    return (
      <div className="form-note" role="status">
        The waitlist is not open yet — no submission endpoint is configured in this build. See the{' '}
        <a href={`${BASE_PATH}/privacy/`}>privacy notice</a>.
      </div>
    );
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!consent) {
      setStatus('error');
      setMessage('Please agree to the privacy notice before submitting.');
      return;
    }
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
          message: 'New Synodos early-access request',
          _subject: 'Synodos — new early-access request',
          _template: 'table',
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatus('done');
      setMessage('You’re on the list. We’ll email you when your spot is ready.');
      emit('waitlist_submitted');
    } catch {
      setStatus('error');
      setMessage('Could not submit right now. Please try again later.');
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
      <label className="consent-row">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => { setConsent(e.target.checked); if (status === 'error') { setStatus('idle'); setMessage(''); } }}
        />
        <span>I agree to the <a href={`${BASE_PATH}/privacy/`}>privacy notice</a> and to being contacted about early access.</span>
      </label>
      <button
        type="submit"
        className="btn btn--primary"
        disabled={status === 'loading' || !consent}
        style={{ width: '100%', marginTop: 8 }}
      >
        {status === 'loading' ? 'Sending…' : 'Request access'} <span aria-hidden="true">→</span>
      </button>
      <p className="form-note">
        Your address is sent only to the configured submission endpoint. No tracking, no resale.
        You can ask for deletion at any time — see the privacy notice.
      </p>
    </form>
  );
}
