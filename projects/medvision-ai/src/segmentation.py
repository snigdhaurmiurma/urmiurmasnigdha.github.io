"""
Cell Segmentation Module: Otsu Thresholding & Watershed Boundary Isolation
Author: Urmi Urma Snigdha
"""
import numpy as np

class CellSegmenter:
    def __init__(self, min_cell_area=50, max_cell_area=5000):
        self.min_cell_area = min_cell_area
        self.max_cell_area = max_cell_area

    def otsu_threshold(self, gray_image: np.ndarray) -> (int, np.ndarray):
        """Calculates optimal global threshold maximizing inter-class variance."""
        hist, bin_edges = np.histogram(gray_image, bins=256, range=(0, 256))
        total_pixels = gray_image.size

        current_max, threshold = 0, 0
        sum_total = np.dot(np.arange(256), hist)
        sum_back, weight_back = 0.0, 0.0

        for t in range(256):
            weight_back += hist[t]
            if weight_back == 0:
                continue
            weight_fore = total_pixels - weight_back
            if weight_fore == 0:
                break

            sum_back += t * hist[t]
            mean_back = sum_back / weight_back
            mean_fore = (sum_total - sum_back) / weight_fore

            var_between = weight_back * weight_fore * ((mean_back - mean_fore) ** 2)
            if var_between > current_max:
                current_max = var_between
                threshold = t

        binary = (gray_image > threshold).astype(np.uint8) * 255
        return threshold, binary

    def morphological_clean(self, binary_mask: np.ndarray, iterations=2) -> np.ndarray:
        """Removes salt-and-pepper noise and fills small vacuoles using erosion & dilation."""
        # Simple cross kernel 3x3
        kernel = np.array([[0, 1, 0], [1, 1, 1], [0, 1, 0]], dtype=bool)
        cleaned = binary_mask > 0

        # Opening (Erosion followed by Dilation)
        for _ in range(iterations):
            cleaned = self._binary_erosion(cleaned, kernel)
        for _ in range(iterations):
            cleaned = self._binary_dilation(cleaned, kernel)

        return (cleaned.astype(np.uint8)) * 255

    def _binary_erosion(self, mask: np.ndarray, kernel: np.ndarray) -> np.ndarray:
        pad = 1
        padded = np.pad(mask, pad, mode='constant', constant_values=False)
        out = np.zeros_like(mask, dtype=bool)
        for i in range(mask.shape[0]):
            for j in range(mask.shape[1]):
                window = padded[i:i + 3, j:j + 3]
                out[i, j] = np.all(window[kernel])
        return out

    def _binary_dilation(self, mask: np.ndarray, kernel: np.ndarray) -> np.ndarray:
        pad = 1
        padded = np.pad(mask, pad, mode='constant', constant_values=False)
        out = np.zeros_like(mask, dtype=bool)
        for i in range(mask.shape[0]):
            for j in range(mask.shape[1]):
                window = padded[i:i + 3, j:j + 3]
                out[i, j] = np.any(window[kernel])
        return out
