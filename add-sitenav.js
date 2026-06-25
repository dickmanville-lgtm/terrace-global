const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(process.cwd(), 'app');

// Folders to skip — these aren't individual club pages
const SKIP = new Set(['club-map', 'fan-map', 'supporter-groups']);

const navBlockRe = /<nav style=\{\{[\s\S]*?<\/nav>\n/;
const colorRe = /<div style=\{\{ width: '10px', height: '10px', borderRadius: '50%', background: (.*?) \}\} \/>/;
const nameRe = /<span style=\{\{ fontSize: '14px', fontWeight: 700, letterSpacing: '0\.08em', textTransform: 'uppercase' \}\}>(.*?)<\/span>/;
const taglineRe = /<div style=\{\{ fontSize: '12px', color: 'rgba\(255,255,255,0\.3\)', fontStyle: 'italic' \}\}>(.*?)<\/div>/;

let results = [];

for (const folder of fs.readdirSync(APP_DIR)) {
  if (SKIP.has(folder)) continue;
  const filePath = path.join(APP_DIR, folder, 'page.tsx');
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes("from '../../components/SiteNav'")) {
    results.push({ folder, status: 'SKIPPED (already has SiteNav)' });
    continue;
  }

  const navMatch = content.match(navBlockRe);
  if (!navMatch) {
    results.push({ folder, status: 'NO MATCH (manual review needed)' });
    continue;
  }
  const navBlock = navMatch[0];

  const colorMatch = navBlock.match(colorRe);
  const nameMatch = navBlock.match(nameRe);
  const taglineMatch = navBlock.match(taglineRe);

  if (!colorMatch || !nameMatch || !taglineMatch) {
    results.push({ folder, status: `PARTIAL MATCH (color:${!!colorMatch} name:${!!nameMatch} tagline:${!!taglineMatch}) — skipped, needs manual edit` });
    continue;
  }

  const colorExpr = colorMatch[1].trim();
  const name = nameMatch[1].trim();
  const tagline = taglineMatch[1].trim();

  const replacement = `<SiteNav active="club-map" club={{ name: '${name}', color: ${colorExpr}, tagline: '${tagline}' }} />\n`;
  content = content.replace(navBlockRe, replacement);

  content = content.replace(
    /(import ClubMapLoader from '\.\.\/\.\.\/components\/ClubMapLoader';\n)/,
    `$1import SiteNav from '../../components/SiteNav';\n`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  results.push({ folder, status: `OK — name:"${name}" color:${colorExpr} tagline:"${tagline}"` });
}

results.forEach(r => console.log(`${r.folder.padEnd(22)} ${r.status}`));