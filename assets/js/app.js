/**
 * KAAN-HA LUXURY RESIDENCES - CORE CONTROLLER
 * Handles i18n, video switching, GHL webhook, WhatsApp sync, 360 tour, and UI interactions.
 */

(function () {
  // Global State & Configuration
  const CONFIG = {
    jorgePhone: "5216561436266",
    secondaryEmail: "jorgeasoti@yahoo.com",
    brokerDriveUrl: "https://drive.google.com/drive/folders/1Iee16levvkNgKNrJGaGQ4NbdVySygIwg?usp=sharing",
    videosDriveUrl: "https://drive.google.com/drive/folders/1qnUCy0k1KjOYHNYn5kjn0cfUM3tVTlgQ?usp=drive_link",
    // Configurable GoHighLevel Webhook URL
    ghlWebhookUrl: "https://services.leadconnectorhq.com/hooks/catch/custom-kaan-ha-webhook",
    // Local / CDN video paths
    videoPaths: {
      es: "kaanha/Videos/Kaanha esp.mp4",
      en: "kaanha/Videos/KaanHa ing.mp4",
      fr: "kaanha/Videos/KaanHa ing.mp4"
    }
  };

  let currentLang = "es";

  // DOM Elements
  const heroVideo = document.getElementById("hero-video");
  const heroVideoSource = document.getElementById("hero-video-source");
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

  // Initialize
  document.addEventListener("DOMContentLoaded", () => {
    initLanguage();
    initMobileDrawer();
    initVideoPlayer();
    initWhatsAppLinks();
    initScrollEffects();
    initLeadForm();
    initConcierge();
    init360Tour();
    initGallery();
  });

  /**
   * 1. LANGUAGE & I18N
   */
  function initLanguage() {
    // Check saved preference or URL hash
    const saved = localStorage.getItem("kaan_ha_lang");
    const hash = window.location.hash.replace("#", "").toLowerCase();

    if (["es", "en", "fr"].includes(hash)) {
      currentLang = hash;
    } else if (["es", "en", "fr"].includes(saved)) {
      currentLang = saved;
    } else {
      // Detect browser language
      const navLang = (navigator.language || navigator.userLanguage || "es").toLowerCase();
      if (navLang.startsWith("fr")) currentLang = "fr";
      else if (navLang.startsWith("en")) currentLang = "en";
      else currentLang = "es";
    }

    setLanguage(currentLang, false);

    // Bind language button clicks
    langSelectors.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const lang = e.currentTarget.getAttribute("data-lang");
        if (lang && lang !== currentLang) {
          setLanguage(lang, true);
        }
      });
    });
  }

  /**
   * 1.1 MOBILE MENU DRAWER
   */
  function initMobileDrawer() {
    if (!mobileMenuToggle || !mobileDrawer || !mobileDrawerOverlay) return;

    function openDrawer() {
      mobileDrawerOverlay.classList.remove("hidden");
      mobileDrawer.classList.remove("drawer-closed");
      mobileDrawer.classList.add("drawer-open");
      document.body.classList.add("overflow-hidden");
    }

    function closeDrawer() {
      mobileDrawerOverlay.classList.add("hidden");
      mobileDrawer.classList.remove("drawer-open");
      mobileDrawer.classList.add("drawer-closed");
      document.body.classList.remove("overflow-hidden");
    }

    mobileMenuToggle.addEventListener("click", openDrawer);
    if (mobileDrawerClose) mobileDrawerClose.addEventListener("click", closeDrawer);
    mobileDrawerOverlay.addEventListener("click", closeDrawer);

    // Close when clicking any link inside drawer
    document.querySelectorAll(".mobile-nav-link").forEach(link => {
      link.addEventListener("click", closeDrawer);
    });
  }

  function setLanguage(lang, switchVideo = true) {
    currentLang = lang;
    localStorage.setItem("kaan_ha_lang", lang);

    // Update active button classes
    langSelectors.forEach(btn => {
      const isSelected = btn.getAttribute("data-lang") === lang;
      if (isSelected) {
        btn.classList.add("bg-matte-gold", "text-deep-jungle", "font-bold");
        btn.classList.remove("text-arena-chukum/70", "hover:text-white");
      } else {
        btn.classList.remove("bg-matte-gold", "text-deep-jungle", "font-bold");
        btn.classList.add("text-arena-chukum/70", "hover:text-white");
      }
    });

    const dict = window.I18N_DATA[lang] || window.I18N_DATA.es;

    // Update text content with data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    // Update input placeholders with data-i18n-placeholder
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key]) {
        el.setAttribute("placeholder", dict[key]);
      }
    });

    // Update form select preferred language value
    const langSelect = document.getElementById("form-preferred-lang");
    if (langSelect) {
      langSelect.value = lang.toUpperCase();
    }

    // Update WhatsApp links
    updateWhatsAppMessages(lang);

    // Switch video if required
    if (switchVideo) {
      updateHeroVideo(lang);
    }

    // Refresh Concierge greeting
    refreshConciergeGreeting(lang);
  }

  /**
   * 2. VIDEO SWITCHER LOGIC
   * Si Idioma = ES: Cargar Video Kaan Ha ES.mp4
   * Si Idioma = EN o FR: Cargar Video Kaan Ha EN.mp4
   */
  function initVideoPlayer() {
    if (!heroVideo) return;
    updateHeroVideo(currentLang);
  }

  function updateHeroVideo(lang) {
    if (!heroVideo || !heroVideoSource) return;

    const targetSrc = CONFIG.videoPaths[lang] || CONFIG.videoPaths.es;
    const currentSrc = heroVideoSource.getAttribute("src");

    if (currentSrc === targetSrc) return;

    // Smooth transition
    heroVideo.classList.add("opacity-60");
    setTimeout(() => {
      heroVideoSource.setAttribute("src", targetSrc);
      heroVideo.load();
      const playPromise = heroVideo.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            heroVideo.classList.remove("opacity-60");
          })
          .catch(err => {
            // Autoplay policy or low power mode: keep poster crisp
            console.info("Video autoplay waiting for interaction:", err);
            heroVideo.classList.remove("opacity-60");
          });
      }
    }, 250);
  }

  /**
   * 3. WHATSAPP FLOATING BUTTON & LINKS
   */
  function initWhatsAppLinks() {
    updateWhatsAppMessages(currentLang);
  }

  function updateWhatsAppMessages(lang) {
    const dict = window.I18N_DATA[lang] || window.I18N_DATA.es;
    const message = dict.wa_message || "Hola Jorge, vi la propiedad Kaan-Ha en Tulum Country Club y me gustaría recibir el brochure completo y agendar una llamada privada.";
    const waUrl = `https://wa.me/${CONFIG.jorgePhone}?text=${encodeURIComponent(message)}`;

    if (floatingWaBtn) {
      floatingWaBtn.setAttribute("href", waUrl);
    }

    // Update all .wa-direct-link elements
    document.querySelectorAll(".wa-direct-link").forEach(btn => {
      btn.setAttribute("href", waUrl);
    });

    if (successWaCta) {
      successWaCta.setAttribute("href", waUrl);
    }
  }

  /**
   * 4. GOHIGHLEVEL WEBHOOK & EMAIL LEAD CAPTURE
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
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> Procesando...
      `;

      // Extract form data
      const formData = {
        nombre: document.getElementById("form-name").value.trim(),
        email: document.getElementById("form-email").value.trim(),
        telefono: document.getElementById("form-phone").value.trim(),
        idioma_preferencia: document.getElementById("form-preferred-lang").value,
        objetivo: document.getElementById("form-interest").value,
        mensaje: document.getElementById("form-message").value.trim(),
        notificar_a: CONFIG.secondaryEmail,
        propiedad: "Kaan-Ha Garden Residence (Planta Baja Reventa) - Tulum Country Club",
        fecha: new Date().toISOString(),
        origen_url: window.location.href
      };

      // 1. Save lead in localStorage as reliable backup
      try {
        const storedLeads = JSON.parse(localStorage.getItem("kaan_ha_leads") || "[]");
        storedLeads.push(formData);
        localStorage.setItem("kaan_ha_leads", JSON.stringify(storedLeads));
      } catch (err) {
        console.warn("Storage err:", err);
      }

      // 2. Dispatch to GoHighLevel Webhook
      try {
        await fetch(CONFIG.ghlWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(formData),
          mode: "no-cors" // Allow cross-origin dispatch to webhook receiver
        });
      } catch (err) {
        console.warn("Webhook dispatched with non-blocking status:", err);
      }

      // 3. Prepare secondary mailto notification trigger
      const mailtoSubject = encodeURIComponent(`Nuevo Lead Kaan-Ha: ${formData.nombre} (${formData.idioma_preferencia})`);
      const mailtoBody = encodeURIComponent(
        `Nombre: ${formData.nombre}\nEmail: ${formData.email}\nTeléfono: ${formData.telefono}\nIdioma: ${formData.idioma_preferencia}\nObjetivo: ${formData.objetivo}\nMensaje: ${formData.mensaje}\nFecha: ${formData.fecha}`
      );
      const secondaryMailtoUrl = `mailto:${CONFIG.secondaryEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;
      
      // Store secondary mailto link in window
      window.lastLeadMailto = secondaryMailtoUrl;

      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      leadForm.reset();

      // Show luxury confirmation modal
      if (successModal) {
        successModal.classList.remove("hidden");
        successModal.classList.add("flex");
      }
    });

    if (closeSuccessModal) {
      closeSuccessModal.addEventListener("click", () => {
        successModal.classList.add("hidden");
        successModal.classList.remove("flex");
      });
    }
  }

  /**
   * 5. AI CONCIERGE WIDGET
   */
  function initConcierge() {
    if (!conciergeWidget || !conciergeToggle) return;

    // Toggle chat visibility
    function openConcierge() {
      conciergeWidget.classList.remove("hidden");
      conciergeToggle.classList.add("scale-95");
      if (conciergeMobileOverlay) conciergeMobileOverlay.classList.remove("hidden");
      conciergeInput.focus();
      scrollChatToBottom();
    }

    function closeConcierge() {
      conciergeWidget.classList.add("hidden");
      conciergeToggle.classList.remove("scale-95");
      if (conciergeMobileOverlay) conciergeMobileOverlay.classList.add("hidden");
    }

    conciergeToggle.addEventListener("click", () => {
      if (conciergeWidget.classList.contains("hidden")) {
        openConcierge();
      } else {
        closeConcierge();
      }
    });

    if (conciergeClose) {
      conciergeClose.addEventListener("click", closeConcierge);
    }
    if (conciergeMobileOverlay) {
      conciergeMobileOverlay.addEventListener("click", closeConcierge);
    }

    // Handle form submit
    if (conciergeForm) {
      conciergeForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const userText = conciergeInput.value.trim();
        if (!userText) return;

        // Render user message
        appendChatMessage("user", userText);
        conciergeInput.value = "";

        // Render typing indicator
        const typingId = showTypingIndicator();

        // Query AI Concierge
        try {
          const aiResponse = await window.AI_CONCIERGE.sendMessage(userText, currentLang);
          removeTypingIndicator(typingId);
          appendChatMessage("model", aiResponse, true);
        } catch (err) {
          removeTypingIndicator(typingId);
          appendChatMessage("model", "Disculpe, hubo un breve retraso en la conexión. Por favor permítanos asistirle directamente en WhatsApp con Jorge Sandoval.", false);
        }
      });
    }

    // Bind quick pill clicks
    if (quickPillsContainer) {
      quickPillsContainer.addEventListener("click", (e) => {
        const pill = e.target.closest("button");
        if (!pill) return;
        const query = pill.innerText.trim();
        conciergeInput.value = query;
        conciergeForm.dispatchEvent(new Event("submit"));
      });
    }
  }

  function refreshConciergeGreeting(lang) {
    const dict = window.I18N_DATA[lang] || window.I18N_DATA.es;
    const initialMsgEl = document.getElementById("concierge-initial-msg");
    if (initialMsgEl && dict.ai_greeting) {
      initialMsgEl.innerText = dict.ai_greeting;
    }

    // Update quick pills
    if (quickPillsContainer) {
      quickPillsContainer.innerHTML = `
        <button type="button" class="text-xs px-2.5 py-1 rounded-full bg-deep-jungle/60 hover:bg-matte-gold hover:text-deep-jungle text-arena-chukum border border-matte-gold/30 transition-all text-left whitespace-nowrap">${dict.ai_quick_1}</button>
        <button type="button" class="text-xs px-2.5 py-1 rounded-full bg-deep-jungle/60 hover:bg-matte-gold hover:text-deep-jungle text-arena-chukum border border-matte-gold/30 transition-all text-left whitespace-nowrap">${dict.ai_quick_2}</button>
        <button type="button" class="text-xs px-2.5 py-1 rounded-full bg-deep-jungle/60 hover:bg-matte-gold hover:text-deep-jungle text-arena-chukum border border-matte-gold/30 transition-all text-left whitespace-nowrap">${dict.ai_quick_3}</button>
        <button type="button" class="text-xs px-2.5 py-1 rounded-full bg-deep-jungle/60 hover:bg-matte-gold hover:text-deep-jungle text-arena-chukum border border-matte-gold/30 transition-all text-left whitespace-nowrap">${dict.ai_quick_4}</button>
      `;
    }
  }

  function appendChatMessage(sender, htmlOrText, isHtml = false) {
    if (!conciergeMessages) return;

    const msgWrapper = document.createElement("div");
    msgWrapper.className = sender === "user" 
      ? "flex justify-end mb-3" 
      : "flex justify-start mb-3";

    const bubble = document.createElement("div");
    if (sender === "user") {
      bubble.className = "max-w-[82%] bg-matte-gold text-deep-dark text-sm rounded-2xl rounded-br-xs px-4 py-2.5 shadow-md";
      bubble.textContent = htmlOrText;
    } else {
      bubble.className = "max-w-[85%] bg-deep-jungle/90 border border-matte-gold/30 text-arena-chukum text-sm rounded-2xl rounded-bl-xs px-4 py-3 shadow-lg";
      if (isHtml) {
        bubble.innerHTML = htmlOrText;
      } else {
        bubble.textContent = htmlOrText;
      }
    }

    msgWrapper.appendChild(bubble);
    conciergeMessages.appendChild(msgWrapper);
    scrollChatToBottom();
  }

  function showTypingIndicator() {
    const id = "typing-" + Date.now();
    const typingWrapper = document.createElement("div");
    typingWrapper.id = id;
    typingWrapper.className = "flex justify-start mb-3";
    typingWrapper.innerHTML = `
      <div class="bg-deep-jungle/80 border border-matte-gold/20 rounded-2xl px-4 py-2.5 flex items-center space-x-1.5">
        <span class="w-2 h-2 rounded-full bg-matte-gold typing-dot"></span>
        <span class="w-2 h-2 rounded-full bg-matte-gold typing-dot"></span>
        <span class="w-2 h-2 rounded-full bg-matte-gold typing-dot"></span>
      </div>
    `;
    conciergeMessages.appendChild(typingWrapper);
    scrollChatToBottom();
    return id;
  }

  function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function scrollChatToBottom() {
    if (conciergeMessages) {
      conciergeMessages.scrollTop = conciergeMessages.scrollHeight;
    }
  }

  /**
   * 6. CLOUDPANO 360 TOUR
   */
  function init360Tour() {
    // CloudPano embed script is already declared in HTML
    // We also provide smooth lazy loading and interactive controls
    const tourContainer = document.getElementById("5kEjo0NdT");
    if (tourContainer) {
      // Check if script ran; if not, ensure iframe fallback is loaded gracefully
      setTimeout(() => {
        const iframe = tourContainer.querySelector("iframe");
        if (!iframe) {
          // Fallback iframe for instant 360 viewer
          const fbIframe = document.createElement("iframe");
          fbIframe.src = "https://app.cloudpano.com/tours/5kEjo0NdT";
          fbIframe.width = "100%";
          fbIframe.setAttribute("frameborder", "0");
          fbIframe.setAttribute("allowfullscreen", "true");
          fbIframe.setAttribute("allow", "xr-spatial-tracking; accelerometer; gyroscope");
          fbIframe.className = "w-full h-[380px] sm:h-[460px] md:h-[520px] rounded-xl border border-matte-gold/20 shadow-2xl";
          tourContainer.appendChild(fbIframe);
        }
      }, 2500);
    }
  }

  /**
   * 7. SCROLL EFFECTS & PARALLAX
   */
  function initScrollEffects() {
    // Reveal on scroll using IntersectionObserver
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    reveals.forEach(el => observer.observe(el));

    // Parallax on Hero
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

  /**
   * 8. GALLERY LIGHTBOX
   */
  function initGallery() {
    const galleryItems = document.querySelectorAll(".gallery-card");
    const modal = document.getElementById("gallery-modal");
    const modalImg = document.getElementById("gallery-modal-img");
    const modalClose = document.getElementById("gallery-modal-close");

    if (!modal || !modalImg) return;

    galleryItems.forEach(item => {
      item.addEventListener("click", () => {
        const imgSrc = item.getAttribute("data-full-img");
        if (imgSrc) {
          modalImg.setAttribute("src", imgSrc);
          modal.classList.remove("hidden");
          modal.classList.add("flex");
        }
      });
    });

    if (modalClose) {
      modalClose.addEventListener("click", () => {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
      });
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
      }
    });
  }

})();
