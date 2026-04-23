# Resume Learning Email System — Setup Guide

This guide gets the "Resume Learning" email nudge system running. It's a 4-step,
one-time setup done entirely in two web dashboards (Resend + Vercel). Should take
about 15 minutes. No code to write.

---

## What This System Does

1. On every calculator, after a short delay, users see an optional **"Want a reminder
   to finish this?"** card.
2. If they enter an email, it's saved server-side.
3. Every day at ~9 AM ET, a background job checks for users who haven't returned:
   - **7 days inactive** → sends a "Pick up where you left off" email.
   - **30 days inactive** → sends a "Your work is still saved (for a few more days)"
     email before the 45-day auto-delete.
4. If they come back and use another tool, the clock resets.
5. Every email has a one-click unsubscribe link (legally required).

All user data is stored in **Vercel KV** (a managed database included with Vercel).
Email sending runs through **Resend** (free for up to 3,000 emails/month, then $20/mo
for 50,000).

---

## Step 1 — Create a Resend Account (for sending email)

1. Go to [https://resend.com](https://resend.com) and click **Sign Up**. Use
   `elcrisp07@gmail.com` or `customerservice@intellitcsolutions.com`.
2. After signing up, in the left sidebar, click **Domains** → **Add Domain**.
3. Enter `intellitcsolutions.com` and click **Add**.
4. Resend will show you **DNS records** (usually 3-4 TXT/MX records). You need to
   add these in whichever service owns your domain DNS (most likely Vercel, since
   the site is deployed there).
   - In Vercel: **Project → Settings → Domains → intellitcsolutions.com → DNS Records**
   - Copy each record from Resend, paste into Vercel, save.
5. Back in Resend, click **Verify DNS Records**. Wait 5-10 minutes if it doesn't
   verify immediately (DNS takes time).
6. Once verified, go to **API Keys** in the left sidebar → **Create API Key** →
   name it `IntelliTC Production` → select **Sending access** → **Create**.
7. **Copy the key** (starts with `re_...`). You'll paste it into Vercel next.
   You won't be able to see it again after closing this screen.

---

## Step 2 — Enable Vercel KV Storage

1. Go to your Vercel dashboard → **intellitc-solutions-platform** project.
2. Click the **Storage** tab at the top.
3. Click **Create Database** → select **KV** (Redis) → give it any name like
   `intellitc-users` → select the region closest to you → **Create**.
4. After it's created, Vercel shows a screen with **Connect to Project**. Make sure
   it's connected to the `intellitc-solutions-platform` project and all environments
   (Production, Preview, Development) are checked → **Connect**.

That's it for KV. The connection auto-injects environment variables the code needs
(`KV_REST_API_URL`, `KV_REST_API_TOKEN`, etc).

---

## Step 3 — Add Environment Variables

1. In your Vercel project → **Settings** → **Environment Variables**.
2. Add these three variables (each for **Production** + **Preview** + **Development**):

| Name | Value |
|---|---|
| `RESEND_API_KEY` | The `re_...` key you copied from Resend in Step 1 |
| `UNSUB_SECRET` | Any random 32+ character string (used to sign unsubscribe links). Generate one at [https://www.random.org/strings/](https://www.random.org/strings/) or just mash your keyboard |
| `CRON_SECRET` | Another random 32+ character string (protects the cron endpoint from random internet traffic) |

3. Click **Save** after each.

---

## Step 4 — Redeploy

1. In Vercel project → **Deployments** tab.
2. Find the latest deployment → click the **⋯** menu → **Redeploy** → confirm.
3. Wait ~1 minute for it to finish.

The daily cron job is already configured in `vercel.json` to run at **14:00 UTC**
(9 AM Eastern during DST, 10 AM Eastern in winter). You can see it under
**Settings → Cron Jobs** after the redeploy.

---

## How to Verify It's Working

### Test email capture
1. Open any calculator on the live site in an incognito window.
2. Wait about 2 seconds. The "Want a reminder to finish this?" card should appear
   below the "Progress is saved locally" line.
3. Enter a test email address → click **Send me a reminder**.
4. You should see: *"✓ You're set. We'll send one reminder if you don't come back."*

### Confirm it saved
In Vercel → **Storage** → click your KV database → **Data Browser**:
- Look for a key named `user:your-test-email@example.com`
- Look for a set named `users:index` that contains that email

### Test the cron manually
Open in a browser (replace `YOUR_CRON_SECRET` with the value from Step 3):

```
https://intellitcsolutions.com/api/resume-trigger?key=YOUR_CRON_SECRET
```

You'll see a JSON response like:
```json
{"scanned":1,"sent_7d":0,"sent_30d":0,"skipped":1,"errors":[]}
```

`skipped:1` means the user is too recent to nudge — that's correct for a fresh test.

### Force a test nudge (optional)
In Vercel KV **Data Browser**, edit your test user record and change `last_seen_ts`
to a value from 8 days ago (subtract 8 * 86400000 = 691200000 from the current
timestamp). Then hit the cron URL again. You should receive the 7-day reminder email
within a few seconds.

---

## Costs

- **Vercel KV**: Free tier includes 30,000 reads + 5,000 writes per month. For
  thousands of beta users, free.
- **Resend**: Free up to 3,000 emails/month + 100/day. Paid is $20/mo for 50,000.
- **Vercel Cron**: Free on the Pro plan (which you already have). Free plan allows
  2 cron jobs; we use 1.

---

## What to Do If Something Breaks

- **No emails going out?** Check Resend dashboard → **Logs** for delivery errors.
  Most common: DNS not fully propagated, or the Gmail/Outlook recipient flagged it
  as spam (check spam folder first).
- **Card not showing?** Open browser devtools console on a calculator page. Any
  errors from `progress-save.js`? If the email was already entered on that device,
  the card is hidden on purpose.
- **Cron not firing?** Vercel project → **Cron Jobs** tab shows last run time and
  status. If failing, click the run to see the error.
- **Need to manually remove a user?** Vercel KV → Data Browser → find `user:email`
  → delete.

For any issue beyond this, reply with the error message you see in Vercel logs and
I can fix it.

---

## Files in This System

- `api/capture-email.js` — saves email + last calculator used
- `api/track-activity.js` — resets the clock when a user comes back
- `api/unsubscribe.js` — handles unsubscribe links in emails
- `api/resume-trigger.js` — the daily cron job that sends nudges
- `shared/progress-save.js` — front-end email capture card (runs on every calc)
- `shared/progress-save.css` — styling for the card
- `vercel.json` — cron schedule configuration
- `package.json` — lists `@vercel/kv` dependency
