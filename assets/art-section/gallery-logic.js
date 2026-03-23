/**
 * ART ARCHIVE SCRIPT V2.1
 * MyBad_
 */

// DATABASE
const artData = [
    { title: "Pixel Cyber Land", category: "digital", src: "digital/pixel-cyber.png", desc: "A cyber land in the midst of war" },
    { title: "For You", category: "traditional", src: "traditional/flower.jpg", desc: "A colored pencil sketch of a flower for you" },
    { title: "Pixel Gloomy Forest", category: "digital", src: "digital/pixel-gloom.png", desc: "A gloomy forest in the pixelated world" },
    { title: "I want", category: "traditional", src: "traditional/iwant.jpg", desc: "Maybe I just need a good talk" },
    { title: "Face me", category: "traditional", src: "traditional/face1.jpg", desc: "A portrait study of a person looking directly at the viewer." }
];

const grid = document.getElementById('artGrid');
const countLabel = document.getElementById('artCount');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const captionText = document.getElementById('caption');

// GALLERY RENDERER
function initGallery(data) {
    grid.innerHTML = ''; 
    
    // shuffle
    const shuffledData = [...data].sort(() => Math.random() - 0.5);
    
    countLabel.innerText = `${shuffledData.length.toString().padStart(2, '0')} WORKS ARCHIVED`;
    
    shuffledData.forEach(item => {
        const artCard = document.createElement('div');
        artCard.className = `art-item`;
        artCard.innerHTML = `
            <img src="${item.src}" alt="${item.title}" loading="lazy">
            <div class="art-info">
                <h4 class="syne">${item.title}</h4>
                <span class="mono">${item.category}</span>
            </div>
        `;
        artCard.onclick = () => openLightbox(item);
        grid.appendChild(artCard);
        revealObserver.observe(artCard);
    });
}

// INTEGRATED SEARCH & FILTER
function filterArt() {
    const query = document.getElementById('artSearch').value.toLowerCase();
    const activeBtn = document.querySelector('.filter-btn.active');
    const category = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';

    const filtered = artData.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(query);
        const matchesCategory = category === 'all' || item.category === category;
        return matchesSearch && matchesCategory;
    });

    initGallery(filtered);
}

// Handle Filter Button Clicks
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterArt();
    };
});

// LIGHTBOX SYSTEM
function openLightbox(item) {
    lightbox.style.display = "block";
    lightboxImg.src = item.src;
    captionText.innerHTML = `<strong>${item.title}</strong> — ${item.desc}`;
    document.body.style.overflow = 'hidden';
}

document.querySelector('.close-lightbox').onclick = () => {
    lightbox.style.display = "none";
    document.body.style.overflow = 'auto';
};

// AESTHETICS
const canvas = document.getElementById('studio-bg');
const ctx = canvas.getContext('2d');
let w, h, blobs = [];

function initBackground() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    blobs = [];
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const colors = isDark ? ['#feca57', '#5f27cd', '#ee5253'] : ['#fdcb6e', '#a29bfe', '#ff7675'];
    
    for (let i = 0; i < 4; i++) {
        blobs.push({
            x: Math.random() * w, y: Math.random() * h,
            r: Math.random() * 250 + 150,
            color: colors[i % colors.length],
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        });
    }
}

function render() {
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.filter = 'blur(90px)';
    ctx.globalAlpha = 0.2;
    blobs.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
        b.x += b.vx; b.y += b.vy;
        if (b.x < 0 || b.x > w) b.vx *= -1;
        if (b.y < 0 || b.y > h) b.vy *= -1;
    });
    ctx.restore();
    requestAnimationFrame(render);
}

// THEME TOGGLE
const themeBtn = document.getElementById('themeToggle');
themeBtn.onclick = () => {
    const target = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', target);
    localStorage.setItem('studio-theme', target);
    initBackground();
};

// START
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    document.getElementById("scroll-progress").style.width = (winScroll / height) * 100 + "%";
});

window.onload = () => {
    initGallery(artData);
    initBackground();
    render();
};

// Reveal on scroll
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); 
        }
    });
}, { threshold: 0.1 });
