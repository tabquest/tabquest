import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const browser = process.argv[2];
const rootDir = path.resolve(__dirname, '..');
const manifestsDir = path.join(rootDir, 'manifests');
const publicManifest = path.join(rootDir, 'public', 'manifest.json');

const manifestMap = {
  chrome: 'manifest.chrome.json',
  edge: 'manifest.edge.json',
  firefox: 'manifest.firefox.json',
};

const manifestFile = manifestMap[browser];

if (!manifestFile) {
  console.error(`Unknown browser: ${browser}`);
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
const version = packageJson.version;

const sourcePath = path.join(manifestsDir, manifestFile);

try {
  const manifest = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));
  manifest.version = version;
  
  fs.writeFileSync(publicManifest, JSON.stringify(manifest, null, 4));
  console.log(`Successfully synced version ${version} to public/manifest.json for ${browser}`);
} catch (err) {
  console.error(`Failed to copy and sync manifest: ${err.message}`);
  process.exit(1);
}
