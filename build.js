#!/usr/bin/env node
/**
 * Lunaire Design System — Build Script
 * Regenerates dist/ from tokens/ by fetching fresh data from Figma.
 * Usage: FIGMA_TOKEN=your_token node build.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const FILE_ID = 'jzFagp4bblJKr0u7p9UylJ';
const FIGMA_TOKEN = process.env.FIGMA_TOKEN;

if (!FIGMA_TOKEN) {
  console.error('❌  Set FIGMA_TOKEN environment variable first.');
  process.exit(1);
}

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'X-Figma-Token': FIGMA_TOKEN } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
  });
}

function toHex(c) {
  const r = Math.round(c.r * 255);
  const g = Math.round(c.g * 255);
  const b = Math.round(c.b * 255);
  const a = c.a ?? 1;
  if (a < 1) return `rgba(${r},${g},${b},${Math.round(a * 1000) / 1000})`;
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

function toCssName(s) {
  return '--' + s.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
}

function writeFile(rel, content) {
  const abs = path.join(__dirname, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content);
  console.log(`  ✓ ${rel}`);
}

async function build() {
  console.log('Fetching Figma variables…');
  const varData = await get(`https://api.figma.com/v1/files/${FILE_ID}/variables/local`);
  const meta = varData.meta || {};
  const collections = meta.variableCollections || {};
  const variables = meta.variables || {};

  const modeMap = {};
  Object.values(collections).forEach(col => {
    col.modes.forEach(m => { modeMap[m.modeId] = m.name; });
  });

  const colMap = {};
  Object.entries(collections).forEach(([id, col]) => { colMap[id] = col.name; });

  const colorsByMode = {};
  const paddingTokens = {};

  Object.values(variables).forEach(v => {
    const col = colMap[v.variableCollectionId] || '';
    Object.entries(v.valuesByMode || {}).forEach(([modeId, val]) => {
      const modeName = modeMap[modeId] || modeId;
      if (col === 'AH DS 2.0 Colour Mode') {
        colorsByMode[modeName] = colorsByMode[modeName] || {};
        const resolved = typeof val === 'object' && val?.type === 'VARIABLE_ALIAS'
          ? null : val;
        if (resolved && 'r' in resolved) {
          colorsByMode[modeName][v.name] = toHex(resolved);
        }
      } else if (col === 'Padding') {
        paddingTokens[v.name] = `${val}px`;
      }
    });
  });

  // Write raw tokens
  writeFile('tokens/colors.json', JSON.stringify(colorsByMode, null, 2));
  writeFile('tokens/spacing.json', JSON.stringify(paddingTokens, null, 2));

  // Write CSS
  const lightVars = Object.entries(colorsByMode['Light Mode'] || {})
    .map(([k, v]) => `  ${toCssName(k)}: ${v};`).join('\n');
  const spacingVars = Object.entries(paddingTokens)
    .map(([k, v]) => `  ${toCssName('spacing-' + k)}: ${v};`).join('\n');

  writeFile('dist/css/tokens.css',
    `/* Lunaire DS — Light Mode */\n:root {\n${lightVars}\n\n  /* Spacing */\n${spacingVars}\n}\n`);

  const darkVars = Object.entries(colorsByMode['Dark Mode'] || {})
    .map(([k, v]) => `  ${toCssName(k)}: ${v};`).join('\n');
  writeFile('dist/css/tokens-dark.css',
    `/* Lunaire DS — Dark Mode */\n[data-theme="dark"], .dark {\n${darkVars}\n}\n`);

  console.log('\n✅ Build complete.');
}

build().catch(e => { console.error(e); process.exit(1); });
