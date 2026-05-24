# Garmin Connect Developer Program — Training API application

Long-form application content. Use this as the body of the actual
intake form, the contact-form ticket (see `garmin-contact-ticket.md`
for the shorter ticket version), and as a PDF attachment if the form
allows uploads.

> **Posture:** ask only for **Training API** as the primary integration.
> Mention Activity / Health API as a non-blocking future ask. Keep the
> medical / safety story explicit — Garmin reviewers care.

---

## Applicant

| Field | Value |
|---|---|
| Company name | Cloudwired |
| Country of registration | Estonia |
| Registration number | [REG_NO] |
| Website | https://switchback.run |
| Primary contact | Peter Van Hee, Founder |
| Email | peter@switchback.run |
| Privacy Policy | https://switchback.run/privacy |
| Terms of Service | https://switchback.run/terms |

## Product

**Switchback** is an AI-assisted training plan service for endurance
runners. The product is specifically focused on the trail and
ultra-trail segment — races between 30 km and 100 miles, often with
significant elevation gain, where existing template-based apps stop
being useful.

Users describe their goal race in natural language; Switchback generates
a periodized training plan structured around established endurance
coaching principles (Lydiard / Daniels / Friel-style periodization
with progressive overload, recovery weeks, and tapering). Plans are
adapted weekly based on the user's actual training data.

## Why Garmin integration matters

Garmin is the dominant device platform in trail and ultra-trail
running. UTMB World Series races, Skyrunner events, and most
national trail series are densely populated with Garmin Forerunner,
Fenix, and Enduro users. For Switchback to be useful, structured
workouts need to land on the user's watch automatically — manual
workout-by-workout import is a non-starter for a multi-month
training block.

The Training API solves this with the same workflow used by
TrainingPeaks and similar partners: Switchback generates a structured
workout, pushes it to the user's calendar via the Training API, and
the user's watch syncs the workout automatically.

## Integration scope requested

**Primary: Training API**

- Push structured running workouts to the user's Garmin Connect
  calendar
- Schedule workouts on specific dates (typically 1–4 weeks ahead at
  any time)
- Update or remove previously scheduled workouts when a plan is
  adapted
- Workouts use the standard Garmin structured-workout format: warmup,
  interval, recovery, cooldown, and repeat groups, with HR-zone or
  pace-zone targets

We do not need to push activity data back to Garmin, courses,
segments, or any non-workout content.

**Optional, future: Activity / Health API**

We would benefit from read access to completed activity data
(duration, HR distribution, pace, elevation) and basic wellness
signals (sleep, HRV, resting HR) to improve the weekly adaptation
loop. This is **not required for launch** — in the interim, users
manually mark workouts complete in our app, or we read summary data
returned by the Training API itself. We mention it here so we don't
need to file a second application later.

## Volume forecast

| Period | Active users | Workouts pushed / week | API calls / day |
|---|---|---|---|
| Closed alpha (months 1–3) | 10–50 | 40–200 | <50 |
| Private beta (months 4–6) | 100–500 | 400–2,000 | <500 |
| Year 1 GA | 1,000–5,000 | 4,000–20,000 | <2,000 |

Push volume is bounded: one weekly batch per user (Sunday evening)
plus occasional ad-hoc adjustments. No real-time / per-minute API
pressure.

## How we handle user data

- **Garmin OAuth tokens** are stored encrypted with a per-user key,
  in a Postgres database in [eu-west-1 / Ireland]. Tokens are never
  written to logs and are decrypted only in memory during the API
  call.
- **No Garmin passwords are ever requested or stored.** Authentication
  is exclusively via the Garmin Connect Developer Program OAuth flow.
- **Workout / activity data** is retained while the user is an active
  subscriber and purged 30 days after account deletion. See published
  Privacy Policy for full retention schedule.
- **No data sharing with third parties** except for the named
  processors in the Privacy Policy (Stripe, Anthropic, email
  provider, analytics, error tracking) — each under a DPA.
- **Disconnect honored immediately.** When a user disconnects Garmin,
  we delete the tokens and stop processing their Garmin-sourced data
  within the same request.

## Safety and medical posture

Our Terms of Service explicitly state the service is not medical
advice, require users to consult a medical professional before
starting any new training program, and place responsibility for
training decisions with the user. Plans are constrained by
conservative coaching rules: weekly load progression caps, mandatory
recovery weeks, single-hard-day-per-48h limits, and tapering
requirements. The model cannot freely invent workout intensities; it
selects from a typed catalog parameterized by the user's
self-reported zones.

## Existing validation

The plan-generation logic and Garmin workout-structure handling has
been validated end-to-end against a personal 14-week training block
for the Monte Rosa Walserwaeg Trail (UTMB World Series, July 18,
2026 — 43 km / 3,200 m vert). All workout types, scheduling logic,
and feedback analysis are working in production for a single user.
We are now scaling this to a multi-user product.

## Timeline and ask

We expect to begin closed alpha in [MONTH] and would like to ship
with the Training API integration native. If approval takes longer,
we will ship initial alpha on `.FIT` workout-file export (users
manually import files into Garmin Connect) and migrate to the
Training API once approved.

Happy to provide technical demo, OAuth callback hosts, additional
documentation, or any other information needed to move this forward.

Thank you,

Peter Van Hee
Founder, Switchback
Cloudwired · Estonia
peter@switchback.run
