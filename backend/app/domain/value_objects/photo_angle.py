from enum import Enum


class PhotoAngle(str, Enum):
    """
    Value object untuk sudut pengambilan foto.
    Mendukung 5 sudut sesuai spesifikasi MVP.
    """

    FRONT = "front"
    TOP = "top"
    RIGHT = "right"
    LEFT = "left"
    CUSTOM = "custom"

    def get_description(self) -> str:
        descriptions = {
            PhotoAngle.FRONT: "Foto dari depan wajah (analisis garis rambut depan)",
            PhotoAngle.TOP: "Foto dari atas kepala (analisis vertex/crown area)",
            PhotoAngle.RIGHT: "Foto sisi kanan kepala (analisis temporal right)",
            PhotoAngle.LEFT: "Foto sisi kiri kepala (analisis temporal left)",
            PhotoAngle.CUSTOM: "Foto area yang mengalami kebotakan (analisis area spesifik)",
        }
        return descriptions[self]
