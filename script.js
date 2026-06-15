// Initialize Lucide Icons
lucide.createIcons();

// --- Background Particles Canvas ---
const canvas = document.getElementById('particles-canvas');
let ctx, particlesArray = [], neuralLines = [];

if (canvas) {
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = Math.random() > 0.5 ? '#b0f3f1' : '#8a2be2';
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.width * canvas.height) / 15000;
        if (numberOfParticles > 150) numberOfParticles = 150;
        
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function connectParticles() {
        let maxDistance = 150;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    let opacityValue = 1 - (distance / maxDistance);
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(138, 43, 226, ${opacityValue * 0.2})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
}


// --- GSAP Animations ---
gsap.registerPlugin(ScrollTrigger);

// Hero Animations
const tlHero = gsap.timeline();
tlHero.from('.gs-hero-left > *', {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: "power3.out"
}, 0.2)
.from('.gs-hero-right', {
    x: 50,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out"
}, 0.4);

// Parallax Hero Image
gsap.to('.gs-hero-right img', {
    y: -30,
    ease: "none",
    scrollTrigger: {
        trigger: "#home",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

// Fade Up Elements
gsap.utils.toArray('.gs-fade-up').forEach(element => {
    gsap.from(element, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
            trigger: element,
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });
});

// Stagger Cards (About Section)
gsap.from('.gs-stagger-card', {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    scrollTrigger: {
        trigger: "#about",
        start: "top 70%",
        toggleActions: "play none none reverse"
    }
});

// Tech Cards Hover/Entrance
gsap.from('.gs-tech-card', {
    scale: 0.9,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: "back.out(1.7)",
    scrollTrigger: {
        trigger: "#showcase",
        start: "top 70%",
        toggleActions: "play none none reverse"
    }
});

// Form and Map Entrance
gsap.from('.gs-form', {
    x: -50,
    opacity: 0,
    duration: 0.8,
    scrollTrigger: {
        trigger: "#apply",
        start: "top 75%",
        toggleActions: "play none none reverse"
    }
});

gsap.from('.gs-map', {
    x: 50,
    opacity: 0,
    duration: 0.8,
    scrollTrigger: {
        trigger: "#apply",
        start: "top 75%",
        toggleActions: "play none none reverse"
    }
});

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-lg', 'border-b', 'border-white/10', 'bg-[#030014]/80');
    } else {
        navbar.classList.remove('shadow-lg', 'border-b', 'border-white/10', 'bg-[#030014]/80');
    }
});

// --- Animated Counters ---
const counters = document.querySelectorAll('.gs-counter-wrap div[data-target]');
const observerOptions = {
    threshold: 0.5
};

const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const targetNumber = parseInt(target.getAttribute('data-target'));
            
            gsap.to(target, {
                innerHTML: targetNumber,
                duration: 2,
                snap: { innerHTML: 1 },
                ease: "power2.out",
                onUpdate: function() {
                    target.innerHTML = Math.round(target.innerHTML) + "+";
                }
            });
            
            observer.unobserve(target);
        }
    });
}, observerOptions);

counters.forEach(counter => {
    counterObserver.observe(counter);
});

// --- Form Submission Handling ---
const applicationForm = document.getElementById('applicationForm');
const formSuccess = document.getElementById('formSuccess');
const resetFormBtn = document.getElementById('resetFormBtn');

if(applicationForm) {
    applicationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Form Validation visual feedback can be added here
        
        // Show success animation overlay
        formSuccess.classList.add('active');
        
        // Optional: Animate the icon
        gsap.fromTo('#formSuccess i', 
            { scale: 0.5, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)", delay: 0.2 }
        );
    });
}

if(resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
        applicationForm.reset();
        formSuccess.classList.remove('active');
    });
}
