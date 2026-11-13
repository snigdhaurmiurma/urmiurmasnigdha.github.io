# DocuQuery-AI: Enterprise Document Intelligence & Semantic Search (RAG)

[![Python](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://www.python.org/)
[![Domain](https://img.shields.io/badge/Domain-NLP%20%7C%20Retrieval--Augmented%20Generation-3b82f6.svg)]()
[![Tech Stack](https://img.shields.io/badge/Tech-Transformers%20%7C%20Vector%20Search%20%7C%20Cross--Encoder-emerald.svg)]()
[![License](https://img.shields.io/badge/License-MIT-purple.svg)]()

> **A production-structured Retrieval-Augmented Generation (RAG) and document intelligence pipeline providing high-precision semantic search, cross-encoder passage reranking, and grounded answers with source citations.**

---

## 🎯 The Real-World Problem
Enterprise knowledge repositories (compliance documentation, legal contracts, clinical trial reports, technical engineering specs) often span thousands of pages. Keyword search (Ctrl+F) fails when queries use synonyms or abstract conceptual phrasing. Meanwhile, standard LLMs hallucinate unsupported statements when ungrounded.

**DocuQuery-AI** bridges this by delivering a verified, hallucination-resistant document intelligence system that finds exact passages and produces grounded answers with strict document page citations.

---

## 🔬 System Architecture & Flow

```
[Raw Documents / PDF Transcripts / Reports]
                    │
                    ▼
[Stage 1: Semantic Document Chunker]
  - Boundary-Aware Recursive Character Chunking
  - Sliding Window Overlap (Stride = 50 tokens)
                    │
                    ▼
[Stage 2: Dense Bi-Encoder Embedding]
  - Generates Normalized 384-dimensional dense vectors
  - Fast In-Memory L2 / Cosine Vector Indexing
                    │
                    ▼
[Stage 3: Hybrid Retrieval & Query Embedding]
  - Query vector projection into shared embedding space
  - Top-K Candidate Extraction ($K = 15$)
                    │
                    ▼
[Stage 4: Cross-Encoder Re-Ranking]
  - Joint Query-Passage Self-Attention Scoring
  - Confidence Gating ($\theta_{\text{relevance}} \ge 0.65$)
                    │
                    ▼
[Stage 5: Grounded Answer Synthesis & Citations]
  - Synthesizes response strictly from top reranked contexts
  - Formats verifiable [Source ID, Chunk, Confidence Score]
```

### 1. Vector Cosine Similarity
$$\text{Sim}(\mathbf{q}, \mathbf{d}) = \frac{\mathbf{q} \cdot \mathbf{d}}{\|\mathbf{q}\| \|\mathbf{d}\|}$$

### 2. Cross-Encoder Re-Ranking Optimization
Bi-encoders are fast ($O(N)$ dot products) but treat query and document independently. Cross-encoders pass both tokens concatenated through all transformer attention layers:
$$\text{Score}_{\text{CE}}(q, d) = \sigma\left(\mathbf{W} \cdot \text{Transformer}([CLS] \circ q \circ [SEP] \circ d \circ [SEP])\right)$$
This eliminates false positives from superficial keyword matches.

---

## 🛠️ Project Structure
```
docuquery-rag/
├── src/
│   ├── __init__.py
│   ├── document_loader.py    # Recursive chunking & boundary preservation
│   ├── vector_store.py       # In-memory dense semantic vector index
│   ├── reranker.py           # Cross-encoder relevance scoring & thresholding
│   └── query_engine.py       # End-to-end Q&A synthesis with citations
├── main.py                   # Interactive terminal search engine & benchmark
├── requirements.txt
└── README.md
```

---

## ⚡ Quickstart & Installation

```bash
# Clone the repository
git clone https://github.com/snigdhaurmiurma/urmiurmasnigdha.github.io.git
cd urmiurmasnigdha.github.io/projects/docuquery-rag

# Install dependencies
pip install -r requirements.txt

# Run the document intelligence demo
python main.py
```

---

## 📊 Sample Execution Output

```
============================================================
       DOCUQUERY-AI: SEMANTIC DOCUMENT SEARCH & RAG         
============================================================
Documents Ingested : 12 technical research policy reports
Chunks Indexed     : 84 passages (384-dim normalized vectors)

User Query: "What is the computational overhead of LLM guardrails at runtime?"

[Retrieval]: Extracted 6 candidate chunks via Vector Similarity
[Reranking]: Cross-encoder scored and filtered top 2 passages

Synthesized Grounded Answer:
"At runtime inference, LLM safety guardrails introduce an average 
latency overhead of +142.8 ms and increase GPU power consumption by 
up to 18.6 gCO2eq per 1k queries when employing heavy LLM-as-judge 
validation configurations."

Verified Citations:
  [1] Doc: "Green_AI_Safety_Report.pdf", Section 3.2 (Confidence: 94.6%)
  [2] Doc: "GPU_Inference_Telemetry.pdf", Section 4.1 (Confidence: 89.2%)
============================================================
```

---

## 👩‍💻 Author
**Urmi Urma Snigdha**  
B.Sc. in Computer Science & Engineering · United International University (UIU)  
Portfolio: [urmisnigdha.vercel.app](https://urmisnigdha.vercel.app)
