from enum import Enum


class PhotoAngle(str, Enum):
    """Supported photo angles for hair density analysis."""

    FRONT = "front"
    TOP = "top"
    RIGHT = "right"
    LEFT = "left"
    CUSTOM = "custom"

    def describe(self) -> str:
        descriptions = {
            PhotoAngle.FRONT: "Front view - hairline analysis",
            PhotoAngle.TOP: "Top view - vertex/crown analysis",
            PhotoAngle.RIGHT: "Right side - temporal right analysis",
            PhotoAngle.LEFT: "Left side - temporal left analysis",
            PhotoAngle.CUSTOM: "Custom spot - targeted area analysis",
        }
        return descriptions[self]
