"""
MarketPulse: Complete Data Mining & Churn Intelligence Pipeline Execution
Author: Urmi Urma Snigdha
"""
import numpy as np

from src.association_rules import AprioriMiner
from src.customer_segmentation import CustomerSegmenter
from src.churn_predictor import ChurnPredictor

def generate_synthetic_enterprise_data(n_customers=1000):
    """Generates realistic e-commerce and subscription behavioral dataset."""
    np.random.seed(42)

    # 1. Market Basket Transactions
    catalog = [
        "Cloud Storage Pro", "API Gateway Add-on", "Security Shield Plus",
        "Team Seats License", "Annual SLA Support", "Data Pipeline ETL",
        "Custom Domain SSL", "Automated Backup Suite"
    ]
    transactions = []
    for _ in range(n_customers * 2):
        n_items = np.random.choice([1, 2, 3, 4], p=[0.4, 0.35, 0.15, 0.1])
        # Add correlated purchase behavior
        chosen = list(np.random.choice(catalog, size=n_items, replace=False))
        if "Cloud Storage Pro" in chosen and np.random.rand() > 0.3:
            chosen.append("API Gateway Add-on")
        if "Annual SLA Support" in chosen and np.random.rand() > 0.4:
            chosen.append("Security Shield Plus")
        transactions.append(list(set(chosen)))

    # 2. RFM Matrix: [Recency (days), Frequency (purchases), Monetary ($)]
    recency = np.random.exponential(scale=35, size=n_customers) + 1
    frequency = np.random.poisson(lam=4, size=n_customers) + 1
    monetary = frequency * np.random.uniform(50, 220, size=n_customers)
    rfm_matrix = np.column_stack([recency, frequency, monetary])

    # 3. Churn Ground Truth Label (Higher recency + lower frequency = higher churn)
    churn_score = (recency / 100.0) * 1.5 - (frequency / 10.0) * 1.2
    prob = 1.0 / (1.0 + np.exp(-churn_score))
    churn_labels = (np.random.rand(n_customers) < prob).astype(int)

    return transactions, rfm_matrix, churn_labels

def main():
    print("=" * 65)
    print("   MARKETPULSE: CUSTOMER DATA MINING & CHURN INTELLIGENCE ENGINE  ")
    print("   Author: Urmi Urma Snigdha (United International University)   ")
    print("=" * 65)

    print("\n[Stage 1] Ingesting transactional logs & behavioral telemetry...")
    transactions, rfm_matrix, churn_labels = generate_synthetic_enterprise_data(1000)
    print(f"  ✓ {len(transactions)} transactions ingested across {len(rfm_matrix)} active customers.")

    print("\n[Stage 2] Executing Apriori Association Rule Mining...")
    miner = AprioriMiner(min_support=0.06, min_confidence=0.45, min_lift=1.3)
    rules = miner.mine_rules(transactions)
    print(f"  ✓ Mined {len(rules)} statistically significant cross-sell association rules.")
    print("  Top Discovered Cross-Sell Patterns:")
    for i, r in enumerate(rules[:3], 1):
        print(f"    Rule #{i}: [{r['antecedent']}] => [{r['consequent']}]")
        print(f"             Support: {r['support']*100:.1f}% | Confidence: {r['confidence']*100:.1f}% | Lift: {r['lift']:.2f}")

    print("\n[Stage 3] Performing Behavioral RFM Customer Segmentation (K-Means)...")
    segmenter = CustomerSegmenter(n_clusters=4)
    labels = segmenter.fit_predict(rfm_matrix)
    cohorts = segmenter.assign_cohort_names(rfm_matrix, labels)

    cohort_names = ["Champions / Power Users", "Loyal Mid-Tier", "At-Risk VIPs", "Hibernating / Dormant"]
    print("  Customer Cohort Breakdown:")
    for k, stats in cohorts.items():
        name = cohort_names[k]
        print(f"    - Cohort {k} [{name}]: {stats['count']} users | Avg Spend: ${stats['avg_monetary_spend']} | Avg Inactive: {stats['avg_recency_days']} days")

    print("\n[Stage 4] Training Predictive Churn Risk Classifier...")
    # Normalize features
    X = (rfm_matrix - rfm_matrix.mean(axis=0)) / (rfm_matrix.std(axis=0) + 1e-8)
    split_idx = int(0.8 * len(X))
    X_train, X_test = X[:split_idx], X[split_idx:]
    y_train, y_test = churn_labels[:split_idx], churn_labels[split_idx:]

    model = ChurnPredictor(learning_rate=0.08, n_estimators=60)
    model.fit(X_train, y_train)
    metrics = model.evaluate(X_test, y_test)

    print("=" * 65)
    print("                   MODEL EVALUATION BENCHMARKS                   ")
    print("=" * 65)
    print(f"  Test Accuracy  : {metrics['accuracy']*100:.2f}%")
    print(f"  Precision      : {metrics['precision']*100:.2f}%")
    print(f"  Recall         : {metrics['recall']*100:.2f}%")
    print(f"  F1-Score       : {metrics['f1_score']:.4f}")
    print("=" * 65)
    print("✓ Full Data Mining pipeline executed successfully.")
    print("=" * 65)

if __name__ == "__main__":
    main()
