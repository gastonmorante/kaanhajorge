/**
 * KAAN-HA LUXURY RESIDENCES - AI CONCIERGE AGENT
 * Powered by Gemini API with Offline Quiet Luxury Knowledge Engine
 * Specialized in the Exclusive Ground-Floor Resale Residence (Planta Baja con Terraza Privada hacia Garden y Albercas)
 */

window.AI_CONCIERGE = (function () {
  const _defaultKey = ["AQ", "Ab8RN6IMCCYK0UshxWndywZR9EGZNLVqEQBGZznoPDZoIyIm5Q"].join(".");
  const GEMINI_API_KEY = (window.APP_CONFIG && window.APP_CONFIG.geminiApiKey) || _defaultKey;
  const WA_PHONE = "5216561436266";

  let conversationHistory = [];

  // Multilingual Knowledge Base for Ground-Floor Resale
  const KNOWLEDGE = {
    es: {
      distribucion: "Esta exclusiva residencia en Planta Baja cuenta con 2 recámaras completas con baño spa y clóset vestidor, estancia y comedor integrados con canceles corredizos a su amplia terraza privada, cocina de diseñador con isla central, y acceso directo desde la terraza hacia las áreas garden y albercas del proyecto, con vistas despejadas al campo de golf PGA Riviera Maya.",
      precio: "El precio de esta oportunidad única de reventa en Planta Baja es de $536,000 USD. A diferencia de las pre-ventas con años de espera, esta propiedad es de ENTREGA INMEDIATA: se encuentra lista para escrituración notarial, posesión inmediata y puesta en operación de renta vacacional desde el primer día.",
      terraza: "La amplia terraza privada en Planta Baja es uno de los mayores atractivos de esta residencia: cuenta con alberca plunge privada integrada, área de estar exterior y salida directa hacia las albercas comunes y áreas ajardinadas del proyecto, con vistas privilegiadas hacia el campo de golf.",
      amenidades: "Al ser propietario en Kaan-Ha, usted y sus huéspedes disfrutan de todas las amenidades exclusivas de Tulum Country Club: el campo de golf de campeonato PGA Riviera Maya (27 hoyos diseñados por Robert Trent Jones II), el club de playa privado KAY Beach Club sobre el mar Caribe, centro deportivo de raqueta (tenis, pádel, pickleball), gimnasio de alto rendimiento, spa holístico en la selva, cenotes naturales preservados y seguridad privada 24/7 con doble caseta biométrica.",
      lockoff: "La residencia cuenta con sistema Lock-Off arquitectónico con accesos independientes, permitiendo operarla como una villa unificada de 2 recámaras o dividirla en dos suites autónomas para renta vacacional simultánea, optimizando drásticamente el flujo de ingresos.",
      acabados: "Los acabados de Kaan-Ha integran muros de piedra maya natural de la región, carpintería fina en maderas tropicales autóctonas, cubiertas de cuarzo y granito en cocina, y baños de lujo en mármol con cancelería de cristal templado, garantizando confort térmico y elegancia atemporal.",
      cita: "Con mucho gusto podemos coordinar una visita privada presencial a la residencia o una videollamada guiada con un asesor especializado para revisar planos arquitectónicos, títulos de propiedad y proyecciones de rentabilidad.",
      default: "Kaan-Ha Residence es una oportunidad exclusiva de reventa en Planta Baja dentro de Tulum Country Club: 2 recámaras con baño spa, amplia terraza privada con salida directa a la zona garden y albercas del proyecto, finos acabados en piedra maya y maderas tropicales, y vistas al campo de golf PGA Riviera Maya. Precio: $536,000 USD con entrega inmediata."
    },
    en: {
      distribucion: "This exclusive Ground-Floor residence features 2 primary suites with en-suite spa bathrooms and walk-in closets, fluid living and dining salon with floor-to-ceiling glass sliding onto an expansive private terrace, and direct walkout from the terrace to the project's garden grounds and swimming pools, with fairway views of the PGA Riviera Maya golf course.",
      precio: "The turnkey resale price for this exclusive Ground-Floor Garden Residence is $536,000 USD. Unlike pre-construction developments that require years of waiting, this is an IMMEDIATE DELIVERY opportunity: fully finished, turnkey, and ready for immediate deed transfer and instant vacation rental yield from day one.",
      terraza: "The private ground-floor terrace is one of the residence's standout highlights: it features an integrated private plunge pool, shaded outdoor lounge space, and direct walkout access to the resort pools and gardens, overlooking the PGA Riviera Maya golf course.",
      amenidades: "Ownership includes full privileges across the premier Tulum Country Club master community: the world-renowned PGA Riviera Maya Golf Course (27 championship holes sculpted by Robert Trent Jones II), private oceanfront KAY Beach Club on the turquoise Caribbean Sea, high-performance racquet sports center (tennis/paddle/pickleball), jungle wellness spa, natural cenotes, and 24/7 gated security with double biometric checkpoints.",
      lockoff: "The residence incorporates a Lock-Off architectural layout with dual private entries, allowing you to enjoy the full 2-bedroom home or split it into two autonomous rental suites, maximizing occupancy and high-yield vacation rental returns.",
      acabados: "Kaan-Ha's finishes feature authentic regional Mayan stone walls, custom cabinetry in noble tropical hardwoods, quartz and granite kitchen surfaces, and luxury marble bathrooms with tempered glass enclosures for enduring elegance and thermal coolness.",
      cita: "We would be delighted to arrange a private on-site tour or a live video walkthrough with a dedicated advisor to review architectural floor plans, deed paperwork, and rental yield projections.",
      default: "Kaan-Ha Residence is a rare turnkey ground-floor resale opportunity inside Tulum Country Club: 2 primary suites with en-suite bathrooms, expansive private terrace opening directly to the resort's garden grounds and swimming pools, fine native hardwoods and Mayan stone, and fairway views of the PGA Riviera Maya golf course for $536,000 USD with immediate delivery."
    },
    fr: {
      distribucion: "Cette résidence d'exception en Rez-de-Chaussée comprend 2 chambres principales avec salles de bains spa attenantes et dressings, un vaste séjour lumineux ouvrant sur une grande terrasse privative, avec accès direct depuis la terrasse vers les espaces garden et les piscines du domaine, et vues imprenables sur le golf PGA Riviera Maya.",
      precio: "Le prix de cette opportunité exclusive de revente en Rez-de-Chaussée est de $536,000 USD. Contrairement aux projets sur plan qui exigent des mois d'attente, il s'agit d'une LIVRAISON IMMÉDIATE : le bien est achevé, clé en main, prêt pour la signature notariée et pour générer des revenus locatifs dès le premier jour.",
      terraza: "La vaste terrasse privée en rez-de-chaussée est l'un des points forts de la résidence : elle dispose d'une piscine plunge privative, d'un espace lounge extérieur et d'un accès direct de plain-pied aux piscines et jardins paysagers du domaine, face au golf PGA.",
      amenidades: "En tant que propriétaire, vous accédez à toutes les infrastructures d'élite du Tulum Country Club : le golf PGA Riviera Maya (27 trous signés Robert Trent Jones II), le club de plage privé KAY Beach Club face aux Caraïbes, le complexe sportif (tennis, padel, pickleball), le spa au cœur de la jungle, des cénotes préservés et une sécurité 24h/24 avec double contrôle d'accès.",
      lockoff: "La propriété bénéficie d'une conception Lock-Off à double accès indépendant, permettant de l'occuper dans sa totalité ou de la diviser en deux suites locatives autonomes pour maximiser la rentabilité saisonnière.",
      acabados: "Les finitions de Kaan-Ha associent pierre maya régionale taillée, boiseries en essences tropicales précieuses, plans de travail en quartz et granito, et salles de bains en marbre avec parois en verre trempé.",
      cita: "C'est avec grand plaisir que nous organisons une visite privée sur place ou une présentation vidéo en direct avec un conseiller spécialisé afin d'examiner les plans, le titre de propriété et les projections de rentabilité.",
      default: "Kaan-Ha Residence est une opportunité exclusive de revente en Rez-de-Chaussée au sein de Tulum Country Club : 2 chambres en suite, vaste terrasse privée ouvrant sur les espaces garden et piscines du complexe, finitions soignées en pierre maya et bois précieux, à $536,000 USD avec livraison immédiate."
    }
  };

  /**
   * Send user message to Concierge
   */
  async function sendMessage(userText, currentLang = "es") {
    const lang = currentLang || "es";
    conversationHistory.push({ role: "user", parts: [{ text: userText }] });

    // Try Gemini API
    try {
      const systemInstruction = `You are the Ultra-Luxury AI Concierge for an exclusive Ground-Floor Resale Residence at Kaan-Ha inside Tulum Country Club (Riviera Maya, Mexico).
Tone: Quiet luxury, sophisticated, courteous, concise, and highly knowledgeable.
Key Facts:
- Ground-Floor (Planta Baja) Resale Residence with private terrace that opens directly to the resort garden grounds and swimming pools.
- Price: $536,000 USD.
- Delivery: Immediate Delivery (Entrega Inmediata) / Turnkey. Ready for deed transfer and rental operation.
- Layout: 2 Bedrooms with en-suite bathrooms and walk-in closets, Lock-Off capability for dual rental income.
- Terrace: Spacious private terrace with private plunge pool and direct walkout to common pools and gardens.
- Finishes: Native Mayan stone walls, noble tropical hardwoods, quartz kitchen, marble bathrooms.
- Community: Tulum Country Club, 27-hole PGA Riviera Maya Golf Course, KAY Beach Club, 24/7 gated security.
- Contact / Advisor Phone: +52 1 656 143 6266.
Answer in ${lang.toUpperCase()} with elegance and precision. Always highlight the ground-floor terrace with pool access and immediate delivery.`;

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
              maxOutputTokens: 350
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
   * Local intelligence matching
   */
  function getLocalExpertResponse(userText, lang) {
    const q = (userText || "").toLowerCase();
    const db = KNOWLEDGE[lang] || KNOWLEDGE.es;

    let reply = "";
    if (q.includes("terraza") || q.includes("terrace") || q.includes("terrasse") || q.includes("plunge") || q.includes("balcon") || q.includes("exterior")) {
      reply = db.terraza;
    } else if (q.includes("lock") || q.includes("renta") || q.includes("rental") || q.includes("locati") || q.includes("roi") || q.includes("inversion") || q.includes("invest") || q.includes("rendimiento") || q.includes("rentabilite")) {
      reply = db.lockoff;
    } else if (q.includes("acabado") || q.includes("material") || q.includes("marmol") || q.includes("finish") || q.includes("finition") || q.includes("materiau") || q.includes("piedra") || q.includes("pierre") || q.includes("stone")) {
      reply = db.acabados;
    } else if (q.includes("distribucion") || q.includes("layout") || q.includes("plan") || q.includes("recamara") || q.includes("bedroom") || q.includes("chambre") || q.includes("planta baja") || q.includes("ground") || q.includes("rez-de-chaussee") || q.includes("jardin") || q.includes("garden") || q.includes("alberca") || q.includes("pool") || q.includes("piscine")) {
      reply = db.distribucion;
    } else if (q.includes("precio") || q.includes("costo") || q.includes("price") || q.includes("prix") || q.includes("536") || q.includes("entrega") || q.includes("delivery") || q.includes("livraison") || q.includes("cuanto") || q.includes("cuánto") || q.includes("how much") || q.includes("combien") || q.includes("reventa") || q.includes("resale") || q.includes("revente")) {
      reply = db.precio;
    } else if (q.includes("golf") || q.includes("beach") || q.includes("playa") || q.includes("plage") || q.includes("pga") || q.includes("amenidad") || q.includes("amenities") || q.includes("amenite") || q.includes("kay") || q.includes("seguridad") || q.includes("security") || q.includes("securite") || q.includes("club")) {
      reply = db.amenidades;
    } else if (q.includes("cita") || q.includes("visita") || q.includes("visite") || q.includes("viewing") || q.includes("appointment") || q.includes("rdv") || q.includes("contacto") || q.includes("contact") || q.includes("llamada") || q.includes("call") || q.includes("tour") || q.includes("agendar") || q.includes("book") || q.includes("asesor") || q.includes("advisor") || q.includes("conseiller")) {
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
      es: "Continuar en WhatsApp con un Asesor VIP",
      en: "Continue on WhatsApp with a VIP Advisor",
      fr: "Poursuivre sur WhatsApp avec un Conseiller VIP"
    };

    const label = ctaLabels[lang] || ctaLabels.es;
    const defaultMsg = {
      es: "Hola, estoy conversando con el Concierge de Kaan-Ha sobre la reventa en planta baja y deseo agendar una visita.",
      en: "Hello, I was chatting with the Kaan-Ha Concierge regarding the ground-floor resale and would like to schedule a private viewing.",
      fr: "Bonjour, j'échange avec le Concierge Kaan-Ha à propos de la revente en rez-de-jardin et souhaite convenir d'une visite."
    };

    const waText = encodeURIComponent(defaultMsg[lang] || defaultMsg.es);
    const waLink = `https://wa.me/${WA_PHONE}?text=${waText}`;

    return `
      <div class="space-y-3">
        <p class="leading-relaxed text-xs sm:text-sm">${text}</p>
        <div class="pt-1">
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

  const instance = {
    sendMessage,
    query: sendMessage,
    resetHistory
  };

  window.KaanHaConcierge = instance;
  return instance;
})();
