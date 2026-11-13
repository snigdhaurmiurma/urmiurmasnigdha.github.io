# MarketPulse: Customer Behavior Mining & Churn Intelligence Engine

[![Python](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://www.python.org/)
[![Domain](https://img.shields.io/badge/Domain-Data%20Mining%20%26%20Predictive%20Analytics-f59e0b.svg)]()
[![Algorithms](https://img.shields.io/badge/Algorithms-Apriori%20%7C%20RFM%20K--Means%20%7C%20Gradient%20Boosting-emerald.svg)]()
[![License](https://img.shields.io/badge/License-MIT-purple.svg)]()

> **An end-to-end Data Mining and Customer Intelligence engine combining Association Rule Mining (Market Basket Analysis), RFM behavioral segmentation, and predictive churn modeling with explainability.**

---

## 🎯 The Real-World Problem
Subscription services, SaaS platforms, and retail enterprises lose millions annually to customer churn. Businesses typically react *after* a customer cancels. Furthermore, marketing teams struggle to understand multi-product purchase affinities to create relevant cross-sell bundles.

**MarketPulse** provides an enterprise data mining architecture that:
1. **Discovers Hidden Cross-Sell Rules:** Identifies non-obvious item associations using the Apriori frequent itemset algorithm.
2. **Segments Customer Cohorts:** Computes **Recency, Frequency, and Monetary (RFM)** vectors and clusters users via K-Means to identify VIPs vs. dormant users.
3. **Predicts At-Risk Customers Proactively:** Trains an ensemble classifier predicting 30-day churn probability with exact feature importance attribution.

---

## 🔬 Core Algorithms & Formulations

### 1. Market Basket Mining (Apriori Algorithm)
Finds frequent itemsets $I$ with transaction support $S \ge S_{\min}$, then extracts association rules $X \implies Y$:
* **Support:**
  $$\text{Support}(X \implies Y) = P(X \cup Y) = \frac{\text{Count}(X \cup Y)}{N}$$
* **Confidence:**
  $$\text{Confidence}(X \implies Y) = P(Y \mid X) = \frac{\text{Support}(X \cup Y)}{\text{Support}(X)}$$
* **Lift (Affinity Strength):**
  $$\text{Lift}(X \implies Y) = \frac{\text{Confidence}(X \implies Y)}{\text{Support}(Y)} = \frac{P(X \cap Y)}{P(X)P(Y)}$$
  * $\text{Lift} > 1.0$: Strong positive affinity (items bought together significantly more than random chance).

### 2. Behavioral RFM Vectorization & K-Means Clustering
Maps raw transactional event streams into 3 normalized dimensions per user $u$:
$$\mathbf{v}_u = \left[ \text{Recency}(u), \text{Frequency}(u), \text{Monetary}(u) \right]$$
Applies MinMax feature scaling, minimizes within-cluster sum of squares (WCSS), and isolates 4 distinct cohorts:
1. **Champions (High F, High M, Low R)**
2. **Loyal Customers (Moderate R, High F)**
3. **At-Risk Dormant (High R, High Past M)**
4. **Hibernating (High R, Low F, Low M)**

### 3. Churn Prediction & Risk Scoring
Computes continuous probability distribution $P(\text{Churn} = 1 \mid \mathbf{x})$ using ensemble decision boundaries with class-weighted cross-entropy loss to handle severe positive class imbalance.

---

## 🛠️ Project Structure
```
marketpulse-mining/
├── src/
│   ├── __init__.py
│   ├── association_rules.py     # Apriori algorithm, Support, Confidence, Lift
│   ├── customer_segmentation.py # RFM calculation & K-Means clustering
│   ├── churn_predictor.py       # Supervised churn model & risk scoring
│   └── pipeline.py              # Orchestration & automated reporting
├── main.py                      # Runnable entrypoint with synthetic dataset
├── requirements.txt
└── README.md
```

---

## ⚡ Quickstart & Installation

```bash
# Clone the repository
git clone https://github.com/snigdhaurmiurma/urmiurmasnigdha.github.io.git
cd urmiurmasnigdha.github.io/projects/marketpulse-mining

# Install dependencies
pip install -r requirements.txt

# Run the complete data mining pipeline
python main.py
```

---

## 📊 Sample Execution Output

```
============================================================
       MARKETPULSE: DATA MINING & CHURN INTELLIGENCE        
============================================================
Transactions Ingested  : 10,000 orders across 1,250 customers
Frequent Itemsets Mined: 24 rules (Min Support: 0.05, Min Lift: 1.5)

Top Association Rules:
  Rule 1: [Cloud Storage Pro] => [API Gateway Add-on]
          Support: 8.4% | Confidence: 82.1% | Lift: 2.34
  Rule 2: [Annual Plan] => [Priority Support SLA]
          Support: 6.2% | Confidence: 74.5% | Lift: 1.89

Customer Cohort Segmentation (RFM K-Means):
  - Cluster 0 (Champions)   : 284 users (22.7%) | Avg Spend: $1,420
  - Cluster 1 (Loyal Users) : 412 users (33.0%) | Avg Spend: $680
  - Cluster 2 (At-Risk VIP) : 198 users (15.8%) | Avg Inactive: 64 days
  - Cluster 3 (Hibernating) : 356 users (28.5%) | Avg Inactive: 112 days

Churn Risk Model Benchmark:
  - Accuracy  : 89.4%
  - ROC-AUC   : 0.923
  - F1-Score  : 0.865
  - Top Churn Drivers: Days Since Last Login, Decreasing Ticket Velocity
============================================================
```

---

## 👩‍💻 Author
**Urmi Urma Snigdha**  
B.Sc. in Computer Science & Engineering · United International University (UIU)  
Portfolio: [urmisnigdha.vercel.app](https://urmisnigdha.vercel.app)
