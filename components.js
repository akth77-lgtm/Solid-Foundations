// Layout Components Loader
function loadComponents() {

  const navHTML = `
  <nav class="navbar navbar-expand-lg sticky-top site-nav">
    <div class="container">
      <a class="navbar-brand d-flex align-items-center gap-2" href="index.html">
        <img class="brand-logo" src="images/Logo.png" alt="Solid Foundations logo" />
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
        data-bs-target="#siteNav" aria-controls="siteNav" aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="siteNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-3">
          <li class="nav-item"><a class="nav-link" href="about.html" data-i18n="nav_about">عن الشركة</a></li>
          <li class="nav-item"><a class="nav-link" href="services.html" data-i18n="nav_services">الخدمات</a></li>
          <li class="nav-item"><a class="nav-link" href="projects.html" data-i18n="nav_projects">المشاريع</a></li>
          <li class="nav-item"><a class="nav-link" href="quality.html" data-i18n="nav_quality">الجودة</a></li>
          <li class="nav-item"><a class="nav-link" href="contact.html" data-i18n="nav_contact">تواصل معنا</a></li>
        </ul>
        <div class="d-flex align-items-center gap-2 flex-wrap navbar-actions">
          <div class="theme-switcher">
            <span class="theme-switcher-label" aria-hidden="true">
              <i class="bi bi-palette2"></i>
            </span>
            <div class="theme-options" role="group" aria-label="Theme options">
              <button class="theme-dot theme-dot-trust" type="button" data-theme-option="trust" data-i18n-title="theme_trust" title="الثقة والاحتراف" aria-label="الثقة والاحتراف" aria-pressed="false">
                <span class="visually-hidden" data-i18n="theme_trust">الثقة والاحتراف</span>
              </button>
              <button class="theme-dot theme-dot-build" type="button" data-theme-option="build" data-i18n-title="theme_build" title="البناء والقوة" aria-label="البناء والقوة" aria-pressed="false">
                <span class="visually-hidden" data-i18n="theme_build">البناء والقوة</span>
              </button>
              <button class="theme-dot theme-dot-modern" type="button" data-theme-option="modern" data-i18n-title="theme_modern" title="الهندسة الحديثة" aria-label="الهندسة الحديثة" aria-pressed="false">
                <span class="visually-hidden" data-i18n="theme_modern">الهندسة الحديثة</span>
              </button>
              <button class="theme-dot theme-dot-abuwaleed" type="button" data-theme-option="abuwaleed" data-i18n-title="theme_abuwaleed" title="باقة أبو الوليد" aria-label="باقة أبو الوليد" aria-pressed="false">
                <span class="visually-hidden" data-i18n="theme_abuwaleed">باقة أبو الوليد</span>
              </button>
            </div>
          </div>
          <button class="btn btn-ghost" type="button" data-lang-toggle>EN</button>
          <a class="btn btn-primary" href="contact.html" data-i18n="nav_cta">اطلب استشارة</a>
        </div>
      </div>
    </div>
  </nav>`;

  const footerHTML = `
  <footer class="footer">
    <div class="container">
      <div class="row mb-4">
        <div class="col-md-4 mb-3">
          <div class="footer-brand">
            <img class="brand-logo" src="images/Logo.png" alt="Solid Foundations logo" />
          </div>
          <p class="footer-text" data-i18n="footer_desc">
            شركة متخصصة في المقاولات الهندسية مع التزام عميق بالجودة والتسليم في الوقت.
          </p>
        </div>

        <div class="col-md-2 mb-3">
          <h6 data-i18n="footer_links">الروابط</h6>
          <ul class="list-unstyled">
            <li><a href="about.html" data-i18n="nav_about">عن الشركة</a></li>
            <li><a href="services.html" data-i18n="nav_services">الخدمات</a></li>
            <li><a href="projects.html" data-i18n="nav_projects">المشاريع</a></li>
            <li><a href="contact.html" data-i18n="nav_contact">تواصل معنا</a></li>
          </ul>
        </div>

        <div class="col-md-3 mb-3">
          <h6 data-i18n="footer_contact">تواصل</h6>
          <p class="footer-text"><i class="bi bi-telephone"></i> +966 12 345 6789</p>
          <p class="footer-text"><i class="bi bi-envelope"></i> info@solidfoundations.sa</p>
          <p class="footer-text"><i class="bi bi-geo-alt"></i> الرياض، المملكة العربية السعودية</p>
        </div>

        <div class="col-md-3 mb-3">
          <h6 data-i18n="footer_follow">تابعنا</h6>
          <div class="d-flex gap-2">
            <a href="#" class="social"><i class="bi bi-facebook"></i></a>
            <a href="#" class="social"><i class="bi bi-twitter"></i></a>
            <a href="#" class="social"><i class="bi bi-linkedin"></i></a>
            <a href="#" class="social"><i class="bi bi-instagram"></i></a>
          </div>
        </div>
      </div>
    </div>
  </footer>`;

  // Insert navbar: prefer after topbar if it exists, otherwise at top of body
  const topbar = document.querySelector('.topbar');
  if (!document.querySelector('.site-nav')) {
    if (topbar) {
      topbar.insertAdjacentHTML('afterend', navHTML);
    } else {
      document.body.insertAdjacentHTML('afterbegin', navHTML);
    }
  }

  // Insert footer before closing body tag
  if (!document.querySelector('footer.footer')) {
    document.body.insertAdjacentHTML('beforeend', footerHTML);
  }

  initializeNavigation();
  initializeFooter();

  document.dispatchEvent(new Event("components:loaded"));
}

// Navigation
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.site-nav .nav-link');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  const navbar = document.querySelector('.site-nav');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 0);
    });
  }
}

// Footer
function initializeFooter() {
  const toTopBtn = document.querySelector('.to-top');
  if (!toTopBtn) return;

  window.addEventListener('scroll', () => {
    toTopBtn.classList.toggle('is-visible', window.scrollY > 300);
  });

  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Load components
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadComponents);
} else {
  loadComponents();
}
