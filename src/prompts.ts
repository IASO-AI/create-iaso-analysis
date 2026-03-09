import path from 'node:path';
import prompts from 'prompts';
import type { PromptResults } from './types.js';

const DEFAULT_TEMPLATE_REPO = 'git@github.com:IASO-AI/iaso-analysis-template.git';

function onCancel() {
  throw new Error('Operation cancelled.');
}

export async function promptTemplateRepo(offline: boolean): Promise<string> {
  const defaultValue = offline
    ? path.resolve('test/template')
    : DEFAULT_TEMPLATE_REPO;

  const { templateRepo } = await prompts(
    {
      type: 'text',
      name: 'templateRepo',
      message: offline ? 'Local template directory:' : 'Template repository URL:',
      initial: defaultValue,
    },
    { onCancel },
  );
  return templateRepo as string;
}

export async function promptPackageManager(): Promise<'npm' | 'pnpm' | 'bun'> {
  const { packageManager } = await prompts(
    {
      type: 'select',
      name: 'packageManager',
      message: 'Package manager:',
      choices: [
        { title: 'npm', value: 'npm' },
        { title: 'pnpm', value: 'pnpm' },
        { title: 'bun', value: 'bun' },
      ],
      initial: 0,
    },
    { onCancel },
  );
  return packageManager as 'npm' | 'pnpm' | 'bun';
}

export async function runPrompts(offline = false): Promise<PromptResults> {
  const templateRepo = await promptTemplateRepo(offline);
  const packageManager = await promptPackageManager();
  return { templateRepo, packageManager };
}
