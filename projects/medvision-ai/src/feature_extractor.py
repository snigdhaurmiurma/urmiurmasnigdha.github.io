"""
Morphometric Feature Extraction & Pathological Anomaly Detection
Author: Urmi Urma Snigdha
"""
import numpy as np

class FeatureExtractor:
    def __init__(self, circularity_threshold=0.68):
        self.circularity_threshold = circularity_threshold

    def extract_cell_properties(self, labeled_mask: np.ndarray) -> list:
        """Extracts geometric features from connected components."""
        unique_labels = np.unique(labeled_mask)
        unique_labels = unique_labels[unique_labels != 0] # Exclude background

        cells = []
        for label in unique_labels:
            coords = np.argwhere(labeled_mask == label)
            area = len(coords)
            if area < 30:
                continue

            # Centroid (y, x)
            cy, cx = coords.mean(axis=0)

            # Perimeter approximation via edge counting
            min_y, min_x = coords.min(axis=0)
            max_y, max_x = coords.max(axis=0)
            bbox_h = max_y - min_y + 1
            bbox_w = max_x - min_x + 1
            perimeter = 2 * (bbox_h + bbox_w) * 0.85 # Approximation factor

            circularity = (4 * np.pi * area) / (perimeter ** 2 + 1e-6)
            circularity = min(1.0, max(0.0, circularity))

            is_anomaly = circularity < self.circularity_threshold

            cells.append({
                "id": int(label),
                "centroid": (float(cx), float(cy)),
                "area": int(area),
                "perimeter": round(float(perimeter), 2),
                "circularity": round(float(circularity), 3),
                "bbox": [int(min_x), int(min_y), int(bbox_w), int(bbox_h)],
                "anomaly": bool(is_anomaly)
            })

        return cells
