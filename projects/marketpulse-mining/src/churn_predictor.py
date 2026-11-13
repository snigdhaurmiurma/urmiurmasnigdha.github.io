"""
Predictive Churn Modeling & Risk Probability Scoring
Author: Urmi Urma Snigdha
"""
import numpy as np

class ChurnPredictor:
    def __init__(self, learning_rate=0.05, n_estimators=50):
        self.learning_rate = learning_rate
        self.n_estimators = n_estimators
        self.weights = None
        self.bias = 0.0

    def fit(self, X: np.ndarray, y: np.ndarray):
        """Trains a regularized logistic decision engine on customer behavior vectors."""
        np.random.seed(42)
        n_samples, n_features = X.shape
        self.weights = np.zeros(n_features)
        self.bias = 0.0

        for _ in range(self.n_estimators * 10):
            linear_model = np.dot(X, self.weights) + self.bias
            y_predicted = 1.0 / (1.0 + np.exp(-np.clip(linear_model, -20, 20)))

            # Gradient calculation with L2 regularization
            dw = (1 / n_samples) * np.dot(X.T, (y_predicted - y)) + 0.01 * self.weights
            db = (1 / n_samples) * np.sum(y_predicted - y)

            self.weights -= self.learning_rate * dw
            self.bias -= self.learning_rate * db

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        linear_model = np.dot(X, self.weights) + self.bias
        return 1.0 / (1.0 + np.exp(-np.clip(linear_model, -20, 20)))

    def evaluate(self, X: np.ndarray, y: np.ndarray) -> dict:
        probas = self.predict_proba(X)
        preds = (probas >= 0.5).astype(int)

        accuracy = np.mean(preds == y)
        tp = np.sum((preds == 1) & (y == 1))
        fp = np.sum((preds == 1) & (y == 0))
        fn = np.sum((preds == 0) & (y == 1))

        precision = tp / (tp + fp + 1e-8)
        recall = tp / (tp + fn + 1e-8)
        f1 = 2 * (precision * recall) / (precision + recall + 1e-8)

        return {
            "accuracy": round(float(accuracy), 4),
            "precision": round(float(precision), 4),
            "recall": round(float(recall), 4),
            "f1_score": round(float(f1), 4)
        }
