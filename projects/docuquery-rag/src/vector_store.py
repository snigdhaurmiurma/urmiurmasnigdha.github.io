"""
Dense Semantic Vector Store & Cosine Similarity Retrieval
Author: Urmi Urma Snigdha
"""
import numpy as np

class InMemoryVectorStore:
    def __init__(self, embedding_dim=128):
        self.embedding_dim = embedding_dim
        self.chunks = []
        self.vectors = None

    def _pseudo_embed(self, text: str) -> np.ndarray:
        """Deterministic hash-based dense embedding emulator for offline lightweight execution."""
        # For deployment with live HuggingFace, replace with: model.encode(text)
        np.random.seed(abs(hash(text)) % (2**31))
        vec = np.random.normal(0, 1, self.embedding_dim)
        norm = np.linalg.norm(vec) + 1e-8
        return (vec / norm).astype(np.float32)

    def add_chunks(self, chunks: list):
        """Indexes text chunks with their dense vector representations."""
        self.chunks.extend(chunks)
        new_vecs = [self._pseudo_embed(c["text"]) for c in chunks]

        if self.vectors is None:
            self.vectors = np.array(new_vecs)
        else:
            self.vectors = np.vstack([self.vectors, np.array(new_vecs)])

    def similarity_search(self, query: str, top_k=5) -> list:
        """Computes cosine similarity between query and all stored document vectors."""
        if self.vectors is None or len(self.chunks) == 0:
            return []

        q_vec = self._pseudo_embed(query)
        # Cosine similarity on normalized vectors is dot product
        similarities = np.dot(self.vectors, q_vec)

        top_indices = np.argsort(similarities)[::-1][:top_k]
        results = []
        for idx in top_indices:
            item = dict(self.chunks[idx])
            item["score"] = round(float(similarities[idx]), 4)
            results.append(item)

        return results
