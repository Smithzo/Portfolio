// register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// =========================================
// LENIS SMOOTH SCOLL
// =========================================
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Integrates Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time)=>{
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0, 0)


// =========================================
// CUSTOM CURSOR
// =========================================
const cursor = document.querySelector('.cursor');
const hoverLinks = document.querySelectorAll('.hover-link, a, button');

document.addEventListener('mousemove', (e) => {
    // using gsaps quickTo for better performance
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
    });
});

hoverLinks.forEach(link => {
    link.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    link.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});

// =========================================
// PRELOADER LOGIC
// =========================================
const terminalText = document.getElementById('terminal-text');
const loadingBar = document.getElementById('loading-bar');
const percentText = document.getElementById('percent-text');
const preloader = document.querySelector('.preloader');
const lines = [
    "[SYSTEM] INITIATING MYTHICAL ARCHITECTURE...",
    "[WARNING] UNKNOWN MAGICAL SURGE DETECTED...",
    "[SYSTEM] DECRYPTING FILE: SMITHZO.SYS...",
    "[STATUS] CEREBRAL LINK SECURED // 100%",
    "[PROCEED] ENTERING THE CONSTRUCT..."
];

let lineIndex = 0;
let currentText = '';
let isTyping = false;
let overallTextProgress = 0;

function typeLine() {
    if (lineIndex < lines.length) {
        if (!isTyping) {
            isTyping = true;
            currentText = '';
        }
        
        let targetLine = lines[lineIndex];
        if (currentText.length < targetLine.length) {
            currentText += targetLine.charAt(currentText.length);
            let displayLines = lines.slice(0, lineIndex).join('\n') + (lineIndex > 0 ? '\n' : '') + currentText;
            terminalText.textContent = displayLines;
            
            overallTextProgress += (100 / (lines.join('').length));
            let currentP = Math.min(100, Math.floor(overallTextProgress));
            
            loadingBar.style.width = currentP + '%';
            if(percentText) {
                percentText.textContent = currentP + '%';
                percentText.setAttribute('data-text', currentP + '%');
                
                // Add mini random glitch jumps for crazy feel
                if(Math.random() > 0.8) {
                    percentText.style.transform = `translate(${Math.random()*10 - 5}px, ${Math.random()*10 - 5}px)`;
                } else {
                    percentText.style.transform = `translate(0, 0)`;
                }
            }

            // Super fast crazy typing
            setTimeout(typeLine, Math.random() * 20 + 5); 
        } else {
            isTyping = false;
            lineIndex++;
            setTimeout(typeLine, 150);
        }
    } else {
        setTimeout(triggerBootComplete, 400);
    }
}

function triggerBootComplete() {
    const tl = gsap.timeline();
    tl.to(".terminal", { opacity: 0, duration: 0.2, delay: 0.5 })
      .to(".flash", { opacity: 1, duration: 0.1 })
      .to(".preloader", { display: "none", duration: 0 })
      .to(".flash", { opacity: 0, duration: 1, ease: "power2.out" })
      .from(".main-title", { y: 100, opacity: 0, duration: 1, ease: "power4.out" }, "-=0.5")
      .from(".sub-title, .tagline", { y: 20, opacity: 0, stagger: 0.2, duration: 1 }, "-=0.8")
      .from(".nav", { y: -50, opacity: 0, duration: 1 }, "-=1")
      .from(".scroll-indicator", { opacity: 0, duration: 1 }, "-=0.5")
      .call(() => {
          document.body.classList.remove('loading');
      });
}

// Start boot sequence when window loads
window.addEventListener('load', () => {
    // scroll to top just in case
    window.scrollTo(0,0);
    setTimeout(typeLine, 500);
});

// =========================================
// SCROLL ANIMATIONS
// =========================================

// Stats Counter
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
    ScrollTrigger.create({
        trigger: counter,
        start: "top 80%",
        onEnter: () => {
            const target = +counter.getAttribute('data-target');
            gsap.to(counter, {
                innerHTML: target,
                duration: 2,
                snap: { innerHTML: 1 },
                ease: "power2.out"
            });
        },
        once: true
    });
});

// Content Fade In/Out on Scroll
const fadeElements = document.querySelectorAll(".sys-title, .bio p, .stat-card, .terminal-box");

fadeElements.forEach(el => {
    gsap.fromTo(el, 
        { opacity: 0, y: 50 },
        {
            scrollTrigger: {
                trigger: el,
                start: "top 90%",
                end: "bottom 10%",
                toggleActions: "play reverse play reverse"
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        }
    );
});

// Hero specifically fades out as you scroll down
gsap.to(".hero-content", {
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    },
    opacity: 0,
    y: -50
});

// Game Text List Entrance
gsap.from(".game-item", {
    scrollTrigger: {
        trigger: ".game-list",
        start: "top 85%",
        toggleActions: "play reverse play reverse"
    },
    x: -150,
    skewX: 10,
    opacity: 0,
    stagger: 0.15,
    duration: 1.2,
    ease: "power4.out"
});



// =========================================
// NATIVE CANVAS BACKGROUND (LAG OPTIMIZED)
// =========================================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width, height;

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

window.addEventListener('resize', resize);
resize();

// Reduced particle count to 30 for max mobile smoothness
const stars = Array.from({ length: 30 }).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2 + 0.5,
    speedY: Math.random() * 0.5 + 0.1,
    speedX: (Math.random() - 0.5) * 0.4,
    opacity: Math.random() * 0.8 + 0.2
}));

function drawGlow() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw Ambient Fireflies
    stars.forEach(s => {
        // Single simple dot, zero heavy calculations
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${s.opacity})`; 
        ctx.fill();
        
        s.y -= s.speedY;
        s.x += s.speedX;
        s.opacity += (Math.random() - 0.5) * 0.03;
        if(s.opacity < 0.1) s.opacity = 0.1;
        if(s.opacity > 1) s.opacity = 1;
        if (s.y < 0) s.y = height;
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
    });
    
    requestAnimationFrame(drawGlow);
}
drawGlow();
