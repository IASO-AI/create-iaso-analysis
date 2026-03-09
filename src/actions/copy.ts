import path from 'node:path';
import fs from 'fs-extra';
import prompts from 'prompts';
import { logger } from '../utils/logger.js';

export async function isDirectoryEmpty(dir: string): Promise<boolean> {
  if (!(await fs.pathExists(dir))) {
    return true;
  }
  const entries = await fs.readdir(dir);
  return entries.length === 0;
}

export async function detectConflicts(templateDir: string, targetDir: string): Promise<string[]> {
  if (!(await fs.pathExists(targetDir))) {
    return [];
  }

  const templateEntries = await fs.readdir(templateDir);
  const targetEntries = await fs.readdir(targetDir);

  // Filter out .git from template entries
  const filtered = templateEntries.filter((e) => e !== '.git');
  return filtered.filter((e) => targetEntries.includes(e));
}

export async function promptOverwrite(conflicts: string[]): Promise<boolean> {
  logger.warn(`The following files/folders already exist: ${conflicts.join(', ')}`);
  const { overwrite } = await prompts(
    {
      type: 'confirm',
      name: 'overwrite',
      message: 'Overwrite existing files?',
      initial: false,
    },
    {
      onCancel() {
        throw new Error('Operation cancelled.');
      },
    },
  );
  return overwrite as boolean;
}

export async function copyTemplateFiles(templateDir: string, targetDir: string): Promise<void> {
  logger.step('Copying template files...');
  await fs.ensureDir(targetDir);

  const entries = await fs.readdir(templateDir);
  for (const entry of entries) {
    if (entry === '.git') continue;
    const src = path.join(templateDir, entry);
    const dest = path.join(targetDir, entry);
    await fs.copy(src, dest, { overwrite: true });
  }

  logger.success('Template files copied.');
}
