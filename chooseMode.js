import prompts from 'prompts';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname);
const manifestsDir = path.join(rootDir, 'manifests');
const publicManifest = path.join(rootDir, 'public', 'manifest.json');

const questions = [
  {
    type: 'select',
    name: 'browser',
    message: 'Choose a browser:',
    choices: [
      { title: 'Chrome', value: 'chrome' },
      { title: 'Edge', value: 'edge' },
      { title: 'Firefox', value: 'firefox' }
    ]
  }
];

async function prepareManifest(browser) {
  const manifestMap = {
    chrome: 'manifest.chrome.json',
    edge: 'manifest.edge.json',
    firefox: 'manifest.firefox.json',
  };

  const manifestFile = manifestMap[browser];
  if (!manifestFile) {
    throw new Error(`Unknown browser: ${browser}`);
  }

  const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
  const version = packageJson.version;
  const sourcePath = path.join(manifestsDir, manifestFile);

  const manifest = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));
  manifest.version = version;

  fs.writeFileSync(publicManifest, JSON.stringify(manifest, null, 4));
  console.log(`\x1b[32m✔\x1b[0m Synced version ${version} to public/manifest.json for ${browser}`);
}

(async () => {
  const action = process.argv[2]; // 'dev' or 'build'
  let browser = process.argv[3]; // optional browser arg for CI/CD

  if (!action) {
    console.error('Usage: node chooseMode.js [dev|build] [browser]');
    process.exit(1);
  }

  // If browser is not provided, ask interactively
  if (!browser) {
    const response = await prompts(questions);
    browser = response.browser;
  }

  if (!browser) {
    console.log('No browser selected, operation cancelled.');
    process.exit(0);
  }

  try {
    await prepareManifest(browser);

    const command = 'pnpm';
    const args = action === 'dev' 
      ? ['vite', '--mode', browser, '--host', '--open'] 
      : ['vite', 'build', '--mode', browser];

    console.log(`\x1b[36m🚀 Starting ${action} for ${browser}...\x1b[0m\n`);

    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: false,
      env: {
        ...process.env,
        VITE_BROWSER: browser
      }
    });

    child.on('close', (code) => {
      process.exit(code);
    });

  } catch (err) {
    console.error(`\x1b[31m✘ Error:\x1b[0m ${err.message}`);
    process.exit(1);
  }
})();
