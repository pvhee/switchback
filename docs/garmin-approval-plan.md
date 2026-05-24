# Garmin Training API — approval plan

The shortest plausible path from today to an approved Training API
integration. Ordered by dependency. Most items only you can do —
Claude can help with the writing and code in between.

---

## Current state (2026-05)

What's done:

- Brand locked (Switchback) and intended legal entity named (Cloudwired,
  Estonia)
- Landing page built; deployable via GitHub Pages
- Application materials drafted (`docs/garmin-application.md`,
  `docs/garmin-contact-ticket.md`, `docs/brief.md`)
- Privacy policy and Terms of Service drafted (need lawyer review)
- **Web app built and on `main`**: plain-language → structured plan via
  Claude, `.FIT` export per workout, demo mode works without a backend.
  Tests in `app/tests/`. This is the single biggest credibility lever
  for Garmin — they will click whatever URL you put in the application.

What's missing (the checklist gaps):

- Entity registration (or registration number copied into docs)
- `switchback.run` purchased
- Workspace email (`peter@switchback.run`) live with SPF/DKIM/DMARC
- Landing page live at `switchback.run`
- Privacy / Terms lawyer-reviewed and published
- App deployed to a public URL so reviewers can use it
- Application not submitted

---

## Critical path

Three blockers run roughly in parallel. **Lawyer review of legal docs is
the longest single item — start it Day 1.**

```
Week 1                 Week 2                 Week 3                 Week 4
├─ entity              ├─ landing live        ├─ legal published     ├─ submit
├─ domain              ├─ app deployed        ├─ app docs final      └─ follow up day 10
├─ email               └─ lawyer in flight    └─ application
└─ lawyer engaged
```

If the entity is already registered and the domain is bought, Week 1
collapses to a 1–2 day window.

---

## Week 1 — foundations (only you)

| # | Item | Notes |
|---|---|---|
| 1.1 | **Entity registration confirmed.** If Cloudwired Estonia is incorporated, capture the registration number. If not, file. Blocks every doc that names the legal entity. | Estonia e-Residency typically 1–5 days. |
| 1.2 | **Buy `switchback.run`** on Namecheap or your registrar of choice. | ~€30/yr. |
| 1.3 | **Google Workspace** on `switchback.run` per `docs/email-setup.md`. Set SPF / DKIM / DMARC. Verify with mxtoolbox. | Garmin's mail server checks SPF before a human reads the message. |
| 1.4 | **Engage a privacy lawyer** (Estonia or your jurisdiction) for review of `docs/privacy-policy.md` + `docs/terms-of-service.md`. Get the quote, send drafts, ask for 2-week turnaround. | This is the longest-lead item. Don't wait. |
| 1.5 | **DNS `switchback.run` → GitHub Pages** for the landing page. README has the steps. | 24 hr DNS, then you have a public site. |

---

## Week 2 — public surface (mostly you; Claude can help)

| # | Item | Owner | Notes |
|---|---|---|---|
| 2.1 | **Deploy the app to Render** via `app/render.yaml`. Set `ANTHROPIC_API_KEY`. Get a `*.onrender.com` URL. | You | ~10 min. Will be referenced in the application. |
| 2.2 | **Custom domain on the app** (`app.switchback.run`) once domain is live. | You | Optional but cheap polish. |
| 2.3 | **Reviewer-ready demo page**: a short `/demo` route or a `docs/demo.md` explaining what the reviewer can do (paste a goal, see a plan, download a `.FIT`, import into Garmin Connect to confirm it parses). | Claude | I can write this. |
| 2.4 | **Update application docs** to reference the working prototype (live URL, public repo, demo flow) instead of "validated against personal training block". | Claude | Doing this now — see updates to `garmin-application.md` and `brief.md` in this commit. |
| 2.5 | **Fill placeholders** in legal + application docs: `[REG_NO]`, `[ENTITY_ADDRESS]`, `[DATE]`, `[MONTH]`, `[ENTITY_CITY]`. | You + Claude | Trivial once entity info is known. |
| 2.6 | **Add a waitlist counter on the landing page** if signups are flowing. Even "27 trail runners on the waitlist" is signal Garmin reviewers will register. | Claude | I can build a Formspree / Tally integration. |

---

## Week 3 — legal + finalisation (you + lawyer; Claude tidies)

| # | Item | Owner | Notes |
|---|---|---|---|
| 3.1 | **Lawyer returns reviewed Privacy & Terms.** Incorporate changes; publish at `switchback.run/privacy` and `switchback.run/terms`. Update `Last updated` and `Effective` dates. | You + Claude | Application requires these URLs live. |
| 3.2 | **Final review of `garmin-application.md`** with the prototype reality and finalised legal links. | Claude | I can do another pass once placeholders land. |
| 3.3 | **PDF version of the application** + product brief as attachments. | Claude | Pandoc one-liner; I can do it. |
| 3.4 | **Test deliverability**: send `peter@switchback.run` → known address, check SpamAssassin score. Aim < 1. | You | https://mail-tester.com |

---

## Week 4 — submit

Per `docs/garmin-contact-ticket.md`:

1. **Open the thread.** Submit the short ticket via Garmin Developer
   contact form. Don't attach documents — just establish the thread
   and confirm the right intake.
2. **Wait for a human reply.** This usually takes 3–10 business days.
3. **Reply with the full application** (`garmin-application.md`) +
   brief PDF + privacy/terms URLs + live demo link.
4. **Polite follow-up at 10 business days** if no response.
5. **Use any warm path in parallel.** LinkedIn search for "Garmin
   Developer Relations" or anyone in the Connect API team. A
   one-degree intro cuts response time meaningfully. Same for any
   contact at sponsored UTMB races.

---

## What Claude (me) can do in this session and future sessions

Without further input from you:

- Update `garmin-application.md` "Existing validation" section to
  reflect the public prototype (doing in this commit)
- Update `brief.md` Status section accordingly (doing in this commit)
- Build a `/demo` walkthrough page targeted at Garmin reviewers
- Write the cover email when you're ready to submit
- Generate the PDF attachments once placeholders are filled
- Add a working waitlist form to the landing page

Need your input first:

- Entity reg number, address, city
- Confirmed launch month (closed alpha date)
- Once domain + email are live, the exact URLs to reference
- Lawyer feedback on legal docs

---

## What Garmin reviewers will actually look at

Anticipating the review so we don't get caught flat-footed:

1. **Is this a real company?** Reg number, address, lawyer-reviewed
   legal docs, business email on custom domain. ✅ once Week 1 done.
2. **Is there a real product?** Live URL, working flow, public repo
   if open. ✅ once Week 2 deploy done. Big win.
3. **What's the data posture?** Privacy policy specifically addresses
   Garmin OAuth, token storage, retention, deletion. ✅ already
   drafted; needs lawyer review.
4. **What's the medical / liability posture?** ToS §6 is explicit. ✅.
5. **Is the volume plausible and bounded?** Forecast in
   `garmin-application.md` is reasonable. ✅.
6. **Will they pollute the API with bad requests?** Mentioning rate
   limits, retries, idempotent batching in the application helps.
   Claude can add a "Technical posture" section if useful.

The first two — real company, real product — are the ones our pre-Week-3
state doesn't yet support. Everything in Weeks 1–2 exists to close those.

---

## What changes if Garmin says no (or takes >3 months)

Per the brief, the .FIT export path is the alpha fallback. The app
already supports it. If approval drags, ship closed alpha on .FIT,
gather a few dozen alpha users, use that "demand" as leverage on a
follow-up application. Don't pause product development waiting on
Garmin.
