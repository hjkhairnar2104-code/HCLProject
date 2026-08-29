const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const distDir = path.join(__dirname, 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    const base = path.basename(src);
    if (base === 'node_modules' || base === 'dist' || base.startsWith('.')) {
      return;
    }
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

for (const item of fs.readdirSync(srcDir)) {
  if (item !== 'dist' && item !== 'node_modules' && !item.startsWith('.')) {
    copyRecursive(path.join(srcDir, item), path.join(distDir, item));
  }
}

console.log('✅ Build successful: All static files copied into dist/ directory for Vercel deployment.');
