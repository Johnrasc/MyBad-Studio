/**
 * THE ARCHIVE ENGINE v2.1
 * Optimized for: Zero-Latency Input, Mobile Compatibility, and Performance
 */

// DUAL-ELEMENT CURSOR SYSTEM (ZERO LATENCY)
const dot = document.getElementById('cursor-dot');
const outline = document.getElementById('cursor-outline');

// Scroll Progress Tracking
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("scroll-progress").style.width = scrolled + "%";
});

// Floating Elements
function spawnScraps() {
    const container = document.body;
    const icons = ['✦', '◦', '•', '✧', '■'];
    for(let i = 0; i < 15; i++) {
        const scrap = document.createElement('div');
        scrap.className = 'scrap';
        scrap.innerHTML = icons[Math.floor(Math.random() * icons.length)];
        scrap.style.left = Math.random() * 100 + 'vw';
        scrap.style.top = Math.random() * 100 + 'vh';
        scrap.style.fontSize = (Math.random() * 20 + 10) + 'px';
        scrap.style.color = 'var(--ink)';
        container.appendChild(scrap);
        
        // Simple floating animation
        animateScrap(scrap);
    }
}

function animateScrap(el) {
    let x = Math.random() * 2 - 1;
    let y = Math.random() * 2 - 1;
    setInterval(() => {
        el.style.transform = `translate(${x}px, ${y}px) rotate(${Date.now() * 0.05}deg)`;
    }, 50);
}

spawnScraps();

// We use direct X/Y snap for zero delay
window.addEventListener('mousemove', (e) => {
    const { clientX: x, clientY: y } = e;
    
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    // Outline offset by its own radius (17px) to center it
    outline.style.transform = `translate3d(${x - 17}px, ${y - 17}px, 0)`;
});

// Hover interactions for all interactive elements
const interactives = document.querySelectorAll('.interactive-element, .btn, a, input, button');
interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
        outline.style.width = '50px';
        outline.style.height = '50px';
        outline.style.background = 'var(--cursor-outer)';
        // Center the expanded outline (offset by 25px)
        outline.style.marginLeft = '-8px'; 
        outline.style.marginTop = '-8px';
    });
    el.addEventListener('mouseleave', () => {
        outline.style.width = '34px';
        outline.style.height = '34px';
        outline.style.background = 'transparent';
        outline.style.marginLeft = '0';
        outline.style.marginTop = '0';
    });
});

// PERFORMANCE-OPTIMIZED BACKGROUND
const canvas = document.getElementById('studio-bg');
const ctx = canvas.getContext('2d');
let w, h, blobs = [];

function initCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    generateBlobs();
}

function generateBlobs() {
    blobs = [];
    const colors = [
        getComputedStyle(document.documentElement).getPropertyValue('--accent-music'),
        getComputedStyle(document.documentElement).getPropertyValue('--accent-proj'),
        getComputedStyle(document.documentElement).getPropertyValue('--accent-art')
    ];
    
    for (let i = 0; i < 5; i++) {
        blobs.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 250 + 150,
            color: colors[i % colors.length],
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        });
    }
}

function render() {
    ctx.clearRect(0, 0, w, h);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    ctx.save();
    ctx.filter = 'blur(90px)';
    ctx.globalAlpha = isDark ? 0.08 : 0.18; // Enhanced visibility for light mode

    blobs.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();

        b.x += b.vx;
        b.y += b.vy;

        if (b.x < 0 || b.x > w) b.vx *= -1;
        if (b.y < 0 || b.y > h) b.vy *= -1;
    });
    ctx.restore();
    requestAnimationFrame(render);
}

// 3D TILT ENGINE (DESKTOP ONLY)
const cards = document.querySelectorAll('.paper-card');
cards.forEach(card => {
    const inner = card.querySelector('.card-inner');
    
    card.addEventListener('mousemove', (e) => {
        // Performance check: disable tilt on touch devices
        if (window.matchMedia("(pointer: fine)").matches) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            
            inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
    });
    
    card.addEventListener('mouseleave', () => {
        inner.style.transform = `rotateX(0deg) rotateY(0deg)`;
    });
});

// THEME & SEARCH LOGIC
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const target = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', target);
    localStorage.setItem('studio-theme', target);
    generateBlobs(); // Refresh colors
});

function filterStudio() {
    const query = document.getElementById('studioSearch').value.toLowerCase();
    document.querySelectorAll('.paper-card').forEach(card => {
        const isMatch = card.textContent.toLowerCase().includes(query);
        card.style.display = isMatch ? "block" : "none";
        if (isMatch) card.classList.add('active');
    });
}

// OBSERVER & INITIALIZATION
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal-on-scroll').forEach(el => revealObserver.observe(el));

// Load Theme
const savedTheme = localStorage.getItem('studio-theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

// Handle Resize & Start
window.addEventListener('resize', () => {
    clearTimeout(window.resizeFinished);
    window.resizeFinished = setTimeout(initCanvas, 200);
});

initCanvas();
render();

// Shortcut for search (/)
document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('studioSearch').focus();
    }
});