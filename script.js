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
        const targetElement = document.querySelector(targetId);
        
        // 1. Close the menu
        isMenuOpen = false;
        menuBtn.innerHTML = '<i data-lucide="menu"></i>';
        lucide.createIcons();
        lenis.start();
        tlMenu.reverse();
        
        // 2. Smooth scroll to target using Lenis after a short delay
        if (targetElement) {
            setTimeout(() => {
                lenis.scrollTo(targetElement, { duration: 1.5, offset: -50 });
            }, 600); // Wait until the menu overlay is mostly gone
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

// --- Three.js Abstract 3D Scene ---
const canvasContainer = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.05);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 12;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
canvasContainer.appendChild(renderer.domElement);

// Create Abstract Geometry (Liquid Metal Blob)
const geometry = new THREE.SphereGeometry(3, 64, 64);

// Store original vertices for animation
const positionAttribute = geometry.getAttribute('position');
const vertexData = [];
for (let i = 0; i < positionAttribute.count; i++) {
    vertexData.push({
        x: positionAttribute.getX(i),
        y: positionAttribute.getY(i),
        z: positionAttribute.getZ(i)
    });
}

const material = new THREE.MeshStandardMaterial({
    color: 0xccff00, // Acid Green
    metalness: 0.9,
    roughness: 0.1,
    wireframe: true
});
const abstractMesh = new THREE.Mesh(geometry, material);
scene.add(abstractMesh);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 3D Animation Loop
const clock = new THREE.Clock();
function animate3D() {
    requestAnimationFrame(animate3D);
    const elapsedTime = clock.getElapsedTime();
    
    // Slow continuous rotation
    abstractMesh.rotation.x = elapsedTime * 0.1;
    abstractMesh.rotation.y = elapsedTime * 0.15;
    
    // Liquid Blob Vertex Animation
    const positionAttr = abstractMesh.geometry.getAttribute('position');
    for (let i = 0; i < positionAttr.count; i++) {
        const p = vertexData[i];
        // Mathematical fluid noise (amplified for more deformation)
        const noise = 1.0 * Math.sin(p.x * 1.5 + elapsedTime * 1.5) + 
                      1.0 * Math.sin(p.y * 1.5 + elapsedTime * 1.5) + 
                      1.0 * Math.sin(p.z * 1.5 + elapsedTime * 1.5);
        
        // Secondary high-frequency ripple
        const noise2 = 0.5 * Math.sin(p.x * 4 + elapsedTime * 2);
        
        // Push vertices outwards (amplified)
        const scale = 1 + (noise + noise2) * 0.3; 
        
        positionAttr.setXYZ(i, p.x * scale, p.y * scale, p.z * scale);
    }
    positionAttr.needsUpdate = true;
    abstractMesh.geometry.computeVertexNormals();
    
    // Parallax mouse effect
    const targetRotX = (mouseY / window.innerHeight - 0.5) * 0.5;
    const targetRotY = (mouseX / window.innerWidth - 0.5) * 0.5;
    
    scene.rotation.x += (targetRotX - scene.rotation.x) * 0.05;
    scene.rotation.y += (targetRotY - scene.rotation.y) * 0.05;

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
    .from(abstractMesh.scale, { 
        x: 0, y: 0, z: 0, 
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
        // 1. Move 3D object to the side during services section
    gsap.to(abstractMesh.position, {
        x: 4,
        ease: "power1.inOut",
        scrollTrigger: {
            trigger: ".services",
            start: "top bottom",
            end: "center center",
            scrub: true
        }
    });

    // 2. Change 3D object color or scale
    gsap.to(abstractMesh.scale, {
        x: 0.5, y: 0.5, z: 0.5,
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
