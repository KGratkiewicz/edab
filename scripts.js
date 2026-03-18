(() => {
  const SELECTORS = {
    hamburger: '.header .nav-bar .nav-list .hamburger',
    mobileMenu: '.header .nav-bar .nav-list ul',
    menuItems: '.header .nav-bar .nav-list ul li a',
    tabLinks: '.tab-link',
    tabPanels: '.projects-content',
    slidesWrapper: '#slidesWrapper',
    logoItems: '.logo-item'
  };

  const hamburger = document.querySelector(SELECTORS.hamburger);
  const mobileMenu = document.querySelector(SELECTORS.mobileMenu);
  const navList = document.querySelector('.header .nav-bar .nav-list');
  const header = document.getElementById('header');
  const menuItems = document.querySelectorAll(SELECTORS.menuItems);
  const tabLinks = Array.from(document.querySelectorAll(SELECTORS.tabLinks));
  const tabPanels = Array.from(document.querySelectorAll(SELECTORS.tabPanels));
  const slidesWrapper = document.querySelector(SELECTORS.slidesWrapper);
  const logoItems = Array.from(document.querySelectorAll(SELECTORS.logoItems));

  const callButton = document.getElementById('call');
  const mailButton = document.getElementById('mail');
  const locationButton = document.getElementById('location');

  const phoneNumber = '+48797314398';
  const email = 'biuro@e-dab.pl';

  const desktopMedia = window.matchMedia('(min-width: 900px)');

  function setMenuState(isOpen) {
    if (!hamburger || !mobileMenu || !navList) {
      return;
    }

    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Zamknij menu' : 'Otwórz menu');
    mobileMenu.classList.toggle('active', isOpen);
    navList.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function setupMenu() {
    if (!hamburger || !mobileMenu || !navList) {
      return;
    }

    hamburger.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('active');
      setMenuState(isOpen);
    });

    menuItems.forEach((item) => {
      item.addEventListener('click', () => setMenuState(false));
    });

    document.addEventListener('click', (event) => {
      if (!mobileMenu.classList.contains('active')) {
        return;
      }

      const clickedInsideNav = event.target instanceof Element && event.target.closest('.nav-list');
      if (!clickedInsideNav) {
        setMenuState(false);
      }
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setMenuState(false);
      }
    });

    const syncHeaderOnScroll = () => {
      if (!header) {
        return;
      }

      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };

    syncHeaderOnScroll();
    window.addEventListener('scroll', syncHeaderOnScroll, { passive: true });

    const closeOnDesktop = (event) => {
      if (event.matches) {
        setMenuState(false);
      }
    };

    if (typeof desktopMedia.addEventListener === 'function') {
      desktopMedia.addEventListener('change', closeOnDesktop);
    } else if (typeof desktopMedia.addListener === 'function') {
      desktopMedia.addListener(closeOnDesktop);
    }
  }

  function activateTab(tabToActivate) {
    if (!tabToActivate) {
      return;
    }

    const targetClass = tabToActivate.dataset.target;

    tabLinks.forEach((tab) => {
      const isSelected = tab === tabToActivate;
      tab.classList.toggle('active', isSelected);
      tab.setAttribute('aria-selected', String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
    });

    tabPanels.forEach((panel) => {
      const isSelectedPanel = panel.classList.contains(targetClass);
      panel.classList.toggle('active', isSelectedPanel);
      panel.hidden = !isSelectedPanel;
    });
  }

  function setupTabs() {
    if (!tabLinks.length || !tabPanels.length) {
      return;
    }

    tabLinks.forEach((tab) => {
      tab.addEventListener('click', () => activateTab(tab));

      tab.addEventListener('keydown', (event) => {
        const currentIndex = tabLinks.indexOf(tab);
        if (currentIndex === -1) {
          return;
        }

        let nextIndex = currentIndex;

        if (event.key === 'ArrowRight') {
          nextIndex = (currentIndex + 1) % tabLinks.length;
        }

        if (event.key === 'ArrowLeft') {
          nextIndex = (currentIndex - 1 + tabLinks.length) % tabLinks.length;
        }

        if (nextIndex !== currentIndex) {
          event.preventDefault();
          tabLinks[nextIndex].focus();
          activateTab(tabLinks[nextIndex]);
        }
      });
    });

    activateTab(tabLinks.find((tab) => tab.classList.contains('active')) || tabLinks[0]);
  }

  function goToSlide(index) {
    if (!slidesWrapper || !logoItems.length) {
      return;
    }

    const boundedIndex = Math.max(0, Math.min(index, logoItems.length - 1));
    slidesWrapper.style.transform = `translateX(-${100 * boundedIndex}%)`;

    logoItems.forEach((logo, logoIndex) => {
      const isActive = logoIndex === boundedIndex;
      logo.classList.toggle('active', isActive);
      logo.setAttribute('aria-pressed', String(isActive));
    });
  }

  function setupSlider() {
    if (!slidesWrapper || !logoItems.length) {
      return;
    }

    logoItems.forEach((logo) => {
      logo.addEventListener('click', () => {
        const index = Number.parseInt(logo.dataset.index || '', 10);
        if (!Number.isNaN(index)) {
          goToSlide(index);
        }
      });
    });

    goToSlide(0);
  }

  function canUseClipboard() {
    return Boolean(navigator.clipboard && window.isSecureContext);
  }

  function fallbackCopyText(text) {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = text;
    tempTextArea.setAttribute('readonly', '');
    tempTextArea.style.position = 'absolute';
    tempTextArea.style.left = '-9999px';
    document.body.append(tempTextArea);
    tempTextArea.select();

    const copySucceeded = typeof document.execCommand === 'function'
      ? document.execCommand('copy')
      : false;
    tempTextArea.remove();
    return copySucceeded;
  }

  async function copyText(text, successMessage) {
    try {
      if (canUseClipboard()) {
        await navigator.clipboard.writeText(text);
        window.alert(successMessage);
        return;
      }

      if (fallbackCopyText(text)) {
        window.alert(successMessage);
      }
    } catch (error) {
      console.error('Błąd podczas kopiowania', error);
    }
  }

  function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  function setupContactActions() {
    if (callButton) {
      callButton.addEventListener('click', () => {
        if (isMobileDevice()) {
          window.location.href = `tel:${phoneNumber}`;
          return;
        }

        copyText(phoneNumber, `Skopiowano numer telefonu: ${phoneNumber}`);
      });
    }

    if (mailButton) {
      mailButton.addEventListener('click', () => {
        if (isMobileDevice()) {
          const body = 'Dzień%20dobry.%20Jestem%20zainteresowany,%20proszę%20o%20kontakt.';
          window.location.href = `mailto:${email}?subject=Oferta&body=${body}`;
          return;
        }

        copyText(email, `Skopiowano adres email: ${email}`);
      });
    }

    if (locationButton) {
      locationButton.addEventListener('click', () => {
        window.open('https://maps.app.goo.gl/i3D6GyPJhEfm9fvt6', '_blank', 'noopener,noreferrer');
      });
    }
  }

  setupMenu();
  setupTabs();
  setupSlider();
  setupContactActions();
})();
