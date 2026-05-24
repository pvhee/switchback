# Privacy Policy

> **⚠ DRAFT — REQUIRES LAWYER REVIEW BEFORE PUBLISHING.**
>
> This draft is GDPR-primary (EU posture). If incorporating outside the
> EU, the structure still works but specific clauses need adjustment.
> Engage a privacy lawyer in your jurisdiction before this goes live.
> The Garmin application reviewers will read this, and getting it wrong
> is both a legal and credibility risk.

---

**Last updated:** [DATE]

Cloudwired ("**we**", "**us**", "**Switchback**") operates the Switchback
service at https://switchback.run (the "**Service**"). This Privacy Policy
explains what personal data we collect, why, and what your rights are.

## 1. Who we are

Cloudwired, a company registered in Estonia (registration
number [REG_NO]), with registered address [ENTITY_ADDRESS].

Contact: privacy@switchback.run

## 2. What data we collect

We collect three categories of data:

**a) Account data**
- Email address
- Name (optional)
- Password (stored as a salted hash; we never see your plaintext
  password)
- Subscription / billing data (handled by Stripe — see §6)

**b) Training profile and plan data**
- Goal race details (date, distance, vert, location, target time)
- Training availability (days per week, hours available)
- Self-reported recent performances, injury history, training history
- Generated training plans

**c) Garmin Connect data (only with your explicit consent)**

When you connect your Garmin account via the official Garmin Connect
Developer Program OAuth flow, we receive:

- Workout / activity data: distance, duration, pace, heart rate, power,
  elevation, route polyline, perceived effort
- Wellness data (where you grant the scope): sleep, HRV, resting heart
  rate, stress, Body Battery
- Garmin user ID (not your email or password — we never see those)

You can revoke this connection at any time from your Garmin Connect
account settings or from your Switchback account.

## 3. Why we collect it

| Purpose | Legal basis (GDPR Art. 6) |
|---|---|
| Provide the Service (generate / adapt plans, push workouts) | Contract (6(1)(b)) |
| Bill subscriptions | Contract (6(1)(b)) |
| Send transactional emails (account, billing, weekly plan) | Contract (6(1)(b)) |
| Improve the plan generator quality (aggregated, de-identified) | Legitimate interest (6(1)(f)) |
| Marketing emails | Consent (6(1)(a)) — opt-in only |

We do **not** sell personal data. We do **not** use your training data
to train AI models offered to third parties.

## 4. AI / LLM processing

To generate and adapt training plans we use Anthropic's Claude API.
When generating a plan we send:
- Your training profile (race goal, availability, history)
- The prior week's activity summaries (durations, HR distribution,
  pace, vert) — *not* GPS routes or raw second-by-second data
- Your free-text feedback notes

Anthropic processes this data under their commercial API terms and
does **not** retain it for model training. Their data handling is
documented at https://www.anthropic.com/legal/commercial-terms.

## 5. Where data is stored

- **Primary database:** [Postgres on Supabase / Neon / AWS RDS]
  — [region, e.g. eu-west-1 (Ireland)].
- **Object storage** (activity files): same region.
- **Backups:** encrypted, same region, retained 30 days.

For users in the EEA / UK, your data stays in the EEA. For users
outside, data is processed in the EEA under standard contractual
clauses.

## 6. Third parties we share data with

| Processor | What | Why |
|---|---|---|
| Stripe | Email, billing info | Subscription processing |
| Anthropic | Profile + workout summaries + notes | Plan generation |
| Garmin Connect | OAuth — we receive, never send your data | Read your Garmin data |
| [Email provider — Resend / Postmark] | Email, names | Transactional + marketing email |
| [Analytics — Plausible / Fathom] | Anonymized usage events | Product analytics |
| [Error tracking — Sentry] | Error context (no PII) | Bug diagnosis |

We have Data Processing Agreements (DPAs) in place with each.

## 7. How long we keep it

| Data | Retention |
|---|---|
| Account data | Until account deletion + 30 days |
| Training plans, activity data | Until account deletion + 30 days |
| Billing data | 7 years (legal requirement) |
| Server logs | 30 days |
| Backups | 30 days |

Delete your account anytime from settings; we'll purge within 30 days
except where law requires longer retention (billing).

## 8. Your rights (GDPR Art. 15–22)

You have the right to:
- Access the data we hold about you
- Correct inaccurate data
- Delete your data ("right to be forgotten")
- Export your data in a portable format
- Object to or restrict processing
- Withdraw consent for marketing emails
- Lodge a complaint with your national data protection authority

Exercise any of these by emailing privacy@switchback.run. We respond within
30 days.

## 9. Cookies

We use:
- **Strictly necessary cookies** for authentication (session). No
  consent needed.
- **Anonymous analytics** via [Plausible / Fathom] — no cookies, no
  personal data. No consent banner required.

No advertising cookies. No third-party trackers.

## 10. Security

- TLS 1.2+ for all traffic
- Encryption at rest for the database
- Garmin OAuth tokens encrypted with a per-user key
- Access logs retained for 30 days
- 2FA available on all accounts
- Subprocessors with SOC 2 / ISO 27001 certifications where available

We will notify affected users and the relevant DPA within 72 hours of
becoming aware of a personal data breach affecting their data.

## 11. Children

Switchback is not directed to anyone under 16. We do not knowingly collect
data from minors. If you believe we have, email privacy@switchback.run and
we'll delete it.

## 12. Changes to this policy

We'll email registered users at least 30 days before any material
change.

---

**Contact:**
Cloudwired · privacy@switchback.run · [ENTITY_ADDRESS]
