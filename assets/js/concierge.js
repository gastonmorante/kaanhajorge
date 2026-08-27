/**
 * KAAN-HA LUXURY RESIDENCES - AI CONCIERGE AGENT
 * Powered by Gemini API with Offline Quiet Luxury Knowledge Engine
 * Specialized in the Exclusive Ground-Floor Resale Residence (Planta Baja con Jardín y Alberca Privada)
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
      distribucion: "Esta exclusiva residencia en Planta Baja cuenta con 2 recámaras completas con baño en suite y clóset vestidor, estancia de estar y comedor de concepto abierto integrado a la terraza apergolada, cocina equipada con barra de diseñador, amplio jardín privado con paisajismo tropical y su propia alberca plunge pool privada con vistas frontales al campo de golf PGA Riviera Maya.",
      precio: "El precio de esta oportunidad única de reventa en Planta Baja es de $536,000 USD. A diferencia de las compras en pre-construcción donde se debe esperar años de obra, esta propiedad es de ENTREGA INMEDIATA: se encuentra lista para escrituración, posesión inmediata y puesta en operación de renta vacacional desde el primer día.",
      amenidades: "Al ser propietario de esta residencia en Kaan-Ha, usted y sus huéspedes disfrutan de todas las amenidades exclusivas de Tulum Country Club: el campo de golf de campeonato PGA Riviera Maya (18 hoyos de campeonato + 9 ejecutivos diseñados por Robert Trent Jones II), el club de playa privado KAY Beach Club sobre el mar Caribe, centro deportivo de raqueta (tenis, pádel, pickleball), gimnasio de alto rendimiento, spa holístico en la selva, cenotes naturales preservados y seguridad privada 24/7 con doble caseta biométrica.",
      cita: "Con mucho gusto podemos coordinar una visita privada presencial a la residencia o una videollamada guiada con Jorge Sandoval para revisar planos arquitectónicos, títulos de propiedad y proyecciones financieras de rentabilidad.",
      default: "Kaan-Ha Garden Residence es una oportunidad exclusiva de reventa en Planta Baja dentro de Tulum Country Club: 2 recámaras con baño en suite, amplio jardín privado, alberca plunge pool propia, acabados artesanales en Chukum y vistas frontales al campo de golf PGA Riviera Maya. Precio: $536,000 USD con entrega inmediata."
    },
    en: {
      distribucion: "This exclusive Ground-Floor Garden Residence features 2 primary bedrooms with private en-suite spa bathrooms and walk-in closets, an open-concept living and dining salon opening onto the pergola terrace, designer kitchen, expansive private landscaped garden, and an integrated private plunge pool overlooking the greens of the PGA Riviera Maya golf course.",
      precio: "The turnkey resale price for this exclusive Ground-Floor Garden Residence is $536,000 USD. Unlike pre-construction developments that require years of waiting, this is an IMMEDIATE DELIVERY opportunity: fully finished, turnkey, and ready for immediate deed transfer and instant vacation rental yield from day one.",
      amenidades: "Ownership includes full privileges across the premier Tulum Country Club master community: the world-renowned PGA Riviera Maya Golf Course (27 championship holes sculpted by Robert Trent Jones II), private oceanfront KAY Beach Club on the turquoise Caribbean Sea, high-performance racquet sports center (tennis/paddle/pickleball), jungle wellness spa, natural cenotes, and 24/7 gated security with double biometric checkpoints.",
      cita: "We would be delighted to arrange a private on-site tour or a live video walkthrough with Jorge Sandoval to review architectural floor plans, deed paperwork, and rental yield projections.",
      default: "Kaan-Ha Garden Residence is a rare turnkey ground-floor resale opportunity inside Tulum Country Club: 2 primary bedrooms with en-suite bathrooms, private landscaped garden, integrated plunge pool, authentic Mayan Chukum plaster, and direct fairway views of the PGA Riviera Maya golf course for $536,000 USD with immediate delivery."
    },
    fr: {
      distribucion: "Cette résidence exclusive en Rez-de-Jardin comprend 2 chambres principales avec salles de bains spa attenantes et dressings, un vaste séjour lumineux ouvrant sur la terrasse ombragée, une cuisine équipée, un grand jardin privatif paysager et une piscine plunge pool privée avec vue imprenable sur le golf PGA Riviera Maya.",
      precio: "Le prix de cette opportunité exclusive de revente en Rez-de-Jardin est de $536,000 USD. Contrairement aux projets sur plan qui exigent des mois d'attente, il s'agit d'une LIVRAISON IMMÉDIATE : le bien est achevé, clé en main, prêt pour la signature notariée et pour générer des revenus locatifs dès le premier jour.",
      amenidades: "En tant que propriétaire, vous accédez à toutes les infrastructures d'élite du Tulum Country Club : le golf PGA Riviera Maya (27 trous signés Robert Trent Jones II), le club de plage privé KAY Beach Club face aux Caraïbes, le complexe sportif (tennis, padel, pickleball), le spa au cœur de la jungle, des cénotes préservés et une sécurité 24h/24 avec double contrôle d'accès.",
      cita: "C'est avec grand plaisir que nous organisons une visite privée sur place ou une présentation vidéo en direct avec Jorge Sandoval afin d'examiner les plans, le titre de propriété et les projections de rentabilité.",
      default: "Kaan-Ha Garden Residence est une opportunité exclusive de revente en Rez-de-Jardin au sein de Tulum Country Club : 2 chambres en suite, vaste jardin privatif, piscine plunge pool, finitions en Chukum naturel et vues directes sur le golf PGA à $536,000 USD avec livraison immédiate."
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
      const systemInstruction = `You are the Ultra-Luxury AI Concierge for an exclusive Ground-Floor Garden Resale Residence at Kaan-Ha inside Tulum Country Club (Riviera Maya, Mexico).
Your tone is quiet luxury, sophisticated, courteous, discreet, and highly knowledgeable.
Crucial Context:
- This is NOT a generic pre-sale development of 50 units. It is an EXCLUSIVE RESALE OPPORTUNITY for a single, highly desirable GROUND-FLOOR (Planta Baja / Rez-de-Jardin) Garden Residence.
- Price: $536,000 USD.
- Delivery: IMMEDIATE DELIVERY (Entrega Inmediata) / Turnkey. Ready for deed transfer, immediate personal enjoyment, and immediate vacation rental ROI without waiting for construction.
- Level & Features: Ground Floor (Planta Baja) with its own expansive private landscaped garden and private plunge pool (alberca plunge pool privada en jardín).
- Layout: 2 Bedrooms with en-suite bathrooms and walk-in closets, open-concept salon and designer kitchen, pergola terrace, and direct sliding walkout to private garden and pool.
- Views: Direct frontal views to the PGA Riviera Maya Golf Course (27 holes designed by Robert Trent Jones II).
- Finishes: Authentic organic Mayan Chukum plaster, local hardwood, marble bathrooms.
- Master Community Amenities: Private oceanfront KAY Beach Club, PGA Riviera Maya Golf, Sports Center (tennis, paddle, pickleball, gym), Spa, natural cenotes, 24/7 double-gated biometric security.
- Direct Contact / Broker: Jorge Sandoval (+52 1 656 143 6266).
Your Mission:
Answer inquiries with elegance and precise facts in ${lang.toUpperCase()} language. Highlight the unique advantages of Ground-Floor garden living, immediate delivery, private garden & pool, and the luxury amenities of Tulum Country Club. Always invite the client to book a private viewing or chat on WhatsApp with Jorge Sandoval.`;

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
  function getLocalExpertResponse(userText, lang) {
    const q = (userText || "").toLowerCase();
    const db = KNOWLEDGE[lang] || KNOWLEDGE.es;

    let reply = "";
    if (q.includes("distribucion") || q.includes("recamara") || q.includes("bedroom") || q.includes("chambre") || q.includes("planta baja") || q.includes("ground") || q.includes("jardin") || q.includes("garden") || q.includes("alberca") || q.includes("pool")) {
      reply = db.distribucion;
    } else if (q.includes("precio") || q.includes("costo") || q.includes("price") || q.includes("prix") || q.includes("536") || q.includes("entrega") || q.includes("cuanto") || q.includes("reventa") || q.includes("resale")) {
      reply = db.precio;
    } else if (q.includes("golf") || q.includes("beach") || q.includes("playa") || q.includes("pga") || q.includes("amenidad") || q.includes("amenities") || q.includes("kay")) {
      reply = db.amenidades;
    } else if (q.includes("cita") || q.includes("jorge") || q.includes("visita") || q.includes("contacto") || q.includes("llamada") || q.includes("call") || q.includes("tour") || q.includes("agendar")) {
      reply = db.cita;
    } else {
      reply = db.default;
    }

    conversationHistory.push({ role: "model", parts: [{ text: reply }] });
    return formatResponseWithCTA(reply, lang);
  }

  /**
   * Appends luxury WhatsApp direct conversion CTA button
   */
  function formatResponseWithCTA(text, lang) {
    const ctaLabels = {
      es: "Continuar con Jorge Sandoval en WhatsApp",
      en: "Continue with Jorge Sandoval on WhatsApp",
      fr: "Poursuivre avec Jorge Sandoval sur WhatsApp"
    };

    const label = ctaLabels[lang] || ctaLabels.es;
    const defaultMsg = {
      es: "Hola Jorge, estoy conversando con el Concierge de Kaan-Ha sobre la reventa en planta baja y deseo agendar una visita.",
      en: "Hello Jorge, I was chatting with the Kaan-Ha Concierge regarding the ground-floor resale and would like to schedule a private viewing.",
      fr: "Bonjour Jorge, j'échange avec le Concierge Kaan-Ha à propos de la revente en rez-de-jardin et souhaite convenir d'une visite."
    };

    const waText = encodeURIComponent(defaultMsg[lang] || defaultMsg.es);
    const waLink = `https://wa.me/${JORGE_PHONE}?text=${waText}`;

    return `
      <div class="space-y-3">
        <p class="leading-relaxed">${text}</p>
        <div class="pt-2">
          <a href="${waLink}" target="_blank" rel="noopener noreferrer" 
             class="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-full bg-matte-gold text-deep-dark hover:bg-arena-chukum transition-colors shadow-md">
            <svg class="w-3.5 h-3.5 fill-current text-green-800" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z"/></svg>
            <span>${label}</span>
          </a>
        </div>
      </div>
    `;
  }

  function resetHistory() {
    conversationHistory = [];
  }

  return {
    sendMessage,
    resetHistory
  };
})();
