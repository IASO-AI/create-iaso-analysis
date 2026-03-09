import path from 'node:path';
import fs from 'fs-extra';

const ROOT = path.resolve(import.meta.dirname, '..');
const TEST_DIR = path.join(ROOT, 'test');

async function main() {
  const exists = await fs.pathExists(TEST_DIR);
  if (!exists) {
    console.log('No test/ directory found. Nothing to clean up.');
    return;
  }

  await fs.remove(TEST_DIR);
  console.log('Cleaned up test/ directory.');
}

main().catch((err) => {
  console.error('Failed to cleanup test directory:', err);
  process.exit(1);
});
