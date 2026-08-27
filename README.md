# Kaan-Ha Luxury Residences | Tulum Country Club
### Landing Page Trilingüe (ES | EN | FR) · "Organic Quiet Luxury"

Landing page de ultra-lujo desarrollada para **Kaan-Ha Residences** en **Tulum Country Club (Bahia Principe Residences)**, optimizada para conversiones de alto valor patrimonial y conectada al ecosistema de ventas de Jorge Sandoval.

---

## 1. Características Principales

- **Estética "Organic Quiet Luxury"**:
  - Paleta auténtica: `arena-chukum` (`#E5D3B3`), `deep-jungle` (`#1B3022`), `matte-gold` (`#A68966`) y contraste en `deep-dark` (`#0D1912`).
  - Tipografías: **EB Garamond** (títulos editoriales) e **Inter** (cuerpo y especificaciones técnicas).
  - Microinteracciones: Reveal on Scroll con `IntersectionObserver`, efecto Parallax en el Hero y paneles Glassmorphism.
- **Motor Multilingüe Instantáneo (ES | EN | FR)**:
  - Selector de idioma en el Header flotante sin recargar la página.
  - Traducción completa de copies de ultra-lujo, amenidades, ficha técnica, formulario y asistente de IA.
  - **Lógica de Video Dinámica**:
    - Si Idioma = **ES**: Reproduce `Kaanha esp.mp4`.
    - Si Idioma = **EN** o **FR**: Reproduce `KaanHa ing.mp4`.
  - **LCP Optimizado**: Precarga prioritaria de la imagen de póster del Hero (`hero-poster.jpg`) con `fetchpriority="high"`, permitiendo una carga perceptual instantánea (< 500ms).
- **Integración de Activos & Embeds**:
  - **Tour Virtual 360° CloudPano**: Inserción oficial del script con código `5kEjo0NdT` y respaldo responsivo.
  - **Imágenes Web-Optimized**: 12 tomas de alta resolución optimizadas a 1920px manteniendo la nitidez de los archivos RAW de 6000px.
  - **Broker Portal**: Enlace seguro en el footer a la carpeta raíz de materiales en Google Drive (`https://drive.google.com/drive/folders/1Iee16levvkNgKNrJGaGQ4NbdVySygIwg?usp=sharing`).
- **Conversión de Ventas**:
  - **WhatsApp Flotante**: Conectado a Jorge Sandoval (`+52 1 656 143 6266`) con mensajes predefinidos y traducidos automáticamente para ES, EN y FR.
  - **Formulario VIP GoHighLevel**:
    - Captura: Nombre, Email, Teléfono (con lada), Idioma de preferencia, Perfil de inversión y Mensaje.
    - Dispara webhook a GoHighLevel (`ghlWebhookUrl` en `assets/js/app.js`).
    - Notificación secundaria configurada para `jorgeasoti@yahoo.com`.
    - Almacenamiento de respaldo en `localStorage`.
    - Modal de confirmación con invitación directa a continuar en WhatsApp.
- **Agente Concierge de IA Kaan-Ha**:
  - Widget flotante interactivo en la esquina inferior izquierda.
  - Integrado con la API Key proporcionada para Google Gemini con prompt de sistema especializado.
  - Motor de respaldo local ultrarrápido con base de conocimiento de Tulum Country Club (PGA Golf, Beach Club, Lock-Off, Alberca Privada, Seguridad 24/7 y Precios desde $536,000 USD).

---

## 2. Estructura de Archivos

```
├── index.html                 # Código fuente principal completo
├── vercel.json                # Configuración de despliegue y caché para Vercel
├── package.json               # Metadatos del proyecto y scripts locales
├── README.md                  # Documentación
├── assets/
│   ├── css/
│   │   └── custom.css         # Estilos quiet luxury, glassmorphism y animaciones
│   ├── js/
│   │   ├── app.js             # Controlador central (video switcher, webhook, UI)
│   │   ├── i18n.js            # Diccionario trilingüe ES, EN, FR
│   │   └── concierge.js       # Agente de IA (Gemini API + motor experto offline)
│   └── images/
│       ├── hero-poster.jpg    # Póster prioritario para LCP (< 200KB)
│       └── gallery-01..12.jpg # Fotografías web-optimised
└── kaanha/
    ├── Videos/                # Videos originales (Kaanha esp.mp4 / KaanHa ing.mp4)
    └── Pictures Exported/     # 44 fotos RAW originales en alta resolución
```

---

## 3. Despliegue en Vercel

1. **Opción A: Vercel CLI (Recomendada)**:
   ```bash
   # En la carpeta del proyecto:
   npx vercel
   ```
2. **Opción B: GitHub + Vercel Dashboard**:
   - Crea un repositorio en GitHub.
   - Sube los archivos del proyecto (excluyendo la carpeta pesada `kaanha/Videos` si supera el límite de 100MB de GitHub; para producción se recomienda alojar los videos en Cloudflare Stream, Vimeo OTT, BunnyCDN o Google Drive Stream).
   - En [vercel.com](https://vercel.com), importa el repositorio y haz clic en **Deploy**. El archivo `vercel.json` configurará automáticamente las cabeceras de compresión y caché.

---

## 4. Personalización del Webhook GoHighLevel

En `assets/js/app.js`, localiza la constante `CONFIG`:
```javascript
const CONFIG = {
  jorgePhone: "5216561436266",
  secondaryEmail: "jorgeasoti@yahoo.com",
  ghlWebhookUrl: "TU_ENDPOINT_DE_GOHIGHLEVEL_AQUI"
};
```
Reemplaza `ghlWebhookUrl` con tu URL de webhook de GoHighLevel (Inbound Webhook en Workflows).
Los campos enviados en el payload JSON son:
- `nombre`: Nombre completo del prospecto.
- `email`: Correo electrónico.
- `telefono`: Teléfono con lada.
- `idioma_preferencia`: "ES", "EN" o "FR".
- `objetivo`: Tipo de interés del comprador.
- `mensaje`: Requerimiento opcional.
- `notificar_a`: "jorgeasoti@yahoo.com".
- `propiedad`: "Kaan-Ha Luxury Residences - Tulum Country Club".
- `fecha`: Timestamp ISO 8601.
