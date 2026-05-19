# Vibe Coding AI Rules

**The Ultimate AI Coding Ruleset for Windsurf, Cursor, GitHub Copilot, Claude Code, Cline, Codex, Zed AI, Gemini CLI & more**

> "Context is King. AI agents are only as good as the rules you give them."

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

Production-ready rules, templates, and best practices for AI-assisted development. One repository, all major AI IDEs covered.

### What this folder is for

The `guides/` directory is a **static rules library**: Markdown templates, IDE-specific examples, and documentation you copy into your own projects. There is **no installer or CLI here**—you pick files, duplicate them, and adjust paths for your stack. (If you want a tool that **syncs packs** into Cursor, Copilot, Gemini, and others from one definition, see the `rulebook/` folder in this repo.)

### What each top-level item does

| Path | Role |
|------|------|
| **`docs/`** | Long-form reference: security, testing, API design, migration between IDEs, and comparisons. Use this when you need principles and checklists, not just snippets. |
| **`templates/`** | Starting points for **`AGENTS.md`** and project-wide agent config: generic template, placeholder version, and a full example project. |
| **`ide-specific/`** | One subfolder per editor or agent (Cursor, Windsurf, Copilot, Claude Code, Cline, …). Each contains ready-made rules files and often an `examples/` tree showing realistic layouts. |
| **`prompts/`** | Text prompts you can paste into an AI chat to **adapt** these rules to a new codebase or to **analyze** a repo and draft rules automatically. |
| **`scripts/`** | Shell helpers—mainly **`symlink-setup.sh`** to point several IDE config filenames at a single `AGENTS.md`. |
| **`AGENTS.MD`** | Universal agent instructions template (copy to project root; many teams save as `AGENTS.md` so IDEs recognize the default name). |
| **`GLOBAL_RULES.MD`** | Windsurf-oriented global rules text; useful as reference or to merge into your own global rules. |
| **`VIBE-CODING-RULES_OVERVIEW.MD`** | Short one-page summary of workflow and quality habits—good onboarding for teams. |
| **`CONTRIBUTING.MD`** | How to contribute changes back to this rules collection. |

---

## Quick Start: Pick Your IDE

| AI IDE | What to Copy | Config Format | Setup Guide |
|--------|-------------|---------------|-------------|
| **Cursor** | `ide-specific/cursor/` | `.cursor/rules/*.mdc` | [Setup](ide-specific/cursor/README.MD) |
| **Windsurf** | `ide-specific/windsurf/` | `.windsurfrules` + `GLOBAL_RULES.MD` | [Setup](ide-specific/windsurf/README.MD) |
| **GitHub Copilot** | `ide-specific/github-copilot/` | `.github/COPILOT-INSTRUCTIONS.MD` | [Setup](ide-specific/github-copilot/README.MD) |
| **Claude Code** | `ide-specific/claude-code/` | `CLAUDE.md` + `.claude/rules/` | [Setup](ide-specific/claude-code/README.MD) |
| **Cline** | `ide-specific/cline/` | `.clinerules` or `.clinerules/` | [Setup](ide-specific/cline/README.MD) |
| **Codex** | `ide-specific/codex/` | `AGENTS.md` | [Setup](ide-specific/codex/README.MD) |
| **Zed AI** | `ide-specific/zed/` | `.rules` | [Setup](ide-specific/zed/README.MD) |
| **Gemini CLI** | `ide-specific/gemini-cli/` | `GEMINI.md` | [Setup](ide-specific/gemini-cli/README.MD) |
| **Aider** | `ide-specific/aider/` | `CONVENTIONS.MD` + `.aider.conf.yml` | [Setup](ide-specific/aider/README.MD) |
| **Continue.dev** | `ide-specific/continue/` | `.continue/rules/*.md` | [Setup](ide-specific/continue/README.MD) |
| **Universal** | `AGENTS.MD` | Works everywhere | [Setup](templates/AGENTS.MD) |

**Fastest approach**: Copy `AGENTS.MD` (or rename to `AGENTS.md` for tool compatibility) to your project root and run `./scripts/symlink-setup.sh` to create symlinks for all IDEs at once.

## Universal: The AGENTS.md standard

[agents.md](https://agents.md) is the emerging universal standard for AI coding assistant configuration, backed by OpenAI, Google, Anthropic, Cursor, and Sourcegraph. In this repo the file is named **`AGENTS.MD`**; many tools still expect the conventional lowercase **`AGENTS.md`** filename in your project—copy or rename as your toolchain requires.

**One file, all IDEs:**
```bash
# Copy the template
cp templates/AGENT-TEMPLATE.MD AGENTS.md
# Customize for your project, then:
./scripts/symlink-setup.sh
# Creates: .windsurfrules, .cursorrules, CLAUDE.md, .clinerules, GEMINI.md, .github/COPILOT-INSTRUCTIONS.MD
# Codex, Zed AI read AGENTS.md natively — no symlink needed
```

IDEs that read `AGENTS.md` natively: Cursor, GitHub Copilot, Cline, Codex, Zed AI, Gemini CLI, Aider.

## What's Inside

```
guides/
├── README.MD                          # You are here
├── AGENTS.MD                          # Universal standard (copy to your project)
├── LICENSE                            # MIT License
├── CONTRIBUTING.MD                    # How to contribute
│
├── docs/                              # Knowledge base
│   ├── BEST-PRACTICES.MD             # Comprehensive agentic coding guide
│   ├── SECURITY-RULES.MD             # Security patterns for AI-generated code
│   ├── PERFORMANCE-RULES.MD          # Performance optimization patterns
│   ├── TESTING-RULES.MD              # Testing standards and patterns
│   ├── ERROR-HANDLING.MD             # Error handling patterns and standards
│   ├── LOGGING-RULES.MD             # Logging standards and best practices
│   ├── API-DESIGN.MD                # API design conventions (REST, RFC 7807)
│   ├── MIGRATION-GUIDE.MD            # Migrate between IDE configurations
│   ├── VIBE-CODING-OVERVIEW.MD       # Quick reference cheat sheet
│   └── IDE-COMPARISON.MD             # Feature comparison of all 10 IDEs
│
├── templates/                         # Universal templates (tool-agnostic)
│   ├── AGENTS.MD                     # Universal template
│   ├── AGENT-TEMPLATE.MD             # Customizable template with placeholders
│   └── AGENT-EXAMPLE.MD              # Real-world "FocusFlow" example
│
├── ide-specific/                      # One folder per IDE
│   ├── windsurf/                     # Windsurf config + examples
│   ├── cursor/                       # Cursor .mdc rules + examples
│   ├── github-copilot/               # Copilot instructions + examples
│   ├── claude-code/                  # CLAUDE.md + .claude/rules/ + examples
│   ├── cline/                        # .clinerules single + multi-file + examples
│   ├── codex/                        # AGENTS.md + examples
│   ├── zed/                          # .rules + examples
│   ├── gemini-cli/                   # GEMINI.md + examples
│   ├── aider/                        # CONVENTIONS.MD + .aider.conf.yml
│   └── continue/                     # .continue/rules/*.md
│
├── prompts/                           # AI prompts for customization
│   ├── adapt-rules-prompt.txt        # Generate rules for ANY IDE from project info
│   └── project-analyzer-prompt.txt   # Analyze codebase and auto-generate rules
│
└── scripts/
    └── symlink-setup.sh              # Create IDE symlinks from AGENTS.md
```

## Deep Dives

| Topic | Description |
|-------|-------------|
| [Best Practices](docs/BEST-PRACTICES.MD) | Context management, prompting, workflows, team collaboration |
| [Security Rules](docs/SECURITY-RULES.MD) | Input validation, injection prevention, auth, secrets management |
| [Performance Rules](docs/PERFORMANCE-RULES.MD) | Frontend, backend, database, caching optimization patterns |
| [Testing Rules](docs/TESTING-RULES.MD) | Test pyramid, patterns, mocking, coverage requirements |
| [IDE Comparison](docs/IDE-COMPARISON.MD) | Feature matrix, cross-IDE compatibility, recommendations |
| [Migration Guide](docs/MIGRATION-GUIDE.MD) | Step-by-step migration between any two IDEs |
| [Error Handling](docs/ERROR-HANDLING.MD) | Error types, propagation, retry patterns, error boundaries |
| [Logging Rules](docs/LOGGING-RULES.MD) | Log levels, structured logging, correlation IDs, PII protection |
| [API Design](docs/API-DESIGN.MD) | REST conventions, pagination, error responses (RFC 7807), rate limiting |
| [Vibe Coding Overview](docs/VIBE-CODING-OVERVIEW.MD) | One-page cheat sheet of core principles |

## Core Principles

These principles are embedded in all IDE-specific rule files:

| Principle | Description |
|-----------|-------------|
| Clarify Before Coding | Understand requirements before writing code. Ask questions when intent is unclear. No code without clear goals. |
| Simplicity First | Choose the simplest viable solution. Complex patterns need explicit justification. Readable code over clever code. |
| Security By Default | Validate all inputs. No secrets in code. Defense in depth. Least privilege principle. |
| Test-Driven Thinking | Design all code to be testable from inception. Write tests alongside code. Verify before committing. |

## Customization

Two ways to generate rules for your project:

1. **AI Adaptation Prompt**: Fill in your project details and let AI generate IDE-specific configs
   ```
   Use: prompts/adapt-rules-prompt.txt
   ```

2. **Project Analyzer**: Point AI at your existing codebase to auto-generate rules
   ```
   Use: prompts/project-analyzer-prompt.txt
   ```

## IDE Support Matrix

| Tool | Config File | AGENTS.md | Multi-File | Glob Patterns |
|------|------------|-----------|------------|---------------|
| Cursor | `.cursor/rules/*.mdc` | Native | Yes | Yes (YAML) |
| Windsurf | `.windsurfrules` | Manual | No | No |
| GitHub Copilot | `.github/COPILOT-INSTRUCTIONS.MD` | Native | Yes | Yes (applyTo) |
| Claude Code | `CLAUDE.md` + `.claude/rules/` | Manual | Yes | No (dir-based) |
| Cline | `.clinerules` or `.clinerules/` | Native | Yes | Yes (YAML) |
| Codex | `AGENTS.md` | Native | Yes (dir-based) | No |
| Zed AI | `.rules` | Native | No | No |
| Gemini CLI | `GEMINI.md` | Native | Yes (dir-based) | No |
| Aider | `CONVENTIONS.MD` | Native | No | No |
| Continue.dev | `.continue/rules/*.md` | No | Yes | Yes (YAML globs) |

## Coming from the old Windsurf Global Rules?

If you've been using our original `GLOBAL_RULES.MD` and `.windsurfrules` — they're still here, now as part of a much bigger toolkit. You'll find the original Windsurf rules as a ready-to-use example in [`ide-specific/windsurf/examples/`](ide-specific/windsurf/examples/), alongside new templates that work across all 10 IDEs.

## Origin

This repository is a curated collection of AI coding rules and best practices, compiled to help developers work more effectively with AI assistants.

## Contributing

We welcome contributions! See [CONTRIBUTING.MD](CONTRIBUTING.MD) for guidelines.

**Ways to contribute:**
- Share production-ready rule examples
- Add support for new IDEs or frameworks
- Improve existing templates with real-world learnings
- Report issues or suggest enhancements

## License

[MIT](LICENSE) — Use freely in personal and commercial projects.

---

**Maintained by:** [Petrus Handika](https://github.com/petrushandika)
