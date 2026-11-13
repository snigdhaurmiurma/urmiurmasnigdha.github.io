"""
Document Chunking & Boundary Preservation Module
Author: Urmi Urma Snigdha
"""
import re

class DocumentChunker:
    def __init__(self, chunk_size=300, chunk_overlap=50):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk_text(self, document_id: str, text: str, source_name: str) -> list:
        """Splits raw text into semantically cohesive overlapping text passages."""
        # Clean text
        clean = re.sub(r'\s+', ' ', text).strip()
        words = clean.split(' ')

        chunks = []
        start = 0
        chunk_idx = 0

        while start < len(words):
            end = min(start + self.chunk_size, len(words))
            chunk_words = words[start:end]
            chunk_text = " ".join(chunk_words)

            chunks.append({
                "chunk_id": f"{document_id}_c{chunk_idx}",
                "doc_id": document_id,
                "source": source_name,
                "text": chunk_text,
                "token_count": len(chunk_words),
                "start_idx": start,
                "end_idx": end
            })

            chunk_idx += 1
            start += (self.chunk_size - self.chunk_overlap)
            if end == len(words):
                break

        return chunks
