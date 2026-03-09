import { Command } from 'commander';
import { createRequire } from 'node:module';
import { parseTarget } from './utils/path.js';
import type { ParsedTarget, CLIOptions } from './types.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json') as { version: string; description: string };

export interface CLIResult {
  target: ParsedTarget | undefined;
  options: CLIOptions;
}

export function parseCLI(argv: string[]): CLIResult {
  const program = new Command();

  let target: string | undefined;

  program
    .name('create-iaso-analysis')
    .description(pkg.description)
    .version(pkg.version)
    .argument('[target]', 'project directory or GitHub repo (owner/repo)')
    .option('--offline', 'use local template directory instead of cloning from GitHub', false)
    .option('--template <path>', 'local template directory path (used with --offline)')
    .action((t?: string) => {
      target = t;
    });

  program.parse(argv);

  const opts = program.opts<{ offline: boolean; template?: string }>();

  return {
    target: target ? parseTarget(target) : undefined,
    options: {
      offline: opts.offline,
      template: opts.template,
    },
  };
}
