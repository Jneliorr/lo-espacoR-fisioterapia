// Verificação do projeto estático, sem instalar dependências.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const pages = ['index.html', 'privacidade.html'];
let resources = 0;
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  if (new Set(ids).size !== ids.length) errors.push(`${page}: IDs repetidos`);
  if ((html.match(/<h1\b/g) || []).length !== 1) errors.push(`${page}: deve conter exatamente um h1`);
  if (!html.includes('lang="pt-BR"')) errors.push(`${page}: idioma ausente`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]*)"/g)) {
    const ref = match[1];
    if (!ref) { errors.push(`${page}: URL vazia`); continue; }
    if (/^(?:https?:|data:|mailto:|tel:)/.test(ref)) {
      if (ref.startsWith('http:')) errors.push(`${page}: recurso sem HTTPS: ${ref}`);
      continue;
    }
    const [filename, fragment] = ref.split('#');
    const target = filename || page;
    const absolute = path.resolve(root, target);
    if (!absolute.startsWith(root + path.sep) || !fs.existsSync(absolute)) {
      errors.push(`${page}: arquivo não encontrado: ${ref}`);
      continue;
    }
    resources++;
    if (fragment) {
      const contents = filename ? fs.readFileSync(absolute, 'utf8') : html;
      if (!contents.includes(`id="${fragment}"`)) errors.push(`${page}: âncora não encontrada: ${ref}`);
    }
  }
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="[^"]*"/.test(match[0])) errors.push(`${page}: imagem sem descrição`);
    if (!/\bwidth="\d+"/.test(match[0]) || !/\bheight="\d+"/.test(match[0])) errors.push(`${page}: imagem sem dimensões`);
  }
  for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    if (!/\brel="[^"]*noopener/.test(match[0])) errors.push(`${page}: link externo sem noopener`);
  }
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(match[1]); } catch { errors.push(`${page}: dados estruturados inválidos`); }
  }
}
for (const name of fs.readdirSync(path.join(root, 'js'))) {
  if (!name.endsWith('.js')) continue;
  try { new vm.Script(fs.readFileSync(path.join(root, 'js', name), 'utf8'), { filename: name }); }
  catch (error) { errors.push(`${name}: ${error.message}`); }
}
const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync(path.join(root, 'js/config.js'), 'utf8'), context);
const config = context.window.SPACE_R_CONFIG;
assert.match(config.whatsapp, /^55\d{10,11}$/);
assert.equal(new URL(config.instagram).hostname, 'www.instagram.com');
assert.equal(config.maps, 'https://maps.app.goo.gl/UWZRt281mYaTSqfA6');
assert.equal(config.tour360, '', 'Sem tour oficial verificado: preserve o bloco oculto.');
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`OK: ${pages.length} páginas, ${resources} referências locais e ${fs.readdirSync(path.join(root, 'js')).length} scripts. Links internos, metadados, imagens e configuração válidos.`);
