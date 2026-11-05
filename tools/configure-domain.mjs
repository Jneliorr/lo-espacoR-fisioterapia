// Uso: node tools/configure-domain.mjs https://dominio-confirmado.com.br
// Gera canonical, Open Graph absoluto, sitemap e robots sem inventar um domínio.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const input = process.argv[2];
if (!input) throw new Error('Informe o domínio HTTPS de produção confirmado.');
const parsed = new URL(input);
if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.search || parsed.hash) throw new Error('Use uma URL HTTPS de produção, sem credenciais, parâmetros ou fragmentos.');
const base = parsed.href.replace(/\/$/, '');
for (const [filename, suffix] of [['index.html', '/'], ['privacidade.html', '/privacidade.html']]) {
  const absolute = path.join(root, filename);
  let html = fs.readFileSync(absolute, 'utf8').replace(/\s*<link rel="canonical"[^>]*>/g, '').replace(/\s*<meta property="og:(?:url|image)"[^>]*>/g, '');
  const metadata = `\n  <link rel="canonical" href="${base}${suffix}">\n  <meta property="og:url" content="${base}${suffix}">\n  <meta property="og:image" content="${base}/assets/images/clinica-4.jpg">\n`;
  html = html.replace('</head>', `${metadata}</head>`);
  fs.writeFileSync(absolute, html);
}
const xmlEscape = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
fs.writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${xmlEscape(base)}/</loc></url><url><loc>${xmlEscape(base)}/privacidade.html</loc></url></urlset>\n`);
fs.writeFileSync(path.join(root, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);
const configPath = path.join(root, 'js/config.js');
fs.writeFileSync(configPath, fs.readFileSync(configPath, 'utf8').replace(/siteUrl:\s*(['"])[^'"]*\1/, `siteUrl: ${JSON.stringify(base)}`));
console.log(`Domínio configurado: ${base}. Execute node tools/verify.mjs antes de publicar.`);
