# BrieflyAI | Dialogue Summarizer

An end-to-end, full-stack dialogue summarization application featuring a **FastAPI backend** and a **Next.js 15 App Router frontend**. The application leverages a fine-tuned **Google T5-Small transformer** to distill long, conversational transcripts into clean, structured summaries.

---

## 📋 Project Overview

### What is Dialogue Summarization?
Conversations in chat logs, support tickets, and meeting transcripts are naturally unstructured and messy, filled with casual side-talk, typos, and fragmented thoughts. Reading through long histories to extract key actions is time-consuming.

This project solves this by using a custom-trained natural language processing (NLP) model to act as an automated meeting assistant. When you input a raw conversational transcript, the application:
1. **Cleans & Normalizes**: Automatically pre-processes the text to remove formatting noise.
2. **Analyzes Context**: Identifies speaking turns, context, and key decisions.
3. **Generates Bullet Summaries**: Distills the entire dialogue into key topics and action items.

### Under the Hood
* **ML Model**: Google's `t5-small` (Text-to-Text Transfer Transformer), fine-tuned on the **SAMSum corpus** (16,000 messenger-style conversations paired with human summaries).
* **Decoders**: Generation is optimized using a **Beam Search** strategy (`num_beams=4`, `max_length=150`) to ensure coherent, high-quality output without model hallucinations.
* **FastAPI Backend**: A modular Python API that loads the model once at startup, manages memory, and handles CPU/GPU hardware acceleration automatically.
* **Next.js Frontend**: A responsive, clean React dashboard that features text-to-file downloads, clipboard copies, loading states, and direct API communication.

---

## 📁 Repository Structure

```text
.
├── backend/                  # FastAPI Python backend service
│   ├── app/
│   │   ├── config.py         # Handles app settings & model path resolution
│   │   ├── schemas.py        # Pydantic request/response structures
│   │   └── summarizer.py     # T5 model loading, text cleaning & inference
│   ├── main.py               # API entry point & lifespan event hooks
│   └── pyproject.toml        # Declarative python dependencies
│
├── frontend/                 # Next.js 15 client dashboard
│   ├── src/app/
│   │   ├── globals.css       # Custom design system configuration (Tailwind v4)
│   │   ├── layout.tsx        # Google Font loaders & layout wrapper
│   │   └── page.tsx          # Main interactive dashboard UI & API client
│   ├── .env.local            # Environment configuration (NEXT_PUBLIC_API_URL)
│   └── package.json          # Node dependencies
│
├── notebooks/                # Model training logs and workflows
│   └── text_summarizer.ipynb # Jupyter notebook with fine-tuning & evaluation code
│
├── data/                     # Raw dialogue datasets
│   ├── samsum-train.csv      # Sub-sampled training set (4,000 samples)
│   ├── samsum-validation.csv # Sub-sampled validation set (500 samples)
│   └── samsum-test.csv       # Test set for final evaluation
│
├── saved_model/              # Fine-tuned model directory (Not to be modified)
│   ├── model.safetensors     # Trained T5 weights
│   ├── config.json           # Model configuration
│   └── tokenizer.json        # Tokenizer vocabulary configuration
│
└── README.md                 # Project documentation (this file)
```

---

## 🚀 Setup & Launch Instructions

Both services must be run locally. Make sure you have **UV** (Python package manager) and **Node.js** installed on your machine.

### 1. Start the FastAPI Backend
From the workspace root directory, run:
```bash
cd backend
uv run uvicorn main:app --port 8000 --host 127.0.0.1
```
* The API will startup, load the weights from `saved_model/` onto the CPU/GPU, and listen on port `8000`.
* You can view the automatic Swagger API documentation at `http://127.0.0.1:8000/docs`.

### 2. Start the Next.js Frontend
In a new terminal window, navigate to the `frontend/` directory and run:
```bash
cd frontend
npm run dev
```
* The dev server will boot up and run on `http://localhost:3000`.
* The frontend reads the backend endpoint from `frontend/.env.local`.

---

## 🧪 API Specifications

### `GET /health`
Verifies if the backend is running and the model has loaded successfully.
* **Response**:
  ```json
  {
    "status": "healthy",
    "model_loaded": true,
    "device": "cpu"
  }
  ```

### `POST /summarize`
Receives a dialogue and returns the model-generated summary.
* **Request Body**:
  ```json
  {
    "dialogue": "John: Did you finish the design draft?\nSarah: Yes, emailed it just now."
  }
  ```
* **Response Body**:
  ```json
  {
    "summary": "Sarah emailed the design draft to John."
  }
  ```
