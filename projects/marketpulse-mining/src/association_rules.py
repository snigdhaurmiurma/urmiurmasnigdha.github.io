"""
Market Basket Analysis & Association Rule Mining (Apriori Algorithm)
Author: Urmi Urma Snigdha
"""
from itertools import combinations
from collections import defaultdict

class AprioriMiner:
    def __init__(self, min_support=0.08, min_confidence=0.5, min_lift=1.2):
        self.min_support = min_support
        self.min_confidence = min_confidence
        self.min_lift = min_lift

    def mine_rules(self, transactions: list) -> list:
        """Discovers association rules meeting support, confidence, and lift thresholds."""
        n_transactions = len(transactions)
        item_counts = defaultdict(int)

        # 1. Single frequent itemsets
        for t in transactions:
            for item in set(t):
                item_counts[item] += 1

        frequent_1 = {item: count / n_transactions 
                      for item, count in item_counts.items() 
                      if (count / n_transactions) >= self.min_support}

        # 2. Pairwise itemsets
        pair_counts = defaultdict(int)
        for t in transactions:
            frequent_items = [i for i in set(t) if i in frequent_1]
            for pair in combinations(sorted(frequent_items), 2):
                pair_counts[pair] += 1

        rules = []
        for (item_a, item_b), count in pair_counts.items():
            pair_support = count / n_transactions
            if pair_support < self.min_support:
                continue

            supp_a = frequent_1[item_a]
            supp_b = frequent_1[item_b]

            # Rule A => B
            conf_a_to_b = pair_support / supp_a
            lift_a_to_b = conf_a_to_b / supp_b
            if conf_a_to_b >= self.min_confidence and lift_a_to_b >= self.min_lift:
                rules.append({
                    "antecedent": item_a,
                    "consequent": item_b,
                    "support": round(pair_support, 4),
                    "confidence": round(conf_a_to_b, 4),
                    "lift": round(lift_a_to_b, 3)
                })

            # Rule B => A
            conf_b_to_a = pair_support / supp_b
            lift_b_to_a = conf_b_to_a / supp_a
            if conf_b_to_a >= self.min_confidence and lift_b_to_a >= self.min_lift:
                rules.append({
                    "antecedent": item_b,
                    "consequent": item_a,
                    "support": round(pair_support, 4),
                    "confidence": round(conf_b_to_a, 4),
                    "lift": round(lift_b_to_a, 3)
                })

        # Sort descending by lift
        return sorted(rules, key=lambda x: x["lift"], reverse=True)
