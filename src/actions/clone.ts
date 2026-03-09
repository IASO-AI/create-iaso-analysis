import path from 'node:path';
import os from 'node:os';
import fs from 'fs-extra';
import { execa } from 'execa';
import { logger } from '../utils/logger.js';

function makeTempDir(): string {
  return path.join(os.tmpdir(), `create-iaso-analysis-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
}

export async function cloneTemplate(repoUrl: string): Promise<string> {
  const tempDir = makeTempDir();
  logger.step(`Cloning template from ${repoUrl}...`);
  try {
    await execa('git', ['clone', '--depth', '1', repoUrl, tempDir]);
    logger.success('Template cloned.');
    return tempDir;
  } catch (err) {
    await cleanup(tempDir);
    throw new Error(
      `Failed to clone template repository.\nPlease check the URL and your network/SSH configuration.\n${(err as Error).message}`,
    );
  }
}

export async function cloneTarget(repoUrl: string, targetDir: string): Promise<void> {
  logger.step(`Cloning ${repoUrl}...`);
  try {
    await execa('git', ['clone', repoUrl, targetDir]);
    logger.success('Repository cloned.');
  } catch (err) {
    throw new Error(
      `Failed to clone target repository.\n${(err as Error).message}`,
    );
  }
}

export async function cleanup(dir: string): Promise<void> {
  try {
    await fs.remove(dir);
  } catch {
    // ignore cleanup errors
  }
}
