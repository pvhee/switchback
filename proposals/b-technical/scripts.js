(() => {
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  async function submitEmail(email, source) {
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
      button.textContent = '…';
      try {
        await submitEmail(email, source);
        status.textContent = "You're on the list.";
        status.classList.add('is-success');
        input.value = '';
      } catch (err) {
        status.textContent = "Try again, or email hello@switchback.run.";
        status.classList.add('is-error');
      } finally {
        button.disabled = false;
        button.textContent = original;
      }
    });
  });
})();
