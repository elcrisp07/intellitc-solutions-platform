/* ============================================================
   IntelliTC Solutions — Activity Ping Endpoint
   POST /api/track-activity
   Body: { email, calcId, calcName }
   Updates: last_seen_ts and resets nudge flags on existing users.
   Silently no-ops if user isn't in KV yet (no email captured).
   ============================================================ */
import { kv } from '@vercel/kv';

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const email = (body.email || '').trim().toLowerCase();
    const calcId = String(body.calcId || '').slice(0, 64);
    const calcName = String(body.calcName || '').slice(0, 120);

    if (!EMAIL_RX.test(email)) return res.status(200).json({ ok: true, skipped: true });

    const key = `user:${email}`;
    const existing = await kv.get(key);
    if (!existing) return res.status(200).json({ ok: true, skipped: true });

    await kv.set(key, {
      ...existing,
      last_calc_id: calcId || existing.last_calc_id,
      last_calc_name: calcName || existing.last_calc_name,
      last_seen_ts: Date.now(),
      nudge_7d_sent: false,
      nudge_30d_sent: false
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('track-activity error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
