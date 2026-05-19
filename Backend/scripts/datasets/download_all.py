"""
Script otomatis download semua dataset foto untuk Scalp Analytics.

Sumber:
1. ISIC HAM10000     — CC-BY-NC-4.0 | Dermoscopy, transfer learning base
2. HuggingFace       — TrainingDataPro bald-men, bald-women (preview gratis)
3. HuggingFace       — UniDataPro hair-loss-male-norwood-scale (preview gratis)
4. Roboflow          — Hair & Scalp Disease (butuh ROBOFLOW_API_KEY)
5. Roboflow          — Hair Disease Detection (butuh ROBOFLOW_API_KEY)

Jalankan:
    cd Backend
    python storage/datasets/download_all.py

Optional:
    ROBOFLOW_API_KEY=xxx python storage/datasets/download_all.py
    KAGGLE_USERNAME=xxx KAGGLE_KEY=xxx python storage/datasets/download_all.py
"""

import json
import os
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import requests
from PIL import Image
from tqdm import tqdm


BASE_DIR = Path(__file__).parent

# ─────────────────────────────────────────────
# Konfigurasi
# ─────────────────────────────────────────────
ISIC_LIMIT = 500  # Jumlah gambar dari HAM10000 (max 10015)
HF_BALD_MEN_LIMIT = 200  # Preview gratis HuggingFace
HF_BALD_WOMEN_LIMIT = 100
HF_NORWOOD_LIMIT = 25  # Preview gratis UniDataPro (hanya 25 rows)
MAX_WORKERS = 8  # Thread paralel untuk download


# ─────────────────────────────────────────────
# 1. ISIC HAM10000
# ─────────────────────────────────────────────


def download_isic_ham10000(limit: int = ISIC_LIMIT):
    """Download subset HAM10000 dari ISIC Archive (CC-BY-NC-4.0, gratis)."""
    out_dir = BASE_DIR / "isic_ham10000" / "images"
    meta_file = BASE_DIR / "isic_ham10000" / "metadata.json"
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"\n[ISIC HAM10000] Fetching image list (limit={limit})...")

    # HAM10000 collection id = 212
    images = []
    url = "https://api.isic-archive.com/api/v2/images/?limit=100&collections=212"
    while url and len(images) < limit:
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        images.extend(data["results"])
        url = data.get("next")
        if len(images) >= limit:
            images = images[:limit]
            break

    print(f"[ISIC HAM10000] {len(images)} gambar akan didownload...")

    metadata = []

    def _download_one(img):
        isic_id = img["isic_id"]
        img_url = img["files"]["full"]["url"]
        dest = out_dir / f"{isic_id}.jpg"
        if dest.exists():
            return {"isic_id": isic_id, "status": "skip"}
        try:
            r = requests.get(img_url, timeout=30)
            r.raise_for_status()
            dest.write_bytes(r.content)
            return {
                "isic_id": isic_id,
                "url": img_url,
                "license": img["copyright_license"],
                "status": "ok",
            }
        except Exception as e:
            return {"isic_id": isic_id, "status": "error", "error": str(e)}

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as ex:
        futures = {ex.submit(_download_one, img): img for img in images}
        for f in tqdm(as_completed(futures), total=len(futures), desc="ISIC HAM10000"):
            metadata.append(f.result())

    meta_file.write_text(json.dumps(metadata, indent=2))
    ok = sum(1 for m in metadata if m["status"] == "ok")
    skip = sum(1 for m in metadata if m["status"] == "skip")
    err = sum(1 for m in metadata if m["status"] == "error")
    print(f"[ISIC HAM10000] Selesai: {ok} downloaded, {skip} skipped, {err} errors")
    return metadata


# ─────────────────────────────────────────────
# 2. HuggingFace Datasets
# ─────────────────────────────────────────────


def download_huggingface(repo_id: str, out_name: str, limit: int, split: str = "train"):
    """Download preview dataset dari HuggingFace (tanpa auth, streaming)."""
    from datasets import load_dataset  # type: ignore

    out_dir = BASE_DIR / out_name / "images"
    meta_file = BASE_DIR / out_name / "metadata.json"
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"\n[HuggingFace] {repo_id} (limit={limit})...")

    try:
        ds = load_dataset(repo_id, split=split, streaming=True, trust_remote_code=True)
    except Exception as e:
        print(f"[HuggingFace] Gagal load {repo_id}: {e}")
        return []

    metadata = []
    for i, row in enumerate(tqdm(ds, total=limit, desc=f"HF/{out_name}")):
        if i >= limit:
            break
        try:
            img = row.get("image") or row.get("photo") or row.get("img")
            label = row.get("label", row.get("class", "unknown"))
            if img is None:
                continue
            fname = f"{out_name}_{i:04d}.jpg"
            dest = out_dir / fname
            if not dest.exists():
                if not isinstance(img, Image.Image):
                    img = Image.fromarray(img)
                img.convert("RGB").save(dest, "JPEG", quality=90)
            metadata.append({"file": fname, "label": str(label), "source": repo_id})
        except Exception as e:
            metadata.append({"file": f"row_{i}", "error": str(e), "source": repo_id})

    meta_file.write_text(json.dumps(metadata, indent=2))
    ok = sum(1 for m in metadata if "error" not in m)
    print(f"[HuggingFace] {repo_id}: {ok}/{limit} gambar disimpan")
    return metadata


# ─────────────────────────────────────────────
# 3. Roboflow (butuh API key)
# ─────────────────────────────────────────────


def download_roboflow(workspace: str, project: str, version: int, out_name: str):
    """Download dataset dari Roboflow Universe (butuh ROBOFLOW_API_KEY)."""
    api_key = os.environ.get("ROBOFLOW_API_KEY")
    if not api_key:
        print(f"\n[Roboflow] SKIP {project} — set ROBOFLOW_API_KEY untuk download")
        _write_roboflow_instructions(out_name, workspace, project, version)
        return []

    try:
        from roboflow import Roboflow  # type: ignore
    except ImportError:
        print("[Roboflow] Install dulu: pip install roboflow")
        return []

    out_dir = BASE_DIR / out_name
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"\n[Roboflow] Downloading {workspace}/{project} v{version}...")
    rf = Roboflow(api_key=api_key)
    project_obj = rf.workspace(workspace).project(project)
    project_obj.version(version).download("folder", location=str(out_dir))
    print(f"[Roboflow] Selesai: {out_dir}")
    return [
        {
            "source": f"{workspace}/{project}",
            "version": version,
            "location": str(out_dir),
        }
    ]


def _write_roboflow_instructions(
    out_name: str, workspace: str, project: str, version: int
):
    """Tulis instruksi cara download Roboflow manual."""
    instructions = f"""# Download Roboflow Dataset: {project}

## Cara 1: Python (Otomatis)
```bash
pip install roboflow
export ROBOFLOW_API_KEY=your_api_key_here
python storage/datasets/download_all.py
```

## Cara 2: Manual via Browser
1. Buka https://universe.roboflow.com/{workspace}/{project}
2. Klik "Download Dataset"
3. Pilih format "Folder" atau "YOLOv8"
4. Extract ke folder: Backend/storage/datasets/{out_name}/

## Cara 3: curl (setelah dapat API key)
```bash
curl -L "https://app.roboflow.com/ds/XXXX?key=$ROBOFLOW_API_KEY" > roboflow_{project}.zip
unzip roboflow_{project}.zip -d storage/datasets/{out_name}/
```

API Key gratis di: https://app.roboflow.com/settings/api
"""
    (BASE_DIR / out_name / "DOWNLOAD_INSTRUCTIONS.md").write_text(instructions)


# ─────────────────────────────────────────────
# 4. Kaggle (butuh kredensial)
# ─────────────────────────────────────────────


def download_kaggle(dataset: str, out_name: str):
    """Download dataset dari Kaggle (butuh ~/.kaggle/kaggle.json)."""
    kaggle_json = Path.home() / ".kaggle" / "kaggle.json"
    username = os.environ.get("KAGGLE_USERNAME")
    key = os.environ.get("KAGGLE_KEY")

    if not kaggle_json.exists() and not (username and key):
        print(f"\n[Kaggle] SKIP {dataset} — setup kredensial dulu")
        _write_kaggle_instructions(out_name, dataset)
        return []

    if username and key and not kaggle_json.exists():
        kaggle_json.parent.mkdir(exist_ok=True)
        kaggle_json.write_text(json.dumps({"username": username, "key": key}))
        kaggle_json.chmod(0o600)

    try:
        import kaggle  # type: ignore
    except ImportError:
        print("[Kaggle] Install dulu: pip install kaggle")
        return []

    out_dir = BASE_DIR / out_name
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"\n[Kaggle] Downloading {dataset}...")
    kaggle.api.authenticate()
    kaggle.api.dataset_download_files(dataset, path=str(out_dir), unzip=True)
    print(f"[Kaggle] Selesai: {out_dir}")
    return [{"source": f"kaggle/{dataset}", "location": str(out_dir)}]


def _write_kaggle_instructions(out_name: str, dataset: str):
    instructions = f"""# Download Kaggle Dataset: {dataset}

## Cara 1: CLI (Otomatis setelah setup)
```bash
# 1. Buat akun di kaggle.com
# 2. Download API token dari: kaggle.com/settings -> API -> Create New Token
# 3. Simpan kaggle.json ke ~/.kaggle/kaggle.json
# 4. Jalankan:
kaggle datasets download -d {dataset} -p storage/datasets/{out_name}/ --unzip
```

## Cara 2: Environment Variable
```bash
KAGGLE_USERNAME=your_username KAGGLE_KEY=your_key python storage/datasets/download_all.py
```

## Cara 3: Manual via Browser
1. Buka https://www.kaggle.com/datasets/{dataset}
2. Klik "Download"
3. Extract ke: Backend/storage/datasets/{out_name}/

API key gratis di: https://www.kaggle.com/settings (tab API)
"""
    (BASE_DIR / out_name / "DOWNLOAD_INSTRUCTIONS.md").write_text(instructions)


# ─────────────────────────────────────────────
# 5. Summary Report
# ─────────────────────────────────────────────


def write_summary(results: dict):
    total_files = 0
    summary_lines = ["# Dataset Download Summary\n"]

    for name, _meta in results.items():
        img_dir = BASE_DIR / name / "images"
        count = len(list(img_dir.glob("*.jpg"))) if img_dir.exists() else 0
        total_files += count
        status = (
            "✅" if count > 0 else "⚠️  (butuh API key — lihat DOWNLOAD_INSTRUCTIONS.md)"
        )
        summary_lines.append(f"## {name}")
        summary_lines.append(f"- Status: {status}")
        summary_lines.append(f"- Gambar tersimpan: {count}")
        summary_lines.append("")

    summary_lines.append(f"## Total: {total_files} gambar")
    (BASE_DIR / "SUMMARY.md").write_text("\n".join(summary_lines))
    print(f"\n{'=' * 50}")
    print(f"TOTAL GAMBAR TERSIMPAN: {total_files}")
    print("Lihat: storage/datasets/SUMMARY.md")
    print(f"{'=' * 50}")


# ─────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────

if __name__ == "__main__":
    results = {}

    # 1. ISIC HAM10000 — dermoscopy, transfer learning base (CC-BY-NC-4.0)
    results["isic_ham10000"] = download_isic_ham10000(limit=ISIC_LIMIT)

    # 2. HuggingFace — bald men dengan label Norwood (preview 200 rows gratis)
    results["hf_bald_men"] = download_huggingface(
        repo_id="TrainingDataPro/bald-men",
        out_name="hf_bald_men",
        limit=HF_BALD_MEN_LIMIT,
    )

    # 3. HuggingFace — bald women dengan label Ludwig (preview 100 rows gratis)
    results["hf_bald_women"] = download_huggingface(
        repo_id="TrainingDataPro/bald-women",
        out_name="hf_bald_women",
        limit=HF_BALD_WOMEN_LIMIT,
    )

    # 4. HuggingFace — UniDataPro Norwood scale (hanya 25 preview rows)
    results["hf_norwood"] = download_huggingface(
        repo_id="UniDataPro/hair-loss-male-norwood-scale",
        out_name="hf_norwood",
        limit=HF_NORWOOD_LIMIT,
    )

    # 5. Roboflow Hair & Scalp Disease (butuh ROBOFLOW_API_KEY)
    results["roboflow_hair_scalp"] = download_roboflow(
        workspace="nayab-waris-hfzbj",
        project="hair-and-scalp-disease",
        version=1,
        out_name="roboflow_hair_scalp",
    )

    # 6. Roboflow Hair Disease Detection (butuh ROBOFLOW_API_KEY)
    results["roboflow_hair_disease"] = download_roboflow(
        workspace="project-teqqx",
        project="hair-disease-detection",
        version=1,
        out_name="roboflow_hair_disease",
    )

    # 7. Kaggle Bald People 5000 (butuh Kaggle credentials)
    results["kaggle_bald_people"] = download_kaggle(
        dataset="tapakah68/dataset-of-bald-people",
        out_name="kaggle_bald_people",
    )

    write_summary(results)
