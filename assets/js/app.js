/**
 * KAAN-HA LUXURY RESIDENCES - CORE CONTROLLER
 * Handles i18n, bilingual video switching, GHL webhook, WhatsApp sync, 360 tour, 43-photo luxury carousel, and UI interactions.
 */

(function () {
  // Global State & Configuration
  const CONFIG = {
    jorgePhone: "5216561436266",
    secondaryEmail: "jorgeasoti@yahoo.com",
    brokerDriveUrl: "https://drive.google.com/drive/folders/1SntOa282Gi-bkTEfeL00HPE9c3YHN8S2?usp=drive_link",
    videosDriveUrl: "https://drive.google.com/drive/folders/1qnUCy0k1KjOYHNYn5kjn0cfUM3tVTlgQ?usp=drive_link",
    ghlWebhookUrl: "https://services.leadconnectorhq.com/hooks/catch/custom-kaan-ha-webhook",
    videoPaths: {
      es: "assets/videos/kaan-ha-es.mp4",
      en: "assets/videos/kaan-ha-en.mp4",
      fr: "assets/videos/kaan-ha-en.mp4"
    }
  };

  let currentLang = "es";

  // Gallery Slides Data: All 43 unique curated photos from the official Drive folder
  const GALLERY_DATA = Array.from({ length: 43 }, (_, i) => ({
    id: i + 1,
    base: `gallery-${String(i + 1).padStart(2, "0")}`
  }));

  let currentSlide = 0;

  // DOM Elements
  const heroVideo = document.getElementById("hero-video");
  const heroVideoSource = document.getElementById("hero-video-source");
  const featuredVideo = document.getElementById("featured-video");
  const featuredVideoSource = document.getElementById("featured-video-source");
  const floatingWaBtn = document.getElementById("floating-wa-btn");
  const leadForm = document.getElementById("lead-form");
  const langSelectors = document.querySelectorAll(".lang-btn");
  const successModal = document.getElementById("success-modal");
  const closeSuccessModal = document.getElementById("close-success-modal");
  const successWaCta = document.getElementById("success-wa-cta");
  const conciergeWidget = document.getElementById("concierge-widget");
  const conciergeToggle = document.getElementById("concierge-toggle");
  const conciergeClose = document.getElementById("concierge-close");
  const conciergeMessages = document.getElementById("concierge-messages");
  const conciergeForm = document.getElementById("concierge-form");
  const conciergeInput = document.getElementById("concierge-input");
  const quickPillsContainer = document.getElementById("concierge-quick-pills");
  const brokerPortalBtn = document.getElementById("broker-portal-btn");
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const mobileDrawer = document.getElementById("mobile-drawer");
  const mobileDrawerOverlay = document.getElementById("mobile-drawer-overlay");
  const mobileDrawerClose = document.getElementById("mobile-drawer-close");
  const conciergeMobileOverlay = document.getElementById("concierge-mobile-overlay");

  // Carousel DOM Elements
  const carouselTrack = document.getElementById("carousel-track");
  const carouselPrev = document.getElementById("carousel-prev");
  const carouselNext = document.getElementById("carousel-next");
  const carouselCounter = document.getElementById("carousel-counter");
  const carouselCaption = document.getElementById("carousel-caption");
  const carouselDots = document.getElementById("carousel-dots");
  const carouselExpandBtn = document.getElementById("carousel-expand-btn");

  // Lightbox Modal
  const galleryModal = document.getElementById("gallery-modal");
  const galleryModalImg = document.getElementById("gallery-modal-img");
  const galleryModalClose = document.getElementById("gallery-modal-close");

  // Initialize on DOM Ready
  document.addEventListener("DOMContentLoaded", () => {
    initLanguage();
    initMobileDrawer();
    initVideoPlayers();
    initWhatsAppLinks();
    initScrollEffects();
    initLeadForm();
    initConcierge();
    initCarousel();
    initLightbox();
    initBrokerLink();
  });

  /**
   * 1. LANGUAGE & I18N
   */
  function initLanguage() {
    const saved = localStorage.getItem("kaan_ha_lang");
    const hash = window.location.hash.replace("#", "").toLowerCase();

    if (["es", "en", "fr"].includes(hash)) {
      currentLang = hash;
    } else if (["es", "en", "fr"].includes(saved)) {
      currentLang = saved;
    } else {
      const navLang = (navigator.language || navigator.userLanguage || "es").toLowerCase();
      if (navLang.startsWith("fr")) currentLang = "fr";
      else if (navLang.startsWith("en")) currentLang = "en";
      else currentLang = "es";
    }

    setLanguage(currentLang, false);

    langSelectors.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const lang = e.currentTarget.getAttribute("data-lang");
        if (lang && lang !== currentLang) {
          setLanguage(lang, true);
        }
      });
    });
  }

  function setLanguage(lang, persist = true) {
    currentLang = lang;
    if (persist) {
      localStorage.setItem("kaan_ha_lang", lang);
    }

    if (typeof window.translatePage === "function") {
      window.translatePage(lang);
    }

    updateVideos(lang);
    updateWhatsAppMessages(lang);
    updateCarouselCaptions(lang);
    refreshConciergeGreeting(lang);
  }

  /**
   * 1.1 MOBILE MENU DRAWER
   */
  function initMobileDrawer() {
    if (!mobileMenuToggle || !mobileDrawer || !mobileDrawerOverlay) return;

    function openDrawer() {
      mobileDrawerOverlay.classList.remove("hidden");
      setTimeout(() => {
        mobileDrawerOverlay.classList.add("opacity-100");
        mobileDrawer.classList.remove("drawer-closed");
        mobileDrawer.classList.add("drawer-open");
      }, 10);
      document.body.style.overflow = "hidden";
    }

    function closeDrawer() {
      mobileDrawer.classList.remove("drawer-open");
      mobileDrawer.classList.add("drawer-closed");
      mobileDrawerOverlay.classList.remove("opacity-100");
      setTimeout(() => {
        mobileDrawerOverlay.classList.add("hidden");
        document.body.style.overflow = "";
      }, 300);
    }

    mobileMenuToggle.addEventListener("click", openDrawer);
    if (mobileDrawerClose) mobileDrawerClose.addEventListener("click", closeDrawer);
    mobileDrawerOverlay.addEventListener("click", closeDrawer);

    document.querySelectorAll(".mobile-nav-link").forEach(link => {
      link.addEventListener("click", () => {
        closeDrawer();
      });
    });
  }

  /**
   * 2. BILINGUAL VIDEO LOGIC
   * Spanish page (es) -> assets/videos/kaan-ha-es.mp4
   * English/French page (en, fr) -> assets/videos/kaan-ha-en.mp4
   */
  function initVideoPlayers() {
    updateVideos(currentLang);
  }

  function updateVideos(lang) {
    const targetSrc = CONFIG.videoPaths[lang] || CONFIG.videoPaths.es;

    // 1. Update Hero Video Player
    if (heroVideo && heroVideoSource) {
      const currentHero = heroVideoSource.getAttribute("src");
      if (currentHero !== targetSrc) {
        heroVideo.classList.add("opacity-60");
        setTimeout(() => {
          heroVideoSource.setAttribute("src", targetSrc);
          heroVideo.load();
          const playPromise = heroVideo.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              heroVideo.classList.remove("opacity-60");
            }).catch(err => {
              console.info("Hero video autoplay waiting for user interaction:", err);
              heroVideo.classList.remove("opacity-60");
            });
          }
        }, 200);
      }
    }

    // 2. Update Featured Section Video Player
    if (featuredVideo && featuredVideoSource) {
      const currentFeatured = featuredVideoSource.getAttribute("src");
      if (currentFeatured !== targetSrc) {
        const wasPlaying = !featuredVideo.paused;
        const currentTime = featuredVideo.currentTime;
        featuredVideoSource.setAttribute("src", targetSrc);
        featuredVideo.load();
        if (currentTime > 0) {
          featuredVideo.currentTime = currentTime;
        }
        if (wasPlaying) {
          featuredVideo.play().catch(() => {});
        }
      }
    }
  }

  /**
   * 3. WHATSAPP FLOATING BUTTON & LINKS
   */
  function initWhatsAppLinks() {
    updateWhatsAppMessages(currentLang);
  }

  function updateWhatsAppMessages(lang) {
    const dict = window.I18N_DATA[lang] || window.I18N_DATA.es;
    const message = dict.wa_message || "Hola Jorge, vi la reventa en planta baja de Kaan-Ha en Tulum Country Club y me gustaría recibir los detalles completos y agendar una visita privada.";
    const waUrl = `https://wa.me/${CONFIG.jorgePhone}?text=${encodeURIComponent(message)}`;

    if (floatingWaBtn) {
      floatingWaBtn.setAttribute("href", waUrl);
    }

    document.querySelectorAll(".wa-direct-link").forEach(btn => {
      btn.setAttribute("href", waUrl);
    });

    if (successWaCta) {
      successWaCta.setAttribute("href", waUrl);
    }
  }

  /**
   * 4. BROKER LINK SETUP
   */
  function initBrokerLink() {
    if (brokerPortalBtn) {
      brokerPortalBtn.setAttribute("href", CONFIG.brokerDriveUrl);
    }
  }

  /**
   * 5. GOHIGHLEVEL WEBHOOK & EMAIL LEAD CAPTURE
   */
  function initLeadForm() {
    if (!leadForm) return;

    leadForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = leadForm.querySelector("button[type='submit']");
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="10" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> Procesando...
      `;

      const formData = {
        name: document.getElementById("form-name")?.value || document.getElementById("lead-name")?.value || "",
        email: document.getElementById("form-email")?.value || document.getElementById("lead-email")?.value || "",
        phone: document.getElementById("form-phone")?.value || document.getElementById("lead-phone")?.value || "",
        preferred_language: document.getElementById("form-preferred-lang")?.value || document.getElementById("lead-lang")?.value || currentLang,
        property: "Kaan-Ha Luxury Resale Planta Baja - 2 BR con Terraza",
        property_price: "$536,000 USD (Reventa Planta Baja)",
        location: "Tulum Country Club, Quintana Roo, México",
        broker_contact: "Jorge Sandoval (+52 1 656 143 6266)",
        secondary_notification_email: CONFIG.secondaryEmail,
        objective: document.getElementById("form-interest")?.value || document.getElementById("lead-interest")?.value || "Inversión Inmediata",
        custom_notes: document.getElementById("form-message")?.value || document.getElementById("lead-message")?.value || "Solicitud de Ficha Técnica y Cita VIP",
        timestamp: new Date().toISOString(),
        source: window.location.href,
        referrer: document.referrer || "direct"
      };

      try {
        await fetch(CONFIG.ghlWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: "no-cors",
          body: JSON.stringify(formData)
        });
      } catch (err) {
        console.warn("GoHighLevel Webhook handled:", err);
      }

      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      if (successModal) {
        successModal.classList.remove("hidden");
        successModal.classList.add("flex");
      }

      leadForm.reset();
    });

    if (closeSuccessModal && successModal) {
      closeSuccessModal.addEventListener("click", () => {
        successModal.classList.add("hidden");
        successModal.classList.remove("flex");
      });

      successModal.addEventListener("click", (e) => {
        if (e.target === successModal) {
          successModal.classList.add("hidden");
          successModal.classList.remove("flex");
        }
      });
    }
  }

  /**
   * 6. LUXURY CAROUSEL CONTROLLER (43 CURATED SLIDES)
   */
  function initCarousel() {
    if (!carouselTrack) return;

    // 1. Build Slide Track Markup
    carouselTrack.innerHTML = "";
    GALLERY_DATA.forEach((item, index) => {
      const slide = document.createElement("div");
      slide.className = "w-full shrink-0 relative aspect-[16/10] sm:aspect-[16/9] bg-black/60 cursor-pointer overflow-hidden group";
      slide.setAttribute("data-slide-index", index);

      const isEarly = index < 2;
      slide.innerHTML = `
        <picture class="w-full h-full block">
          <source srcset="assets/images/${item.base}.webp" type="image/webp">
          <img src="assets/images/${item.base}.jpg" 
               alt="Kaan-Ha Fotografía ${index + 1}" 
               loading="${isEarly ? 'eager' : 'lazy'}"
               class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
        </picture>
        <div class="absolute inset-0 bg-gradient-to-t from-deep-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span class="px-4 py-2 rounded-full glass-panel text-xs uppercase tracking-widest text-arena-chukum border border-matte-gold/60 shadow-lg">
            🔍 Ampliar Imagen
          </span>
        </div>
      `;

      slide.addEventListener("click", () => {
        openLightbox(index);
      });

      carouselTrack.appendChild(slide);
    });

    // 2. Build Pagination Dots (Compact scrollable bar for 43 dots)
    if (carouselDots) {
      carouselDots.innerHTML = "";
      GALLERY_DATA.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", `Ir a fotografía ${index + 1}`);
        dot.className = `w-2 h-2 rounded-full transition-all duration-300 ${
          index === 0 ? "bg-matte-gold w-6" : "bg-arena-chukum/30 hover:bg-arena-chukum/60"
        }`;
        dot.addEventListener("click", () => {
          goToSlide(index);
        });
        carouselDots.appendChild(dot);
      });
    }

    // 3. Navigation Controls
    if (carouselPrev) {
      carouselPrev.addEventListener("click", () => {
        goToSlide((currentSlide - 1 + GALLERY_DATA.length) % GALLERY_DATA.length);
      });
    }

    if (carouselNext) {
      carouselNext.addEventListener("click", () => {
        goToSlide((currentSlide + 1) % GALLERY_DATA.length);
      });
    }

    if (carouselExpandBtn) {
      carouselExpandBtn.addEventListener("click", () => {
        openLightbox(currentSlide);
      });
    }

    // 4. Touch Gestures (Swipe)
    let touchStartX = 0;
    let touchEndX = 0;

    carouselTrack.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselTrack.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const threshold = 40;
      if (touchEndX < touchStartX - threshold) {
        goToSlide((currentSlide + 1) % GALLERY_DATA.length);
      } else if (touchEndX > touchStartX + threshold) {
        goToSlide((currentSlide - 1 + GALLERY_DATA.length) % GALLERY_DATA.length);
      }
    }

    // 5. Keyboard Navigation
    document.addEventListener("keydown", (e) => {
      const galSection = document.getElementById("galeria");
      if (!galSection) return;
      const rect = galSection.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        if (e.key === "ArrowLeft") {
          goToSlide((currentSlide - 1 + GALLERY_DATA.length) % GALLERY_DATA.length);
        } else if (e.key === "ArrowRight") {
          goToSlide((currentSlide + 1) % GALLERY_DATA.length);
        }
      }
    });

    goToSlide(0);
  }

  function goToSlide(index) {
    currentSlide = index;
    if (carouselTrack) {
      carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    // Update Counter (01 / 43)
    if (carouselCounter) {
      const num = String(currentSlide + 1).padStart(2, "0");
      const total = String(GALLERY_DATA.length).padStart(2, "0");
      carouselCounter.textContent = `${num} / ${total}`;
    }

    // Update Caption
    updateCarouselCaptions(currentLang);

    // Update Dots (scroll dot into view if needed)
    if (carouselDots) {
      const dots = carouselDots.querySelectorAll("button");
      dots.forEach((dot, i) => {
        if (i === currentSlide) {
          dot.className = "w-6 h-2 rounded-full bg-matte-gold transition-all duration-300 shrink-0";
          if (dot.scrollIntoView) {
            dot.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
          }
        } else {
          dot.className = "w-2 h-2 rounded-full bg-arena-chukum/30 hover:bg-arena-chukum/60 transition-all duration-300 shrink-0";
        }
      });
    }
  }

  function updateCarouselCaptions(lang) {
    if (!carouselCaption) return;
    const dict = window.I18N_DATA[lang] || window.I18N_DATA.es;
    const slides = dict.gallery_slides || [];
    const text = slides[currentSlide] || `Fotografía ${currentSlide + 1}`;
    carouselCaption.textContent = text;
  }
  window.updateCarouselCaptions = updateCarouselCaptions;

  /**
   * 7. LIGHTBOX CONTROLLER
   */
  function initLightbox() {
    if (!galleryModal) return;

    if (galleryModalClose) {
      galleryModalClose.addEventListener("click", closeLightbox);
    }

    galleryModal.addEventListener("click", (e) => {
      if (e.target === galleryModal) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !galleryModal.classList.contains("hidden")) {
        closeLightbox();
      }
    });
  }

  function openLightbox(index) {
    if (!galleryModal || !galleryModalImg) return;
    const item = GALLERY_DATA[index];
    if (!item) return;

    galleryModalImg.setAttribute("src", `assets/images/${item.base}.webp`);
    galleryModal.classList.remove("hidden");
    galleryModal.classList.add("flex");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!galleryModal) return;
    galleryModal.classList.add("hidden");
    galleryModal.classList.remove("flex");
    document.body.style.overflow = "";
  }

  /**
   * 8. AI CONCIERGE CONTROLLER
   */
  function initConcierge() {
    if (!conciergeWidget || !conciergeToggle) return;

    let isOpen = false;

    function openConcierge() {
      isOpen = true;
      conciergeWidget.classList.remove("hidden");
      setTimeout(() => {
        conciergeWidget.classList.add("widget-open");
      }, 10);
      if (window.innerWidth < 640 && conciergeMobileOverlay) {
        conciergeMobileOverlay.classList.remove("hidden");
        document.body.style.overflow = "hidden";
      }
    }

    function closeConcierge() {
      isOpen = false;
      conciergeWidget.classList.remove("widget-open");
      if (conciergeMobileOverlay) {
        conciergeMobileOverlay.classList.add("hidden");
      }
      document.body.style.overflow = "";
      setTimeout(() => {
        if (!isOpen) conciergeWidget.classList.add("hidden");
      }, 300);
    }

    conciergeToggle.addEventListener("click", () => {
      if (isOpen) closeConcierge();
      else openConcierge();
    });

    if (conciergeClose) conciergeClose.addEventListener("click", closeConcierge);
    if (conciergeMobileOverlay) conciergeMobileOverlay.addEventListener("click", closeConcierge);

    if (conciergeForm && conciergeInput) {
      conciergeForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const userText = conciergeInput.value.trim();
        if (!userText) return;

        appendMessage("user", userText);
        conciergeInput.value = "";

        const typingIndicator = appendTypingIndicator();
        try {
          if (window.KaanHaConcierge && typeof window.KaanHaConcierge.query === "function") {
            const reply = await window.KaanHaConcierge.query(userText, currentLang);
            removeTypingIndicator(typingIndicator);
            appendMessage("assistant", reply);
          } else {
            removeTypingIndicator(typingIndicator);
            appendMessage("assistant", "Estoy a su entera disposición para facilitarle la ficha técnica de la residencia en Planta Baja con terraza hacia garden y albercas, o conectarle directamente con Jorge Sandoval por WhatsApp al +52 1 656 143 6266.");
          }
        } catch (err) {
          removeTypingIndicator(typingIndicator);
          appendMessage("assistant", "Con gusto puedo brindarle información sobre la distribución, la terraza privada y el club de golf PGA. ¿Gusta que le enviemos el dossier por WhatsApp?");
        }
      });
    }

    if (quickPillsContainer) {
      quickPillsContainer.querySelectorAll("button").forEach(pill => {
        pill.addEventListener("click", () => {
          const text = pill.textContent.trim();
          if (conciergeInput) {
            conciergeInput.value = text;
            conciergeForm.dispatchEvent(new Event("submit"));
          }
        });
      });
    }
  }

  function appendMessage(sender, text) {
    if (!conciergeMessages) return;

    const row = document.createElement("div");
    row.className = `flex ${sender === "user" ? "justify-end" : "justify-start"} mb-3`;

    const bubble = document.createElement("div");
    bubble.className = sender === "user"
      ? "max-w-[85%] bg-matte-gold text-deep-jungle font-medium text-xs sm:text-sm rounded-2xl rounded-br-xs px-4 py-2.5 shadow-md"
      : "max-w-[85%] bg-deep-jungle/90 border border-matte-gold/30 text-arena-chukum text-xs sm:text-sm rounded-2xl rounded-bl-xs px-4 py-2.5 shadow-md leading-relaxed";

    bubble.innerHTML = text.replace(/\n/g, "<br>");
    row.appendChild(bubble);
    conciergeMessages.appendChild(row);
    conciergeMessages.scrollTop = conciergeMessages.scrollHeight;
  }

  function appendTypingIndicator() {
    if (!conciergeMessages) return null;
    const row = document.createElement("div");
    row.className = "flex justify-start mb-3 typing-indicator-row";
    row.innerHTML = `
      <div class="bg-deep-jungle/80 border border-matte-gold/20 text-arena-chukum rounded-2xl px-3 py-2 flex items-center gap-1 text-xs">
        <span class="w-1.5 h-1.5 rounded-full bg-matte-gold animate-ping"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-matte-gold animate-ping" style="animation-delay: 0.2s"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-matte-gold animate-ping" style="animation-delay: 0.4s"></span>
      </div>
    `;
    conciergeMessages.appendChild(row);
    conciergeMessages.scrollTop = conciergeMessages.scrollHeight;
    return row;
  }

  function removeTypingIndicator(indicator) {
    if (indicator && indicator.parentNode) {
      indicator.parentNode.removeChild(indicator);
    }
  }

  function refreshConciergeGreeting(lang) {
    const greetingEl = document.getElementById("concierge-initial-msg");
    if (!greetingEl) return;
    const dict = window.I18N_DATA[lang] || window.I18N_DATA.es;
    if (dict.ai_greeting) {
      greetingEl.textContent = dict.ai_greeting;
    }
  }

  /**
   * 9. SCROLL REVEAL & PARALLAX
   */
  function initScrollEffects() {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, { threshold: 0.12 });

    reveals.forEach(el => observer.observe(el));

    const heroBg = document.querySelector(".hero-parallax-bg");
    if (heroBg) {
      window.addEventListener("scroll", () => {
        const scrolled = window.pageYOffset;
        if (scrolled < 900) {
          heroBg.style.setProperty("--parallax-offset", `${scrolled * 0.35}px`);
        }
      }, { passive: true });
    }
  }

})();
