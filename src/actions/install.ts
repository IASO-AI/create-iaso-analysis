import path from 'node:path';
import fs from 'fs-extra';
import { execa } from 'execa';
import { logger } from '../utils/logger.js';

export async function hasPackageJson(targetDir: string): Promise<boolean> {
  return fs.pathExists(path.join(targetDir, 'package.json'));
}

export async function checkPackageManagerAvailable(pm: string): Promise<boolean> {
  try {
    await execa(pm, ['--version']);
    return true;
  } catch {
    return false;
  }
}

export async function installDependencies(
  targetDir: string,
  packageManager: 'npm' | 'pnpm' | 'bun',
): Promise<void> {
  if (!(await hasPackageJson(targetDir))) {
    logger.warn('No package.json found, skipping dependency installation.');
    return;
  }

  if (!(await checkPackageManagerAvailable(packageManager))) {
    logger.warn(`${packageManager} is not installed. Please install dependencies manually.`);
    return;
  }

  logger.step(`Installing dependencies with ${packageManager}...`);
  try {
    await execa(packageManager, ['install'], {
      cwd: targetDir,
      stdio: 'inherit',
    });
    logger.success('Dependencies installed.');
  } catch (err) {
    logger.error(`Failed to install dependencies: ${(err as Error).message}`);
    logger.warn(`You can retry manually: cd ${targetDir} && ${packageManager} install`);
  }
}
