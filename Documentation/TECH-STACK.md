# Technology Stack

---

## 1. Stack Overview

```mermaid
graph TB
    subgraph FRONTEND
        A[Next.js]
        B[TypeScript]
        C[Tailwind CSS]
        D[Recharts]
        E[React Query]
    end
    
    subgraph BACKEND
        F[FastAPI]
        G[Pydantic]
        H[SQLAlchemy]
        I[Alembic]
        J[JWT Auth]
    end
    
    subgraph AI_ML
        K[Python]
        L[OpenCV]
        M[TensorFlow]
        N[NumPy]
    end
    
    subgraph DATA
        O[(PostgreSQL)]
        P[Redis]
        Q[MinIO or S3]
    end
    
    subgraph INFRA
        R[Docker]
        S[GitHub Actions]
        T[Nginx]
    end
    
    A --> F
    F --> K
    F --> O
    F --> P
    F --> Q
```

---

## 2. Frontend Technologies

### 2.1 Framework Utama

| Teknologi | Tujuan | Justifikasi |
|-----------|--------|-------------|
| Next.js | React framework | SSR, SSG, App Router |
| TypeScript | Type safety | Compile-time error detection |
| React | UI library | Component architecture |

### 2.2 Styling

| Teknologi | Tujuan | Justifikasi |
|-----------|--------|-------------|
| Tailwind CSS | Utility-first CSS | Rapid prototyping, consistent design |
| PostCSS | CSS processing | Autoprefixer, optimizations |

### 2.3 State Management

| Teknologi | Tujuan | Justifikasi |
|-----------|--------|-------------|
| React Query | Server state | Automatic caching, background refetching |
| React Context | Global state | Lightweight, no dependencies |

### 2.4 Data Visualization

| Teknologi | Tujuan | Justifikasi |
|-----------|--------|-------------|
| Recharts | Charts library | React-native, composable, responsive |

### 2.5 Form Handling

| Teknologi | Tujuan | Justifikasi |
|-----------|--------|-------------|
| React Hook Form | Form management | Performance, validation integration |
| Zod | Schema validation | Type inference, runtime validation |

---

## 3. Backend Technologies

### 3.1 Framework Utama

| Teknologi | Tujuan | Justifikasi |
|-----------|--------|-------------|
| FastAPI | Web framework | Async support, automatic docs, type hints |
| Uvicorn | ASGI server | Production-ready, async capable |
| Pydantic | Data validation | Type safety, serialization |

### 3.2 Database

| Teknologi | Tujuan | Justifikasi |
|-----------|--------|-------------|
| PostgreSQL | Primary database | ACID, JSON support, scalability |
| SQLAlchemy | ORM | Async support, type safety |
| Alembic | Migrations | Version control for database |
| asyncpg | Async driver | High performance |

### 3.3 Authentication

| Teknologi | Tujuan | Justifikasi |
|-----------|--------|-------------|
| JWT | Token-based auth | Stateless, scalable |
| Passlib | Password hashing | bcrypt, secure |

### 3.4 Caching

| Teknologi | Tujuan | Justifikasi |
|-----------|--------|-------------|
| Redis | Caching, sessions | Fast in-memory, pub/sub support |

---

## 4. AI/ML Technologies

### 4.1 Libraries Utama

| Teknologi | Tujuan | Justifikasi |
|-----------|--------|-------------|
| Python | Programming language | ML ecosystem, async support |
| OpenCV | Image processing | Preprocessing, segmentation |
| TensorFlow | ML framework | Production-ready, Keras integration |
| NumPy | Numerical computing | Array operations |

### 4.2 Model Pipeline

```mermaid
flowchart LR
    A[Input Image] --> B[Preprocessing]
    B --> C[Feature Extraction]
    C --> D[Classification]
    D --> E[Density Output]
    
    subgraph Preprocessing
        B1[Resize]
        B2[Normalize]
        B3[CLAHE]
    end
    
    subgraph Feature Extraction
        C1[MobileNetV2]
        C2[Global Pooling]
    end
    
    subgraph Classification
        D1[Dense Layers]
        D2[Sigmoid Output]
    end
```

---

## 5. Infrastructure

### 5.1 Containerization

| Teknologi | Tujuan | Justifikasi |
|-----------|--------|-------------|
| Docker | Containerization | Consistent environments |
| Docker Compose | Multi-container | Development orchestration |

### 5.2 CI/CD

| Teknologi | Tujuan | Justifikasi |
|-----------|--------|-------------|
| GitHub Actions | CI/CD pipeline | Native GitHub integration |
| Husky | Pre-commit hooks | Local validation |

### 5.3 Web Server

| Teknologi | Tujuan | Justifikasi |
|-----------|--------|-------------|
| Nginx | Reverse proxy | Load balancing, SSL termination |

---

## 6. Development Tools

### 6.1 Linter dan Formatter

| Tool | Platform | Konfigurasi |
|------|----------|-------------|
| ESLint | Frontend | eslintrc.json |
| Prettier | Frontend | prettierrc |
| Ruff | Backend | pyproject.toml |
| mypy | Backend | pyproject.toml |

### 6.2 Testing

| Tool | Platform | Konfigurasi |
|------|----------|-------------|
| pytest | Backend | pytest.ini |
| Vitest | Frontend | vitest.config.ts |
| Playwright | E2E | playwright.config.ts |

---

## 7. Third-Party Services

### 7.1 Required

| Service | Tujuan |
|---------|--------|
| Cloud Storage | Photo storage (S3-compatible) |
| Email Service | Verification emails |

### 7.2 Optional

| Service | Tujuan |
|---------|--------|
| CDN | Static asset delivery |
| Analytics | User behavior tracking |
| Error Tracking | Error monitoring |

---

## 8. Version Compatibility

| Komponen | Minimum | Rekomendasi |
|----------|----------|-------------|
| Python | 3.12 | 3.12 |
| Node.js | 20 | 22 |
| PostgreSQL | 15 | 16 |
| Redis | 6 | 7 |
| Docker | 24 | 27 |

---

## 9. Security

### 9.1 Dependency Security

```bash
# Backend security check
pip install safety
safety check --file requirements.txt

# Frontend security check
npm audit
npm audit fix
```

### 9.2 Environment Variables

```bash
# Environment variables required
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/scalpanalytics
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["http://localhost:3000"]
```

---

## 10. Performance Benchmarks

### 10.1 Target Metrics

| Metrik | Target | Pengukuran |
|--------|--------|------------|
| API Response | Kurang dari 500 ms | p95 |
| Photo Analysis | Kurang dari 30 s | End-to-end |
| Page Load | Kurang dari 3 s | LCP |
| Database Query | Kurang dari 100 ms | p95 |
| Cache Hit Rate | Lebih dari 80% | Redis |