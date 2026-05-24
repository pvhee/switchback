# Switchback — Product Brief

**One sentence:** Switchback is an AI-driven training plan service for
trail and ultra runners — describe your race in plain language, get an
adaptive plan that updates each week from your Garmin data.

**One paragraph:** Trail and ultra runners are poorly served by
existing apps. Runna is road-first, template-based, and stops being
useful above the marathon. Coaching is expensive (€150–400/month) and
typically delivered via spreadsheet. Switchback sits between the two:
conversational plan creation, periodized structure within established
coaching rules, and a weekly adaptation loop that ingests the user's
actual Garmin data (HR, pace, vert, fatigue, sleep) plus free-text
feedback to regenerate the next seven days. Workouts are pushed
directly to the user's Garmin watch via the Garmin Training API.

---

## Who it's for

Primary: self-coached trail and ultra runners training for UTMB World
Series, Skyrunner, and national trail-series races (50k → 100mi,
vertical races, multi-day). The segment that buys €300 race entries
and €800 watches and still trains off a spreadsheet.

Secondary: road marathoners who've outgrown Runna's templates and
want a plan that actually adapts to their data.

## What it does

1. **Onboarding chat.** Race, date, distance, vert, training days,
   recent races, injury history, terrain access. ~10 minutes.
2. **Plan generation.** Periodized block (base → build → peak →
   taper) constrained by coaching rules (≤10% weekly load
   progression, down week every 3–4 weeks, single hard day between
   long runs). Workouts use a fixed type catalog (easy, long,
   intervals, tempo, threshold, hills) parameterized by the
   athlete's HR zones.
3. **Garmin delivery.** Plans push to Garmin Connect calendar via
   the Training API; auto-sync to watch.
4. **Weekly adaptation.** Every Sunday, the prior week's actual data
   plus user notes feed back into the plan generator. The user sees
   a diff for next week and can accept, edit, or reject.
5. **Day-of intervention.** "My knee hurts, ease off Wednesday" →
   plan re-renders.

## Why it's different

- **Trail and ultra as first-class:** vert targets, hilly
  out-and-backs, back-to-back long runs, race-simulation efforts,
  technical-terrain time-on-feet.
- **Real adaptation:** Runna picks a template; Switchback regenerates
  weekly from your data.
- **Conversational interface:** plan creation and adjustments happen
  in plain language, not by tapping through forms.

## Business

- **Pricing:** €14.99/month or €119/year. 14-day free trial, no card.
- **Distribution:** founder-led content marketing in the trail/ultra
  community; race partnerships with UTMB World Series; coach
  affiliate program. No paid acquisition pre-PMF.

## Garmin integration

- **Training API**: write structured workouts to user's Garmin
  Connect calendar. The user's watch syncs automatically. This is
  the integration that makes the product viable.
- **Health API** *(optional, secondary)*: read activity data
  (HR, pace, vert, duration) and wellness signals (sleep, HRV) to
  drive the weekly adaptation. If not initially approved, Switchback
  reads the same data from the activity files exported via the
  Garmin Connect calendar response.

Workouts conform to the existing Garmin structured-workout schema:
warmup / interval / cooldown / recovery / repeat groups with HR zone
targets, the same shape Garmin Coach and approved partners already
use.

## Team

Cloudwired, a Estonia company. Founded 2026 by Peter Van Hee.
Building Switchback as a focused product for the trail/ultra running
community.

## Status

Working prototype validated against a personal UTMB World Series
training cycle (Monte Rosa Walserwaeg Trail, July 2026). Plan
generation, Garmin workout structure, calendar push, and feedback
analysis all proven in production for one athlete across a 14-week
training block. Scaling to multi-user web/mobile product as of
[MONTH] 2026.
