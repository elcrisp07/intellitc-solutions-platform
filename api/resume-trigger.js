/* ============================================================
   IntelliTC Solutions — Resume Learning Cron
   GET /api/resume-trigger  (called daily by Vercel Cron)
   Scans all captured emails and sends:
     - 7-day nudge if last_seen_ts is 7-13 days old
     - 30-day nudge if last_seen_ts is 30+ days old
   Skips: unsubscribed users, already-sent nudges, or >44 days
   (data expires at 45 days to match progress-save window).
   ============================================================ */
import { kv } from '@vercel/kv';
import crypto from 'crypto';

const FROM = 'IntelliTC Solutions <hello@intellitcsolutions.com>';
const REPLY_TO = 'customerservice@intellitcsolutions.com';
const SITE = 'https://intellitcsolutions.com';
const DAY = 24 * 60 * 60 * 1000;

export default async function handler(req, res) {
  // Auth: Vercel Cron sends a specific header; also allow manual trigger with ?key=
  const cronSecret = process.env.CRON_SECRET;
  const auth = req.headers.authorization || '';
  const queryKey = req.query.key || '';
  const isCron = cronSecret && (auth === `Bearer ${cronSecret}` || queryKey === cronSecret);
  if (!isCron && process.env.NODE_ENV === 'production') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const emails = (await kv.smembers('users:index')) || [];
    const now = Date.now();
    const results = { scanned: 0, sent_7d: 0, sent_30d: 0, skipped: 0, errors: [] };

    for (const email of emails) {
      results.scanned++;
      try {
        const u = await kv.get(`user:${email}`);
        if (!u || u.unsubscribed) { results.skipped++; continue; }

        const age = now - (u.last_seen_ts || 0);
        const ageDays = age / DAY;

        if (ageDays >= 30 && ageDays <= 44 && !u.nudge_30d_sent) {
          const ok = await sendNudge(u, '30d');
          if (ok) { results.sent_30d++; await kv.set(`user:${email}`, { ...u, nudge_30d_sent: true, last_nudge_ts: now }); }
          else results.errors.push(`30d send failed: ${email}`);
        } else if (ageDays >= 7 && ageDays < 30 && !u.nudge_7d_sent) {
          const ok = await sendNudge(u, '7d');
          if (ok) { results.sent_7d++; await kv.set(`user:${email}`, { ...u, nudge_7d_sent: true, last_nudge_ts: now }); }
          else results.errors.push(`7d send failed: ${email}`);
        } else {
          results.skipped++;
        }
      } catch (e) {
        results.errors.push(`${email}: ${e.message}`);
      }
    }

    return res.status(200).json(results);
  } catch (err) {
    console.error('resume-trigger error:', err);
    return res.status(500).json({ error: err.message });
  }
}

function unsubLink(email) {
  const secret = process.env.UNSUB_SECRET || 'intellitc-dev-secret';
  const token = crypto.createHmac('sha256', secret).update(email).digest('hex').slice(0, 16);
  const b64 = Buffer.from(email).toString('base64');
  return `${SITE}/api/unsubscribe?email=${encodeURIComponent(b64)}&t=${token}`;
}

function calcUrl(calcId) {
  if (!calcId || calcId === 'home') return `${SITE}/goal-pilot/index.html`;
  return `${SITE}/${calcId}/index.html`;
}

async function sendNudge(u, variant) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) { console.error('RESEND_API_KEY not set'); return false; }

  const calcLabel = u.last_calc_name || 'your analysis';
  const resumeUrl = calcUrl(u.last_calc_id);
  const unsub = unsubLink(u.email);

  const subject = variant === '7d'
    ? `Pick up where you left off — ${calcLabel} is saved`
    : `Your ${calcLabel} work is still here (saved for a few more days)`;

  const headline = variant === '7d'
    ? `Ready to finish ${calcLabel}?`
    : `Don't lose your work on ${calcLabel}`;

  const body = variant === '7d'
    ? `It's been about a week since you started analyzing <strong>${calcLabel}</strong>. Your inputs are saved and ready — one click to pick up exactly where you left off.`
    : `You started a <strong>${calcLabel}</strong> analysis about a month ago and your progress is still saved. We hold drafts for 45 days, so you have a little time left to finish.`;

  const html = emailTemplate({ headline, body, ctaUrl: resumeUrl, ctaLabel: `Resume ${calcLabel}`, unsub });
  const text = `${headline}\n\n${body.replace(/<[^>]+>/g, '')}\n\nResume: ${resumeUrl}\n\nUnsubscribe: ${unsub}`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: [u.email],
        reply_to: REPLY_TO,
        subject,
        html,
        text,
        headers: { 'List-Unsubscribe': `<${unsub}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' }
      })
    });
    return r.ok;
  } catch (e) { console.error('send error:', e); return false; }
}

function emailTemplate({ headline, body, ctaUrl, ctaLabel, unsub }) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7f6f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#222">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f6f2;padding:40px 16px">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.04)">
        <tr><td style="background:#01696f;padding:24px 32px;color:#ffffff;font-size:18px;font-weight:700;letter-spacing:0.02em">
          IntelliTC <span style="color:#D19900">Solutions</span>
        </td></tr>
        <tr><td style="padding:40px 32px 16px 32px">
          <h1 style="margin:0 0 16px 0;font-size:24px;font-weight:700;color:#01696f;line-height:1.25">${headline}</h1>
          <p style="margin:0 0 28px 0;font-size:16px;line-height:1.6;color:#333">${body}</p>
          <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:8px;background:#01696f">
            <a href="${ctaUrl}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px">${ctaLabel} &rarr;</a>
          </td></tr></table>
          <p style="margin:32px 0 0 0;font-size:14px;line-height:1.6;color:#666">
            Your inputs are saved in your browser for 45 days. Just open the tool from the button above on the same device you used before, and we'll restore everything automatically.
          </p>
        </td></tr>
        <tr><td style="padding:24px 32px 32px 32px;border-top:1px solid #eee;font-size:12px;color:#888;line-height:1.5">
          You're getting this because you entered your email at <a href="https://intellitcsolutions.com" style="color:#01696f">intellitcsolutions.com</a> to enable resume-learning reminders.<br>
          <a href="${unsub}" style="color:#888;text-decoration:underline">Unsubscribe</a> &nbsp;·&nbsp; Infinite Workz Ventures LLC, Virginia Beach, VA
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
