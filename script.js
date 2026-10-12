// ===========================
// NAVBAR SCROLL EFFECT
// ===========================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===========================
// MOBILE MENU
// ===========================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const body = document.body;

function openMenu() {
  hamburger.classList.add('active');
  navLinks.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('active');
  navLinks.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  if (navLinks.classList.contains('open')) {
    closeMenu();
  } else {
    openMenu();
  }
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    closeMenu();
  });
});

// Close mobile menu on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    closeMenu();
    hamburger.focus();
  }
});

// ===========================
// ACTIVE NAV LINK ON SCROLL
// ===========================
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-link');

function setActiveLink() {
  const scrollPos = window.scrollY + 120;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', setActiveLink);

// ===========================
// SCROLL REVEAL ANIMATION
// ===========================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px',
  }
);

revealElements.forEach(el => revealObserver.observe(el));

// ===========================
// CONTACT FORM
// ===========================
const contactForm = document.getElementById('contactForm');

function setFieldError(field, hasError) {
  if (hasError) {
    field.classList.add('form-error');
  } else {
    field.classList.remove('form-error');
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const messageField = document.getElementById('message');

  const name = nameField.value.trim();
  const email = emailField.value.trim();
  const message = messageField.value.trim();

  let hasError = false;

  if (name.length < 2) {
    setFieldError(nameField, true);
    hasError = true;
  } else {
    setFieldError(nameField, false);
  }

  if (!email || !isValidEmail(email)) {
    setFieldError(emailField, true);
    hasError = true;
  } else {
    setFieldError(emailField, false);
  }

  if (message.length < 10) {
    setFieldError(messageField, true);
    hasError = true;
  } else {
    setFieldError(messageField, false);
  }

  if (hasError) {
    showNotification('Please fix the highlighted fields and try again.', 'error');
    // Focus first error field
    if (name.length < 2) nameField.focus();
    else if (!email || !isValidEmail(email)) emailField.focus();
    else messageField.focus();
    return;
  }

  // Simulate sending
  const btn = contactForm.querySelector('button[type="submit"]');
  const originalContent = btn.innerHTML;
  btn.innerHTML = '<span>Sending...</span>';
  btn.disabled = true;

  setTimeout(() => {
    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
    contactForm.reset();
    btn.innerHTML = originalContent;
    btn.disabled = false;
  }, 1500);
});

// Clear error state on input
['name', 'email', 'message'].forEach(id => {
  const field = document.getElementById(id);
  if (field) {
    field.addEventListener('input', () => setFieldError(field, false));
    field.addEventListener('change', () => setFieldError(field, false));
  }
});

// ===========================
// NOTIFICATION TOAST
// ===========================
function showNotification(message, type = 'success') {
  // Remove existing notification
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${type === 'success'
          ? '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
          : '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'
        }
      </svg>
      <span>${message}</span>
    </div>
  `;

  // Add styles
  Object.assign(notification.style, {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    background: type === 'success' ? '#00c896' : '#ff6b6b',
    color: '#fff',
    padding: '16px 24px',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
    zIndex: '9999',
    animation: 'slideInRight 0.4s ease',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.9rem',
    fontWeight: '500',
  });

  const contentEl = notification.querySelector('.notification-content');
  Object.assign(contentEl.style, {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  });

  document.body.appendChild(notification);

  // Add slide-in animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.style.transition = 'all 0.4s ease';
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 400);
  }, 4000);
}

// ===========================
// SMOOTH SCROLL FOR ALL ANCHORS
// ===========================
// ===========================
// SMOOTH SCROLL FOR ALL ANCHORS
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    // Only handle in-page anchors
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
