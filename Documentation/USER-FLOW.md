# User Flow Document

---

## Wireframe Registrasi

```
┌────────────────────────────────────┐
│             REGISTRASI             │
├────────────────────────────────────┤
│                                    │
│  Email                             │
│  ┌──────────────────────────────┐  │
│  │ user@example.com             │  │
│  └──────────────────────────────┘  │
│                                    │
│  Password                          │
│  ┌──────────────────────────────┐  │
│  │ •••••••••••                  │  │
│  └──────────────────────────────┘  │
│                                    │
│  Nama Lengkap                      │
│  ┌──────────────────────────────┐  │
│  │ John Doe                     │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │          BUAT AKUN           │  │
│  └──────────────────────────────┘  │
│                                    │
│  Sudah punya akun? Masuk           │
└────────────────────────────────────┘
```

---

## Wireframe Habit Logger

```
┌────────────────────────────────────┐
│           LOG HABIT HARIAN         │
│             [Tanggal: ▼]           │
├────────────────────────────────────┤
│                                    │
│  TINGKAT STRES                     │
│                                    │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌───┐ │
│  │ 1  │ │ 2  │ │ 3  │ │ 4  │ │ 5 │ │
│  └────┘ └────┘ └────┘ └────┘ └───┘ │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌───┐ │
│  │ 6  │ │ 7  │ │ 8  │ │ 9  │ │10 │ │
│  └────┘ └────┘ └────┘ └────┘ └───┘ │
│                                    │
├────────────────────────────────────┤
│  JAM TIDUR                         │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ 7.5 jam                      │  │
│  └──────────────────────────────┘  │
│                                    │
├────────────────────────────────────┤
│  ASUPAN AIR                        │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ 2.5 liter                    │  │
│  └──────────────────────────────┘  │
│                                    │
├────────────────────────────────────┤
│  OLAHRAGA                          │
│                                    │
│  [✓] Ya, saya olahraga             │
│  [ ] Tidak                         │
│                                    │
│  Jenis: [Cardio] [Strength]        │
│  Durasi: 30 menit                  │
│                                    │
├────────────────────────────────────┤
│  NUTRISI MAKANAN                   │
│                                    │
│  ┌──────────────────────────────┐  │
│  │      [+] Tambah Makanan      │  │
│  └──────────────────────────────┘  │
│                                    │
│  Makanan Hari Ini:                 │
│  ┌──────────────────────────────┐  │
│  │ Tempe 100g  Protein: 19g  [×]│  │
│  │ Bayam 1 mgk Protein: 3g   [×]│  │
│  │ Telur 1 btr Protein: 6g   [×]│  │
│  └──────────────────────────────┘  │
│                                    │
│  Total: Protein 28g | Zinc 1.5mg   │
│                                    │
├────────────────────────────────────┤
│  ┌──────────────────────────────┐  │
│  │        SIMPAN LOG            │  │
│  └──────────────────────────────┘  │
│                                    │
└────────────────────────────────────┘
```

---

## Wireframe Pilih Sudut Foto

```
┌────────────────────────────────────┐
│         PILIH SUDUT FOTO           │
├────────────────────────────────────┤
│                                    │
│  Kuota: 12/25 | Storage: 18MB      │
│                                    │
├────────────────────────────────────┤
│                                    │
│  Pilih sudut foto:                 │
│                                    │
│  ┌─────────┐  ┌─────────┐          │
│  │  DEPAN  │  │  ATAS   │          │
│  │         │  │         │          │
│  │  Front  │  │  Top    │          │
│  │ ✓ Done  │  │ ✓ Done  │          │
│  │  75.2%  │  │  58.3%  │          │
│  └─────────┘  └─────────┘          │
│                                    │
│  ┌─────────┐  ┌─────────┐          │
│  │  KANAN  │  │  KIRI   │          │
│  │         │  │         │          │
│  │  Right  │  │  Left   │          │
│  │ ✓ Done  │  │ ✓ Done  │          │
│  │  68.1%  │  │  70.5%  │          │
│  └─────────┘  └─────────┘          │
│                                    │
│  ┌─────────┐                       │
│  │ CUSTOM  │                       │
│  │         │                       │
│  │ Area    │                       │
│  │ Botak   │                       │
│  │ ✓ Done  │                       │
│  │  45.0%  │                       │
│  └─────────┘                       │
│                                    │
├────────────────────────────────────┤
│  Progress: 5/5 sudut (100%)        │
│  Sisa: 13 foto | 482MB storage     │
│                                    │
└────────────────────────────────────┘
```

---

## Wireframe Hasil Analisis

```
┌────────────────────────────────────┐
│           HASIL ANALISIS           │
├────────────────────────────────────┤
│                                    │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  │     [Thumbnail Foto]         │  │
│  │                              │  │
│  │            62.5%             │  │
│  │      Kepadatan Rambut        │  │
│  │                              │  │
│  │     Severity: Stage 3-4      │  │
│  │       Confidence: 88%        │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ INFO KOMPRESI                │  │
│  │                              │  │
│  │  Ukuran Asli: 8.0 MB         │  │
│  │  Ukuran Kompresi: 1.5 MB     │  │
│  │  Penghematan: 81%            │  │
│  │  Resolusi: 1920 x 1440       │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ REKOMENDASI                  │  │
│  │                              │  │
│  │  1. Minoxidil 5% Solution    │  │
│  │  2. Hair Vitamin             │  │
│  │  3. Scalp Serum              │  │
│  │                              │  │
│  │  [Lihat Detail Produk]       │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ PERBANDINGAN                 │  │
│  │                              │  │
│  │  Sebelum: 65.0%              │  │
│  │  Sekarang: 62.5%             │  │
│  │  Perubahan: -2.5%            │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌───────────┐ ┌───────────┐       │
│  │ Grafik    │ │ Upload    │       │
│  │ Progress  │ │ Lainya    │       │
│  └───────────┘ └───────────┘       │
│                                    │
└────────────────────────────────────┘
```

---

## Wireframe Checklist Treatment

```
┌────────────────────────────────────┐
│           CHECKLIST HARIAN         │
│             [Tanggal: ▼]           │
├────────────────────────────────────┤
│                                    │
│  ┌──────────────────────────────┐  │
│  │ ☑ MINOXIDIL 5% - PAGI        │  │
│  │   08:00  ✓ Selesai 08:05     │  │
│  │   1ml applied to temples     │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ ○ MINOXIDIL 5% - MALAM       │  │
│  │   20:00  Belum               │  │
│  │   1ml applied to temples     │  │
│  │   ┌────────────────────┐     │  │
│  │   │  Tandai Selesai    │     │  │
│  │   └────────────────────┘     │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ ☑ HAIR VITAMIN               │  │
│  │   09:00  ✓ Selesai 09:15     │  │
│  │   1 tablet setelah makan     │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ ○ SCALP SERUM                │  │
│  │   21:00  Belum               │  │
│  │   Apply after minoxidil      │  │
│  │   ┌────────────────────┐     │  │
│  │   │  Tandai Selesai    │     │  │
│  │   └────────────────────┘     │  │
│  └──────────────────────────────┘  │
│                                    │
├────────────────────────────────────┤
│  STATISTIK HARIAN                  │
│                                    │
│  Penyelesaian: 2/4 (50%)           │
│  Streak: 7 hari                    │
│  Kepatuhan Minggu: 85%             │
│                                    │
└────────────────────────────────────┘
```

---

## Wireframe Dashboard

```
┌────────────────────────────────────┐
│ DASHBOARD HOME   🔔  [Profil ▼]    │
├────────────────────────────────────┤
│                                    │
│  Selamat datang, John!             │
│                                    │
├────────────────────────────────────┤
│        STATISTIK CEPAT             │
│                                    │
│  ┌───────┐ ┌───────┐ ┌───────┐     │
│  │PERTU  │ │SEVERI │ │STREAK │     │
│  │-2.5%  │ │Stage3 │ │ 7hari │     │
│  └───────┘ └───────┘ └───────┘     │
│                                    │
│  ┌───────┐ ┌────────┐              │
│  │KEPATU │ │ MINGGU │              │
│  │ 85%   │ │        │              │
│  └───────┘ └────────┘              │
│                                    │
├────────────────────────────────────┤
│      TREND KEPADATAN RAMBUT        │
│                                    │
│  80% │        ●───●───●            │
│  70% │    ●───●                    │
│  60% │●───●                        │
│  50% │●●                           │
│      └─────────────────            │
│       W1  W2  W3  W4  W5           │
│                                    │
├────────────────────────────────────┤
│          NUTRISI HARIAN            │
│                                    │
│  Nutrisi  Aktual  Target  Status   │
│  ────────────────────────────────  │
│  Protein   28g     50g     56%     │
│  Zinc     1.5mg    11mg    14%     │
│  Iron     7.1mg    18mg    39%     │
│  Biotin   10mcg    30mcg   33%     │
│                                    │
├────────────────────────────────────┤
│          TASK HARI INI             │
│                                    │
│  □ Log habit (stres, tidur)        │
│  □ Selesaikan treatment malam      │
│  □ Upload foto mingguan            │
│  ☑ Treatment pagi selesai          │
│                                    │
├────────────────────────────────────┤
│            INSIGHT                 │
│                                    │
│  • Kepadatan menurun 2.5%          │
│    dalam 2 minggu                  │
│  • Area crown perlu perhatian      │
│  • Asupan Zinc masih               │
│    di bawah target                 │
│                                    │
└────────────────────────────────────┘
```

---

## Wireframe Error States

```
┌────────────────────────────────────┐
│            ERROR KONEKSI           │
├────────────────────────────────────┤
│                                    │
│           ┌──────────┐             │
│           │    ⚠️    │             │
│           │  Error   │             │
│           └──────────┘             │
│                                    │
│  Tidak dapat terhubung ke server.  │
│  Silakan periksa koneksi Anda.     │
│                                    │
│  ┌────────────────────────────┐    │
│  │       COBA LAGI            │    │
│  └────────────────────────────┘    │
│                                    │
└────────────────────────────────────┘
```

---

## Wireframe Bottom Navigation

```
┌────────────────────────────────────┐
│          BOTTOM NAVIGATION         │
├────────────────────────────────────┤
│                                    │
│  ┌───────┐ ┌───────┐ ┌────────┐    │
│  │   📊  │ │   📷   │ │   💊   │    │
│  │  HOME │ │ PHOTO │ │ TREAT  │    │
│  └───────┘ └───────┘ └────────┘    │
│                                    │
│  ┌────────┐                        │
│  │   👤   │                        │
│  │PROFILE │                        │
│  └────────┘                        │
│                                    │
│  Dashboard  Upload  Treat  Account │
│                                    │
└────────────────────────────────────┘
```

---

## Wireframe In-App Notification

```
┌────────────────────────────────────┐
│            NOTIFICATIONS           │
│        [Tandai Semua Dibaca]       │
├────────────────────────────────────┤
│                                    │
│  Hari Ini                          │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ 💊 TREATMENT REMINDER  08:00 │  │
│  │                              │  │
│  │ Waktunya Minoxidil 5%        │  │
│  │ Jangan lupa treatment!       │  │
│  │                              │  │
│  │ [Selesai]  [Dismiss]         │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ 📊 HABIT REMINDER    10:00   │  │
│  │                              │  │
│  │ Sudahkah Anda log hari ini?  │  │
│  │ Jangan lupa catat stres!     │  │
│  │                              │  │
│  │ [Log]  [Nanti]               │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ 🔥 STREAK WARNING    19:00   │  │
│  │                              │  │
│  │ Streak Anda terancam putus!  │  │
│  │ Saat ini: 7 hari. Log!       │  │
│  │                              │  │
│  │ [Log Habit]  [Dismiss]       │  │
│  └──────────────────────────────┘  │
│                                    │
│  Kemarin                           │
│                                    │
│  ┌──────────────────────────────┐  │
│  │ 📈 PROGRESS UPDATE  Minggu   │  │
│  │                              │  │
│  │ Progress mingguan tersedia!  │  │
│  │ Kepadatan: -2.5%, Streak:7   │  │
│  │                              │  │
│  │ [Lihat]  ✓ Dibaca            │  │
│  └──────────────────────────────┘  │
│                                    │
└────────────────────────────────────┘
```

---

## Wireframe Notification Preferences

```
┌────────────────────────────────────┐
│       PENGATURAN NOTIFIKASI        │
├────────────────────────────────────┤
│                                    │
│  TREATMENT REMINDER                │
│  ┌──────────────────────────────┐  │
│  │ [✓] Aktif                    │  │
│  │ Waktu: [08:00 ▼]             │  │
│  └──────────────────────────────┘  │
│                                    │
│  HABIT REMINDER                    │
│  ┌──────────────────────────────┐  │
│  │ [✓] Aktif                    │  │
│  │ Waktu pagi: [09:00 ▼]        │  │
│  │ Waktu malam: [20:00 ▼]       │  │
│  └──────────────────────────────┘  │
│                                    │
│  PHOTO REMINDER                    │
│  ┌──────────────────────────────┐  │
│  │ [✓] Aktif                    │  │
│  │ Hari: [Minggu ▼]             │  │
│  │ Waktu: [10:00 ▼]             │  │
│  └──────────────────────────────┘  │
│                                    │
│  QUIET HOURS                       │
│  ┌──────────────────────────────┐  │
│  │ [✓] Aktif                    │  │
│  │ Dari jam: [22:00 ▼]          │  │
│  │ Sampai jam: [07:00 ▼]        │  │
│  └──────────────────────────────┘  │
│                                    │
│  CHANNEL                           │
│  ┌──────────────────────────────┐  │
│  │ [✓] In-App Push              │  │
│  │ [✓] Email                    │  │
│  │ [✓] Push Browser             │  │
│  │ [ ] SMS (Coming Soon)        │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │       SIMPAN PENGATURAN      │  │
│  └──────────────────────────────┘  │
│                                    │
└────────────────────────────────────┘
```

---

## 1. Gambaran Umum

### 1.1 Persona Pengguna

| Persona | Deskripsi | Tujuan Utama |
|---------|-----------|--------------|
| Pengguna Baru | Pengguna pertama kali | Pahami value, onboarding cepat |
| Pengguna Aktif | Pengguna rutin tracking | Logging harian, foto mingguan |
| Pengguna Analitik | Mencari insight | Lihat korelasi, tren data |
| Pengguna Perawatan | Dengan regimen perawatan | Lacak kepatuhan, streak |

### 1.2 Core User Flows

```mermaid
mindmap
  root((User Flows))
    Registrasi
      Landing Page
      Form Registrasi
      Verifikasi Email
      Setup Profil
    Habit Logging
      Dashboard
      Input Stres
      Input Tidur
      Input Air
      Input Nutrisi
      Input Olahraga
    Photo Upload
      Pilih Sudut
      Capture
      Kompresi
      Analisis AI
    Treatment
      Buat Treatment
      Checklist Harian
      Streak Tracking
```

---

## 2. Flow Registrasi

```mermaid
flowchart TD
    A[Landing Page] --> B[Klik Get Started]
    B --> C{Sudah Punya Akun?}
    C -->|Ya| D[Login]
    C -->|Tidak| E[Form Registrasi]
    E --> F[Input Email]
    F --> G[Input Password]
    G --> H[Input Nama]
    H --> I[Klik Register]
    I --> J{Validasi OK?}
    J -->|Tidak| K[Tampilkan Error]
    K --> E
    J -->|Ya| L[Kirim Email Verifikasi]
    L --> M[Cek Inbox]
    M --> N[Klik Link Verifikasi]
    N --> O[Setup Profil]
    O --> P[Input Usia]
    P --> Q[Pilih Gender]
    Q --> R[Set Goals]
    R --> S[Kuesioner Genetik]
    S --> T[Dashboard Tour]
    T --> U[Dashboard Home]
    D --> V{Validasi OK?}
    V -->|Tidak| W[Tampilkan Error]
    W --> D
    V -->|Ya| U
```

---

## 3. Flow Habit Logging

```mermaid
flowchart TD
    A[Buka Aplikasi] --> B[Dashboard]
    B --> C{Sudah Log Hari Ini?}
    C -->|Belum| D[Tampilkan Prompt]
    C -->|Sudah| E[Tampilkan Status]
    D --> F[Buka Form Logging]
    E --> G{Edit Data?}
    G -->|Ya| F
    G -->|Tidak| H[Lihat History]
    F --> I[Input Tingkat Stres 1-10]
    I --> J[Input Jam Tidur]
    J --> K[Input Asupan Air]
    K --> L[Input Olahraga]
    L --> M[Input Nutrisi]
    M --> N[Submit Log]
    N --> O[Update Database]
    O --> P[Update Analytics]
    P --> Q[Dashboard Updated]
```

---

## 4. Flow Photo Upload

```mermaid
flowchart TD
    A[Dashboard] --> B[Klik Upload Foto]
    B --> C[Pilih Sudut]
    C --> D{Sudut Tersedia}
    D -->|Depan| E[Front]
    D -->|Atas| F[Top]
    D -->|Kanan| G[Right]
    D -->|Kiri| H[Left]
    D -->|Custom| I[Custom Spot]
    E --> J[Buka Kamera]
    F --> J
    G --> J
    H --> J
    I --> J
    J --> K{Validasi}
    K -->|Fail| L[Tampilkan Error]
    K -->|Pass| M{Cek Kuota}
    M -->|Exceeded| N[Error Kuota]
    M -->|OK| O[Kompresi Foto]
    O --> P[Resize ke 1920px]
    P --> Q[JPEG Quality 85%]
    Q --> R[Strip Metadata]
    R --> S[Generate Thumbnail]
    S --> T[Upload ke Server]
    T --> U{Upload OK?}
    U -->|Gagal| V[Retry]
    U -->|Sukses| W[AI Analysis]
    W --> X[Hitung Density]
    X --> Y[Klasifikasi Severity]
    Y --> Z[Generate Report]
```

---

## 5. Flow Treatment

```mermaid
flowchart TD
    A[Halaman Treatment] --> B[Klik Tambah]
    B --> C{Pilih Tipe}
    C -->|Minoxidil| D[Form Minoxidil]
    C -->|Vitamin| E[Form Vitamin]
    C -->|Scalp Serum| F[Form Serum]
    C -->|Custom| G[Form Custom]
    D --> H[Set Dosis dan Jadwal]
    E --> H
    F --> H
    G --> H
    H --> I{Frekuensi}
    I -->|Harian| J[Set Waktu]
    I -->|Mingguan| K[Pilih Hari]
    I -->|Custom| L[Custom Schedule]
    J --> M[Preview Treatment]
    K --> M
    L --> M
    M --> N{Konfirmasi}
    N -->|Tidak| B
    N -->|Ya| O[Save Treatment]
    O --> P[Generate Checklist]
    P --> Q[Success]
```

---

## 6. Flow Dashboard

```mermaid
flowchart TD
    A[Login Success] --> B[Load Dashboard]
    B --> C[Fetch User Data]
    C --> D[Fetch Today Tasks]
    D --> E[Fetch Photo Data]
    E --> F[Fetch Habit Data]
    F --> G[Fetch Nutrition Data]
    G --> H[Fetch Treatment Data]
    H --> I[Calculate Analytics]
    I --> J[Calculate Severity]
    J --> K[Generate Insights]
    K --> L[Render Dashboard]
    L --> M{Quick Stats}
    M --> N[Hair Growth %]
    M --> O[Current Stage]
    M --> P[Treatment Streak]
    M --> Q[Compliance %]
    M --> R[Nutrition Score]
```

---

## 7. Flow Notification

```mermaid
flowchart TD
    subgraph Triggers
        A[Treatment Schedule]
        B[Habit Reminder]
        C[Photo Reminder]
        D[Insight Alert]
        E[Streak Warning]
    end
    subgraph Notification Service
        F[Queue Manager]
        G[Template Engine]
        H[Channel Router]
    end
    subgraph Channels
        I[In-App Push]
        J[Email]
        K[Push Browser]
    end
    A --> F
    B --> F
    C --> F
    D --> F
    E --> F
    F --> G
    G --> H
    H --> I
    H --> J
    H --> K
```

---

## 8. Tabel Data

### Tipe Treatment

| Tipe | Deskripsi | Contoh Produk |
|------|-----------|---------------|
| Minoxidil | Topical solution | Minoxidil 2%, 5% |
| Finasteride | Oral medication | Finasteride 1mg |
| Hair Vitamin | Suplemen | Biotin, Zinc, Vitamin D |
| Scalp Serum | Topical serum | Niacinamide, Peptide |
| Scalp Shampoo | Shampo khusus | Ketoconazole, Oil control |
| Scalp Massage | Terapi pijat | Derma roller |
| Custom | Lainnya | Sesuai kebutuhan |

### Tipe Notifikasi

| Tipe | Trigger | Channel | Frekuensi |
|------|---------|---------|-----------|
| Treatment Reminder | Jadwal treatment | In-App, Push | Real-time |
| Habit Reminder | Belum log hari ini | In-App, Email | 10:00, 20:00 |
| Photo Reminder | Jadwal foto mingguan | Email | Mingguan |
| Streak Warning | Streak akan putus | Push | Real-time |
| Insight Alert | Insight baru tersedia | In-App | On-demand |
| Progress Update | Progress mingguan | Email | Mingguan |
| Severity Alert | Severity berubah signifikan | Email | On-demand |

### Key Success Metrics

| Metrik | Target | Pengukuran |
|--------|--------|-------------|
| Penyelesaian Hari 1 | 80% | Complete onboarding |
| Retensi Minggu 1 | 60% | Return after 7 days |
| Kepatuhan Foto | 70% | Weekly photo uploads |
| Kepatuhan Treatment | 70% | Daily completion |
| Kepatuhan Nutrisi | 60% | Daily food logging |
| Engagement Insight | 50% | View correlation data |
| Click Rate Rekomendasi | 30% | Click on products/videos |