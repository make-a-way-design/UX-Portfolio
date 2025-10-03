document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.site-nav');
  const navOverlay = document.querySelector('.nav-overlay');
  const navToggles = document.querySelectorAll('.nav-toggle');

  const MOBILE_BREAKPOINT = 960;

  const setNav = (open) => {
    const shouldOpen = Boolean(open);
    document.body.classList.toggle('nav-open', shouldOpen);
    navToggles.forEach(btn => btn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false'));
    if (navOverlay) {
      navOverlay.hidden = !shouldOpen;
    }
  };

  navToggles.forEach(btn => {
    btn.addEventListener('click', () => setNav(!document.body.classList.contains('nav-open')));
  });

  if (navOverlay) {
    navOverlay.hidden = true;
    navOverlay.addEventListener('click', () => setNav(false));
  }

  nav?.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        setNav(false);
      }
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.body.classList.contains('nav-open')) {
      setNav(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > MOBILE_BREAKPOINT) {
      setNav(false);
      if (navOverlay) {
        navOverlay.hidden = true;
      }
    }
  });

  document.body.classList.add('js-enabled');

  const headerContent = document.querySelector('.header .header-content');
  if (headerContent) {
    headerContent.classList.add('visible');
  }

  const fadeLinks = document.querySelectorAll('a[href]');
  fadeLinks.forEach(link => {
    if (link.target === '_blank' || link.hasAttribute('download')) return;

    let url;
    try {
      url = new URL(link.getAttribute('href') || '', window.location.href);
    } catch (err) {
      return;
    }

    if (url.origin !== window.location.origin) return;
    if (url.hash && url.pathname === window.location.pathname) return;

    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey) return;
      event.preventDefault();
      document.body.classList.add('fade-out');
      setTimeout(() => {
        window.location.href = url.href;
      }, 320);
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px'
  });

  document.querySelectorAll('.scroll-thumb, .scroll-fade').forEach(el => {
    observer.observe(el);
  });
});
