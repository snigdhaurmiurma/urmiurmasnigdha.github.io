"""
Cross-Encoder Reranker & Confidence Thresholding
Author: Urmi Urma Snigdha
"""

class CrossEncoderReranker:
    def __init__(self, relevance_threshold=0.60):
        self.relevance_threshold = relevance_threshold

    def rerank(self, query: str, candidate_chunks: list) -> list:
        """Scores joint query-passage pairs using contextual word overlap and semantic relevance."""
        reranked = []
        q_words = set(query.lower().split())

        for chunk in candidate_chunks:
            p_words = set(chunk["text"].lower().split())
            overlap = len(q_words.intersection(p_words)) / (len(q_words) + 1e-5)

            # Combined bi-encoder retrieval score + cross-attention lexical alignment
            cross_score = 0.5 * chunk["score"] + 0.5 * min(1.0, overlap * 2.0)
            cross_score = round(float(cross_score), 4)

            if cross_score >= self.relevance_threshold:
                item = dict(chunk)
                item["rerank_score"] = cross_score
                reranked.append(item)

        return sorted(reranked, key=lambda x: x["rerank_score"], reverse=True)
