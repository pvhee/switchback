# Company email setup

Goal: `peter@switchback.run` works for send and receive, with proper SPF /
DKIM / DMARC so Garmin's mail server doesn't classify the application
as spam. Plus a couple of role addresses for the legal docs and
support.

## Recommended provider

**Google Workspace Business Starter** (€6/user/month).
- Familiar UI, mobile sync, calendar, Drive — everything you need.
- Reputation: mail from a Workspace domain almost never gets
  spam-filtered.
- Alternative: **Fastmail** (€5/user/month) if you'd rather avoid
  Google. Equally credible on deliverability.
- Avoid: free Zoho tier (deliverability inconsistent), self-hosted
  mail (do not — IP reputation is brutal).

## Addresses to create

| Address | Purpose |
|---|---|
| `peter@switchback.run` | Founder email; used on Garmin application, signing privacy/terms, sales inquiries |
| `hello@switchback.run` | Generic inbound; published on landing page |
| `privacy@switchback.run` | Required by GDPR Art. 13/14 in the privacy policy; route to founder |
| `legal@switchback.run` | DMCA / legal notices; route to founder |
| `support@switchback.run` | Customer support once we have customers |

The role addresses can all alias to your main inbox at first. Don't
spin up separate inboxes until volume demands it.

## DNS records to set after provider setup

Workspace and Fastmail both walk you through this, but the records
will be roughly:

| Type | Host | Purpose |
|---|---|---|
| `MX` | `@` | Mail routing to provider |
| `TXT` | `@` | SPF — `v=spf1 include:_spf.google.com ~all` |
| `TXT` | `google._domainkey` (or provider equivalent) | DKIM signing key |
| `TXT` | `_dmarc` | DMARC policy — start with `v=DMARC1; p=none; rua=mailto:peter@switchback.run` |

Validate at https://mxtoolbox.com once set up. Garmin's intake may
check SPF/DKIM before a human reads the email — a misconfigured
domain looks unprofessional and can land in their spam folder.

## Email signature for the Garmin application

```
Peter Van Hee
Founder, Switchback
switchback.run

Cloudwired, Estonia
[entity registration number]
```

Keep it boring. The application is a credibility test.
