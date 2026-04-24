// ===== LANGUAGE TOGGLE (PT default, EN optional) =====
const LANG_STORAGE_KEY = 'lang';
const initialLang = localStorage.getItem(LANG_STORAGE_KEY) === 'en' ? 'en' : 'pt';

// Apply body attribute up-front to avoid a flash of the wrong language
document.body.dataset.lang = initialLang;
document.documentElement.lang = initialLang === 'en' ? 'en' : 'pt-BR';

const langOptions = document.querySelectorAll('.lang-option');

function setLanguage(lang) {
    const targetLang = lang === 'en' ? 'en' : 'pt';
    document.body.dataset.lang = targetLang;
    localStorage.setItem(LANG_STORAGE_KEY, targetLang);
    document.documentElement.lang = targetLang === 'en' ? 'en' : 'pt-BR';

    langOptions.forEach(btn => {
        const isActive = btn.getAttribute('data-lang') === targetLang;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    document.dispatchEvent(new CustomEvent('languagechange', { detail: { lang: targetLang } }));
}

langOptions.forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        if (lang) setLanguage(lang);
    });
});

// Mark the active button on load
setLanguage(initialLang);

// ===== TYPED ROLES ANIMATION =====
const roles = [
    'Data Scientist',
    'AI & ML Engineer',
    'Python Developer'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedElement = document.getElementById('typed-role');

function typeRole() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
        typedElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentRole.length) {
        delay = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 400;
    }

    setTimeout(typeRole, delay);
}

typeRole();

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== MOBILE MENU TOGGLE =====
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== STAT COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        };

        update();
    });
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add fade-in class to elements
document.querySelectorAll('.timeline-item, .project-card, .skill-category, .highlight-card, .education-card, .contact-card, .metric').forEach(el => {
    el.classList.add('fade-in');
    fadeObserver.observe(el);
});

// Counter animation observer
const statsSection = document.querySelector('.about-stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
}

// ===== PROJECT FILTERS =====
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const showAllBtn = document.getElementById('show-all-projects');
const showAllBtnLabel = showAllBtn ? showAllBtn.querySelector('.btn-show-all-label') : null;

const INITIAL_VISIBLE = 6;
let currentFilter = 'all';
let isExpanded = false;

function applyFilter() {
    let matchedCount = 0;

    projectCards.forEach(card => {
        const matchesFilter = currentFilter === 'all' || card.getAttribute('data-category') === currentFilter;

        if (!matchesFilter) {
            card.classList.add('hidden');
            return;
        }

        matchedCount++;
        const overLimit = currentFilter === 'all' && !isExpanded && matchedCount > INITIAL_VISIBLE;

        if (overLimit) {
            card.classList.add('hidden');
        } else {
            card.classList.remove('hidden');
            card.style.animation = 'fadeInUp 0.4s ease forwards';
        }
    });

    if (!showAllBtn) return;

    const shouldShowButton = currentFilter === 'all' && matchedCount > INITIAL_VISIBLE;

    if (shouldShowButton) {
        showAllBtn.hidden = false;
        showAllBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        if (showAllBtnLabel) {
            const isEN = document.body.classList.contains('lang-en');
            if (isExpanded) {
                showAllBtnLabel.textContent = isEN ? 'Show fewer projects' : 'Ver menos projetos';
            } else {
                showAllBtnLabel.textContent = isEN
                    ? `Show all ${matchedCount} projects`
                    : `Ver todos os ${matchedCount} projetos`;
            }
        }
    } else {
        showAllBtn.hidden = true;
    }
}

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        isExpanded = false;
        applyFilter();
    });
});

if (showAllBtn) {
    showAllBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;
        applyFilter();
        if (!isExpanded) {
            const projectsSection = document.getElementById('projects');
            if (projectsSection) projectsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

applyFilter();

// ===== EXPERIENCE SHOW ALL =====
const timelineItems = document.querySelectorAll('.timeline-item');
const showAllExpBtn = document.getElementById('show-all-experience');
const showAllExpBtnLabel = showAllExpBtn ? showAllExpBtn.querySelector('.btn-show-all-label') : null;
const INITIAL_VISIBLE_EXP = 3;
let isExpExpanded = false;

function applyExpFilter() {
    timelineItems.forEach((item, idx) => {
        if (!isExpExpanded && idx >= INITIAL_VISIBLE_EXP) {
            item.classList.add('is-hidden');
        } else {
            item.classList.remove('is-hidden');
        }
    });

    if (!showAllExpBtn) return;

    const totalCount = timelineItems.length;
    if (totalCount > INITIAL_VISIBLE_EXP) {
        showAllExpBtn.hidden = false;
        showAllExpBtn.setAttribute('aria-expanded', isExpExpanded ? 'true' : 'false');
        if (showAllExpBtnLabel) {
            const isEN = document.body.classList.contains('lang-en');
            if (isExpExpanded) {
                showAllExpBtnLabel.textContent = isEN ? 'Show fewer experiences' : 'Ver menos experiências';
            } else {
                showAllExpBtnLabel.textContent = isEN
                    ? `Show all ${totalCount} experiences`
                    : `Ver todas as ${totalCount} experiências`;
            }
        }
    } else {
        showAllExpBtn.hidden = true;
    }
}

if (showAllExpBtn) {
    showAllExpBtn.addEventListener('click', () => {
        isExpExpanded = !isExpExpanded;
        applyExpFilter();
        if (!isExpExpanded) {
            const expSection = document.getElementById('experience');
            if (expSection) expSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

applyExpFilter();

// Refresh dynamic labels when language changes
document.addEventListener('languagechange', () => {
    applyFilter();
    applyExpFilter();
});

// ===== SMOOTH SCROLL FOR NAVIGATION =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = 'var(--accent-light)';
        }
    });
});

// ===== PARTICLES BACKGROUND =====
const particlesContainer = document.getElementById('particles');

function createParticle() {
    const particle = document.createElement('div');
    const size = Math.random() * 3 + 1;
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(99, 102, 241, ${Math.random() * 0.3 + 0.1});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
        pointer-events: none;
    `;
    particlesContainer.appendChild(particle);
}

// Create particles
for (let i = 0; i < 30; i++) {
    createParticle();
}

// Add particle animation
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFloat {
        0% { transform: translateY(0) translateX(0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px); opacity: 0; }
    }
`;
document.head.appendChild(particleStyle);
