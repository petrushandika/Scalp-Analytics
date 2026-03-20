# AGENTS.md - Scalp Analytics

## Project Overview

Scalp Analytics adalah sistem manajemen kesehatan rambut berbasis AI yang memungkinkan pengguna memantau progres kebotakan secara objektif melalui analisis foto, mengidentifikasi korelasi antara gaya hidup dan kesehatan rambut, serta menjaga disiplin perawatan.

**Architecture**: Monolith dengan microservices potential  
**Domain**: Healthcare / Wellness Technology  
**Scale**: Startup MVP

---

## Tech Stack

### Core Technologies

| Layer | Technology |
|-------|------------|
| Language Backend | Python 3.12 |
| Language Frontend | TypeScript |
| Framework Backend | FastAPI |
| Framework Frontend | Next.js|
| Database | PostgreSQL |
| Cache | Redis |
| Package Manager Backend | pip |
| Package Manager Frontend | npm |

### Key Dependencies

| Dependency | Purpose |
|-------------|---------|
| OpenCV | Image processing |
| TensorFlow/Keras | CNN model untuk hair density |
| SQLAlchemy | ORM |
| Alembic | Database migrations |
| Pydantic | Data validation |
| TailwindCSS | Styling |
| Recharts | Charts library |

### Development Tools

| Tool | Purpose |
|------|---------|
| Ruff | Python linting dan formatting |
| mypy | Python type checking |
| ESLint | TypeScript linting |
| Prettier | TypeScript formatting |
| pytest | Backend testing |
| Vitest | Frontend testing |
| Husky | Pre-commit hooks |

---

## Project Structure

```
scalp-analytics/
├── backend/
│   ├── app/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── presentation/
│   ├── tests/
│   ├── alembic/
│   ├── pyproject.toml
│   ├── requirements.txt
│   └── requirements-dev.txt
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   ├── .eslintrc.json
│   ├── .prettierrc
│   ├── tsconfig.json
│   └── package.json
├── .github/
│   └── workflows/
│       └── development.yml
├── .husky/
│   ├── pre-commit
│   └── commit-msg
├── Documentation/
├── README.md
├── AGENTS.md
└── DEVELOPMENT.md
```

---

## Code Style and Conventions

### Python (Backend)

| Element | Convention |
|---------|-----------|
| Files | snake_case |
| Variables | snake_case |
| Functions | snake_case |
| Classes | PascalCase |
| Constants | UPPER_SNAKE_CASE |

### TypeScript (Frontend)

| Element | Convention |
|---------|-----------|
| Files | PascalCase untuk components |
| Variables | camelCase |
| Functions | camelCase |
| Classes | PascalCase |
| Constants | UPPER_SNAKE_CASE |
| Components | PascalCase |

### Formatting Rules

| Language | Indentation | Line Length | Quotes |
|----------|-------------|-------------|--------|
| Python | 4 spaces | 88 characters | double |
| TypeScript | 2 spaces | 100 characters | double |

---

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| main | Production-ready code |
| development | Active development |

### Commit Messages

Format: `type(scope): description`

| Types | Keterangan |
|-------|------------|
| feat | New feature |
| fix | Bug fix |
| docs | Documentation |
| style | Code style |
| refactor | Code refactoring |
| test | Testing |
| chore | Maintenance |

---

## Commands

### Backend

```bash
# Install dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Run development server
uvicorn app.main:app --reload

# Run tests
pytest tests/

# Run linting
ruff check app/
ruff format app/

# Run type check
mypy app/

# Run migrations
alembic upgrade head
```

### Frontend

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run linting
npm run lint
npm run format

# Run type check
npm run typecheck

# Run tests
npm run test
```

---

## Testing Requirements

| Type | Framework | Coverage Target |
|------|-----------|-----------------|
| Unit | pytest / Vitest | 80% |
| Integration | pytest-asyncio / Playwright | 70% |
| E2E | Playwright | Critical paths |

---

## Security Considerations

| Aspek | Implementasi |
|-------|--------------|
| Authentication | JWT dengan expiry |
| Authorization | Role-based access control |
| Input Validation | Pydantic / Zod |
| Password Storage | bcrypt dengan salt |
| Data Encryption | AES-256 untuk foto |
| Transit Security | HTTPS (TLS 1.3) |

---

## Documentation Structure

| File | Keterangan |
|------|------------|
| PRD.md | Product Requirements Document |
| MVP.md | MVP Scope dan Features |
| ROADMAP.md | Development Roadmap |
| ARCHITECTURE.md | System Architecture |
| TECH-STACK.md | Technology Stack |
| DATABASE-SCHEMA.md | Database Schema |
| API-DESIGN.md | API Endpoints |
| USER-FLOW.md | User Flow dan Journey |
| AI-TRAINING.md | Panduan Training AI |

---

## Pre-commit Hooks

Hooks yang dijalankan sebelum commit:

| Hook | Check |
|------|-------|
| pre-commit | Ruff lint, Ruff format, mypy, ESLint, Prettier, TypeScript |
| commit-msg | Conventional commit format |

---

## CI/CD Pipeline

Stages yang dijalankan di GitHub Actions:

| Stage | Commands |
|-------|----------|
| Backend Lint | ruff check, ruff format --check, mypy |
| Backend Test | pytest --cov |
| Frontend Lint | eslint, prettier --check, tsc --noEmit |
| Frontend Test | vitest --coverage |
| Build | npm run build |

---

## When Stuck or Uncertain

1. Ask clarifying questions rather than making assumptions
2. Propose a plan before implementing complex changes
3. Reference existing patterns in the codebase
4. Start small - implement minimal solution first
5. Write tests first when fixing bugs or adding features
6. Request review before making significant architectural changes

---

## Additional Resources

| Resource | Location |
|----------|----------|
| API Documentation | /docs (FastAPI Swagger) |
| Architecture | Documentation/ARCHITECTURE.md |
| Database Schema | Documentation/DATABASE-SCHEMA.md |
| AI Training Guide | Documentation/AI-TRAINING.md |