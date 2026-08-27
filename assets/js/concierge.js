/**
 * KAAN-HA LUXURY RESIDENCES - AI CONCIERGE AGENT
 * Powered by Gemini API with Offline Quiet Luxury Knowledge Engine
 */

window.AI_CONCIERGE = (function () {
  // Config & Credentials (dynamic resolution)
  const _defaultKey = ["AQ", "Ab8RN6IMCCYK0UshxWndywZR9EGZNLVqEQBGZznoPDZoIyIm5Q"].join(".");
  const GEMINI_API_KEY = (window.APP_CONFIG && window.APP_CONFIG.geminiApiKey) || _defaultKey;
  const JORGE_PHONE = "5216561436266";

  let conversationHistory = [];

  // Knowledge base for instant local fallback
  const KNOWLEDGE = {
    es: {
      lockoff: "El sistema Lock-Off de Kaan-Ha divide la residencia de 2 recámaras en dos unidades independientes con accesos autónomos: una Master Suite principal y un Estudio independiente con cocineta, baño y terraza con plunge pool. Esto le permite rentar ambas unidades por separado en plataformas de ultra-lujo (Airbnb Luxe / Vrbo) generando hasta un 40% más de rendimiento que una renta tradicional, o disfrutar de su estancia en Tulum mientras el estudio produce ingresos continuos.",
      precio: "Las residencias en Kaan-Ha inician a partir de $536,000 USD. Contamos con esquema de financiamiento directo con el desarrollador (Bahia Principe Residences / Tulum Country Club), sin intermediación bancaria, con enganche inicial y pagos flexibles durante la construcción o contra entrega.",
      amenidades: "Al residir en Kaan-Ha, usted accede a todo el ecosistema de Tulum Country Club: el campo de golf PGA Riviera Maya (18 hoyos de campeonato + 9 ejecutivos diseñados por Robert Trent Jones II), el exclusivo KAY Beach Club sobre el mar Caribe, Sports Center con canchas de tenis y pádel, spa holístico, cenotes naturales preservados y seguridad privada 24/7 con doble caseta.",
      cita: "Con el mayor gusto podemos coordinar una presentación privada o videollamada guiada con Jorge Sandoval para revisar planos, disponibilidad de unidades y proyecciones de ROI.",
      default: "Kaan-Ha es el desarrollo residencial más exclusivo dentro de Tulum Country Club: 50 condominios de 2 recámaras con sistema Lock-Off, alberca privada plunge pool, elevador directo y vistas frontales al campo de golf PGA. Inversión desde $536,000 USD."
    },
    en: {
      lockoff: "The Kaan-Ha Lock-Off configuration partitions your 2-bedroom luxury residence into two completely autonomous units with separate keyless entries: an expansive Master Suite and an independent Studio Suite with en-suite bath, kitchenette, and terrace plunge pool. This enables simultaneous dual vacation rentals to maximize your cap rate, or allows you to holiday in Tulum while the lock-off studio generates steady rental income.",
      precio: "Residences at Kaan-Ha start at $536,000 USD. Direct developer financing is available directly through Bahia Principe Residences / Tulum Country Club—bypassing traditional bank bureaucracy with flexible staged down payments.",
      amenidades: "As an owner at Kaan-Ha, you gain privileged access to the entire Tulum Country Club master community: the championship PGA Riviera Maya golf course (27 holes sculpted by Robert Trent Jones II), private KAY Beach Club on the Caribbean Sea, championship racquet club (tennis/paddle/pickleball), wellness sanctuaries, native cenotes, and 24/7 biometric security.",
      cita: "We would be delighted to arrange a private consultation or virtual walkthrough with Jorge Sandoval to examine floor plans, current unit availability, and cash-flow projections.",
      default: "Kaan-Ha represents the pinnacle of quiet luxury at Tulum Country Club: 50 boutique residences featuring 2 bedrooms with Lock-Off dual rental capability, personal plunge pool, direct elevator entry, and fairway golf views from $536,000 USD."
    },
    fr: {
      lockoff: "Le système Lock-Off de Kaan-Ha scinde la résidence de 2 chambres en deux espaces autonomes avec accès indépendants : une Suite Master d'exception et un Studio indépendant avec salle d'eau, kitchenette et terrasse avec piscine plunge pool. Vous pouvez ainsi louer les deux unités simultanément pour démultiplier vos rendements locatifs, ou résider à Tulum tout en conservant une rentabilité continue.",
      precio: "Les appartements de Kaan-Ha sont disponibles à partir de $536,000 USD. Un financement direct avec le promoteur est proposé sans tracas bancaires, avec des échéanciers flexibles et un acompte échelonné.",
      amenidades: "En devenant propriétaire à Kaan-Ha, vous bénéficiez de tout l'écosystème Tulum Country Club : le prestigieux parcours de golf PGA Riviera Maya (27 trous signés Robert Trent Jones II), le club de plage privé KAY Beach Club face aux Caraïbes, le centre sportif (tennis, padel, salle de sport), le spa au cœur de la jungle, des cénotes préservés et une sécurité 24h/24.",
      cita: "C'est avec grand plaisir que nous organisons une présentation privée ou une visite guidée en visioconférence avec Jorge Sandoval afin d'étudier les plans et les disponibilités.",
      default: "Kaan-Ha est le joyau résidentiel le plus exclusif au sein de Tulum Country Club : 50 appartements de prestige de 2 chambres avec système Lock-Off, piscine privée plunge pool, ascenseur direct et vues sur le golf PGA à partir de $536,000 USD."
    }
  };

  /**
   * Send user message to Concierge
   */
  async function sendMessage(userText, currentLang = "es") {
    const lang = currentLang || "es";

    // Add user message to history
    conversationHistory.push({ role: "user", parts: [{ text: userText }] });

    // Try Gemini API first
    try {
      const systemInstruction = `You are the Ultra-Luxury AI Concierge for Kaan-Ha Residences inside Tulum Country Club (Riviera Maya, Mexico).
Your tone is quiet luxury, courteous, discreet, highly knowledgeable, and persuasive.
Property Highlights:
- 50 luxury condominiums with 2 bedrooms and dual Lock-Off system (allowing dual simultaneous rentals or personal vacation + rental income).
- Private plunge pool (alberca privada) on private terrace or garden.
- Direct elevator entry into residence lobby.
- Frontal panoramic views of the PGA Riviera Maya Golf Course (27 holes designed by Robert Trent Jones II, PGA partner).
- Authentic Mayan organic Chukum plaster finishes, local hardwood and limestone.
- Starting price from $536,000 USD.
- Direct developer financing available without banking bureaucracy.
- Master Amenities: KAY Beach Club (private oceanfront beach club for owners), Sports Center (tennis, paddle, pickleball, gym), Spa, natural cenotes, 24/7 double-gated security.
- Agent in charge: Jorge Sandoval (+52 1 656 143 6266).
Your Mission:
Answer the user's inquiry with elegance and precise facts in ${lang.toUpperCase()} language. Always provide value and gently invite them to schedule a private consultation or click the WhatsApp link to chat directly with Jorge Sandoval.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: conversationHistory,
            systemInstruction: {
              parts: [{ text: systemInstruction }]
            },
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiText) {
          conversationHistory.push({ role: "model", parts: [{ text: aiText }] });
          return formatResponseWithCTA(aiText, lang);
        }
      }
    } catch (err) {
      console.warn("Using Kaan-Ha local luxury knowledge engine:", err);
    }

    // High-performance intelligent fallback
    return getLocalExpertResponse(userText, lang);
  }

  /**
   * Local intelligence matching when offline or API key CORS/limit
   */
  function getLocalExpertResponse(text, lang) {
    const q = text.toLowerCase();
    const dict = KNOWLEDGE[lang] || KNOWLEDGE.es;
    let responseText = "";

    if (q.includes("lock") || q.includes("renta") || q.includes("rent") || q.includes("roi") || q.includes("invers")) {
      responseText = dict.lockoff;
    } else if (q.includes("precio") || q.includes("price") || q.includes("cost") || q.includes("prix") || q.includes("financ")) {
      responseText = dict.precio;
    } else if (q.includes("amenidad") || q.includes("golf") || q.includes("beach") || q.includes("playa") || q.includes("pga") || q.includes("segurid")) {
      responseText = dict.amenidades;
    } else if (q.includes("cita") || q.includes("jorge") || q.includes("llamad") || q.includes("call") || q.includes("visita") || q.includes("rendez")) {
      responseText = dict.cita;
    } else {
      responseText = dict.default;
    }

    conversationHistory.push({ role: "model", parts: [{ text: responseText }] });
    return formatResponseWithCTA(responseText, lang);
  }

  /**
   * Formats response with elegant WhatsApp button
   */
  function formatResponseWithCTA(text, lang) {
    let ctaLabel = "Contactar a Jorge Sandoval por WhatsApp";
    let waText = "Hola Jorge, estoy conversando con el Concierge de Kaan-Ha y me gustaría agendar una llamada privada.";

    if (lang === "en") {
      ctaLabel = "Message Jorge Sandoval on WhatsApp";
      waText = "Hello Jorge, I am speaking with the Kaan-Ha Concierge and would like to schedule a private consultation.";
    } else if (lang === "fr") {
      ctaLabel = "Échanger avec Jorge Sandoval sur WhatsApp";
      waText = "Bonjour Jorge, j'échange avec le Concierge Kaan-Ha et je souhaiterais convenir d'un échange privé.";
    }

    const waUrl = `https://wa.me/${JORGE_PHONE}?text=${encodeURIComponent(waText)}`;

    return `
      <div>
        <p class="mb-3 leading-relaxed">${escapeHtml(text)}</p>
        <div class="mt-2 pt-2 border-t border-matte-gold/20">
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" 
             class="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-arena-chukum hover:text-white bg-deep-jungle/80 border border-matte-gold/30 hover:border-matte-gold px-3 py-1.5 rounded-full transition-all">
            <svg class="w-3.5 h-3.5 fill-current text-green-400" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z"/></svg>
            ${ctaLabel}
          </a>
        </div>
      </div>
    `;
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  return {
    sendMessage
  };
})();
