/* ============================================================
   IntelliTC Solutions — Email Capture Endpoint
   POST /api/capture-email
   Body: { email, calcId, calcName }
   Stores: user record keyed by email, with last_calc + last_seen_ts
   ============================================================ */
import { kv } from '@vercel/kv';

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export default async function handler(req, res) {
  // CORS (same-origin in prod, permissive for testing)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const email = (body.email || '').trim().toLowerCase();
    const calcId = String(body.calcId || 'home').slice(0, 64);
    const calcName = String(body.calcName || '').slice(0, 120);

    if (!EMAIL_RX.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const now = Date.now();
    const key = `user:${email}`;
    const existing = (await kv.get(key)) || {};

    const record = {
      email,
      last_calc_id: calcId,
      last_calc_name: calcName || existing.last_calc_name || '',
      last_seen_ts: now,
      first_seen_ts: existing.first_seen_ts || now,
      nudge_7d_sent: existing.nudge_7d_sent || false,
      nudge_30d_sent: existing.nudge_30d_sent || false,
      unsubscribed: existing.unsubscribed || false,
      // Reset nudge flags if user returned (they're active again)
      ...(existing.last_seen_ts && (now - existing.last_seen_ts) > 24 * 60 * 60 * 1000
        ? { nudge_7d_sent: false, nudge_30d_sent: false }
        : {})
    };

    await kv.set(key, record);
    // Add to index set so cron can scan all users
    await kv.sadd('users:index', email);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('capture-email error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
