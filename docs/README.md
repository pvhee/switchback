# Pre-application artifacts

Drafts of the things that need to exist before contacting Garmin
about Training API access. Per the 7-point checklist:

1. **Landing page copy** → `landing-page.md`
2. **Company email setup notes** → `email-setup.md`
3. **Privacy policy** → `privacy-policy.md` *(draft — lawyer review required)*
4. **Terms of service** → `terms-of-service.md` *(draft — lawyer review required)*
5. **1-page product brief** → `brief.md`
6. **Garmin application copy** → `garmin-application.md`
7. **Garmin Developer contact-form ticket** → `garmin-contact-ticket.md`

Plus:
- `checklist.md` — the pre-application checklist with owner + status per item.

## Status

- **Brand:** Switchback (`switchback.run`)
- **Company:** Cloudwired (`cloudwired.dev`)
- **Founder contact:** `peter@switchback.run`

## Open placeholders

Still to fill in once available:

- `Estonia`, `[ENTITY_ADDRESS]`, `[ENTITY_CITY]` — Cloudwired's
  country of registration and registered address. Required for privacy
  policy (data controller identity, Art. 13 GDPR), terms of service
  (governing law), and the Garmin application.
- `[REG_NO]` — entity registration number.
- `[DATE]`, `[MONTH]` — publication / effective dates, filled at
  release time.

## Related

- Landing page implementation: `../web/`
- Existing prototype CLI (do not touch): root `sync.py`, `feedback.py`,
  `auth_only.py`, `races/`
