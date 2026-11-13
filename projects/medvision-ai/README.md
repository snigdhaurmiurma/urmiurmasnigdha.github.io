# MedVision-AI: Automated Cellular & Microscopic Image Analysis Pipeline

[![Python](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://www.python.org/)
[![Domain](https://img.shields.io/badge/Domain-Digital%20Image%20Processing-06b6d4.svg)]()
[![Computer Vision](https://img.shields.io/badge/Tech-OpenCV%20%7C%20Scikit--Image%20%7C%20NumPy-emerald.svg)]()
[![License](https://img.shields.io/badge/License-MIT-purple.svg)]()

> **An automated Digital Image Processing (DIP) and Computer Vision system designed to segment, isolate, count, and classify microscopic biological cells and detect pathological anomalies.**

---

## 🎯 The Real-World Problem
Pathologists, medical researchers, and clinical lab technicians manually analyze blood smears, cytopathology slides, and cellular cultures using optical microscopes. This manual process is:
1. **Time-Intensive:** A single slide can contain thousands of overlapping cell clusters requiring hours of counting.
2. **Subject to Fatigue & Inconsistency:** Manual counting produces high inter-observer variability (~15-25% discrepancy).
3. **Limited in Feature Capture:** Humans cannot accurately quantify micro-scale geometric metrics like nuclear eccentricity, perimeter irregularity, and pixel-level optical density.

**MedVision-AI** solves this by providing a deterministic, multi-stage computer vision pipeline that processes microscope imaging in seconds with reproducible geometric and statistical metrics.

---

## 🔬 Mathematical & Algorithmic Pipeline

The system processes input imagery through 4 core architectural stages:

```
[Raw Microscopic Image]
        │
        ▼
[Stage 1: Contrast Enhancement & Noise Reduction]
  - Adaptive Histogram Equalization (CLAHE)
  - Gaussian Spatial Filtering
        │
        ▼
[Stage 2: Adaptive Binarization & Topology Extraction]
  - Otsu's Global Variance Maximization Thresholding
  - Morphological Opening & Closing (Structural Elements)
        │
        ▼
[Stage 3: Overlapping Nuclei Splitting via Watershed]
  - Euclidean Distance Transform (L2 Norm)
  - Local Peak Finding (Sure Foreground)
  - Marker-Controlled Watershed Segmentation
        │
        ▼
[Stage 4: Morphometric Feature Extraction & Anomaly Flagging]
  - Contour Analysis: Area, Perimeter, Circularity, Aspect Ratio
  - Statistical Outlier Detection (Z-Score & IQR)
  - Visual Bounding Box & Centroid Annotated Output
```

### 1. Contrast-Limited Adaptive Histogram Equalization (CLAHE)
Standard histogram equalization increases global noise. CLAHE operates on localized $8 \times 8$ grid tiles with a contrast limit clip factor $\beta = 2.0$:
$$\text{Slope Limit} = \frac{N \times M}{K} \left(1 + \frac{\alpha}{100}(\text{MaxSlope} - 1)\right)$$

### 2. Otsu's Thresholding (Variance Minimization)
Automatically calculates the optimal threshold $T^*$ that maximizes between-class variance $\sigma_B^2$:
$$\sigma_B^2(T) = \omega_0(T)\omega_1(T)[\mu_0(T) - \mu_1(T)]^2$$
Where $\omega_0, \omega_1$ are probabilities of foreground/background classes, and $\mu_0, \mu_1$ are class means.

### 3. Marker-Controlled Watershed Transform
Overlapping spherical cells share boundary contacts. MedVision-AI computes the Euclidean distance transform $D(p) = \min_{q \in B} d(p, q)$, extracts local maxima peaks as markers, and floods gradient catchment basins to construct precise division boundaries.

### 4. Morphometric Circularity Metric
Identifies irregular, deformed, or cancerous cell nuclei based on the isoperimetric quotient:
$$\text{Circularity} = \frac{4\pi \times \text{Area}}{\text{Perimeter}^2}$$
* Normal spherical cells: $\text{Circularity} \approx 0.85 - 1.0$
* Deformed / sickle / apoptotic cells: $\text{Circularity} < 0.65$

---

## 🛠️ Project Structure
```
medvision-ai/
├── src/
│   ├── __init__.py
│   ├── preprocessor.py        # CLAHE, color conversion, spatial smoothing
│   ├── segmentation.py        # Otsu binarization, morphological ops, Watershed
│   ├── feature_extractor.py   # Morphometrics (area, circularity, perimeter)
│   └── pipeline.py            # End-to-end orchestration & reporting
├── data/
│   └── samples/               # Synthetic & benchmark microscopic test images
├── main.py                    # CLI entrypoint and automated demo generator
├── requirements.txt
└── README.md
```

---

## ⚡ Quickstart & Installation

```bash
# Clone the repository
git clone https://github.com/snigdhaurmiurma/urmiurmasnigdha.github.io.git
cd urmiurmasnigdha.github.io/projects/medvision-ai

# Install dependencies
pip install -r requirements.txt

# Run the complete analysis demo
python main.py
```

---

## 📊 Sample Execution Output

```
============================================================
           MEDVISION-AI: CELLULAR ANALYSIS REPORT           
============================================================
Input Image            : sample_microscope_slide.png (800x600)
Processing Time        : 142.6 ms
Total Nuclei Detected  : 48
Valid Normal Cells     : 44 (91.67%)
Morphological Anomalies: 4 (8.33%) [FLAGGED FOR REVIEW]

Morphometric Summary:
  - Mean Cell Area     : 412.8 px² (± 34.2 px²)
  - Mean Circularity   : 0.892
  - Mean Perimeter     : 74.5 px
  - High Eccentricity  : Cells #12, #29, #37 (Circularity < 0.65)
============================================================
```

---

## 👩‍💻 Author
**Urmi Urma Snigdha**  
B.Sc. in Computer Science & Engineering · United International University (UIU)  
Portfolio: [urmisnigdha.vercel.app](https://urmisnigdha.vercel.app)
