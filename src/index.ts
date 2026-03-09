#!/usr/bin/env node

import path from 'node:path';
import fs from 'fs-extra';
import pc from 'picocolors';
import { parseCLI } from './cli.js';
import { runPrompts } from './prompts.js';
import { checkGitAvailable } from './utils/git.js';
import { logger } from './utils/logger.js';
import { toAbsolutePath } from './utils/path.js';
import { cloneTemplate, cloneTarget, cleanup } from './actions/clone.js';
import { detectConflicts, promptOverwrite, copyTemplateFiles } from './actions/copy.js';
import { gitInit } from './actions/init.js';
import { installDependencies } from './actions/install.js';

async function validateLocalTemplate(templatePath: string): Promise<void> {
  const absPath = toAbsolutePath(templatePath);
  const exists = await fs.pathExists(absPath);
  if (!exists) {
    throw new Error(`Local template directory does not exist: ${absPath}`);
  }
  const stat = await fs.stat(absPath);
  if (!stat.isDirectory()) {
    throw new Error(`Template path is not a directory: ${absPath}`);
  }
  const files = await fs.readdir(absPath);
  if (files.length === 0) {
    throw new Error(`Template directory is empty: ${absPath}`);
  }
}

async function run() {
  console.log();
  console.log(pc.bold(pc.cyan('create-iaso-analysis')));
  console.log();

  // 1. Parse CLI arguments
  const { target: parsed, options } = parseCLI(process.argv);

  // 2. Check git (skip in offline mode)
  if (!options.offline) {
    if (!(await checkGitAvailable())) {
      logger.error('Git is not installed. Please install Git and try again.');
      process.exit(1);
    }
  }

  // 3. Interactive prompts
  const { templateRepo, packageManager } = await runPrompts(options.offline);

  // 4. Determine target directory
  let targetDir: string;
  let isGitHubTarget = false;

  if (!parsed) {
    // No target specified, use current directory
    targetDir = process.cwd();
  } else if (parsed.type === 'github') {
    isGitHubTarget = true;
    // Extract repo name for local dir
    const repoName = parsed.value.replace(/\.git$/, '').split('/').pop()!.split(':').pop()!;
    targetDir = toAbsolutePath(repoName);
  } else {
    targetDir = parsed.value;
  }

  let tempDir: string | undefined;
  let isLocalTemplate = false;

  try {
    // 5. If GitHub target, clone it first
    if (isGitHubTarget && parsed) {
      await cloneTarget(parsed.value, targetDir);
    }

    // 6. Get template directory
    if (options.offline) {
      // Offline mode: use local template directory
      const localPath = options.template || templateRepo;
      tempDir = toAbsolutePath(localPath);
      await validateLocalTemplate(tempDir);
      isLocalTemplate = true;
      logger.step(`Using local template: ${tempDir}`);
      logger.success('Local template validated.');
    } else {
      // Online mode: clone template to temp dir
      tempDir = await cloneTemplate(templateRepo);
    }

    // 7. Check conflicts
    const conflicts = await detectConflicts(tempDir, targetDir);
    if (conflicts.length > 0) {
      const shouldOverwrite = await promptOverwrite(conflicts);
      if (!shouldOverwrite) {
        logger.info('Operation cancelled. No files were modified.');
        return;
      }
    }

    // 8. Copy template files
    await copyTemplateFiles(tempDir, targetDir);

    // 9. Git init (only if not a GitHub clone)
    if (!isGitHubTarget) {
      await gitInit(targetDir);
    }

    // 10. Install dependencies
    await installDependencies(targetDir, packageManager);

    // 11. Success message
    const relPath = path.relative(process.cwd(), targetDir);
    console.log();
    logger.success(pc.bold('Project created successfully!'));
    console.log();
    if (relPath && relPath !== '.') {
      logger.plain(`  ${pc.dim('$')} cd ${relPath}`);
    }
    logger.plain(`  ${pc.dim('$')} ${packageManager === 'npm' ? 'npm run' : packageManager} dev`);
    console.log();
  } finally {
    // Cleanup temp dir (only if it was a cloned temp, not a local template)
    if (tempDir && !isLocalTemplate) {
      await cleanup(tempDir);
    }
  }
}

run().catch((err: Error) => {
  if (err.message === 'Operation cancelled.') {
    console.log();
    logger.info('Operation cancelled.');
    process.exit(0);
  }
  console.log();
  logger.error(err.message);
  process.exit(1);
});
