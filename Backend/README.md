# Scalp Analytics — Backend

FastAPI backend untuk sistem analisis kesehatan kulit kepala berbasis AI. Menggunakan clean architecture dengan layer domain, application, infrastructure, dan presentation.

## Tech Stack

| Komponen | Teknologi |
|---|---|
| Framework | FastAPI 0.115+ |
| Language | Python 3.12 |
| ORM | SQLAlchemy 2.0 async |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| AI Inference | ONNX Runtime |
| Auth | JWT (python-jose) |
| Migration | Alembic |
| Linting | Ruff |
| Testing | pytest + pytest-asyncio |

## Struktur Proyek

```
Backend/
├── app/
│   ├── application/
│   │   ├── dto/            # Data Transfer Objects
│   │   └── services/       # Business logic (auth, jwt)
│   ├── domain/
│   │   └── entities/       # Domain entities
│   ├── infrastructure/
│   │   ├── ai/             # ONNX model inference
│   │   ├── database/       # Models, migrations, seed
│   │   ├── repositories/   # Database access layer
│   │   └── storage/        # File storage (local)
│   ├── presentation/
│   │   ├── middleware/     # Auth & error handlers
│   │   ├── routers/        # API route handlers
│   │   └── schemas/        # Pydantic request/response schemas
│   ├── config.py           # Settings via pydantic-settings
│   └── main.py             # App factory + lifespan
├── alembic/                # Database migrations
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── requirements.txt
├── requirements-dev.txt
└── .env.example
```

## Prerequisites

- Python 3.12+
- PostgreSQL 16
- Redis 7
- (Opsional) Docker & Docker Compose

## Setup

### 1. Clone & masuk ke folder

```bash
cd Scalp-Analytics/Backend
```

### 2. Buat virtual environment

```bash
python -m venv venv
source venv/bin/activate        # macOS / Linux
# venv\Scripts\activate         # Windows
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Konfigurasi environment

```bash
cp .env.example .env
```

Edit `.env` sesuai konfigurasi lokal:

```env
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/scalp_analytics
REDIS_URL=redis://localhost:6379/0
JWT_SECRET_KEY=ganti-dengan-secret-key-minimal-32-karakter
APP_SECRET_KEY=ganti-dengan-secret-key-minimal-32-karakter
```

### 5. Jalankan database (via Docker)

```bash
docker run -d \
  --name scalp_postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=scalp_analytics \
  -p 5432:5432 \
  postgres:16-alpine

docker run -d \
  --name scalp_redis \
  -p 6379:6379 \
  redis:7-alpine
```

Atau gunakan Docker Compose dari root project:

```bash
docker compose up -d postgres redis
```

### 6. Jalankan migrasi database

```bash
alembic upgrade head
```

### 7. Seed data awal (opsional)

Menambahkan 13 nutrisi dan 30 makanan ke database:

```bash
python -m app.infrastructure.database.seed
```

### 8. Jalankan server

```bash
python -m uvicorn app.main:app --reload
```

Server berjalan di `http://localhost:8000`

> **Penting:** Selalu gunakan `python -m uvicorn` (bukan `uvicorn` langsung) agar menggunakan Python dari virtual environment yang aktif.

## AI Model

Backend menggunakan model ONNX untuk klasifikasi stadium kebotakan (Norwood scale). File model tidak disertakan di repository karena ukurannya besar.

### Melatih model sendiri

Lihat notebook Google Colab di `Documentation/Scalp_Analytics_Training.ipynb`.

### Meletakkan model yang sudah dilatih

```bash
cp scalp_model.onnx app/infrastructure/ai/models/scalp_model.onnx
```

Jika model tidak ada, endpoint analisis foto akan mengembalikan error 422.

## API Documentation

Setelah server berjalan, buka:

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`
- **Health check:** `http://localhost:8000/health`

## Endpoints

| Method | Path | Deskripsi | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Registrasi akun | — |
| POST | `/api/auth/login` | Login, dapat token | — |
| POST | `/api/auth/refresh` | Refresh access token | — |
| POST | `/api/auth/logout` | Logout | ✓ |
| GET | `/api/users/me` | Profil user | ✓ |
| PUT | `/api/users/me` | Update profil | ✓ |
| POST | `/api/photos/analyze` | Analisis AI tanpa simpan | — |
| POST | `/api/photos/upload` | Upload + analisis + simpan | ✓ |
| GET | `/api/photos/` | Daftar foto | ✓ |
| DELETE | `/api/photos/:id` | Hapus foto | ✓ |
| POST | `/api/habits/` | Log habit harian | ✓ |
| GET | `/api/habits/` | Riwayat habit | ✓ |
| POST | `/api/treatments/` | Tambah treatment | ✓ |
| GET | `/api/treatments/` | Daftar treatment | ✓ |
| PATCH | `/api/treatments/:id/deactivate` | Nonaktifkan treatment | ✓ |
| GET | `/api/analytics/` | Ringkasan analitik | ✓ |
| GET | `/api/nutrition/foods` | Cari makanan | ✓ |
| POST | `/api/nutrition/meals` | Log makan | ✓ |
| POST | `/api/nutrition/water` | Log air minum | ✓ |
| GET | `/api/nutrition/water/today` | Konsumsi air hari ini | ✓ |

## Development

### Install dev dependencies

```bash
pip install -r requirements-dev.txt
```

### Linting & Formatting

```bash
ruff check app/
ruff format app/
```

### Testing

```bash
pytest tests/
pytest tests/ --cov=app --cov-report=html
```

### Membuat migrasi baru

Setelah mengubah model di `infrastructure/database/models.py`:

```bash
alembic revision --autogenerate -m "deskripsi perubahan"
alembic upgrade head
```

## Environment Variables

| Variable | Default | Keterangan |
|---|---|---|
| `APP_ENV` | `development` | Environment (`development`, `staging`, `production`) |
| `APP_DEBUG` | `true` | Debug mode |
| `APP_SECRET_KEY` | — | Secret key aplikasi (wajib diubah di production) |
| `DATABASE_URL` | — | PostgreSQL connection string |
| `REDIS_URL` | `redis://localhost:6379/0` | Redis connection string |
| `JWT_SECRET_KEY` | — | Secret key JWT (wajib diubah di production) |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | Masa berlaku access token |
| `JWT_REFRESH_TOKEN_EXPIRE_DAYS` | `7` | Masa berlaku refresh token |
| `CORS_ORIGINS` | `["http://localhost:3000"]` | Allowed CORS origins (JSON array) |
| `STORAGE_PATH` | `./storage` | Path penyimpanan file upload |
| `MAX_UPLOAD_SIZE_MB` | `10` | Ukuran maksimal upload (MB) |
