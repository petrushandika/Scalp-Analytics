# Scalp Analytics — Frontend

Next.js 15 frontend untuk sistem analisis kesehatan kulit kepala. Menggunakan App Router, React Query untuk data fetching, dan Tailwind CSS untuk styling.

## Tech Stack

| Komponen | Teknologi |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| State Management | TanStack React Query 5 |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |
| Charts | Recharts |
| Testing | Vitest + Testing Library |
| Linting | ESLint + Prettier |

## Struktur Proyek

```
Frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/          # Halaman login
│   │   └── register/       # Halaman registrasi
│   ├── (dashboard)/
│   │   ├── layout.tsx      # Layout dashboard + nav sidebar
│   │   ├── page.tsx        # Dashboard utama (analytics)
│   │   ├── photos/         # Upload foto & analisis AI
│   │   ├── habits/         # Log habit harian
│   │   ├── treatments/     # Manajemen treatment
│   │   ├── nutrition/      # Log makan & air minum
│   │   └── profile/        # Profil pengguna
│   ├── globals.css
│   └── layout.tsx          # Root layout
├── components/
│   ├── auth/               # Login & Register forms
│   ├── dashboard/          # Dashboard client component
│   ├── habits/             # Habit form & list
│   ├── layout/             # Nav sidebar & Providers
│   ├── nutrition/          # Water tracker & meal log
│   ├── photos/             # Photo upload & grid
│   ├── profile/            # Profile edit form
│   ├── treatments/         # Treatment form & list
│   └── ui/                 # Shared UI components (Button, Input, Badge, dll)
├── hooks/                  # React Query hooks per domain
├── lib/
│   ├── api.ts              # Axios client + semua API functions
│   ├── schema.ts           # Zod validation schemas
│   └── utils.ts            # cn(), formatDate(), getErrorMessage()
├── types/                  # TypeScript interfaces per domain
├── middleware.ts            # Route protection (redirect ke login jika belum auth)
├── next.config.ts
└── .env.local.example
```

## Prerequisites

- Node.js 20+
- npm 10+
- Backend berjalan di `http://localhost:8000`

## Setup

### 1. Masuk ke folder

```bash
cd Scalp-Analytics/Frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Konfigurasi environment

```bash
cp .env.local.example .env.local
```

Isi `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Scalp Analytics
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Jalankan dev server

```bash
npm run dev
```

Buka `http://localhost:3000`

> Jika port 3000 sudah dipakai, Next.js otomatis menggunakan port berikutnya (3001, dst). Perhatikan output terminal untuk URL yang benar.

## Scripts

| Script | Keterangan |
|---|---|
| `npm run dev` | Jalankan dev server dengan hot reload |
| `npm run build` | Build untuk production |
| `npm run start` | Jalankan production build |
| `npm run lint` | Cek ESLint errors |
| `npm run lint:fix` | Auto-fix ESLint errors |
| `npm run format` | Format semua file dengan Prettier |
| `npm run format:check` | Cek formatting tanpa mengubah file |
| `npm run typecheck` | Cek TypeScript errors |
| `npm run test` | Jalankan unit tests (watch mode) |
| `npm run test:run` | Jalankan unit tests sekali |
| `npm run test:coverage` | Jalankan tests dengan laporan coverage |

## Halaman

| Path | Keterangan |
|---|---|
| `/login` | Form login |
| `/register` | Form registrasi |
| `/dashboard` | Ringkasan analytics (severity stage, streak, treatment) |
| `/dashboard/photos` | Upload foto, lihat hasil analisis AI, galeri foto |
| `/dashboard/habits` | Log stress harian, durasi tidur, konsumsi air |
| `/dashboard/treatments` | Tambah & kelola jadwal perawatan |
| `/dashboard/nutrition` | Water tracker + log makan berdasarkan database makanan |
| `/dashboard/profile` | Lihat & edit data profil |

## Autentikasi

Middleware Next.js (`middleware.ts`) melindungi semua route di luar `/login`, `/register`, dan `/forgot-password`. Jika belum login, pengguna diarahkan ke `/login`.

Token disimpan di `localStorage` dan disinkronkan ke cookie agar middleware server-side dapat membacanya.

## API Client

Semua komunikasi dengan backend ada di `lib/api.ts`. Axios instance sudah dikonfigurasi dengan:

- Base URL dari `NEXT_PUBLIC_API_URL`
- Auto-attach `Authorization: Bearer <token>` di setiap request
- Auto-refresh token jika response 401
- Normalisasi error ke format `ApiError`

Contoh penggunaan hook:

```tsx
import { usePhotos, useUploadPhoto } from "@/hooks/photo";

function PhotoPage() {
  const { data: photos, isLoading } = usePhotos();
  const upload = useUploadPhoto();

  const handleUpload = (file: File) => {
    upload.mutate({ file, angle: "front" });
  };
}
```

## Testing

```bash
npm run test:run
npm run test:coverage
```

Test files berada di `components/ui/__tests__/`.

## Environment Variables

| Variable | Keterangan |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL backend API (default: `http://localhost:8000`) |
| `NEXT_PUBLIC_APP_NAME` | Nama aplikasi yang ditampilkan |
| `NEXT_PUBLIC_APP_URL` | URL frontend (digunakan untuk redirect) |
