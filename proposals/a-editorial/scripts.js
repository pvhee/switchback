// Switchback — landing page client script.
// Goals: nav shadow on scroll; waitlist form handling.

(() => {
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Waitlist form — stub handler. Wire to your real service (Buttondown /
  // Resend / Formspree / Mailchimp / etc.) by replacing `submitEmail` below
  // with a fetch to your endpoint.
  async function submitEmail(email, source) {
    // TODO: replace this stub with a real POST.
    // Example with Buttondown:
    //   const r = await fetch('https://api.buttondown.email/v1/subscribers', {
    //     method: 'POST',
    //     headers: { 'Authorization': 'Token YOUR_TOKEN', 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, tags: ['waitlist', source] }),
    //   });
    //   if (!r.ok) throw new Error('Subscription failed');
    await new Promise(r => setTimeout(r, 600));
    console.info('[waitlist stub]', { email, source });
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
