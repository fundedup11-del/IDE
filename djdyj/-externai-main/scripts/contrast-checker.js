#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function luminance(r, g, b) {
  const [R, G, B] = [r, g, b].map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(hex1, hex2) {
  try {
    const [r1, g1, b1] = hexToRgb(hex1);
    const [r2, g2, b2] = hexToRgb(hex2);
    const L1 = luminance(r1, g1, b1);
    const L2 = luminance(r2, g2, b2);
    const lighter = Math.max(L1, L2);
    const darker = Math.min(L1, L2);
    return (lighter + 0.05) / (darker + 0.05);
  } catch (e) {
    return null;
  }
}

function parseCssVariables(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const vars = {};
  const regex = /--([a-zA-Z0-9-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = regex.exec(content))) {
    vars[`--${m[1]}`] = m[2].trim();
  }
  return vars;
}

function resolveColor(value, vars) {
  if (!value) return null;
  value = value.trim();
  if (value.startsWith('var(')) {
    const inner = value.match(/var\((--[a-zA-Z0-9-]+)\)/);
    if (inner && vars[inner[1]]) return resolveColor(vars[inner[1]], vars);
    return null;
  }
  // Only support hex values for now
  const hexMatch = value.match(/#([0-9a-fA-F]{3,6})/);
  return hexMatch ? (hexMatch[0].length === 4 ? hexMatch[0].split('').map((c,i)=> i>0? c+c: c).join('') : hexMatch[0]) : null;
}

function run() {
  const cssPath = path.join(__dirname, '..', 'src', 'app', 'globals.css');
  if (!fs.existsSync(cssPath)) {
    console.error('globals.css not found at', cssPath);
    process.exit(1);
  }

  const vars = parseCssVariables(cssPath);
  const pairs = [
    ['--text-default', '--surface-foreground'],
    ['--text-default', '--surface-muted'],
    ['--primary-foreground', '--primary'],
    ['--text-default', '--card-background'],
  ];

  console.log('Contrast Checker — evaluating token pairs:');
  for (const [a, b] of pairs) {
    const colorA = resolveColor(vars[a], vars);
    const colorB = resolveColor(vars[b], vars);
    if (!colorA || !colorB) {
      console.log(` - ${a} or ${b} missing or not hex; skipped`);
      continue;
    }
    const ratio = contrastRatio(colorA, colorB);
    const pass = ratio >= 4.5 ? 'PASS' : 'FAIL';
    console.log(` - ${a} (${colorA}) vs ${b} (${colorB}) → ratio: ${ratio.toFixed(2)} — ${pass}`);
  }
}

if (require.main === module) run();
