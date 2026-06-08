// Initialize Icons
lucide.createIcons();

// Custom Cursor
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const links = document.querySelectorAll('a, button, .magnetic-wrap');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Instant update for the dot
    gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0 });

    // Update Spotlight mask position for Studio Modal
    const studioModal = document.querySelector('.studio-modal');
    if (studioModal && studioModal.style.visibility === 'visible') {
        const xDecimal = (mouseX / window.innerWidth) * 100;
        const yDecimal = (mouseY / window.innerHeight) * 100;
        studioModal.style.setProperty('--mouse-x', `${xDecimal}%`);
        studioModal.style.setProperty('--mouse-y', `${yDecimal}%`);
    }
});

// Smooth follow loop
gsap.ticker.add(() => {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    gsap.set(follower, { x: followerX, y: followerY });
});

// Kinetic Menu Logic
const menuBtn = document.querySelector('.nav-btn');
const menuOverlay = document.querySelector('.menu-overlay');
const menuLinks = document.querySelectorAll('.menu-link');
const menuFooter = document.querySelector('.menu-footer');
let isMenuOpen = false;

// Create the paused timeline
const tlMenu = gsap.timeline({ paused: true });

tlMenu.to(menuOverlay, {
    visibility: "visible",
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    duration: 0.8,
    ease: "expo.inOut"
})
.to(menuLinks, {
    y: "0%",
    duration: 0.8,
    stagger: 0.1,
    ease: "power4.out"
}, "-=0.4")
.to(menuFooter, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    ease: "power2.out"
}, "-=0.4");

menuBtn.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
        // Change icon to X
        menuBtn.innerHTML = '<i data-lucide="x"></i>';
        lucide.createIcons();
        lenis.stop(); // Stop scrolling while menu is open
        tlMenu.play();
    } else {
        // Change icon back to Menu
        menuBtn.innerHTML = '<i data-lucide="menu"></i>';
        lucide.createIcons();
        lenis.start();
        tlMenu.reverse();
    }
});

menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default jump
        const targetId = link.getAttribute('href');
        
        // 1. Close the menu
        isMenuOpen = false;
        menuBtn.innerHTML = '<i data-lucide="menu"></i>';
        lucide.createIcons();
        tlMenu.reverse();

        // 2. SPECIAL CASE: STUDIO STORYTELLING MODAL
        if (targetId === '#studio') {
            openStudioModal();
            return; // Stop here, don't scroll
        }

        const targetElement = document.querySelector(targetId);
        
        // 3. Smooth scroll to target using Lenis after a short delay
        if (targetElement) {
            lenis.start();
            setTimeout(() => {
                lenis.scrollTo(targetElement, { duration: 1.5, offset: -50 });
            }, 600); // Wait until the menu overlay is mostly gone
        }
    });
});

// --- STUDIO STORYTELLING MODAL LOGIC ---
const studioModal = document.querySelector('.studio-modal');
const closeStudioBtn = document.querySelector('.close-studio');
const studioLines = document.querySelectorAll('.studio-line');

function openStudioModal() {
    lenis.stop(); // Lock scroll
    
    gsap.to(studioModal, {
        visibility: 'visible',
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.fromTo(studioLines, 
        { y: 50, opacity: 0 },
        { 
            y: 0, 
            opacity: 1, 
            duration: 1.5, 
            stagger: 0.3, 
            ease: 'expo.out',
            delay: 0.5 // Wait for modal background to fade in
        }
    );
}

closeStudioBtn.addEventListener('click', () => {
    gsap.to(studioModal, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
            gsap.set(studioModal, { visibility: 'hidden' });
            lenis.start(); // Unlock scroll
        }
    });
});

links.forEach(link => {
    link.addEventListener('mouseenter', () => follower.classList.add('hover'));
    link.addEventListener('mouseleave', () => follower.classList.remove('hover'));
});

// Hover Media Reveal Logic
const mediaContainer = document.querySelector('.hover-media-container');
const mediaImg = document.querySelector('.hover-media-img');
const serviceItems = document.querySelectorAll('.service-item');

let mediaTargetX = 0, mediaTargetY = 0;

gsap.ticker.add(() => {
    // Parallax effect instead of direct follow
    const parallaxX = (mouseX - window.innerWidth / 2) * 0.15; 
    const parallaxY = (mouseY - window.innerHeight / 2) * 0.15;

    mediaTargetX += (parallaxX - mediaTargetX) * 0.1;
    mediaTargetY += (parallaxY - mediaTargetY) * 0.1;
    
    gsap.set(mediaContainer, { x: mediaTargetX, y: mediaTargetY });
});

serviceItems.forEach(item => {
    item.addEventListener('mouseenter', (e) => {
        const imgSrc = item.getAttribute('data-image');
        if(imgSrc) {
            mediaImg.src = imgSrc;
            gsap.to(mediaContainer, {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: "power3.out"
            });
            follower.classList.add('hover'); // Expand standard cursor too
        }
    });

    item.addEventListener('mouseleave', () => {
        gsap.to(mediaContainer, {
            opacity: 0,
            scale: 0.8,
            duration: 0.4,
            ease: "power2.out"
        });
        follower.classList.remove('hover');
    });
});

// Magnetic Button
const magneticWrap = document.querySelector('.magnetic-wrap');
const magneticBtn = document.querySelector('.magnetic-btn');

if(magneticWrap && magneticBtn) {
    magneticWrap.addEventListener('mousemove', (e) => {
        const rect = magneticWrap.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(magneticBtn, { x: x * 0.4, y: y * 0.4, duration: 0.3, ease: "power2.out" });
        gsap.to(follower, { x: mouseX, y: mouseY, duration: 0.1 }); // Snap follower to mouse
    });

    magneticWrap.addEventListener('mouseleave', () => {
        gsap.to(magneticBtn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
    });
}

// Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integrate GSAP with Lenis
gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// --- Three.js Abstract 3D Scene (Raymarching) ---
const canvasContainer = document.getElementById('canvas-container');
const scene = new THREE.Scene();

const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
canvasContainer.appendChild(renderer.domElement);

const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uOffset;
uniform float uScale;

float sdSphere(vec3 p, float s) { return length(p) - s; }
float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}
mat2 rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
}

float map(vec3 p) {
    p -= uOffset;
    p /= max(uScale, 0.01);
    
    vec3 p1 = p, p2 = p, p3 = p;
    p1.xz *= rot(uTime * 0.5); p1.x += sin(uTime) * 1.5;
    p2.xy -= uMouse * 3.0; p2.z += cos(uTime) * 0.5;
    p3.xy *= rot(-uTime * 0.4); p3.x += cos(uTime) * 2.0;

    float s1 = sdSphere(p1, 1.2);
    float s2 = sdSphere(p2, 1.0);
    float s3 = sdSphere(p3, 0.8);
    float core = sdSphere(p, 1.5);

    float d = smin(core, s1, 0.8);
    d = smin(d, s2, 0.8);
    d = smin(d, s3, 0.8);
    return d * uScale;
}

vec3 calcNormal(vec3 p) {
    const float eps = 0.001;
    const vec2 h = vec2(eps, 0);
    return normalize(vec3(
        map(p + h.xyy) - map(p - h.xyy),
        map(p + h.yxy) - map(p - h.yxy),
        map(p + h.yyx) - map(p - h.yyx)
    ));
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.y, uResolution.x);
    vec3 ro = vec3(0.0, 0.0, 6.0);
    vec3 rd = normalize(vec3(uv, -1.0));
    
    float t = 0.0;
    vec3 col = vec3(0.0);
    float alpha = 0.0;
    
    for(int i = 0; i < 80; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);
        
        if(d < 0.001) {
            vec3 n = calcNormal(p);
            float fresnel = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
            vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
            float diff = max(dot(n, lightDir), 0.0);
            
            // Aberración Cromática ajustada al tono Verde Ácido (#ccff00)
            vec3 crystalColor = vec3(
                smoothstep(0.0, 1.0, fresnel * 1.5) * 0.8, // Red (moderate)
                smoothstep(0.0, 1.0, fresnel * 2.0) * 1.0, // Green (high)
                smoothstep(0.0, 1.0, fresnel * 0.5) * 0.0  // Blue (none)
            );
            
            col = vec3(0.05) + crystalColor * 1.5 + diff * 0.1;
            alpha = 1.0;
            break;
        }
        if(t > 20.0) break;
        t += d;
    }
    
    // Viñeta para darle un toque más oscuro
    col *= 1.0 - 0.5 * length(uv);
    
    gl_FragColor = vec4(col, alpha);
}
`;

const vertexShader = `
void main() {
    gl_Position = vec4(position, 1.0);
}
`;

const uniforms = {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uOffset: { value: new THREE.Vector3(0, 0, 0) },
    uScale: { value: 1.0 }
};

const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true
});

const geometry = new THREE.PlaneGeometry(2, 2);
const raymarchingMesh = new THREE.Mesh(geometry, material);
scene.add(raymarchingMesh);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
function animate3D() {
    requestAnimationFrame(animate3D);
    uniforms.uTime.value = clock.getElapsedTime();
    
    // Suavizado del mouse con lerp manual
    uniforms.uMouse.value.x += ((mouseX / window.innerWidth - 0.5) * 2.0 - uniforms.uMouse.value.x) * 0.05;
    uniforms.uMouse.value.y += (-(mouseY / window.innerHeight - 0.5) * 2.0 - uniforms.uMouse.value.y) * 0.05;

    renderer.render(scene, camera);
}
animate3D();

// --- Loader & Scroll Animations ---
window.addEventListener('load', () => {
    const tlLoader = gsap.timeline();
    
    // Entrance text animation for the loader
    tlLoader.from('.loader-logo', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power4.out"
    })
    .from('.loader-slogan', {
        opacity: 0,
        scale: 1.2, // Hardware accelerated scale instead of letter-spacing
        y: 10,
        duration: 1.2,
        ease: "power3.out"
    }, "-=0.6")
    // Shorter pause, then snap fade out
    .to('.loader-content', { opacity: 0, duration: 0.4, ease: "power2.inOut" }, "+=0.3")
    // Split screens open dramatically at the exact same time
    .to('.loader-bg.top', { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "-=0.3")
    .to('.loader-bg.bottom', { yPercent: 100, duration: 0.8, ease: "expo.inOut" }, "<")
    .set('#loader', { display: 'none' })
    // Entrance animations
    .from('.reveal-text', { 
        y: 100, 
        opacity: 0, 
        duration: 1, 
        stagger: 0.2, 
        ease: "power4.out" 
    }, "-=0.5")
    .from('.subtitle', { opacity: 0, y: 20, duration: 1 }, "-=0.5")
    .from(uniforms.uScale, { 
        value: 0, 
        duration: 1.5, 
        ease: "elastic.out(1, 0.5)",
        onComplete: initScrollTriggers
    }, "-=1");

    function initScrollTriggers() {
        // --- Marquee Animation ---
        const marqueeContent = document.querySelector('.marquee-content');
        if (marqueeContent) {
            const marqueeTween = gsap.to(marqueeContent, {
                xPercent: -50, // Move half the width
                ease: "none",
                duration: 20,
                repeat: -1
            });

            // Direction and speed control based on scroll
            ScrollTrigger.create({
                trigger: ".scroll-content",
                start: "top top",
                end: "bottom bottom",
                onUpdate: (self) => {
                    // Default to 1 (forward) if direction is 0 (hasn't scrolled yet)
                    const direction = self.direction || 1; 
                    const velocity = Math.min(Math.abs(self.getVelocity()), 2000) / 1000;
                    
                    const speedScale = (1 + velocity) * direction;
                    
                    gsap.to(marqueeTween, {
                        timeScale: speedScale,
                        duration: 0.2,
                        ease: "power2.out"
                    });
                }
            });
        }

        // Scroll Animations
        // 1. Mover la esfera líquida hacia la derecha usando uOffset
    gsap.to(uniforms.uOffset.value, {
        x: 2.2, // Adjusted from 4 to keep it more to the left
        ease: "power1.inOut",
        scrollTrigger: {
            trigger: ".services",
            start: "top bottom",
            end: "center center",
            scrub: true
        }
    });

    // 2. Reducir el tamaño de las metaballs usando uScale
    gsap.to(uniforms.uScale, {
        value: 0.5,
        scrollTrigger: {
            trigger: ".cta",
            start: "top bottom",
            end: "center center",
            scrub: true
        }
    });
    
    // 3. Parallax Curtain Reveal Footer Logic
    // This is a much more robust way to do a curtain reveal without z-index bugs
    // We physically place the footer at the bottom, and use parallax to make it slide out
    gsap.fromTo('.footer-inner', 
        { yPercent: -50 }, 
        { 
            yPercent: 0, 
            ease: "none", 
            scrollTrigger: {
                trigger: ".reveal-footer",
                start: "top bottom", // Starts when the top of the footer enters the bottom of the screen
                end: "bottom bottom", // Ends when the footer is fully in view
                scrub: true
            }
        }
    );
    
    // 4. Fade up elements
    const fadeUps = document.querySelectorAll('.fade-up');
    fadeUps.forEach(elem => {
        gsap.fromTo(elem, 
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0, duration: 1,
                scrollTrigger: {
                    trigger: elem,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
    }
});
