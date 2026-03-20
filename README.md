# Scalp Analytics

Sistem manajemen kesehatan rambut berbasis AI untuk memantau progres kebotakan secara objektif melalui analisis foto, mengidentifikasi korelasi gaya hidup dan kesehatan rambut, serta menjaga disiplin perawatan.

## Fitur Utama

### AI Scalp Tracker
- Upload foto dari 3 sudut (depan, atas, samping)
- Analisis AI untuk kalkulasi kepadatan rambut
- Galeri foto historis dengan timeline
- Perbandingan foto side-by-side

### Habit Logger
- Input harian tingkat stres (skala 1-10)
- Input durasi tidur harian
- Catatan opsional per hari
- Riwayat dan statistik

### Correlation Dashboard
- Grafik gabungan kepadatan vs stres/tidur
- Kalkulasi koefisien korelasi
- Insight mingguan otomatis
- Rekomendasi yang dapat ditindaklanjuti

### Treatment Scheduler
- CRUD jadwal perawatan
- Checklist harian otomatis
- Pelacakan streak
- Pengingat notifikasi

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | Next.js, TypeScript, Tailwind CSS, Recharts |
| Backend | FastAPI, Python, SQLAlchemy, Alembic |
| AI/ML | OpenCV, TensorFlow, NumPy |
| Database | PostgreSQL, Redis |
| Infrastructure | Docker, Nginx, GitHub Actions |

## Struktur Proyek

```
scalp-analytics/
├── backend/
│   ├── app/
│   │   ├── domain/          # Entities & Value Objects
│   │   ├── application/     # Use Cases & Services
│   │   ├── infrastructure/  # External Services & Adapters
│   │   └── presentation/    # API Routes & Schemas
│   ├── tests/
│   ├── alembic/
│   └── requirements.txt
├── frontend/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React Components
│   ├── hooks/               # Custom Hooks
│   ├── lib/                 # Utilities
│   └── types/               # TypeScript Types
├── Documentation/
│   ├── PRD.md
│   ├── MVP.md
│   ├── ROADMAP.md
│   ├── ARCHITECTURE.md
│   ├── TECH-STACK.md
│   ├── DATABASE-SCHEMA.md
│   ├── API-DESIGN.md
│   ├── USER-FLOW.md
│   └── AI-TRAINING.md
├── .github/workflows/
│   └── development.yml
├── .husky/
│   ├── pre-commit
│   └── commit-msg
├── README.md
├── AGENTS.md
└── DEVELOPMENT.md
```

## Dokumentasi

| Dokumen | Deskripsi |
|---------|-----------|
| PRD.md | Product Requirements Document |
| MVP.md | MVP Scope & Features |
| ROADMAP.md | Development Roadmap |
| ARCHITECTURE.md | System Architecture |
| TECH-STACK.md | Technology Stack |
| DATABASE-SCHEMA.md | Database Schema |
| API-DESIGN.md | API Endpoints |
| USER-FLOW.md | User Flow & Journey |
| AI-TRAINING.md | AI Model Training Guide |

## Branch Strategy

| Branch | Keterangan |
|--------|------------|
| main | Production-ready code |
| development | Active development |

## Commit Convention

Format: `type(scope): description`

| Type | Keterangan |
|------|------------|
| feat | New feature |
| fix | Bug fix |
| docs | Documentation |
| style | Code style |
| refactor | Code refactoring |
| test | Testing |
| chore | Maintenance |

## Development Setup

### Prerequisites
- Python 3.12+
- Node.js 20+
- PostgreSQL 15+
- Redis 7+

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
pip install -r requirements-dev.txt
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Database Setup

```bash
# Start services with Docker
docker-compose up -d db redis

# Run migrations
alembic upgrade head
```

## Testing

### Backend Tests

```bash
cd backend
pytest tests/ --cov=app
```

### Frontend Tests

```bash
cd frontend
npm run test
npm run test:coverage
```

## Linting

### Backend

```bash
cd backend
ruff check app/
ruff format app/
mypy app/
```

### Frontend

```bash
cd frontend
npm run lint
npm run format
npm run typecheck
```

## Pre-commit Hooks

Pre-commit hooks dijalankan secara otomatis sebelum setiap commit:

- Ruff lint dan format (Backend)
- ESLint dan Prettier (Frontend)
- TypeScript type check
- Python mypy type check

## CI/CD Pipeline

GitHub Actions workflow dijalankan pada:
- Push ke branch `main` dan `development`
- Pull request ke branch `main` dan `development`

### Stages

1. Backend Lint - Ruff, mypy
2. Backend Test - pytest dengan coverage
3. Frontend Lint - ESLint, Prettier, TypeScript
4. Frontend Test - Vitest dengan coverage
5. Build - Next.js build

## Security

| Aspek | Implementasi |
|-------|--------------|
| Authentication | JWT dengan expiry |
| Authorization | Role-based access control |
| Input Validation | Pydantic / Zod |
| Password Storage | bcrypt dengan salt |
| Data Encryption | AES-256 untuk foto |
| Transit Security | HTTPS (TLS 1.3) |

## Contributing

Lihat `DEVELOPMENT.md` untuk panduan development.

## License

MIT License