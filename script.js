// ==================== Mobile Menu Toggle ====================
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger?.classList.remove('active');
        });
    });
});

// ==================== Smooth Scroll for Anchors ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== Intersection Observer for Animations ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and stat items
document.querySelectorAll('.feature-card, .stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// ==================== Active Link Highlighting ====================
window.addEventListener('scroll', function() {
    let scrollPosition = window.scrollY;
    
    document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop - 200 && scrollPosition < sectionTop + sectionHeight - 200) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            const activeLink = document.querySelector(`.nav-link[href="#${section.id}"]);
            if (activeLink) {
                activeLink.style.borderBottom = '2px solid var(--accent-color)';
                activeLink.style.paddingBottom = '4px';
            }
        }
    });
});

// ==================== Stats Counter Animation ====================
function animateCounter(element, target, duration = 2000) {
    const start = parseInt(element.textContent);
    const increment = (target - start) / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
            element.textContent = target + '%';
            clearInterval(timer);
        } else {
            element.textContent = Math.ceil(current) + '%';
        }
    }, 16);
}

// Start counter animation when stats section is visible
const statsSection = document.querySelector('.stats-grid');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            document.querySelectorAll('.stat-number').forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text);
                animateCounter(stat, number);
            });
            statsObserver.unobserve(entries[0].target);
        }
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
}

// ==================== Form Submission (Optional) ====================
const contactForm = document.querySelector('form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // You can add form submission logic here
        alert('Obrigado pelo contato! Responderemos em breve.');
        this.reset();
    });
}

// ==================== Keyboard Navigation ====================
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    }
});

// ==================== Accessibility: Skip to Main Content ====================
const skipLink = document.querySelector('.skip-link');
if (skipLink) {
    skipLink.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector('#main');
        if (target) {
            target.focus();
        }
    });
}

console.log('AgroTech website initialized successfully! 🚀');