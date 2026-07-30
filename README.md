# Dialogue Summarization using T5 Transformer

This repository contains a Google Colab / Jupyter Notebook pipeline for fine-tuning Google's **T5-Small** transformer model on the **SAMSum dataset** to generate clean, concise summaries of conversational dialogues.

---

## 🚀 Features
- **Data Preprocessing**: Custom cleaning utility to remove HTML tags, handle carriage returns/extra spaces, and normalize text.
- **Efficient Fine-Tuning**: Configured for Hugging Face's `Trainer` API with mixed precision training (`fp16`) optimized for GPUs (e.g., NVIDIA Tesla T4).
- **Beam Search Decoding**: Inference pipeline using Beam Search (`num_beams=4`) and early stopping to generate high-quality summaries.
- **Model Serialization**: Saves both the fine-tuned model and tokenizer configurations to local storage and Google Drive.

---

## 📁 Repository Structure
```text
.
├── text_summarizer.ipynb      # Main Jupyter notebook containing training and inference pipelines
├── saved_model/               # Directory containing the fine-tuned model and tokenizer binaries
│   ├── config.json            # Model architecture configuration
│   ├── generation_config.json # Inference configuration
│   ├── model.safetensors      # Fine-tuned model weights (242 MB)
│   ├── tokenizer.json         # Tokenizer vocabulary and merge rules
│   └── tokenizer_config.json  # Tokenizer settings
├── samsum-train.csv           # Dialogue train dataset (4,000 samples randomly selected for training)
├── samsum-validation.csv      # Dialogue validation dataset (500 samples randomly selected)
├── samsum-test.csv            # Dialogue test dataset
└── README.md                  # Project documentation (this file)
```

---

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sujaljadhav14/text-summarizer-transformer.git
   cd text-summarizer-transformer
   ```

2. **Set up a Virtual Environment**:
   ```bash
   python -m venv .venv
   # On Windows:
   .venv\Scripts\activate
   # On Linux/macOS:
   source .venv/bin/activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install torch pandas transformers accelerate
   ```

---

## 📊 Model Training

The model was fine-tuned with the following hyperparameters:
- **Base Model**: `t5-small` (60M parameters)
- **Dataset**: SAMSum dialogue dataset (Sub-sampled to **4,000** training & **500** validation dialogues for efficient runtimes)
- **Epochs**: `4`
- **Batch Size**: `8`
- **Learning Rate**: `3e-4`
- **Weight Decay**: `0.01`
- **Warmup Steps**: `200`
- **FP16 Mixed Precision**: Enabled

### Training & Validation Loss Progression

| Epoch | Training Loss | Validation Loss |
|:---:|:---:|:---:|
| 1 | 0.388512 | 0.357063 |
| 2 | 0.345916 | 0.347199 |
| 3 | 0.326641 | 0.346364 |
| 4 | 0.306306 | 0.345886 |

---

## 📝 Dataset Reference
The pipeline uses the **SAMSum dataset**, which contains about 16k messenger-like conversations with human-written summaries.
- [SAMSum Dataset on HuggingFace](https://huggingface.co/datasets/samsum)

