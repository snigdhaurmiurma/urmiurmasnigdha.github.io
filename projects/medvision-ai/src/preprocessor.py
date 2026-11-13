"""
Image Preprocessing Module for Microscopic Cellular Imagery
Author: Urmi Urma Snigdha
"""
import numpy as np

class ImagePreprocessor:
    def __init__(self, clip_limit=2.0, tile_grid_size=(8, 8)):
        self.clip_limit = clip_limit
        self.tile_grid_size = tile_grid_size

    def to_grayscale(self, image: np.ndarray) -> np.ndarray:
        """Converts RGB image to single-channel luminance."""
        if len(image.shape) == 2:
            return image
        # Standard ITU-R BT.601 luma conversion
        return np.dot(image[..., :3], [0.2989, 0.5870, 0.1140]).astype(np.uint8)

    def apply_clahe(self, gray_image: np.ndarray) -> np.ndarray:
        """Applies Contrast-Limited Adaptive Histogram Equalization."""
        # Software fallback CLAHE algorithm implementation using localized histogram clipping
        img = gray_image.copy()
        h, w = img.shape
        grid_h, grid_w = self.tile_grid_size
        tile_h, tile_w = h // grid_h, w // grid_w

        enhanced = np.zeros_like(img, dtype=np.float32)
        for i in range(grid_h):
            for j in range(grid_w):
                y1, y2 = i * tile_h, (i + 1) * tile_h if i < grid_h - 1 else h
                x1, x2 = j * tile_w, (j + 1) * tile_w if j < grid_w - 1 else w
                tile = img[y1:y2, x1:x2]

                hist, _ = np.histogram(tile.flatten(), bins=256, range=[0, 256])
                clip = self.clip_limit * (tile.size / 256.0)
                excess = np.sum(np.clip(hist - clip, 0, None))
                hist = np.clip(hist, 0, clip) + (excess / 256.0)

                cdf = hist.cumsum()
                cdf_normalized = (cdf - cdf.min()) * 255.0 / (cdf.max() - cdf.min() + 1e-8)
                enhanced[y1:y2, x1:x2] = cdf_normalized[tile]

        return np.clip(enhanced, 0, 255).astype(np.uint8)

    def gaussian_blur(self, gray_image: np.ndarray, kernel_size=5, sigma=1.0) -> np.ndarray:
        """Applies 2D Gaussian spatial smoothing to reduce high-frequency noise."""
        ax = np.arange(-kernel_size // 2 + 1., kernel_size // 2 + 1.)
        xx, yy = np.meshgrid(ax, ax)
        kernel = np.exp(-(xx**2 + yy**2) / (2. * sigma**2))
        kernel /= np.sum(kernel)

        pad = kernel_size // 2
        padded = np.pad(gray_image, pad, mode='reflect')
        out = np.zeros_like(gray_image, dtype=np.float32)

        for i in range(gray_image.shape[0]):
            for j in range(gray_image.shape[1]):
                window = padded[i:i + kernel_size, j:j + kernel_size]
                out[i, j] = np.sum(window * kernel)

        return np.clip(out, 0, 255).astype(np.uint8)
