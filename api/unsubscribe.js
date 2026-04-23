/* ============================================================
   IntelliTC Solutions — Unsubscribe Endpoint
   GET /api/unsubscribe?email=<base64email>&t=<token>
   Flips unsubscribed=true on the user's record.
   ============================================================ */
import { kv } from '@vercel/kv';
import crypto from 'crypto';

function verify(email, token) {
  const secret = process.env.UNSUB_SECRET || 'intellitc-dev-secret';
  const expected = crypto.createHmac('sha256', secret).update(email).digest('hex').slice(0, 16);
  return expected === token;
}

export default async function handler(req, res) {
  try {
    const rawEmail = String(req.query.email || '');
    const token = String(req.query.t || '');
    let email;
    try { email = Buffer.from(rawEmail, 'base64').toString('utf8').toLowerCase(); } catch(e) { email = ''; }

    if (!email || !verify(email, token)) {
      res.setHeader('Content-Type', 'text/html');
      return res.status(400).send(htmlPage('Invalid unsubscribe link', 'This link is not valid or has expired. If you continue to receive emails you don\'t want, reply to any email from us and we\'ll remove you manually.'));
    }

    const key = `user:${email}`;
    const existing = await kv.get(key);
    if (existing) {
      await kv.set(key, { ...existing, unsubscribed: true, unsubscribed_ts: Date.now() });
    }

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(htmlPage('You\'re unsubscribed', 'You won\'t receive any more learning reminders from IntelliTC Solutions. You can still use all the free tools at intellitcsolutions.com anytime.'));
  } catch (err) {
    console.error('unsubscribe error:', err);
    res.setHeader('Content-Type', 'text/html');
    return res.status(500).send(htmlPage('Something went wrong', 'We hit an error. Please reply to any email from us and we\'ll remove you manually.'));
  }
}

function htmlPage(title, msg) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${title} | IntelliTC Solutions</title>
<style>body{font-family:system-ui,-apple-system,sans-serif;background:#f7f6f2;color:#222;max-width:520px;margin:80px auto;padding:40px;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.06);line-height:1.5}
h1{color:#01696f;margin-top:0}
a{color:#01696f}</style></head>
<body><h1>${title}</h1><p>${msg}</p>
<p><a href="https://intellitcsolutions.com">Return to IntelliTC Solutions</a></p></body></html>`;
}
