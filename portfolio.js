
(function () {
    // Navbar scroll state
    const navbar = document.getElementById('navbar');
    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile menu
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const backdrop = document.getElementById('menuBackdrop');
    function toggleMenu(force) {
        const open = force !== undefined ? force : !mobileMenu.classList.contains('open');
        mobileMenu.classList.toggle('open', open);
        backdrop.classList.toggle('open', open);
        hamburger.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', open);
    }
    hamburger.addEventListener('click', () => toggleMenu());
    backdrop.addEventListener('click', () => toggleMenu(false));
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

    // Scroll reveal
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealEls = document.querySelectorAll('.reveal');
    if (reduceMotion) {
        revealEls.forEach(el => el.classList.add('in'));
    } else {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
        revealEls.forEach(el => io.observe(el));
    }

    // Hero staggered items get an index-based delay
    document.querySelectorAll('#heroStagger [data-reveal]').forEach((el, i) => {
        el.style.setProperty('--i', i);
        el.style.transitionDelay = (i * 100) + 'ms';
    });

    // Typing effect for hero role
    const roles = ['Full Stack Developer', 'React & Next.js Engineer', 'UI/UX-minded Builder'];
    const typedEl = document.getElementById('typedRole');
    if (typedEl) {
        if (reduceMotion) {
            typedEl.textContent = roles[0];
        } else {
            let roleIndex = 0, charIndex = 0, deleting = false;
            function tick() {
                const current = roles[roleIndex];
                if (!deleting) {
                    charIndex++;
                    typedEl.textContent = current.slice(0, charIndex);
                    if (charIndex === current.length) {
                        deleting = true;
                        setTimeout(tick, 1600);
                        return;
                    }
                } else {
                    charIndex--;
                    typedEl.textContent = current.slice(0, charIndex);
                    if (charIndex === 0) {
                        deleting = false;
                        roleIndex = (roleIndex + 1) % roles.length;
                    }
                }
                setTimeout(tick, deleting ? 35 : 65);
            }
            tick();
        }
    }

    // Project filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            projectCards.forEach(card => {
                const cats = card.dataset.cat.split(' ');
                const show = filter === 'all' || cats.includes(filter);
                card.style.transition = 'opacity .35s ease, transform .35s ease';
                if (show) {
                    card.classList.remove('hide');
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    });
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px) scale(0.98)';
                    setTimeout(() => card.classList.add('hide'), 350);
                }
            });
        });
    });

    // Contact form (demo only, no backend)
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const original = btn.innerHTML;
        btn.innerHTML = 'Message Sent <i class="fa-solid fa-check"></i>';
        btn.style.opacity = '0.85';
        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.opacity = '1';
            form.reset();
        }, 2200);
    });

    // Smooth anchor scroll offset for sticky nav
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id.length > 1) {
                const target = document.querySelector(id);
                if (target) {
                    e.preventDefault();
                    const offset = 78;
                    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
                }
            }
        });
    });
})();