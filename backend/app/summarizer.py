import os
import re
import logging
import torch
from transformers import T5Tokenizer, T5ForConditionalGeneration

logger = logging.getLogger(__name__)

class DialogueSummarizer:
    def __init__(self, model_path: str):
        logger.info(f"Initializing DialogueSummarizer with model from: {model_path}")
        
        # Verify if path exists locally, otherwise assume it's a Hugging Face Hub repo ID
        if os.path.exists(model_path):
            logger.info(f"Loading local model from directory: {model_path}")
        else:
            logger.info(f"Loading model from Hugging Face Hub: {model_path}")
            
        # Load tokenizer and model
        # Note: T5Tokenizer might warn about sentencepiece if not installed, we installed it.
        self.tokenizer = T5Tokenizer.from_pretrained(model_path)
        self.model = T5ForConditionalGeneration.from_pretrained(model_path)
        
        # Select device (GPU / MPS / CPU)
        if torch.cuda.is_available():
            self.device = torch.device("cuda")
        elif torch.backends.mps.is_available():
            self.device = torch.device("mps")
        else:
            self.device = torch.device("cpu")
            
        logger.info(f"Moving model to device: {self.device}")
        self.model.to(self.device)
        self.model.eval()
        logger.info("Model loaded successfully and set to evaluation mode.")

    def clean_data(self, text: str) -> str:
        # Replicates the cleaning logic from the notebook (cell 10)
        text = re.sub(r"\r\n", " ", text)
        text = re.sub(r"\s+", " ", text)
        text = re.sub(r"<.*?>", " ", text)
        return text

    def summarize(self, dialogue: str) -> str:
        cleaned_dialogue = self.clean_data(dialogue)
        
        # Tokenize input
        inputs = self.tokenizer(
            cleaned_dialogue,
            padding="max_length",
            max_length=512,
            truncation=True,
            return_tensors="pt"
        )
        
        # Move inputs to device
        input_ids = inputs["input_ids"].to(self.device)
        attention_mask = inputs["attention_mask"].to(self.device)
        
        # Generate summary (without gradients for faster inference)
        with torch.no_grad():
            outputs = self.model.generate(
                input_ids=input_ids,
                attention_mask=attention_mask,
                max_length=150,
                num_beams=4,
                early_stopping=True
            )
            
        # Decode and return summary
        summary = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return summary
