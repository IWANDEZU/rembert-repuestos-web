const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'public', 'logos', 'autos');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const svgs = {
  'toyota.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 130" fill="#EB0A1E">
  <path d="M100 8C44.8 8 0 35.8 0 70c0 34.2 44.8 62 100 62s100-27.8 100-62C200 35.8 155.2 8 100 8zm0 10.5c48.5 0 88 23.3 88 51.5 0 28.3-39.5 51.5-88 51.5-48.6 0-88-23.2-88-51.5 0-28.2 39.4-51.5 88-51.5zm0 12.3c-23.7 0-43.2 17.5-43.2 39.2 0 21.6 19.5 39.2 43.2 39.2 23.6 0 43.2-17.6 43.2-39.2 0-21.7-19.6-39.2-43.2-39.2zm0 8.5c17.5 0 32.2 13.8 32.2 30.7 0 16.9-14.7 30.7-32.2 30.7-17.6 0-32.3-13.8-32.3-30.7 0-16.9 14.7-30.7 32.3-30.7z"/>
  <path d="M100 40c-15.5 0-28 8.5-28 19 0 9.8 11.2 17.8 25.5 18.8V110h5V77.8c14.3-1 25.5-9 25.5-18.8 0-10.5-12.5-19-28-19zm0 6c11.5 0 21 5.8 21 13 0 7.1-9.5 13-21 13s-21-5.9-21-13c0-7.2 9.5-13 21-13z"/>
</svg>`,

  'renault.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 200" fill="#000000">
  <path d="M80 0 L160 100 L80 200 L0 100 Z M80 32 L25 100 L80 168 L135 100 Z" fill-rule="evenodd"/>
  <path d="M80 50 L120 100 L80 150 L40 100 Z" fill="#ffffff"/>
  <path d="M80 65 L108 100 L80 135 L52 100 Z" fill="#000000"/>
</svg>`,

  'chevrolet.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 110">
  <defs>
    <linearGradient id="goldChevy" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFD700"/>
      <stop offset="50%" stop-color="#DAA520"/>
      <stop offset="100%" stop-color="#B8860B"/>
    </linearGradient>
  </defs>
  <path d="M30 35 L115 35 L105 0 L195 0 L185 35 L270 35 L255 75 L175 75 L165 110 L75 110 L85 75 L15 75 Z" fill="#C0C0C0" stroke="#333" stroke-width="3"/>
  <path d="M37 40 L118 40 L110 8 L190 8 L182 40 L263 40 L250 70 L172 70 L162 102 L82 102 L90 70 L24 70 Z" fill="url(#goldChevy)"/>
</svg>`,

  'mazda.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" fill="#111111">
  <path d="M100 0 C45 0 0 35 0 80 C0 125 45 160 100 160 C155 160 200 125 200 80 C200 35 155 0 100 0 Z M100 15 C147 15 185 44 185 80 C185 116 147 145 100 145 C53 145 15 116 15 80 C15 44 53 15 100 15 Z"/>
  <path d="M100 95 C120 70 155 55 170 50 C145 80 125 115 100 125 C75 115 55 80 30 50 C45 55 80 70 100 95 Z" fill="#111111"/>
</svg>`,

  'kia.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" fill="#05141F">
  <path d="M15 15 L35 15 L35 40 L65 15 L90 15 L55 45 L90 75 L65 75 L35 48 L35 75 L15 75 Z M100 15 L120 15 L120 75 L100 75 Z M130 75 L155 15 L180 75 L160 75 L155 58 L142 58 L142 42 L155 42 L155 35 L145 60 L138 75 Z"/>
</svg>`,

  'nissan.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 170" fill="#C0C0C0">
  <circle cx="100" cy="85" r="75" fill="none" stroke="#111" stroke-width="14"/>
  <rect x="10" y="65" width="180" height="40" rx="4" fill="#111"/>
  <text x="100" y="92" font-family="Arial, sans-serif" font-weight="900" font-size="24" fill="#ffffff" text-anchor="middle" letter-spacing="4">NISSAN</text>
</svg>`,

  'ford.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 120">
  <ellipse cx="110" cy="60" rx="105" ry="55" fill="#003478" stroke="#ffffff" stroke-width="5"/>
  <ellipse cx="110" cy="60" rx="98" ry="48" fill="none" stroke="#ffffff" stroke-width="2"/>
  <text x="110" y="78" font-family="'Brush Script MT', 'Lucida Calligraphy', cursive, sans-serif" font-style="italic" font-weight="bold" font-size="56" fill="#ffffff" text-anchor="middle">Ford</text>
</svg>`,

  'hyundai.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 130">
  <ellipse cx="110" cy="65" rx="100" ry="55" fill="none" stroke="#002C6C" stroke-width="12"/>
  <path d="M65 30 L85 30 L95 100 L75 100 Z M135 30 L155 30 L145 100 L125 100 Z M80 60 L140 60 L138 72 L78 72 Z" fill="#002C6C"/>
</svg>`,

  'volkswagen.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
  <circle cx="80" cy="80" r="75" fill="#001E50" stroke="#001E50" stroke-width="4"/>
  <circle cx="80" cy="80" r="68" fill="none" stroke="#ffffff" stroke-width="5"/>
  <path d="M45 42 L65 105 L80 58 L95 105 L115 42 L103 42 L91 85 L80 48 L69 85 L57 42 Z" fill="#ffffff"/>
  <path d="M52 118 L70 65 L80 100 L90 65 L108 118 L96 118 L86 85 L80 108 L74 85 L64 118 Z" fill="#ffffff"/>
</svg>`,

  'suzuki.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" fill="#E30613">
  <path d="M140 30 L60 30 L30 65 L110 65 L40 130 L120 130 L150 95 L70 95 Z"/>
</svg>`
};

for (const [filename, content] of Object.entries(svgs)) {
  fs.writeFileSync(path.join(targetDir, filename), content.trim(), 'utf8');
  console.log('Created', filename);
}
