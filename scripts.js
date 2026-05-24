// Switchback — landing page client script.
// Goals: nav shadow on scroll; waitlist form handling.

(() => {
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Waitlist form — posts to formsubmit.co (no account required).
  //
  // SETUP (one-time, once peter@switchback.run is live):
  //   1. Submit any test email from the form below.
  //   2. formsubmit.co will email peter@switchback.run an activation link.
  //   3. Click it once. From that moment, real submissions are delivered.
  //
  // To swap providers (Tally, Buttondown, ConvertKit, etc.), change the
  // ENDPOINT constant and the body shape — that's the only edit needed.
  const ENDPOINT = 'https://formsubmit.co/ajax/peter@switchback.run';

  async function submitEmail(email, source) {
    const r = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        source,
        _subject: `Switchback waitlist signup (${source})`,
        _template: 'table',
      }),
    });
    let data = {};
    try { data = await r.json(); } catch { /* network or non-JSON */ }
    if (!r.ok || (data.success && data.success !== 'true')) {
      throw new Error(data.message || `Subscription failed (${r.status})`);
    }
  }

  document.querySelectorAll('form.waitlist').forEach(form => {
    const status = form.querySelector('.waitlist-status');
    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector('button[type="submit"]');
    const source = form.dataset.form || 'unknown';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = '';
      status.className = 'waitlist-status';
      const email = (input.value || '').trim();
      if (!email) return;
      const original = button.textContent;
      button.disabled = true;
      button.textContent = 'Joining…';
      try {
        await submitEmail(email, source);
        status.textContent = "You're on the list. We'll be in touch.";
        status.classList.add('is-success');
        input.value = '';
      } catch (err) {
        status.textContent = "Something went wrong. Try again, or email hello@switchback.run.";
        status.classList.add('is-error');
      } finally {
        button.disabled = false;
        button.textContent = original;
      }
    });
  });
})();
