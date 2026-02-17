gsap.registerPlugin(ScrollToPlugin);

/**
 * 1. NARRATIVE SNAP LOGIC
 */
let scenes = gsap.utils.toArray(".scene");
let currentIndex = 0;
let isAnimating = false;

function goToScene(index) {
    if (index >= 0 && index < scenes.length && !isAnimating) {
        isAnimating = true;
        currentIndex = index;
        
        const progress = (currentIndex / (scenes.length - 1)) * 100;
        document.getElementById("myBar").style.width = progress + "%";

        gsap.to(window, {
            scrollTo: { y: scenes[currentIndex], autoKill: false },
            duration: 1.2,
            ease: "power2.inOut",
            onComplete: () => { isAnimating = false; }
        });
        
        animateContent(scenes[currentIndex]);
    }
}

window.addEventListener("wheel", (e) => {
    e.preventDefault();
    if (isAnimating) return;
    if (e.deltaY > 0) goToScene(currentIndex + 1);
    else goToScene(currentIndex - 1);
}, { passive: false });

function animateContent(scene) {
    const content = scene.querySelector(".content");

    // animasi konten utama
    gsap.fromTo(content, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );

    // khusus skill section
    if (scene.querySelector(".skills-icons")) {

        const skills = scene.querySelectorAll(".skill-card");

        // RESET dulu biar bisa animasi ulang
        gsap.set(skills, { opacity: 0, y: 40 });

        // lalu animasi masuk lagi
        gsap.to(skills, {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });
    }
}


/**
 * 2. CURSOR & PARTICLES
 */
const cursor = document.querySelector('.cursor-follower');
window.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.3 });
});

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resize);
resize();

let particles = [];
for (let i = 0; i < 40; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.random() * 0.4 - 0.2,
        vy: Math.random() * 0.4 - 0.2
    });
}
function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height); ctx.fillStyle = '#00f2ff';
    particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if(p.x<0 || p.x>canvas.width) p.vx*=-1;
        if(p.y<0 || p.y>canvas.height) p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1, 0, Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(draw);
}
draw();

animateContent(scenes[0]);

document.querySelectorAll('.project-item, .cta-button').forEach(el => {
    el.addEventListener('mouseenter', () => gsap.to(cursor, {scale: 3}));
    el.addEventListener('mouseleave', () => gsap.to(cursor, {scale: 1}));
});

