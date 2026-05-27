import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Set base layout percentages for craftsmanship text centering
gsap.set('.craft-text-card', { xPercent: -50, yPercent: -50 });

/* --- LENIS SMOOTH SCROLLING --- */
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2.2,
  infinite: false,
});

// Update ScrollTrigger on Lenis scroll
lenis.on('scroll', ScrollTrigger.update);

// Integrate Lenis raf loop with GSAP ticker
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);


/* --- HEADER INTERACTION --- */
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});


/* --- BACKGROUND AUDIO SYSTEM CHOREOGRAPHY --- */
const bgAudio = document.getElementById('bg-audio');
const soundToggleBtn = document.getElementById('sound-toggle-btn');
const soundLabel = soundToggleBtn ? soundToggleBtn.querySelector('.sound-label') : null;

if (soundToggleBtn && bgAudio) {
  // Set volume 70% lower (0.12) for a premium, subtle luxury ambient background mood
  bgAudio.volume = 0.12;

  const startAudioOnFirstInteraction = () => {
    bgAudio.play()
      .then(() => {
        soundToggleBtn.classList.add('playing');
        if (soundLabel) soundLabel.textContent = 'SOUND ON';
        document.removeEventListener('click', startAudioOnFirstInteraction);
        document.removeEventListener('touchend', startAudioOnFirstInteraction);
      })
      .catch(() => {
        // Autoplay blocked silently
      });
  };

  // Listen for the first click or mobile touch release on the document to bypass browser autoplay rules
  document.addEventListener('click', startAudioOnFirstInteraction);
  document.addEventListener('touchend', startAudioOnFirstInteraction);

  // Sound Button click handler
  soundToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Stop document click trigger from firing

    if (bgAudio.paused) {
      bgAudio.play()
        .then(() => {
          soundToggleBtn.classList.add('playing');
          if (soundLabel) soundLabel.textContent = 'SOUND ON';
        });
    } else {
      bgAudio.pause();
      soundToggleBtn.classList.remove('playing');
      if (soundLabel) soundLabel.textContent = 'SOUND OFF';
    }
  });
}


/* --- NAVIGATION CLICK ANCHORS --- */
const scrollToRevealBtns = document.querySelectorAll('.scroll-to-reveal');
scrollToRevealBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById('section-reveal');
    if (target) {
      lenis.scrollTo(target, { offset: -80 });
    }
  });
});


/* --- CINEMATIC DUAL-VARIANT CONFIGURATOR SYSTEM --- */
const redOnlyElements = document.querySelectorAll('.red-only');
const blackOnlyElements = document.querySelectorAll('.black-only');
const heroHeadingText = document.querySelector('#hero-heading .text-serif');
const heritageToggleBtn = document.getElementById('heritage-variant-toggle');

// Apply initial red state visibility classes
redOnlyElements.forEach(el => el.classList.add('active'));
blackOnlyElements.forEach(el => el.classList.remove('active'));

// Switcher implementation
function toggleVariantState() {
  const isBlack = document.body.classList.contains('variant-black');
  const targetVariant = isBlack ? 'red' : 'black';

  // Scroll smoothly back to Hero section as the transition starts
  lenis.scrollTo('#section-hero', {
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  });

  // Reset and play the hero video from the beginning as requested
  const heroMedia = document.getElementById('hero-media');
  if (heroMedia) {
    heroMedia.currentTime = 0;
    heroMedia.play().catch(() => { /* Silent block handle */ });
  }

  // 1. Trigger the cinematic camera studio flash animation
  const flashTl = gsap.timeline();
  flashTl.to('.heritage-img-overlay', {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    duration: 0.22,
    ease: 'power2.out',
    onComplete: () => {
      // 2. Perform the DOM state changes right in the middle of the flash
      if (targetVariant === 'black') {
        document.body.classList.add('variant-black');
        
        // Update taglines and headlines
        document.getElementById('nav-tagline').textContent = 'Stealth Edition R35';
        if (heroHeadingText) heroHeadingText.textContent = 'Gold & Shadow';
        if (heritageToggleBtn) heritageToggleBtn.textContent = 'Experience Red Metallic';

        // Toggle visibility classes across components
        redOnlyElements.forEach(el => el.classList.remove('active'));
        blackOnlyElements.forEach(el => el.classList.add('active'));
        
      } else {
        document.body.classList.remove('variant-black');
        
        document.getElementById('nav-tagline').textContent = 'Limited Production R35';
        if (heroHeadingText) heroHeadingText.textContent = 'Red & Shadow';
        if (heritageToggleBtn) heritageToggleBtn.textContent = 'Experience Stealth Black';

        blackOnlyElements.forEach(el => el.classList.remove('active'));
        redOnlyElements.forEach(el => el.classList.add('active'));
      }

      // Reset tabs in the dynamic galleries
      resetCollectionTabs(targetVariant);
    }
  });

  // 3. Fade out the white flash, leaving its specular glow behind
  flashTl.to('.heritage-img-overlay', {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    duration: 0.65,
    ease: 'power2.in',
    clearProps: 'backgroundColor' // Clear inline style so original CSS gradients are restored
  });

  // 4. Heavy cinematic zoom shift animation on the Heritage images
  gsap.fromTo('.heritage-img.active', 
    { scale: 1.15, filter: 'brightness(1.5) contrast(1.3)' },
    { scale: 1.03, filter: 'brightness(0.85) contrast(1.15)', duration: 0.9, ease: 'power3.out' }
  );
}

// Bind variant switch event to the Heritage Section CTA
if (heritageToggleBtn) {
  heritageToggleBtn.addEventListener('click', toggleVariantState);
}


/* --- GALLERY / SPECIFICATION TAB CHOREOGRAPHY --- */
const collectionToggles = document.querySelectorAll('.collection-toggles .toggle-btn');

function resetCollectionTabs(variant) {
  collectionToggles.forEach((tab, index) => {
    if (index === 0) {
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
    } else {
      tab.classList.remove('active');
      tab.setAttribute('aria-selected', 'false');
    }
  });

  const activeWrapper = document.querySelector(`.gallery-wrapper.${variant}-only`);
  const activeInfo = document.querySelector(`.variant-gallery-info.${variant}-only`);
  
  if (activeWrapper && activeInfo) {
    activeWrapper.querySelectorAll('.variant-img-container').forEach((slide, index) => {
      if (index === 0) slide.classList.add('active');
      else slide.classList.remove('active');
    });
    activeInfo.querySelectorAll('.variant-card').forEach((card, index) => {
      if (index === 0) card.classList.add('active');
      else card.classList.remove('active');
    });
  }
}

collectionToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const slideIndex = toggle.getAttribute('data-slide');
    
    // Update active tab styling class
    collectionToggles.forEach((t) => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    toggle.classList.add('active');
    toggle.setAttribute('aria-selected', 'true');

    // Get current active variant
    const activeVariant = document.body.classList.contains('variant-black') ? 'black' : 'red';
    
    // Fades between variant showcase slides
    const activeWrapper = document.querySelector(`.gallery-wrapper.${activeVariant}-only`);
    if (activeWrapper) {
      activeWrapper.querySelectorAll('.variant-img-container').forEach((slide) => {
        if (slide.getAttribute('data-slide') === slideIndex) {
          gsap.fromTo(slide, 
            { opacity: 0, scale: 0.97 }, 
            { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out', onStart: () => slide.classList.add('active') }
          );
        } else {
          slide.classList.remove('active');
        }
      });
    }

    // Crossfade info cards
    const activeInfo = document.querySelector(`.variant-gallery-info.${activeVariant}-only`);
    if (activeInfo) {
      activeInfo.querySelectorAll('.variant-card').forEach((card) => {
        if (card.getAttribute('data-slide') === slideIndex) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
    }
  });
});


/* --- PRIVATE ENQUIRY MODAL --- */
const modal = document.getElementById('enquiry-modal');
const triggerEnquiryBtns = document.querySelectorAll('.trigger-enquiry');
const closeBtn = document.getElementById('modal-close-btn');
const form = document.getElementById('allocation-form');
const successMsg = document.getElementById('success-notification');

// Open modal
triggerEnquiryBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('active');
    lenis.stop(); // Stop scroll events
  });
});

// Close modal
const closeModal = () => {
  modal.classList.remove('active');
  lenis.start(); // Restart scroll events
  setTimeout(() => {
    form.style.display = 'grid';
    successMsg.style.display = 'none';
  }, 500);
};

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    closeModal();
  }
});

// Form Netlify handling
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  
  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(formData).toString(),
  })
    .then((response) => {
      if (response.ok) {
        gsap.to(form, {
          opacity: 0,
          y: -20,
          duration: 0.4,
          onComplete: () => {
            form.style.display = 'none';
            form.reset();
            successMsg.style.display = 'block';
            gsap.fromTo(successMsg, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 });
          }
        });
      } else {
        alert('An error occurred during submission. Please try again.');
      }
    })
    .catch((error) => {
      console.error('Submission Error:', error);
      alert('An error occurred. Please check your network and try again.');
    });
});


/* --- GSAP CINEMATIC SCROLL ANIMATIONS --- */

// 1. Hero Title Entrance
const heroTl = gsap.timeline();
heroTl.fromTo('.hero-ghost-text', 
  { scale: 0.85, opacity: 0 }, 
  { scale: 1, opacity: 0.03, duration: 2.5, ease: 'power2.out' }
);
heroTl.fromTo('#hero-heading span', 
  { y: 70, opacity: 0 }, 
  { y: 0, opacity: 1, duration: 1.6, stagger: 0.25, ease: 'power4.out' },
  '-=2.0'
);
heroTl.fromTo('#hero-eyebrow-text', 
  { opacity: 0, letterSpacing: '2px' }, 
  { opacity: 1, letterSpacing: '5px', duration: 1.2, ease: 'power2.out' },
  '-=1.5'
);
heroTl.fromTo('#hero-tagline-text', 
  { opacity: 0, y: 15 }, 
  { opacity: 0.9, y: 0, duration: 1.2, ease: 'power3.out' },
  '-=1.2'
);
heroTl.fromTo('.hero-ctas', 
  { opacity: 0, y: 15 }, 
  { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
  '-=1.0'
);

// 2. Concept Reveal Scroll entrance
gsap.from('.reveal-text-side > *', {
  scrollTrigger: {
    trigger: '.section-reveal',
    start: 'top 80%',
  },
  y: 40,
  opacity: 0,
  duration: 1.2,
  stagger: 0.15,
  ease: 'power3.out',
});

gsap.from('.reveal-image-side', {
  scrollTrigger: {
    trigger: '.section-reveal',
    start: 'top 80%',
  },
  scale: 0.95,
  opacity: 0,
  duration: 1.6,
  ease: 'power2.out',
});

// 3. Heritage Parallax Scroll
gsap.from('.heritage-img', {
  scrollTrigger: {
    trigger: '.section-heritage',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  },
  yPercent: 12,
  ease: 'none',
});

gsap.from('.heritage-text-side > *', {
  scrollTrigger: {
    trigger: '.section-heritage',
    start: 'top 80%',
  },
  y: 40,
  opacity: 0,
  duration: 1.2,
  stagger: 0.15,
  ease: 'power3.out',
});

// 4. Collection Reveal
gsap.from('.collection-header-text > *', {
  scrollTrigger: {
    trigger: '.section-collection',
    start: 'top 80%',
  },
  y: 35,
  opacity: 0,
  duration: 1.2,
  stagger: 0.15,
  ease: 'power3.out',
});

// 5. Craftsmanship Pinning & Horizontal Specular Light Scrub
const craftTl = gsap.timeline({
  scrollTrigger: {
    trigger: '.section-craftsmanship',
    start: 'top top',
    end: '+=200%',
    pin: true,
    scrub: 1.2,
    anticipatePin: 1,
  }
});

// specular sweeps linear scrub
craftTl.to('#specular-sweep-line', {
  left: '120%',
  duration: 4,
  ease: 'power1.inOut'
}, 0);

// Transition from Layer 1 to Layer 2
craftTl.to('#craft-layer-1', { opacity: 0, duration: 1.5 }, 0.5)
       .to('#craft-layer-2', { opacity: 1, duration: 1.5 }, 0.5)
       .to('#craft-text-1', { opacity: 0, y: -20, duration: 1.0 }, 0.5)
       .to('#craft-text-2', { opacity: 1, y: 0, duration: 1.2 }, 1.2);

// Transition from Layer 2 to Layer 3
craftTl.to('#craft-layer-2', { opacity: 0, duration: 1.5 }, 2.0)
       .to('#craft-layer-3', { opacity: 1, duration: 1.5 }, 2.0)
       .to('#craft-text-2', { opacity: 0, y: -20, duration: 1.0 }, 2.0)
       .to('#craft-text-3', { opacity: 1, y: 0, duration: 1.2 }, 2.7);

// 6. Showcase Zoom Scroll
gsap.fromTo('.showcase-img-layer', 
  { scale: 1.1 }, 
  {
    scrollTrigger: {
      trigger: '.section-showcase',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
    scale: 1.0,
    ease: 'none',
  }
);

gsap.from('.showcase-content > *', {
  scrollTrigger: {
    trigger: '.section-showcase',
    start: 'top 70%',
  },
  x: -40,
  opacity: 0,
  duration: 1.2,
  stagger: 0.15,
  ease: 'power3.out',
});

// 7. Hide Left/Right Side Chrome to Prevent Footer Collision
ScrollTrigger.create({
  trigger: 'footer',
  start: 'top 92%',
  onEnter: () => gsap.to(['.side-chrome', '.side-chrome-right'], { opacity: 0, duration: 0.4, pointerEvents: 'none', ease: 'power2.out' }),
  onLeaveBack: () => gsap.to(['.side-chrome', '.side-chrome-right'], { opacity: 1, duration: 0.4, pointerEvents: 'auto', ease: 'power2.in' })
});

