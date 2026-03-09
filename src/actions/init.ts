import { execa } from 'execa';
import { logger } from '../utils/logger.js';

export async function gitInit(targetDir: string): Promise<void> {
  logger.step('Initializing git repository...');
  try {
    await execa('git', ['init'], { cwd: targetDir });
    logger.success('Git repository initialized.');
  } catch (err) {
    logger.warn(`Failed to initialize git: ${(err as Error).message}`);
  }
}
