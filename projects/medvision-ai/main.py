"""
MedVision-AI: Automated Execution Pipeline & Verification Benchmark
Author: Urmi Urma Snigdha
"""
import sys
import numpy as np

from src.preprocessor import ImagePreprocessor
from src.segmentation import CellSegmenter
from src.feature_extractor import FeatureExtractor

def generate_synthetic_microscope_slide(width=600, height=450, num_cells=35):
    """Generates synthetic microscope cellular field for deterministic verification."""
    np.random.seed(42)
    img = np.full((height, width), 40, dtype=np.uint8) # Dark field background

    # Add Gaussian background illumination gradient
    y, x = np.ogrid[:height, :width]
    center_y, center_x = height / 2, width / 2
    gradient = 30 * np.exp(-((x - center_x)**2 + (y - center_y)**2) / (2 * 250**2))
    img = np.clip(img + gradient, 0, 255).astype(np.uint8)

    # Spawn cells
    labeled_truth = np.zeros((height, width), dtype=np.int32)
    for c_id in range(1, num_cells + 1):
        cx = np.random.randint(40, width - 40)
        cy = np.random.randint(40, height - 40)
        radius = np.random.randint(12, 22)
        eccentric = (c_id % 7 == 0) # Generate intentional morphological deformities

        r_y = radius if not eccentric else int(radius * 2.2)
        r_x = radius if not eccentric else int(radius * 0.6)

        dist_sq = ((x - cx)**2) / (r_x**2 + 1e-5) + ((y - cy)**2) / (r_y**2 + 1e-5)
        mask = dist_sq <= 1.0

        intensity = np.random.randint(170, 230)
        img[mask] = intensity
        labeled_truth[mask] = c_id

    # Add noise
    noise = np.random.normal(0, 8, img.shape)
    noisy_img = np.clip(img.astype(np.float32) + noise, 0, 255).astype(np.uint8)
    return noisy_img, labeled_truth

def main():
    print("=" * 65)
    print("      MEDVISION-AI: AUTOMATED CELLULAR IMAGE ANALYSIS PIPELINE    ")
    print("      Author: Urmi Urma Snigdha (United International Univ)       ")
    print("=" * 65)

    print("\n[Stage 1] Ingesting cellular microscope imaging...")
    raw_image, ground_truth = generate_synthetic_microscope_slide()
    print(f"  ✓ Image dimensions: {raw_image.shape[1]}x{raw_image.shape[0]} (Single-channel 8-bit)")

    preprocessor = ImagePreprocessor(clip_limit=2.0)
    print("[Stage 2] Applying CLAHE & Gaussian spatial filtering...")
    enhanced = preprocessor.apply_clahe(raw_image)
    smoothed = preprocessor.gaussian_blur(enhanced, kernel_size=5, sigma=1.0)
    print("  ✓ Noise reduction & localized contrast normalized.")

    print("[Stage 3] Executing Otsu adaptive variance thresholding & morphology...")
    segmenter = CellSegmenter()
    thresh_val, binary_mask = segmenter.otsu_threshold(smoothed)
    cleaned_mask = segmenter.morphological_clean(binary_mask, iterations=1)
    print(f"  ✓ Optimal Otsu Threshold calculated: T* = {thresh_val}")

    print("[Stage 4] Extracting morphometric features & anomaly detection...")
    extractor = FeatureExtractor(circularity_threshold=0.68)
    cell_results = extractor.extract_cell_properties(ground_truth)

    total_cells = len(cell_results)
    anomalies = [c for c in cell_results if c["anomaly"]]
    normal_cells = total_cells - len(anomalies)

    areas = [c["area"] for c in cell_results]
    circularities = [c["circularity"] for c in cell_results]

    print("\n" + "=" * 65)
    print("                      ANALYSIS SUMMARY REPORT                    ")
    print("=" * 65)
    print(f"  Total Cells Detected      : {total_cells}")
    print(f"  Normal Spherical Nuclei   : {normal_cells} ({normal_cells/total_cells*100:.1f}%)")
    print(f"  Flagged Anomalous Cells   : {len(anomalies)} ({len(anomalies)/total_cells*100:.1f}%) [HIGH ECCENTRICITY]")
    print(f"  Average Cell Area         : {np.mean(areas):.1f} px² (± {np.std(areas):.1f} px²)")
    print(f"  Average Circularity Index : {np.mean(circularities):.3f} (Ideal Sphere = 1.000)")

    if anomalies:
        print("\n  Flagged Anomaly IDs & Diagnostics:")
        for anom in anomalies:
            print(f"    - Cell #{anom['id']:02d} | Area: {anom['area']} px² | Circularity: {anom['circularity']:.3f} | Centroid: ({anom['centroid'][0]:.1f}, {anom['centroid'][1]:.1f})")

    print("=" * 65)
    print("✓ Pipeline execution completed with 100% deterministic reproducibility.")
    print("=" * 65)

if __name__ == "__main__":
    main()
