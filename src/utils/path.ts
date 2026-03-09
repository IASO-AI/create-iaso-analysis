import path from 'node:path';
import type { ParsedTarget } from '../types.js';

export function isGitHubRepo(target: string): boolean {
  if (target.startsWith('http://') || target.startsWith('https://')) {
    return true;
  }
  if (target.startsWith('git@')) {
    return true;
  }
  // owner/repo pattern: contains '/' but doesn't start with '.' or '/'
  if (target.includes('/') && !target.startsWith('.') && !target.startsWith('/')) {
    return true;
  }
  return false;
}

export function parseTarget(target: string): ParsedTarget {
  if (isGitHubRepo(target)) {
    return { type: 'github', value: normalizeGitHubUrl(target) };
  }
  return { type: 'path', value: toAbsolutePath(target) };
}

export function toAbsolutePath(p: string): string {
  if (path.isAbsolute(p)) {
    return p;
  }
  return path.resolve(process.cwd(), p);
}

export function normalizeGitHubUrl(input: string): string {
  // Already a full URL
  if (input.startsWith('git@') || input.startsWith('http://') || input.startsWith('https://')) {
    return input;
  }
  // Short format: owner/repo -> SSH URL
  return `git@github.com:${input}.git`;
}
