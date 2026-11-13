"""
Customer Behavioral RFM Segmentation & K-Means Clustering
Author: Urmi Urma Snigdha
"""
import numpy as np

class CustomerSegmenter:
    def __init__(self, n_clusters=4, max_iter=100, random_state=42):
        self.n_clusters = n_clusters
        self.max_iter = max_iter
        self.random_state = random_state
        self.cluster_centers_ = None

    def fit_predict(self, rfm_matrix: np.ndarray) -> np.ndarray:
        """Standardizes RFM features and clusters customers via K-Means."""
        np.random.seed(self.random_state)
        # MinMax Normalization per column
        min_vals = rfm_matrix.min(axis=0)
        max_vals = rfm_matrix.max(axis=0) + 1e-8
        scaled_data = (rfm_matrix - min_vals) / (max_vals - min_vals)

        # Initialize centroids randomly from dataset points
        n_samples = scaled_data.shape[0]
        init_indices = np.random.choice(n_samples, self.n_clusters, replace=False)
        centroids = scaled_data[init_indices].copy()

        labels = np.zeros(n_samples, dtype=int)
        for _ in range(self.max_iter):
            # Compute Euclidean distance to all centroids
            distances = np.linalg.norm(scaled_data[:, np.newaxis] - centroids, axis=2)
            new_labels = np.argmin(distances, axis=1)

            if np.array_equal(labels, new_labels):
                break
            labels = new_labels

            # Update centroids
            for k in range(self.n_clusters):
                cluster_points = scaled_data[labels == k]
                if len(cluster_points) > 0:
                    centroids[k] = cluster_points.mean(axis=0)

        self.cluster_centers_ = centroids
        return labels

    def assign_cohort_names(self, rfm_matrix: np.ndarray, labels: np.ndarray) -> dict:
        """Assigns meaningful domain personas based on average Recency, Frequency, Monetary spend."""
        cohort_stats = {}
        for k in range(self.n_clusters):
            idx = np.where(labels == k)[0]
            cluster_rfm = rfm_matrix[idx]
            avg_r = np.mean(cluster_rfm[:, 0]) # Days since last purchase
            avg_f = np.mean(cluster_rfm[:, 1]) # Order count
            avg_m = np.mean(cluster_rfm[:, 2]) # Total spend ($)

            cohort_stats[k] = {
                "count": len(idx),
                "avg_recency_days": round(float(avg_r), 1),
                "avg_frequency": round(float(avg_f), 1),
                "avg_monetary_spend": round(float(avg_m), 2)
            }
        return cohort_stats
