export interface ParsedTarget {
  type: 'path' | 'github';
  value: string;
}

export interface CLIOptions {
  offline: boolean;
  template?: string;
}

export interface PromptResults {
  templateRepo: string;
  packageManager: 'npm' | 'pnpm' | 'bun';
}

export interface ExecutionContext {
  targetDir: string;
  isGitHubTarget: boolean;
  tempDir: string;
  templateRepo: string;
  packageManager: 'npm' | 'pnpm' | 'bun';
}
