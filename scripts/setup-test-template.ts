import path from 'node:path';
import fs from 'fs-extra';

const ROOT = path.resolve(import.meta.dirname, '..');
const TEMPLATE_DIR = path.join(ROOT, 'test', 'template');

const files: Record<string, string> = {
  'package.json': JSON.stringify(
    {
      name: 'iaso-analysis-test-template',
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'echo "dev server"',
        build: 'echo "build"',
      },
      dependencies: {},
    },
    null,
    2,
  ),
  'README.md': `# Test Template

This is a test template for \`create-iaso-analysis\`.
`,
  '.gitignore': `node_modules
dist
`,
  [path.join('src', 'index.ts')]: `console.log('Hello from iaso-analysis test template');
`,
};

async function main() {
  console.log('Setting up test template...');

  await fs.ensureDir(TEMPLATE_DIR);

  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(TEMPLATE_DIR, filePath);
    await fs.ensureDir(path.dirname(fullPath));
    await fs.writeFile(fullPath, content, 'utf-8');
    console.log(`  Created: test/template/${filePath}`);
  }

  console.log('\nTest template created at test/template/');
  console.log('Run with: npx create-iaso-analysis --offline my-project');
}

main().catch((err) => {
  console.error('Failed to setup test template:', err);
  process.exit(1);
});
