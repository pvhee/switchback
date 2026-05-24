# Garmin Training API — cover email (send after the contact-form ticket gets a human reply)

The contact-form ticket (`garmin-contact-ticket.md`) is the icebreaker.
When a human at Garmin DevRel replies and asks for more, this is the
follow-up that delivers the full application package. Keep it short:
acknowledge, link, attach, offer a call.

**Don't send this before they reply to the ticket.** Cold-mailing the
full application bypasses their triage and lands in a different queue.

---

**Subject:** RE: Training API access — Switchback (trail / ultra running plan service)

**From:** Peter Van Hee &lt;peter@switchback.run&gt;
**Attachments:** `switchback-training-api-application.pdf`, `switchback-brief.pdf`

---

Hi [NAME],

Thanks for getting back to me, and for the pointer to [INTAKE / FORM /
NEXT STEP they mentioned].

Attached is the full application document for the Switchback Training
API integration request, plus our one-page product brief. The
short version:

- **Switchback** is an adaptive training plan service for trail and
  ultra runners. Plain-language goal in, periodised plan out,
  structured workouts pushed to the user's Garmin watch.
- **Status:** working prototype live. Reviewers can see the full
  flow in under five minutes — including downloading a real Garmin
  `.FIT` structured workout — at:
  - **App:** [APP_URL]
  - **Reviewer walkthrough:** [APP_URL]/demo.html
  - **Public source:** https://github.com/pvhee/switchback
- **Privacy & Terms** (lawyer-reviewed, published):
  - https://switchback.run/privacy
  - https://switchback.run/terms
- **Volume forecast** is in the application doc — modest, bounded by
  weekly batch cadence (one push per user per week + occasional
  adjustments).
- **Data posture:** OAuth tokens only, encrypted at rest in an
  EU-region database, deleted on disconnect. We never request or
  store Garmin passwords.

We're asking for **Training API** access primarily. Read access to
the Activity / Health API would benefit our weekly adaptation loop
but is not a launch blocker — happy to scope it now or defer.

If a short call would be useful — to walk through the integration
shape, the OAuth callback hosts, expected error handling, or any
specific concerns — I'm in CET, flexible. Or I'm happy to answer in
this thread.

Thanks for your time on this.

Best,
Peter Van Hee
Founder, Switchback
peter@switchback.run · https://switchback.run
Cloudwired, Estonia · [REG_NO]

---

## Send-day checklist

Before hitting send, verify:

- [ ] **PDFs render correctly.** Generate from the markdown sources:
      ```
      pandoc docs/garmin-application.md -o switchback-training-api-application.pdf
      pandoc docs/brief.md -o switchback-brief.pdf
      ```
      Open both. Headers shouldn't break across pages mid-table.
- [ ] **All `[PLACEHOLDERS]`** in the email body are filled:
      `[NAME]` (their name from the reply), `[INTAKE / FORM / NEXT
      STEP]` (whatever they suggested), `[APP_URL]` (the Render or
      `app.switchback.run` URL), `[REG_NO]` (entity registration
      number).
- [ ] **The links resolve.** Click each one as if you were the
      reviewer. `/demo.html` loads, `/privacy` and `/terms` load,
      the GitHub repo is public.
- [ ] **Email signature** is the boring version from
      `email-setup.md` — not a marketing signature with social links.
- [ ] **Sent from `peter@switchback.run`** (not Gmail).
- [ ] **SPF / DKIM / DMARC** pass — verify with
      https://mxtoolbox.com before sending.

## Follow-up cadence

- 10 business days of silence → polite one-liner: *"Just bumping
  this in case my last message got buried. Happy to provide more
  detail / set up a call / whatever helps."*
- Another 10 business days → ask the original ticket thread for a
  status update.
- Beyond that → use any warm path (LinkedIn intro, race sponsor
  contact, partner at TrainingPeaks).

Don't nag. Each follow-up should add value or close a loop — never
just bump for the sake of bumping.
