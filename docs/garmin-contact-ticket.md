# Garmin Developer contact-form ticket

Per the checklist item: use the Garmin Developer **Contact** form to
open a ticket while the standard intake form is paused. This is the
short version — designed to fit a contact-form text area, get a human
to reply, and lead to the full application (`garmin-application.md`)
attached or sent next.

Keep it short. The goal is to get into a thread, not to land the
decision in one message.

---

**Subject:** Training API access — Switchback (trail / ultra running plan service)

---

Hi Garmin Developer Relations,

I'm writing to request access to the Training API. The standard
Connect Developer Program intake form appears to be paused, so I
hope this contact channel is the right way to start a conversation.

**Who we are:** Cloudwired, a Estonia company. I'm Peter Van
Hee, the founder. Website: https://switchback.run. Privacy policy and terms
are published at https://switchback.run/privacy and https://switchback.run/terms.

**What we're building:** Switchback is a training plan service for
endurance runners, focused on trail and ultra-trail — a segment
underserved by existing template-based apps. Users describe their
goal race in natural language; we generate a periodized plan and
adapt it weekly to their actual training data.

**What we need:** the Training API, to push structured workouts to
the user's Garmin Connect calendar so they sync to their watch. The
same integration pattern used by TrainingPeaks and similar partners.

**Volume:** modest. One weekly push per user, scaling from ~50 users
in alpha to ~5,000 in year one.

**Posture on user data:** OAuth only — we never request or store
Garmin credentials. Tokens are encrypted at rest in our EU-region
database. Disconnect deletes tokens immediately. Full data-handling
detail in the Privacy Policy linked above.

**Activity / Health API:** would benefit our weekly adaptation loop
but is not a launch blocker. Happy to scope this in the same
conversation or defer to a later request — whichever is easier on
your side.

I have a 1-page product brief and a longer application document
ready to send as soon as you let me know the right intake. Happy to
do a short call if useful.

Thanks for your time.

Best,
Peter Van Hee
Founder, Switchback
peter@switchback.run
Cloudwired · Estonia
[entity registration number]

---

## Notes for sending

- **Don't attach the long application yet.** First message is just to
  open the thread and confirm the right intake. Attachments often
  trigger spam filters or get stripped by contact forms.
- **Send from `peter@switchback.run`**, not Gmail. The whole point of
  setting up the company email first is so this lands credibly.
- **Wait 10 business days before following up.** Garmin DevRel is
  slow but does respond. A polite one-line follow-up after 10 days is
  appropriate; nagging earlier is counterproductive.
- **If you have any contact at Garmin** (LinkedIn, mutual connection,
  someone at a sponsored race), use it in parallel. A warm intro
  cuts response time meaningfully.
