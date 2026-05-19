from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image


MODEL_PATH = Path(__file__).parent / "models" / "scalp_model.onnx"

STAGES = [f"stage_{i}" for i in range(8)]

RECOMMENDATIONS = {
    "stage_0": "Rambut sehat. Pertahankan pola makan dan perawatan rutin.",
    "stage_1": "Kerontokan sangat minimal. Mulai perawatan preventif.",
    "stage_2": "Kerontokan ringan. Konsultasi dengan dermatolog disarankan.",
    "stage_3": "Kerontokan sedang. Segera konsultasi dengan spesialis rambut.",
    "stage_4": "Kerontokan signifikan. Diperlukan penanganan medis.",
    "stage_5": "Kerontokan lanjut. Konsultasi segera dengan dokter spesialis.",
    "stage_6": "Kerontokan parah. Penanganan medis intensif diperlukan.",
    "stage_7": "Kebotakan total. Konsultasi dengan dokter untuk opsi perawatan.",
}


class ScalpAnalyzer:
    _session: ort.InferenceSession | None = None

    @classmethod
    def _get_session(cls) -> ort.InferenceSession:
        if cls._session is None:
            cls._session = ort.InferenceSession(str(MODEL_PATH))
        return cls._session

    @classmethod
    def analyze(cls, image_bytes: bytes) -> dict:
        img = (
            Image.open(__import__("io").BytesIO(image_bytes))
            .convert("RGB")
            .resize((224, 224))
        )
        arr = np.array(img, dtype=np.float32) / 255.0
        arr = np.expand_dims(arr, axis=0)

        session = cls._get_session()
        outputs = session.run(None, {"input": arr})[0][0]

        stage_idx = int(np.argmax(outputs))
        confidence = float(outputs[stage_idx])
        stage = STAGES[stage_idx]

        return {
            "severity_stage": stage,
            "confidence": round(confidence, 4),
            "recommendation": RECOMMENDATIONS[stage],
            "probabilities": {
                s: round(float(p), 4) for s, p in zip(STAGES, outputs, strict=False)
            },
        }
