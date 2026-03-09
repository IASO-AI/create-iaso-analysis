# create-iaso-analysis

A CLI scaffold tool for quickly creating IASO analysis projects from GitHub template repositories.

## Features

- Clone projects from GitHub template repositories
- Offline mode with local template support
- Interactive command-line prompts
- File conflict detection and overwrite confirmation
- Automatic Git repository initialization
- Automatic dependency installation (npm, pnpm, bun)
- Colorful terminal output

## Quick Start

### Online Mode (Recommended)

```bash
npx create-iaso-analysis
```

Specify a project directory:

```bash
npx create-iaso-analysis my-project
```

Clone a GitHub repo and apply template:

```bash
npx create-iaso-analysis owner/repo
```

### Offline Mode

```bash
npx create-iaso-analysis --offline --template /path/to/local/template
```

## CLI Options

```
Usage: create-iaso-analysis [options] [target]

Arguments:
  target              project directory or GitHub repo (owner/repo format)

Options:
  -V, --version       output the version number
  --offline           use local template directory instead of cloning from GitHub
  --template <path>   local template directory path (used with --offline)
  -h, --help          display help for command
```

## Target Formats

| Input | Interpreted As |
|-------|----------------|
| `my-project` | Local path `./my-project` |
| `.` | Current directory |
| `./path/to/dir` | Relative local path |
| `/absolute/path` | Absolute local path |
| `owner/repo` | GitHub SSH: `git@github.com:owner/repo.git` |
| `git@github.com:owner/repo.git` | GitHub SSH URL |
| `https://github.com/owner/repo` | GitHub HTTPS URL |

## Usage Examples

### Create in current directory

```bash
mkdir my-project && cd my-project
npx create-iaso-analysis
```

### Create in a new directory

```bash
npx create-iaso-analysis my-project
cd my-project
```

### Create from GitHub repository

```bash
npx create-iaso-analysis IASO-AI/iaso-analysis-template
```

### Use local template (offline mode)

```bash
npx create-iaso-analysis --offline --template ~/templates/iaso-analysis
```

## Interactive Prompts

After running the command, the CLI guides you through:

1. **Template repository URL** - Enter GitHub template repo address (default: `git@github.com:IASO-AI/iaso-analysis-template.git`)
2. **Package manager** - Choose from npm, pnpm, or bun

## Workflow

```
┌─────────────────────────────────────────────────────────┐
│                    create-iaso-analysis                 │
├─────────────────────────────────────────────────────────┤
│  1. Parse CLI arguments                                 │
│  2. Check Git availability (online mode)                │
│  3. Interactive prompts (template repo, package manager)│
│  4. Determine target directory                          │
│  5. Clone template to temp dir / use local template     │
│  6. Detect file conflicts and prompt for overwrite      │
│  7. Copy template files to target directory             │
│  8. Initialize Git repository                           │
│  9. Install dependencies                                │
│ 10. Output success message and next steps               │
└─────────────────────────────────────────────────────────┘
```

## Requirements

- Node.js >= 18
- Git (required for online mode)
- npm / pnpm / bun (any package manager)

## Global Installation

```bash
npm install -g create-iaso-analysis
create-iaso-analysis my-project
```

## Development

### Install dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Publish

```bash
npm run release
```

## Project Structure

```
src/
├── index.ts           # Entry point, main workflow
├── cli.ts             # CLI argument parsing
├── prompts.ts         # Interactive prompts
├── types.ts           # TypeScript type definitions
├── actions/
│   ├── clone.ts       # Git clone operations
│   ├── copy.ts        # File copy and conflict detection
│   ├── init.ts        # Git initialization
│   └── install.ts     # Dependency installation
└── utils/
    ├── git.ts         # Git utility functions
    ├── logger.ts      # Terminal logging
    └── path.ts        # Path handling utilities
```

## Tech Stack

| Library | Purpose |
|---------|---------|
| [commander](https://github.com/tj/commander.js) | CLI argument parsing |
| [prompts](https://github.com/terkelg/prompts) | Interactive CLI prompts |
| [execa](https://github.com/sindresorhus/execa) | Subprocess execution |
| [fs-extra](https://github.com/jprichardson/node-fs-extra) | Enhanced file system operations |
| [picocolors](https://github.com/alexeyraspopov/picocolors) | Terminal color output |

## License

ISC

## Links

- [GitHub Repository](https://github.com/IASO-AI/create-iaso-analysis)
- [Issue Tracker](https://github.com/IASO-AI/create-iaso-analysis/issues)
