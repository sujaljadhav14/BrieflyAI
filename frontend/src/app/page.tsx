"use client";

import React, { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  const [dialogue, setDialogue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Auto-resize / track length
  const charCount = dialogue.length;

  const loadExample = () => {
    setDialogue(
      "John: Hey Sarah, did you finish the marketing report for the Q3 launch?\n" +
        "Sarah: Almost, I'm just waiting for the final budget numbers from Mike.\n" +
        "John: Mike mentioned he'd have them by 4 PM today. We need to present this to the CEO tomorrow morning at 9.\n" +
        "Sarah: Understood. Once I get the numbers, I'll spend about an hour finalizing the charts.\n" +
        "John: Great. Let's aim to have a dry run tonight at 6 PM. I'll book a meeting room.\n" +
        "Sarah: Sounds good. I'll be ready."
    );
    setError(null);
  };

  const clearText = () => {
    setDialogue("");
    setSummary("");
    setError(null);
  };

  const handleSummarize = async () => {
    if (!dialogue.trim()) {
      setError("Please enter some text to summarize.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummary("");

    try {
      const response = await fetch(`${API_URL}/summarize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dialogue }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error (${response.status})`);
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Unable to connect to the summarization server.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleDownload = () => {
    if (!summary) return;
    const element = document.createElement("a");
    const file = new Blob([summary], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "summary.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  // Split summary into sentences for bulleted design mockup presentation
  const getSentences = (text: string) => {
    if (!text) return [];
    return text
      .split(/[.!?]\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => (s.endsWith(".") || s.endsWith("!") || s.endsWith("?") ? s : s + "."));
  };

  const summarySentences = getSentences(summary);

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary-container/30 selection:text-on-background bg-background text-on-background font-body">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 z-50">
        <div className="flex justify-between items-center h-20 px-8 max-w-7xl mx-auto">
          <div className="serif-font text-3xl font-bold text-primary tracking-tight">
            BrieflyAI
          </div>
          <div className="hidden md:flex items-center gap-10">
            <a
              className="text-primary border-b-2 border-primary pb-1 font-semibold text-sm tracking-wide"
              href="#"
            >
              Dashboard
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors font-semibold text-sm tracking-wide"
              href="#"
            >
              History
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors font-semibold text-sm tracking-wide"
              href="#"
            >
              Features
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors font-semibold text-sm tracking-wide"
              href="#"
            >
              API
            </a>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-on-surface-variant hover:text-primary font-semibold text-sm transition-all active:scale-95">
              Sign In
            </button>
            <button className="primary-button px-6 py-2.5 rounded-lg font-bold text-sm active:scale-95">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-40 pb-24 px-8 max-w-7xl mx-auto w-full relative">
        {/* Hero Section */}
        <header className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/5 border border-primary/20 mb-8">
            <span className="material-symbols-outlined text-primary text-[18px]">
              auto_awesome
            </span>
            <span className="font-label text-[10px] font-extrabold text-primary uppercase tracking-[0.25em]">
              Advanced NLP Engine
            </span>
          </div>
          <h1 className="serif-font text-6xl md:text-7xl font-medium text-on-surface mb-8 tracking-tight leading-[1.1]">
            Dialogue <span className="text-primary italic">Summarizer</span>
          </h1>
          <p className="font-body text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Transform lengthy conversations into concise, meaningful summaries using a fine-tuned Google T5 Transformer model. Extract the essence of any dialogue in seconds.
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Input Panel */}
          <section className="lg:col-span-7 space-y-10">
            <div className="clean-card p-10 bg-white">
              <div className="flex justify-between items-center mb-8">
                <h3 className="serif-font text-2xl font-bold flex items-center gap-4 text-on-surface">
                  <span className="material-symbols-outlined text-primary">
                    chat_bubble
                  </span>
                  Conversation
                </h3>
                <div className="flex gap-4">
                  <button
                    className="px-5 py-2.5 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors text-on-surface-variant text-xs font-bold active:scale-95"
                    onClick={loadExample}
                  >
                    Load Example
                  </button>
                  <button
                    className="px-5 py-2.5 rounded-lg border border-outline-variant hover:bg-error-container/20 hover:text-error transition-colors text-on-surface-variant text-xs font-bold active:scale-95"
                    onClick={clearText}
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="relative">
                <textarea
                  className="w-full h-96 bg-surface-bright border border-outline-variant rounded-lg p-8 font-body text-lg focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all resize-none placeholder:text-on-surface-variant/30 leading-relaxed text-on-surface"
                  value={dialogue}
                  onChange={(e) => {
                    setDialogue(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Paste your conversation here..."
                ></textarea>
                <div className="absolute bottom-6 right-8 font-label text-xs text-on-surface-variant/40 tracking-wider">
                  <span className="font-bold">{charCount}</span> characters
                </div>
              </div>

              {error && (
                <div className="mt-4 p-4 rounded-lg bg-error-container/10 border border-error/20 text-error text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="mt-10">
                <button
                  className="w-full primary-button py-5 rounded-lg serif-font text-xl font-bold flex items-center justify-center gap-4 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSummarize}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Summarize Dialogue"}
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    bolt
                  </span>
                </button>
              </div>
            </div>

            {/* Features Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="clean-card p-8 bg-white group hover:shadow-lg transition-all">
                <div className="w-14 h-14 rounded-lg bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    psychology
                  </span>
                </div>
                <h4 className="font-body text-lg font-bold mb-3 text-on-surface">
                  AI Powered
                </h4>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed font-light">
                  Transformer-based logic for nuanced editorial understanding and context retention.
                </p>
              </div>

              <div className="clean-card p-8 bg-white group hover:shadow-lg transition-all">
                <div className="w-14 h-14 rounded-lg bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    touch_app
                  </span>
                </div>
                <h4 className="font-body text-lg font-bold mb-3 text-on-surface">
                  Easy to Use
                </h4>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed font-light">
                  Simple paste-and-click interface designed for maximum scholarly efficiency.
                </p>
              </div>

              <div className="clean-card p-8 bg-white group hover:shadow-lg transition-all">
                <div className="w-14 h-14 rounded-lg bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    security
                  </span>
                </div>
                <h4 className="font-body text-lg font-bold mb-3 text-on-surface">
                  Privacy First
                </h4>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed font-light">
                  Your data is processed securely and never stored on our local server nodes.
                </p>
              </div>

              <div className="clean-card p-8 bg-white group hover:shadow-lg transition-all">
                <div className="w-14 h-14 rounded-lg bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    speed
                  </span>
                </div>
                <h4 className="font-body text-lg font-bold mb-3 text-on-surface">
                  Fast Processing
                </h4>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed font-light">
                  Distilled summaries delivered in milliseconds via our high-speed global API.
                </p>
              </div>
            </div>
          </section>

          {/* Output Panel */}
          <section className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="clean-card bg-white min-h-[480px] flex flex-col relative overflow-hidden">
              {/* Loading State Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-white/98 z-20 flex flex-col items-center justify-center p-12 text-center">
                  <div className="spinner mb-8"></div>
                  <h3 className="serif-font text-2xl font-bold mb-3 text-on-surface">
                    Generating Summary...
                  </h3>
                  <p className="font-body text-base text-on-surface-variant font-light">
                    Our models are distilling the dialogue for clarity.
                  </p>
                  <div className="w-56 h-1 bg-surface-container rounded-full mt-10 overflow-hidden relative">
                    <div className="h-full bg-primary w-1/3 absolute left-0 top-0 animate-[progress_2s_infinite_ease-in-out]"></div>
                  </div>
                </div>
              )}

              {/* Panel Header */}
              <div className="p-8 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50">
                <h3 className="serif-font text-2xl font-bold flex items-center gap-4 text-on-surface">
                  <span className="material-symbols-outlined text-primary">
                    description
                  </span>
                  Summary
                </h3>
                <div className="flex gap-2">
                  <button
                    className="p-3 rounded-lg hover:bg-surface-container text-on-surface-variant disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    onClick={handleCopy}
                    disabled={!summary}
                    title="Copy to clipboard"
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      {copySuccess ? "check" : "content_copy"}
                    </span>
                  </button>
                  <button
                    className="p-3 rounded-lg hover:bg-surface-container text-on-surface-variant disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    onClick={handleDownload}
                    disabled={!summary}
                    title="Download TXT"
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      {downloadSuccess ? "check" : "download"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Panel Body */}
              <div className="p-10 flex-grow flex flex-col items-center justify-center text-center">
                {!summary && (
                  <div className="w-full">
                    <div className="w-20 h-20 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center mx-auto mb-8 text-outline/50">
                      <span className="material-symbols-outlined text-4xl">
                        auto_fix_high
                      </span>
                    </div>
                    <p className="serif-font text-xl text-on-surface-variant italic font-medium">
                      The editorial summary will appear here once you hit &quot;Summarize&quot;.
                    </p>
                  </div>
                )}

                {summary && (
                  <div className="text-left w-full">
                    <div className="font-body text-on-surface space-y-6">
                      <h4 className="font-bold text-xl mb-6 text-primary serif-font">
                        Executive Summary
                      </h4>
                      <ul className="space-y-5 text-base font-light">
                        {summarySentences.map((sentence, idx) => (
                          <li key={idx} className="flex gap-4">
                            <span className="text-primary mt-1.5 font-bold">
                              {String(idx + 1).padStart(2, "0")}.
                            </span>
                            <span>{sentence}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Panel Footer */}
              <div className="p-6 bg-surface-container-low border-t border-outline-variant flex items-center justify-center gap-3">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  verified
                </span>
                <span className="font-label text-[10px] font-extrabold text-on-surface-variant tracking-widest uppercase">
                  Verified by BrieflyAI Transformer V4
                </span>
              </div>
            </div>

            {/* Architecture Info */}
            <div className="mt-10 clean-card p-8 bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-2xl">
                    account_tree
                  </span>
                </div>
                <div>
                  <h4 className="font-body text-lg font-bold text-primary mb-2">
                    Transformer Architecture
                  </h4>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed font-light">
                    Our summarization engine leverages multi-head attention mechanisms to identify key speakers and critical decision points in any dialogue transcript with academic precision.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Educational/Info Section */}
        <section className="mt-24 border-t border-outline-variant/30 pt-20">
          <div className="text-center mb-16">
            <h2 className="serif-font text-4xl font-bold text-on-surface mb-6">How It Works Under the Hood</h2>
            <p className="font-body text-lg text-on-surface-variant max-w-2xl mx-auto font-light leading-relaxed">
              Delve into the science and mechanics behind BrieflyAI&apos;s dialogue summarization engine. We bridge high-performance NLP models with clean, accessible interfaces.
            </p>
          </div>

          {/* Unified How It Works Section */}
          <div className="clean-card p-10 bg-white shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Left Column: Core Overview */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl">info</span>
                  <h3 className="serif-font text-2xl font-bold text-on-surface">Dialogue Summarization</h3>
                </div>
                <p className="font-body text-base text-on-surface-variant leading-relaxed font-light mb-6">
                  Conversations in team chat logs or meeting transcripts are naturally unstructured, filled with casual talk, typos, and fragments. Our automated summarization assistant reads through raw transcripts, filters out conversational noise, and compiles key resolutions, decisions, and action items.
                </p>
                <p className="font-body text-base text-on-surface-variant leading-relaxed font-light">
                  This helps teams quickly review transcripts without manually digging through hours of chat history, creating an instantaneous summary output.
                </p>
              </div>

              {/* Right Column: Under the Hood Specs */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl">settings</span>
                  <h3 className="serif-font text-2xl font-bold text-on-surface">Under the Hood</h3>
                </div>
                <p className="font-body text-base text-on-surface-variant leading-relaxed font-light mb-6">
                  The engine leverages a Google <strong>T5-Small Transformer</strong> model, fine-tuned on the <strong>SAMSum corpus</strong> (16,000 messenger conversations). A <strong>Beam Search</strong> decoding strategy (using 4 beams) is applied during inference to generate highly coherent summaries.
                </p>
                <div className="bg-surface-container-low rounded-lg p-5 border border-outline-variant/30 text-sm">
                  <p className="font-body text-on-surface-variant font-light leading-relaxed">
                    <strong>Model Type</strong>: Encoder-Decoder Transformer<br />
                    <strong>Dataset</strong>: SAMSum Corpus (Conversational Dialect)<br />
                    <strong>Inference Parameters</strong>: Max Context Length = 512, Max Output = 150, Beam Search (k=4)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Flow diagram */}
          <div className="mt-12 clean-card p-10 bg-white shadow-sm">
            <h3 className="serif-font text-2xl font-bold text-on-surface mb-8 text-center">Pipeline Dataflow</h3>
            <div className="flex flex-col md:flex-row items-center justify-around gap-6">
              <div className="flex flex-col items-center p-4 bg-surface-container-low rounded-lg border border-outline-variant/30 w-full md:w-1/5 text-center">
                <span className="material-symbols-outlined text-primary mb-2 text-2xl">chat_paste_go</span>
                <span className="font-body text-sm font-bold text-on-surface">1. Raw Input</span>
                <span className="font-body text-xs text-on-surface-variant font-light mt-1">Paste dialogue transcripts</span>
              </div>
              <span className="hidden md:inline material-symbols-outlined text-outline/50 text-2xl">arrow_forward</span>
              <div className="flex flex-col items-center p-4 bg-surface-container-low rounded-lg border border-outline-variant/30 w-full md:w-1/5 text-center">
                <span className="material-symbols-outlined text-primary mb-2 text-2xl">cleaning_services</span>
                <span className="font-body text-sm font-bold text-on-surface">2. Cleaning</span>
                <span className="font-body text-xs text-on-surface-variant font-light mt-1">Strip tags & normalize spacing</span>
              </div>
              <span className="hidden md:inline material-symbols-outlined text-outline/50 text-2xl">arrow_forward</span>
              <div className="flex flex-col items-center p-4 bg-surface-container-low rounded-lg border border-outline-variant/30 w-full md:w-1/5 text-center">
                <span className="material-symbols-outlined text-primary mb-2 text-2xl">account_tree</span>
                <span className="font-body text-sm font-bold text-on-surface">3. T5 Small</span>
                <span className="font-body text-xs text-on-surface-variant font-light mt-1">Encoder-Decoder processing</span>
              </div>
              <span className="hidden md:inline material-symbols-outlined text-outline/50 text-2xl">arrow_forward</span>
              <div className="flex flex-col items-center p-4 bg-surface-container-low rounded-lg border border-outline-variant/30 w-full md:w-1/5 text-center">
                <span className="material-symbols-outlined text-primary mb-2 text-2xl">manage_search</span>
                <span className="font-body text-sm font-bold text-on-surface">4. Beam Search</span>
                <span className="font-body text-xs text-on-surface-variant font-light mt-1">Search k=4 for best summary</span>
              </div>
              <span className="hidden md:inline material-symbols-outlined text-outline/50 text-2xl">arrow_forward</span>
              <div className="flex flex-col items-center p-4 bg-surface-container-low rounded-lg border border-outline-variant/30 w-full md:w-1/5 text-center">
                <span className="material-symbols-outlined text-primary mb-2 text-2xl">assignment_turned_in</span>
                <span className="font-body text-sm font-bold text-on-surface">5. Bullet Output</span>
                <span className="font-body text-xs text-on-surface-variant font-light mt-1">Split sentences for UI display</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container border-t border-outline-variant/30 w-full py-20 mt-24">
        <div className="flex flex-col md:flex-row justify-between items-start px-8 max-w-7xl mx-auto gap-12">
          <div className="max-w-md">
            <div className="serif-font text-3xl font-bold text-on-surface mb-4 tracking-tight">
              Dialogue Summarizer
            </div>
            <p className="font-body text-base text-on-surface-variant leading-relaxed font-light">
              Conversational AI application using a fine-tuned Google T5 Transformer model, built with Next.js, FastAPI, and HuggingFace Transformers.
            </p>
          </div>
          <div className="flex flex-col md:items-end gap-8">
            <div className="flex gap-10">
              <a
                className="font-label text-xs font-bold text-on-surface-variant hover:text-primary transition-colors tracking-[0.2em] uppercase"
                href="#"
              >
                Privacy
              </a>
              <a
                className="font-label text-xs font-bold text-on-surface-variant hover:text-primary transition-colors tracking-[0.2em] uppercase"
                href="#"
              >
                Terms
              </a>
              <a
                className="font-label text-xs font-bold text-on-surface-variant hover:text-primary transition-colors tracking-[0.2em] uppercase"
                href="#"
              >
                Contact
              </a>
            </div>
            <div className="flex items-center gap-3 font-label text-xs font-bold text-on-surface-variant tracking-[0.2em] uppercase">
              <span>Developed by</span>
              <a
                href="https://github.com/sujaljadhav14"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline transition-colors normal-case tracking-normal font-extrabold text-sm"
              >
                Sujal Jadhav
              </a>
              <a
                href="https://github.com/sujaljadhav14/text-summarizer-transformer"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub Repository"
                className="inline-flex items-center transition-transform hover:scale-110 active:scale-95 text-on-surface-variant hover:text-primary"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
