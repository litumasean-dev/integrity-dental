/* ============================================================
   INTEGRITY DENTAL CENTER — main.js  v20260515
   ============================================================
   EmailJS:  https://emailjs.com → replace IDs below
   WhatsApp: WA_NUMBER = country code + number, no + or spaces
   ============================================================ */

(function () {
    'use strict';

    /* ----------------------------------------------------------
       CONFIG
    ---------------------------------------------------------- */
    var EMAILJS_PUBLIC_KEY  = '1M7mfRPsjwEjNGMU2';
    var EMAILJS_SERVICE_ID  = 'service_66os6lo';
    var EMAILJS_TEMPLATE_ID = 'template_u483qbb';
    var CLINIC_EMAIL        = 'integritydentalcenter@gmail.com';
    var WA_NUMBER           = '593979073890';

    /* ----------------------------------------------------------
       SAFE WRAPPER
    ---------------------------------------------------------- */
    function safe(fn, name) {
        try { fn(); } catch (e) { console.warn('[IDC]', name, e); }
    }

    /* ----------------------------------------------------------
       EmailJS init
    ---------------------------------------------------------- */
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    /* ----------------------------------------------------------
       SCROLL REVEAL
    ---------------------------------------------------------- */
    function initScrollReveal() {
        var els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
        if (!els.length) return;

        var revealEl = function (el) { el.classList.add('in-view'); };

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    revealEl(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

        els.forEach(function (el) { observer.observe(el); });

        setTimeout(function () {
            document.querySelectorAll('.reveal-up:not(.in-view),.reveal-left:not(.in-view),.reveal-right:not(.in-view)')
                .forEach(revealEl);
        }, 6000);
    }

    /* ----------------------------------------------------------
       COUNT-UP ANIMATION
    ---------------------------------------------------------- */
    function initCountUp() {
        var els = document.querySelectorAll('[data-count]');
        if (!els.length) return;

        var animateCount = function (el) {
            var target = parseInt(el.getAttribute('data-count'), 10);
            var start  = null;
            var step   = function (ts) {
                if (!start) start = ts;
                var p = Math.min((ts - start) / 2000, 1);
                var e = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.floor(e * target);
                if (p < 1) requestAnimationFrame(step);
                else el.textContent = target;
            };
            requestAnimationFrame(step);
        };

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        els.forEach(function (el) { observer.observe(el); });
    }

    /* ----------------------------------------------------------
       CUSTOM CURSOR
    ---------------------------------------------------------- */
    function initCursor() {
        var dot  = document.querySelector('.cursor-dot');
        var ring = document.querySelector('.cursor-ring');
        if (!dot || !ring) return;
        if (window.matchMedia('(pointer: coarse)').matches) {
            dot.style.display = ring.style.display = 'none';
            return;
        }
        var mouseX = 0, mouseY = 0, ringX = 0, ringY = 0, rafId = null;
        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX; mouseY = e.clientY;
            dot.style.transform = 'translate(' + mouseX + 'px,' + mouseY + 'px)';
            if (!rafId) rafId = requestAnimationFrame(animateRing);
        });
        function animateRing() {
            ringX += (mouseX - ringX) * 0.14;
            ringY += (mouseY - ringY) * 0.14;
            ring.style.transform = 'translate(' + ringX + 'px,' + ringY + 'px)';
            rafId = requestAnimationFrame(animateRing);
        }
        document.addEventListener('mousedown', function () { dot.classList.add('pressed'); ring.classList.add('pressed'); });
        document.addEventListener('mouseup', function () { dot.classList.remove('pressed'); ring.classList.remove('pressed'); });
        document.querySelectorAll('a,button,[role="button"]').forEach(function (el) {
            el.addEventListener('mouseenter', function () { ring.classList.add('hovering'); });
            el.addEventListener('mouseleave', function () { ring.classList.remove('hovering'); });
        });
    }

    /* ----------------------------------------------------------
       HEADER
    ---------------------------------------------------------- */
    function initHeader() {
        var header = document.getElementById('header');
        if (!header) return;
        var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 40); };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ----------------------------------------------------------
       MOBILE MENU
    ---------------------------------------------------------- */
    function initMobileMenu() {
        var btn  = document.getElementById('navHamburger');
        var menu = document.getElementById('navMenu');
        if (!btn || !menu) return;
        var toggle = function (open) {
            btn.classList.toggle('open', open);
            menu.classList.toggle('open', open);
            btn.setAttribute('aria-expanded', String(open));
            document.body.style.overflow = open ? 'hidden' : '';
        };
        btn.addEventListener('click', function () { toggle(!menu.classList.contains('open')); });
        menu.querySelectorAll('.nav-link').forEach(function (l) { l.addEventListener('click', function () { toggle(false); }); });
        document.addEventListener('click', function (e) {
            if (!btn.contains(e.target) && !menu.contains(e.target)) toggle(false);
        });
    }

    /* ----------------------------------------------------------
       SCROLL SPY
    ---------------------------------------------------------- */
    function initScrollSpy() {
        var sections = document.querySelectorAll('section[id]');
        var links    = document.querySelectorAll('.nav-link[data-section]');
        if (!sections.length || !links.length) return;
        var highlight = function () {
            var sy = window.scrollY + 120;
            sections.forEach(function (s) {
                if (sy >= s.offsetTop && sy < s.offsetTop + s.offsetHeight) {
                    links.forEach(function (l) { l.classList.remove('active'); });
                    var a = document.querySelector('.nav-link[data-section="' + s.id + '"]');
                    if (a) a.classList.add('active');
                }
            });
        };
        window.addEventListener('scroll', highlight, { passive: true });
        highlight();
    }

    /* ----------------------------------------------------------
       BACK TO TOP
    ---------------------------------------------------------- */
    function initBackToTop() {
        var btn = document.getElementById('backToTop');
        if (!btn) return;
        window.addEventListener('scroll', function () { btn.classList.toggle('visible', window.scrollY > 500); }, { passive: true });
        btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }

    /* ----------------------------------------------------------
       HERO SLIDER — image + 2 videos, progress bars
    ---------------------------------------------------------- */
    function initHeroSlider() {
        var slider = document.getElementById('heroSlider');
        if (!slider) return;
        var slides  = slider.querySelectorAll('.hero-media-slide');
        var pbars   = document.querySelectorAll('.hero-pbar');
        if (!slides.length) return;

        var current = 0;
        var timer   = null;

        function getVideo(slide) { return slide.querySelector('video'); }

        function goTo(index) {
            var prev = current;
            current = ((index % slides.length) + slides.length) % slides.length;

            slides[prev].classList.remove('active');
            pbars[prev] && pbars[prev].classList.remove('active');
            var vPrev = getVideo(slides[prev]);
            if (vPrev) vPrev.pause();

            slides[current].classList.add('active');
            var vCur = getVideo(slides[current]);
            if (vCur) vCur.play().catch(function () {});

            if (pbars[current]) {
                pbars[current].classList.remove('active');
                void pbars[current].offsetWidth;
                pbars[current].classList.add('active');
            }
        }

        function startAuto() {
            stopAuto();
            timer = setInterval(function () { goTo(current + 1); }, 5000);
        }
        function stopAuto() { clearInterval(timer); }

        pbars.forEach(function (pb, i) {
            pb.addEventListener('click', function () { stopAuto(); goTo(i); startAuto(); });
        });

        startAuto();
    }

    /* ----------------------------------------------------------
       SERVICES SLIDER — 6 slides, dots, swipe
    ---------------------------------------------------------- */
    function initServicesSlider() {
        var container = document.getElementById('servicesSlider');
        if (!container) return;
        var slides   = container.querySelectorAll('.service-slide');
        var prevBtn  = document.getElementById('servPrev');
        var nextBtn  = document.getElementById('servNext');
        var dotsWrap = document.getElementById('servDots');
        if (!slides.length) return;

        var current = 0;
        var total   = slides.length;
        var timer   = null;
        var touchSX = 0;
        var dots    = [];

        /* Clear any HTML-hardcoded dots, let JS own them */
        if (dotsWrap) {
            dotsWrap.innerHTML = '';
            for (var i = 0; i < total; i++) {
                var d = document.createElement('button');
                d.className = 'serv-dot' + (i === 0 ? ' active' : '');
                d.setAttribute('aria-label', 'Slide ' + (i + 1));
                d.setAttribute('data-idx', String(i));
                dotsWrap.appendChild(d);
                dots.push(d);
            }
            dotsWrap.addEventListener('click', function (e) {
                var btn = e.target.closest('[data-idx]');
                if (btn) { stopAuto(); goTo(parseInt(btn.getAttribute('data-idx'), 10)); startAuto(); }
            });
        }

        slides[0].classList.add('active');

        function goTo(index, dir) {
            var prev = current;
            current  = ((index % total) + total) % total;
            if (prev === current) return;
            var d = dir !== undefined ? dir : (current > prev ? 1 : -1);
            slides[prev].classList.remove('active', 'slide-left');
            slides[current].classList.remove('active', 'slide-left');
            if (d < 0) slides[current].classList.add('slide-left');
            void slides[current].offsetHeight;
            slides[current].classList.add('active');
            dots.forEach(function (dot, i) { dot.classList.toggle('active', i === current); });
        }

        function next() { goTo(current + 1, 1); }
        function prev() { goTo(current - 1, -1); }
        function startAuto() { stopAuto(); timer = setInterval(next, 6000); }
        function stopAuto() { clearInterval(timer); }

        if (prevBtn) prevBtn.addEventListener('click', function () { stopAuto(); prev(); startAuto(); });
        if (nextBtn) nextBtn.addEventListener('click', function () { stopAuto(); next(); startAuto(); });
        container.addEventListener('mouseenter', stopAuto);
        container.addEventListener('mouseleave', startAuto);
        container.addEventListener('touchstart', function (e) { touchSX = e.changedTouches[0].clientX; }, { passive: true });
        container.addEventListener('touchend', function (e) {
            var dx = e.changedTouches[0].clientX - touchSX;
            if (dx > 50) { stopAuto(); prev(); startAuto(); }
            else if (dx < -50) { stopAuto(); next(); startAuto(); }
        }, { passive: true });

        startAuto();
    }

    /* ----------------------------------------------------------
       CASOS SLIDER — 3 split-layout sets
    ---------------------------------------------------------- */
    function initCasosSlider() {
        var sets    = document.querySelectorAll('.casos-set');
        var prevBtn = document.getElementById('casosPrev');
        var nextBtn = document.getElementById('casosNext');
        var curNum  = document.getElementById('casosCurrentNum');
        var totNum  = document.getElementById('casosTotalNum');
        if (!sets.length) return;

        var current = 0;
        var total   = sets.length;
        if (totNum) totNum.textContent = total;

        function goTo(index) {
            sets[current].classList.remove('active');
            current = ((index % total) + total) % total;
            sets[current].classList.add('active');
            if (curNum) curNum.textContent = current + 1;
        }

        sets[0].classList.add('active');
        if (curNum) curNum.textContent = 1;

        if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
        if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });
    }

    /* ----------------------------------------------------------
       CLIENTES SLIDER — 3 video+text slides
    ---------------------------------------------------------- */
    function initClientesSlider() {
        var container = document.getElementById('clientesSlider');
        if (!container) return;
        var slides   = container.querySelectorAll('.clientes-slide');
        var prevBtn  = document.getElementById('clientesPrev');
        var nextBtn  = document.getElementById('clientesNext');
        var dotsWrap = document.getElementById('clientesDots');
        if (!slides.length) return;

        var current = 0;
        var total   = slides.length;
        var timer   = null;
        var touchSX = 0;
        var dots    = [];

        if (dotsWrap) {
            for (var i = 0; i < total; i++) {
                var d = document.createElement('button');
                d.className = 'clientes-dot' + (i === 0 ? ' active' : '');
                d.setAttribute('aria-label', 'Slide ' + (i + 1));
                d.setAttribute('data-idx', String(i));
                dotsWrap.appendChild(d);
                dots.push(d);
            }
            dotsWrap.addEventListener('click', function (e) {
                var btn = e.target.closest('[data-idx]');
                if (btn) { stopAuto(); goTo(parseInt(btn.getAttribute('data-idx'), 10)); startAuto(); }
            });
        }

        /* Play first slide video */
        var firstVid = slides[0].querySelector('video');
        if (firstVid) firstVid.play().catch(function () {});

        function goTo(index, dir) {
            var prev = current;
            current  = ((index % total) + total) % total;
            if (prev === current) return;
            var d = dir !== undefined ? dir : (current > prev ? 1 : -1);
            var prevVid = slides[prev].querySelector('video');
            if (prevVid) prevVid.pause();
            slides[prev].classList.remove('active', 'slide-left');
            slides[current].classList.remove('active', 'slide-left');
            if (d < 0) slides[current].classList.add('slide-left');
            void slides[current].offsetHeight;
            slides[current].classList.add('active');
            var curVid = slides[current].querySelector('video');
            if (curVid) curVid.play().catch(function () {});
            dots.forEach(function (dot, i) { dot.classList.toggle('active', i === current); });
        }

        function next() { goTo(current + 1, 1); }
        function prev() { goTo(current - 1, -1); }
        function startAuto() { stopAuto(); timer = setInterval(next, 7000); }
        function stopAuto() { clearInterval(timer); }

        if (prevBtn) prevBtn.addEventListener('click', function () { stopAuto(); prev(); startAuto(); });
        if (nextBtn) nextBtn.addEventListener('click', function () { stopAuto(); next(); startAuto(); });
        container.addEventListener('mouseenter', stopAuto);
        container.addEventListener('mouseleave', startAuto);
        container.addEventListener('touchstart', function (e) { touchSX = e.changedTouches[0].clientX; }, { passive: true });
        container.addEventListener('touchend', function (e) {
            var dx = e.changedTouches[0].clientX - touchSX;
            if (dx > 50) { stopAuto(); prev(); startAuto(); }
            else if (dx < -50) { stopAuto(); next(); startAuto(); }
        }, { passive: true });

        startAuto();
    }

    /* ----------------------------------------------------------
       LOCATION SLIDER — dots + prev/next arrows
    ---------------------------------------------------------- */
    function initLocationSlider() {
        var slides  = document.querySelectorAll('.location-video-slide');
        var dots    = document.querySelectorAll('.loc-dot');
        var prevBtn = document.getElementById('locPrev');
        var nextBtn = document.getElementById('locNext');
        if (!slides.length) return;

        var current = 0;
        var timer   = null;

        function getVideo(slide) { return slide.querySelector('video'); }

        function goTo(index) {
            var prev = current;
            current  = ((index % slides.length) + slides.length) % slides.length;
            slides[prev].classList.remove('active');
            dots[prev] && dots[prev].classList.remove('active');
            var vPrev = getVideo(slides[prev]);
            if (vPrev) vPrev.pause();
            slides[current].classList.add('active');
            dots[current] && dots[current].classList.add('active');
            var vCur = getVideo(slides[current]);
            if (vCur) vCur.play().catch(function () {});
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () { stopAuto(); goTo(i); startAuto(); });
        });
        if (prevBtn) prevBtn.addEventListener('click', function () { stopAuto(); goTo(current - 1); startAuto(); });
        if (nextBtn) nextBtn.addEventListener('click', function () { stopAuto(); goTo(current + 1); startAuto(); });

        function startAuto() { stopAuto(); timer = setInterval(function () { goTo(current + 1); }, 8000); }
        function stopAuto() { clearInterval(timer); }

        slides[0].classList.add('active');
        dots[0] && dots[0].classList.add('active');
        var firstVid = getVideo(slides[0]);
        if (firstVid) firstVid.play().catch(function () {});
        startAuto();
    }

    /* ----------------------------------------------------------
       DATE INPUT
    ---------------------------------------------------------- */
    function setMinDate() {
        var dateInput = document.getElementById('fecha');
        if (!dateInput) return;
        dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
    }

    /* ----------------------------------------------------------
       CONTACT FORM
    ---------------------------------------------------------- */
    function initContactForm() {
        var form = document.getElementById('contactForm');
        if (!form) return;
        var submitBtn  = document.getElementById('submitBtn');
        var response   = document.getElementById('formResponse');
        var btnText    = submitBtn && submitBtn.querySelector('.btn-txt');
        var btnLoading = submitBtn && submitBtn.querySelector('.btn-spin');

        var rules = {
            nombre:     { errId: 'err-nombre',    fn: function (v) { return v.trim().length >= 2 ? '' : 'Ingresa tu nombre completo.'; } },
            email:      { errId: 'err-email',     fn: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Correo electrónico inválido.'; } },
            telefono:   { errId: 'err-telefono',  fn: function (v) { return v.trim().replace(/\D/g,'').length >= 9 ? '' : 'Ingresa un número válido (9 dígitos).'; } },
            servicio:   { errId: 'err-servicio',  fn: function (v) { return v ? '' : 'Selecciona un servicio.'; } },
            privacidad: { errId: 'err-privacidad', fn: function (v, el) { return el.checked ? '' : 'Debes aceptar la política de privacidad.'; } },
        };

        function setError(errId, msg) { var el = document.getElementById(errId); if (el) el.textContent = msg; }
        function validateField(key) {
            var rule = rules[key];
            var inputEl = document.getElementById(key);
            if (!inputEl) return true;
            var err = rule.fn(inputEl.value, inputEl);
            setError(rule.errId, err);
            inputEl.classList.toggle('error', !!err);
            return !err;
        }
        Object.keys(rules).forEach(function (key) {
            var el = document.getElementById(key);
            if (!el) return;
            el.addEventListener('blur', function () { validateField(key); });
            el.addEventListener('input', function () { if (el.classList.contains('error')) validateField(key); });
        });

        // Fecha mínima = hoy (evita seleccionar fechas pasadas)
        var fechaEl = document.getElementById('fecha');
        if (fechaEl) {
            var t = new Date();
            fechaEl.min = t.getFullYear() + '-' +
                String(t.getMonth() + 1).padStart(2, '0') + '-' +
                String(t.getDate()).padStart(2, '0');
        }

        function setLoading(on) {
            if (!submitBtn) return;
            submitBtn.disabled = on;
            if (btnText)    btnText.hidden    = on;
            if (btnLoading) btnLoading.hidden = !on;
        }
        function showResponse(type, msg) {
            if (!response) return;
            response.className = 'form-response ' + type;
            response.textContent = msg;
            response.hidden = false;
            response.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            if (type === 'success') setTimeout(function () { response.hidden = true; }, 8000);
        }
        function buildWAMessage(data) {
            var msg = 'Hola, soy *' + data.nombre + '* y acabo de completar el formulario.\n';
            msg += 'Servicio: *' + data.servicio + '*\n';
            msg += 'Teléfono: *' + data.telefono + '*\n';
            if (data.fecha)   msg += 'Fecha preferida: *' + data.fecha + '*\n';
            if (data.mensaje) msg += 'Mensaje: ' + data.mensaje + '\n';
            return msg;
        }
        function redirectToWA(data) {
            var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(buildWAMessage(data));
            setTimeout(function () { window.open(url, '_blank', 'noopener'); }, 2200);
        }
        function sendViaEmailJS(data) {
            if (typeof emailjs === 'undefined' || EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') return Promise.resolve('skipped');
            var base = {
                name:           data.nombre,
                from_name:      data.nombre,
                email:          data.email,
                from_email:     data.email,
                teléfono:       data.telefono,
                service:        data.servicio,
                preferred_date: data.fecha || 'No especificada',
                message:        data.mensaje || 'Sin mensaje adicional',
            };
            // 1. Notificación a la clínica
            return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID,
                Object.assign({}, base, { to_email: CLINIC_EMAIL, to_name: 'Integrity Dental Center' })
            ).then(function () {
                // 2. Confirmación al cliente con template dedicado — fire-and-forget
                emailjs.send(EMAILJS_SERVICE_ID, 'template_vaywhoe',
                    Object.assign({}, base, { to_email: data.email, to_name: data.nombre })
                ).catch(function (e) { console.error('[IDC] conf. cliente error:', e.status, e.text); });
            });
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var valid = Object.keys(rules).map(function (k) { return validateField(k); }).every(Boolean);
            if (!valid) return;
            var data = {
                nombre: document.getElementById('nombre').value.trim(),
                email: document.getElementById('email').value.trim(),
                telefono: document.getElementById('telefono').value.trim(),
                servicio: document.getElementById('servicio').value,
                fecha: document.getElementById('fecha').value,
                mensaje: document.getElementById('mensaje').value.trim(),
            };
            setLoading(true);
            sendViaEmailJS(data).then(function () {
                showResponse('success', '¡Cita solicitada! Te contactaremos muy pronto. Serás redirigido a WhatsApp.');
                form.reset();
                redirectToWA(data);
            }).catch(function (err) {
                console.error('EmailJS error:', err);
                showResponse('error', 'Hubo un problema. Escríbenos directamente por WhatsApp.');
            }).finally(function () { setLoading(false); });
        });
    }

    /* ----------------------------------------------------------
       SMOOTH SCROLL
    ---------------------------------------------------------- */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var target = document.querySelector(anchor.getAttribute('href'));
                if (!target) return;
                e.preventDefault();
                var headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hh')) || 72;
                window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerH, behavior: 'smooth' });
            });
        });
    }

    /* ----------------------------------------------------------
       DENTAL CHATBOT — full booking flow per Integrity Dental prompt
    ---------------------------------------------------------- */
    function initChatbot() {
        var panel     = document.getElementById('chatbotPanel');
        var toggleBtn = document.getElementById('chatbotToggle');
        var body      = document.getElementById('chatbotBody');
        var input     = document.getElementById('chatbotInput');
        var sendBtn   = document.getElementById('chatbotSend');
        var badge     = document.getElementById('chatbotBadge');
        var closeBtn  = document.getElementById('chatbotClose');
        var container = document.getElementById('chatbot');
        if (!panel || !toggleBtn) return;

        var isOpen    = false;
        var isLoading = false;
        var MAX_TURNS = 20;
        var STORAGE_KEY = 'idc_chat_v2';

        /* Booking state machine */
        var BOOKING_STEPS = ['service','name','phone','date','time','notes'];
        var bookingState  = null;  /* null = not booking, or object with step + collected data */

        var SERVICES = {
            blanqueamiento:   'Blanqueamiento Dental',
            limpieza:         'Limpieza Dental Profunda',
            implantes:        'Implantes Dentales',
            ortodoncia:       'Ortodoncia Invisible',
            carillas:         'Carillas de Porcelana',
            coronas:          'Coronas Dentales',
            'diseño':         'Diseño de Sonrisa',
            consulta:         'Consulta General',
        };

        var history = (function () {
            try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch (e) { return []; }
        })();

        var systemPrompt = [
            'Eres Dental AI, asistente virtual de Integrity Dental Center — clínica dental premium en Guayaquil, Ecuador (Km 2.5 Vía Samborondón, Edificio Diana Quintana, Piso 3).',
            'Directora: Dra. María Cecilia Pimentel, Especialista en Prostodoncia, graduada en la U. de Guadalajara, México.',
            'Horario: Lunes-Viernes 9:00-19:00 | Sábados y Domingos 8:00-17:00.',
            'Email: integritydentalcenter@gmail.com | WhatsApp: +593 97 907 3890',
            '',
            'SERVICIOS:',
            '1. Blanqueamiento Dental: LED profesional. Hasta 10 tonos más claro en 1 sesión. Sin dañar esmalte.',
            '2. Limpieza Dental Profunda: Ultrasonido, elimina sarro/placa. No invasivo. Recomendada cada 6 meses.',
            '3. Implantes Dentales: Titanio, planificación 3D, solución permanente para dientes perdidos.',
            '4. Ortodoncia Invisible: Alineadores transparentes removibles. Sin brackets metálicos.',
            '5. Carillas de Porcelana: Láminas ultrafinas. Corrección de color, forma y tamaño en 2 sesiones.',
            '6. Coronas Dentales: Cerámica CAD/CAM. Restaura y protege dientes dañados.',
            '7. Diseño de Sonrisa: Planificación digital. Visualiza el resultado antes del tratamiento.',
            '8. Consulta General: Evaluación completa y plan de tratamiento personalizado.',
            '',
            'REGLAS:',
            '- Siempre en español. Tono cálido, empático y profesional. Máximo 4 oraciones por respuesta.',
            '- Precios: varían por caso, ofrecer valoración gratuita.',
            '- Para agendar: guía paso a paso: servicio → nombre → teléfono → fecha → hora → nota.',
            '- Confirmar todos los datos antes de finalizar la cita.',
            '- Guardar datos de cita en localStorage como JSON.',
            '- No inventar info médica específica. No responder temas ajenos a la clínica.',
        ].join('\n');

        function saveHistory() {
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(history)); } catch (e) {}
        }

        function scrollToBottom() {
            requestAnimationFrame(function () { body.scrollTop = body.scrollHeight; });
        }

        function clearReplies() {
            var existing = body.querySelectorAll('.chat-replies');
            existing.forEach(function (el) { el.remove(); });
        }

        function showReplies(opts) {
            clearReplies();
            if (!opts || !opts.length) return;
            var wrap = document.createElement('div');
            wrap.className = 'chat-replies';
            opts.forEach(function (label) {
                var btn = document.createElement('button');
                btn.className = 'chat-reply-btn';
                btn.textContent = label;
                btn.addEventListener('click', function () {
                    clearReplies();
                    input.value = label;
                    handleSend();
                });
                wrap.appendChild(btn);
            });
            body.appendChild(wrap);
            scrollToBottom();
        }

        function appendMsg(role, text, animate) {
            clearReplies();
            var div = document.createElement('div');
            div.className = 'chatbot-msg chatbot-msg--' + role + (animate !== false ? ' chatbot-msg--new' : '');
            div.textContent = text;
            body.appendChild(div);
            scrollToBottom();
        }

        function appendTyping() {
            var div = document.createElement('div');
            div.className = 'chatbot-msg chatbot-msg--typing';
            div.id = 'typingIndicator';
            div.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
            body.appendChild(div);
            scrollToBottom();
        }
        function removeTyping() { var el = document.getElementById('typingIndicator'); if (el) el.remove(); }

        function openPanel() {
            isOpen = true;
            container.classList.add('is-open');
            panel.setAttribute('aria-hidden', 'false');
            toggleBtn.setAttribute('aria-expanded', 'true');
            if (badge) badge.hidden = true;
            setTimeout(function () { input.focus(); }, 300);
            scrollToBottom();
        }
        function closePanel() {
            isOpen = false;
            container.classList.remove('is-open');
            panel.setAttribute('aria-hidden', 'true');
            toggleBtn.setAttribute('aria-expanded', 'false');
        }

        /* Render saved history */
        history.forEach(function (m) {
            appendMsg(m.role === 'assistant' ? 'bot' : 'user', m.content, false);
        });

        var WELCOME_REPLIES = ['Agendar cita', 'Ver servicios', 'Horarios', 'Ubicación', 'WhatsApp'];
        var GENERAL_REPLIES = ['Agendar cita', 'Ver servicios', 'WhatsApp'];
        var SERVICE_REPLIES = ['1 Blanqueamiento', '2 Limpieza Dental', '3 Implantes', '4 Ortodoncia', '5 Carillas', '6 Coronas', '7 Diseño de Sonrisa', '8 Consulta General'];

        /* Welcome */
        if (!history.length) {
            appendMsg('bot', '¡Hola! Soy Dental AI, asistente de Integrity Dental Center. 😊\n\nPuedo ayudarte con:\n📅 Agendar una cita\n📋 Información sobre nuestros servicios\n⏰ Confirmar horarios\n💬 Responder tus preguntas\n\n¿En qué te puedo ayudar hoy?', false);
            showReplies(WELCOME_REPLIES);
        }

        toggleBtn.addEventListener('click', function () { isOpen ? closePanel() : openPanel(); });
        if (closeBtn) closeBtn.addEventListener('click', closePanel);
        sendBtn.addEventListener('click', handleSend);
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
        });

        function handleSend() {
            var text = input.value.trim();
            if (!text || isLoading) return;
            if (history.length >= MAX_TURNS * 2) {
                appendMsg('bot', 'Hemos alcanzado el límite de la sesión. Contáctanos por WhatsApp o llena el formulario en la página.');
                return;
            }
            input.value = '';
            appendMsg('user', text);
            history.push({ role: 'user', content: text });

            isLoading = true;
            sendBtn.disabled = true;
            appendTyping();

            /* Check if in booking flow first */
            var response = handleBookingFlow(text);
            if (response !== null) {
                setTimeout(function () {
                    removeTyping();
                    appendMsg('bot', response);
                    history.push({ role: 'assistant', content: response });
                    saveHistory();
                    isLoading = false;
                    sendBtn.disabled = false;
                    input.focus();
                    /* Quick replies based on booking step */
                    if (bookingState && bookingState.step === 0) {
                        showReplies(SERVICE_REPLIES);
                    } else if (bookingState && bookingState.step === 6) {
                        showReplies(['Confirmar', 'Cancelar']);
                    } else if (!bookingState) {
                        showReplies(GENERAL_REPLIES);
                    }
                }, 600);
                return;
            }

            /* Otherwise use fallback response (or API if key set) */
            var reply = buildSmartResponse(text);
            setTimeout(function () {
                removeTyping();
                appendMsg('bot', reply);
                history.push({ role: 'assistant', content: reply });
                saveHistory();
                isLoading = false;
                sendBtn.disabled = false;
                input.focus();
                showReplies(GENERAL_REPLIES);
            }, 700);
        }

        /* ---- Booking state machine ---- */
        function handleBookingFlow(text) {
            var q = text.toLowerCase();

            /* Start booking */
            if (!bookingState && /agendar|cita|reservar|turno|appointment|quiero una|necesito una/.test(q)) {
                bookingState = { step: 0, data: {} };
                return '¡Perfecto! Voy a ayudarte a agendar tu cita. 📅\n\n¿Qué servicio te interesa?\n\n1️⃣ Blanqueamiento Dental\n2️⃣ Limpieza Dental Profunda\n3️⃣ Implantes Dentales\n4️⃣ Ortodoncia Invisible\n5️⃣ Carillas de Porcelana\n6️⃣ Coronas Dentales\n7️⃣ Diseño de Sonrisa\n8️⃣ Consulta General';
            }

            if (!bookingState) return null;

            var step = bookingState.step;
            var data = bookingState.data;

            /* Step 0: service */
            if (step === 0) {
                var service = detectService(text);
                if (!service) {
                    return 'Por favor indica el servicio que deseas (puedes escribir el nombre o el número del 1 al 8).';
                }
                data.servicio = service;
                bookingState.step = 1;
                return '¡Excelente elección! Has seleccionado: *' + service + '*\n\n¿Cuál es tu nombre completo? 👤';
            }

            /* Step 1: name */
            if (step === 1) {
                if (text.trim().length < 3) return 'Por favor ingresa tu nombre completo.';
                data.nombre = text.trim();
                bookingState.step = 2;
                return 'Gracias, ' + data.nombre.split(' ')[0] + '! 😊\n\n¿Cuál es tu número de teléfono o WhatsApp? 📞';
            }

            /* Step 2: phone */
            if (step === 2) {
                var phone = text.replace(/\D/g, '');
                if (phone.length < 9) return 'Por favor ingresa tu número de teléfono (9 dígitos, ej: 0987654321).';
                data.telefono = text.trim();
                bookingState.step = 3;
                return '¡Perfecto! ¿Qué día prefieres para tu cita? 📆\n(Escribe la fecha, ej: "próximo lunes", "15 de junio", o una fecha específica)';
            }

            /* Step 3: date */
            if (step === 3) {
                if (text.trim().length < 2) return 'Por favor indica el día de tu preferencia.';
                data.fecha = text.trim();
                bookingState.step = 4;
                return '¡Anotado! ¿Y qué hora te viene mejor? ⏰\n(Atendemos Lun-Vie 9:00-19:00 | Sáb-Dom 8:00-17:00)';
            }

            /* Step 4: time */
            if (step === 4) {
                data.hora = text.trim();
                bookingState.step = 5;
                return '¿Tienes alguna dolencia, urgencia o nota especial que debamos saber? 📝\n(Escribe "ninguna" si no tienes)';
            }

            /* Step 5: notes → confirm */
            if (step === 5) {
                data.nota = /ninguna|no|nada/.test(q) ? '' : text.trim();
                bookingState.step = 6;

                var nota = data.nota ? '\n📝 Nota: ' + data.nota : '';
                var summary = '¡Perfecto! Confirmemos tu cita:\n\n' +
                    '📋 Servicio: ' + data.servicio + '\n' +
                    '👤 Nombre: ' + data.nombre + '\n' +
                    '📞 Teléfono: ' + data.telefono + '\n' +
                    '📅 Fecha: ' + data.fecha + '\n' +
                    '⏰ Hora: ' + data.hora + nota + '\n\n' +
                    '¿Confirmas estos datos? (escribe "sí" o "confirmar")';
                return summary;
            }

            /* Step 6: final confirm */
            if (step === 6) {
                if (/si|sí|confirmar|confirmo|correcto|ok|yes/.test(q)) {
                    /* Save to localStorage */
                    saveAppointment(data);
                    bookingState = null;
                    return '✅ ¡Tu cita ha sido registrada con éxito!\n\nTe contactaremos en breve para confirmarla. También puedes escribirnos por WhatsApp al +593 97 907 3890.\n\n¿Hay algo más en lo que pueda ayudarte?';
                } else {
                    bookingState = null;
                    return 'Cita cancelada. Si deseas intentarlo de nuevo, escribe "agendar cita" cuando quieras. ¿Puedo ayudarte con algo más?';
                }
            }

            return null;
        }

        function detectService(text) {
            var q = text.toLowerCase();
            var num = parseInt(text.trim(), 10);
            var serviceList = [
                'Blanqueamiento Dental', 'Limpieza Dental Profunda', 'Implantes Dentales',
                'Ortodoncia Invisible', 'Carillas de Porcelana', 'Coronas Dentales',
                'Diseño de Sonrisa', 'Consulta General'
            ];
            if (num >= 1 && num <= 8) return serviceList[num - 1];
            if (/blanquea/.test(q)) return 'Blanqueamiento Dental';
            if (/limpieza|profilaxis/.test(q)) return 'Limpieza Dental Profunda';
            if (/implante/.test(q)) return 'Implantes Dentales';
            if (/ortodoncia|invisalign|alineador/.test(q)) return 'Ortodoncia Invisible';
            if (/carilla|porcelana|veneer/.test(q)) return 'Carillas de Porcelana';
            if (/corona/.test(q)) return 'Coronas Dentales';
            if (/diseño|sonrisa/.test(q)) return 'Diseño de Sonrisa';
            if (/consulta|general|evaluacion/.test(q)) return 'Consulta General';
            return null;
        }

        function saveAppointment(data) {
            try {
                var appointments = JSON.parse(localStorage.getItem('idc_appointments')) || [];
                appointments.push({ id: Date.now(), timestamp: new Date().toISOString(), data: data });
                localStorage.setItem('idc_appointments', JSON.stringify(appointments));
            } catch (e) {}
        }

        /* ---- Smart fallback (no API needed) ---- */
        function buildSmartResponse(question) {
            var q = question.toLowerCase();

            /* Service info */
            if (/blanquea/.test(q)) {
                return 'El Blanqueamiento Dental LED es un sistema clínico profesional. ✅ Hasta 10 tonos más claros en UNA SOLA SESIÓN ✅ Sin dañar el esmalte ✅ Resultados inmediatos y duraderos ✅ Completamente seguro. ¿Deseas agendar una cita?';
            }
            if (/limpieza|profilaxis|sarro/.test(q)) {
                return 'La Limpieza Dental Profunda elimina completamente el sarro y la placa. ✅ Procedimiento no invasivo ✅ Resultados visibles al instante ✅ Previene enfermedades periodontales ✅ Dientes más saludables y brillantes. ¿Deseas agendar tu cita?';
            }
            if (/implante/.test(q)) {
                return 'Los Implantes Dentales son la solución permanente para dientes faltantes. ✅ Aspecto y función 100% natural ✅ Planificación quirúrgica 3D ✅ Titanio de grado médico ✅ Previene pérdida ósea. ¿Te interesa una evaluación gratuita?';
            }
            if (/ortodoncia|invisalign|alineador|bracket/.test(q)) {
                return 'La Ortodoncia Invisible alinea tus dientes sin brackets metálicos. ✅ Alineadores transparentes removibles ✅ Estética discreta ✅ Cómoda e higiénica ✅ Resultados rápidos. ¿Quieres agendar tu consulta?';
            }
            if (/carilla|porcelana|veneer/.test(q)) {
                return 'Las Carillas de Porcelana transforman tu sonrisa completamente. ✅ Estética perfecta y natural ✅ Durabilidad superior ✅ Resistentes a manchas ✅ Solo 2 visitas. ¿Te interesa conocer más?';
            }
            if (/corona/.test(q)) {
                return 'Las Coronas Dentales restauran y fortalecen dientes dañados. ✅ Cerámica CAD/CAM de alta resistencia ✅ Protección completa ✅ Funcionalidad restaurada ✅ Aspecto completamente natural. ¿Deseas una consulta?';
            }
            if (/diseño.*sonrisa|smile design/.test(q)) {
                return 'El Diseño de Sonrisa es una transformación digital completa. ✅ Análisis facial personalizado ✅ Visualización del resultado antes de empezar ✅ Combina múltiples tratamientos ✅ Resultados espectaculares. ¿Quieres transformar tu sonrisa?';
            }
            if (/consulta|evaluacion/.test(q)) {
                return 'Una Consulta General incluye evaluación completa y diagnóstico profesional. ✅ Diagnóstico preciso ✅ Plan de tratamiento personalizado ✅ Respuesta a todas tus dudas ✅ Sin costo adicional. ¿Deseas agendar?';
            }

            /* Operational info */
            if (/precio|costo|cuánto|cuanto|valor/.test(q)) {
                return 'Los precios varían según cada caso clínico. Para darte un presupuesto exacto necesitamos evaluarte de forma gratuita y sin compromiso. ¿Te gustaría agendar una valoración gratuita?';
            }
            if (/horario|hora|abre|cierra/.test(q)) {
                return '¡Te esperamos! Nuestros horarios son:\n⏰ Lunes a Viernes: 9:00 am – 7:00 pm\n⏰ Sábados y Domingos: 8:00 am – 5:00 pm';
            }
            if (/direcc|ubica|donde|dónde|llegar|mapa/.test(q)) {
                return 'Estamos en Samborondón, muy fácil de llegar:\n📍 Km 2.5 Vía Samborondón\n🏢 Edificio Diana Quintana, Piso 3\n\n¿Te gustaría que te contactemos para darte más detalles?';
            }
            if (/email|correo/.test(q)) {
                return 'Puedes escribirnos al correo: integritydentalcenter@gmail.com\nO por WhatsApp al +593 97 907 3890. ¡Respondemos rápido!';
            }
            if (/cecilia|pimentel|doctora|dra/.test(q)) {
                return 'La Dra. María Cecilia Pimentel es Especialista en Prostodoncia, Rehabilitación Oral y Estética Dental Avanzada, graduada en la Universidad de Guadalajara, México. Docente universitaria y CEO de Integrity Dental Center. ¡Estás en las mejores manos!';
            }
            if (/urgencia|urgente|dolor|emergencia/.test(q)) {
                return 'Para urgencias dentales escríbenos de inmediato por WhatsApp al +593 97 907 3890. Haremos todo lo posible por atenderte rápidamente. ¡No dejes el dolor sin atención!';
            }
            if (/niño|infante|bebe|hijo|pediatr/.test(q)) {
                return 'Atendemos pacientes de todas las edades con paciencia y cariño. Para los más pequeños tenemos un trato especial que los hace sentir seguros. ¿Deseas agendar una consulta?';
            }

            return 'Gracias por tu consulta. Para brindarte la mejor atención, puedes:\n📋 Llenar el formulario en esta página\n💬 Escribirnos por WhatsApp al +593 97 907 3890\n📧 Enviarnos un email a integritydentalcenter@gmail.com\n\n¿Hay algo más en que pueda ayudarte?';
        }
    }

    /* ----------------------------------------------------------
       BOOT
    ---------------------------------------------------------- */
    safe(initScrollReveal,   'scrollReveal');
    safe(initCountUp,        'countUp');
    safe(initCursor,         'cursor');
    safe(initHeader,         'header');
    safe(initMobileMenu,     'mobileMenu');
    safe(initScrollSpy,      'scrollSpy');
    safe(initBackToTop,      'backToTop');
    safe(initHeroSlider,     'heroSlider');
    safe(initServicesSlider, 'servicesSlider');
    safe(initCasosSlider,    'casosSlider');
    safe(initClientesSlider, 'clientesSlider');
    safe(initLocationSlider, 'locationSlider');
    safe(setMinDate,         'minDate');
    safe(initContactForm,    'contactForm');
    safe(initSmoothScroll,   'smoothScroll');
    safe(initChatbot,        'chatbot');

})();
