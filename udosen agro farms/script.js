/* ============================================
   UDOSEN AGRO FARMS - Interactive JavaScript
   Clean, Sharp & Agro-Based Functionality
   ============================================ */

(function() {
    'use strict';

    // ─── Elements & Global Variables ───
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const backTop = document.getElementById('backTop');
    const form = document.getElementById('inquiryForm');
    const successMsg = document.getElementById('formSuccess');

    // ─── 1. Dynamic Farm Status (Agro Greeting) ───
    function greetBasedOnTime() {
        const hour = new Date().getHours();
        let greeting = "Welcome to UDOSEN Farms";
        
        // Agro-Based Time Logic: Farm opens at 6 AM, closes at 7 PM
        if (hour >= 6 && hour < 12) {
            greeting = "Good Morning, Farmer! Fresh harvest today.";
        } else if (hour >= 12 && hour < 17) {
            greeting = "Good Afternoon! Fields are buzzing with activity.";
        } else if (hour >= 17 && hour < 19) {
            greeting = "Good Evening! Fresh stock ready for pickup.";
        } else {
            greeting = "Farm is currently closed. Send us an inquiry!";
        }

        // Look for an element with ID "farm-greeting" (Add <span id="farm-greeting"></span> to hero if desired)
        const greetingEl = document.getElementById('farm-greeting');
        if (greetingEl) {
            greetingEl.textContent = greeting;
        }
    }
    greetBasedOnTime();

    // ─── 2. Header Scroll Effect ───
    window.addEventListener('scroll', () => {
        // Add shadow to header
        if (window.pageYOffset > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Show Back to Top button
        if (window.pageYOffset > 500) {
            backTop.classList.add('visible');
        } else {
            backTop.classList.remove('visible');
        }
    }, { passive: true });

    // ─── 3. Mobile Menu Toggle ───
    function toggleMenu() {
        const isOpen = hamburger.classList.toggle('active');
        mobileNav.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMenu);

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // ─── 4. Smooth Scrolling for Anchor Links ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // ─── 5. Back to Top ───
    backTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ─── 6. Scroll Reveal (IntersectionObserver) ───
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    
    revealElements.forEach(el => revealObserver.observe(el));

    // ─── 7. Quote Form Validation & Mailto Logic ───
    function validateField(field) {
        const group = field.closest('.form-group');
        const error = group.querySelector('.error-message');

        if (field.hasAttribute('required') && !field.value.trim()) {
            group.classList.add('error');
            return false;
        }

        // Email validation
        if (field.type === 'email' && field.value.trim()) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(field.value.trim())) {
                group.classList.add('error');
                return false;
            }
        }

        group.classList.remove('error');
        return true;
    }

    // Real-time validation on blur
    form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            const group = field.closest('.form-group');
            if (group.classList.contains('error')) {
                validateField(field);
            }
        });
    });

    // Submit Handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        let isValid = true;
        const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
        fields.forEach(field => {
            if (!validateField(field)) isValid = false;
        });

        // Final Email Check
        const emailField = document.getElementById('email');
        if (emailField.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
            const group = emailField.closest('.form-group');
            group.classList.add('error');
            isValid = false;
        }

        if (!isValid) {
            const firstError = form.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const input = firstError.querySelector('input, select, textarea');
                if (input) input.focus();
            }
            return;
        }

        // Gather Data for Email Client
        const name = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const product = document.getElementById('productInterest').value;
        const message = document.getElementById('message').value.trim();

        const subject = `[Agro Inquiry] ${product} - ${name}`;
        const body = 
            `Name: ${name}\n` +
            `Email: ${email}\n` +
            `Phone: ${phone}\n` +
            `Product Interest: ${product}\n\n` +
            `Message:\n${message}`;

        // Open User's Email Client
        window.location.href = `mailto:udosenfavour21@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Show Success Message & Reset
        successMsg.classList.add('show');
        form.reset();
        form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

        setTimeout(() => {
            successMsg.classList.remove('show');
        }, 8000);
    });
})();