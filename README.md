---

# MemZero – Memory-Aware Chatbot

A sophisticated **JavaScript** chatbot that combines **Ollama's local LLM capabilities** with a **custom memory system** for persistent, context-aware conversations.
Implements **advanced memory management** with Extraction → Update → Retrieval phases, powered by **LangChain.js** and **FAISS vector similarity search**.

---

## ✨ Features

* 🧠 **Persistent Memory** – Remembers information from previous conversations with intelligent storage.
* 🔍 **Semantic Search** – Finds relevant memories using **FAISS** vector similarity search.
* 💬 **Natural Conversations** – Context-aware responses using retrieved memories and conversation history.
* 📚 **Advanced Memory Management** – Intelligent `ADD`, `UPDATE`, `DELETE`, and `NOOP` operations.
* 🤖 **Local LLM** – Uses Ollama with LangChain.js for **privacy-focused AI interactions**.
* ⚡ **Multi-Phase Architecture** – **Extraction → Update → Retrieval** pipeline for memory management.
* 🔄 **Automatic Memory Extraction** – LLM-powered extraction of important facts from conversations.
* 📊 **Memory Analytics** – Search, view, and manage stored memories with similarity scoring.

---

## 📦 Prerequisites

* Node.js **v18+**
* **Ollama** – [Install from ollama.ai](https://ollama.ai)
* **LangChain.js** – For LLM integration (installed via npm)
* **FAISS** – Node.js binding for vector similarity search

---

## 🚀 Quick Start

### 1. Setup Ollama

```bash
# Install and start Ollama (if not already done)
ollama serve

# In another terminal, pull a model
ollama pull qwen2.5:3b-instruct

# Run the model
ollama run qwen2.5:3b-instruct
```

---

### 2. Install Dependencies

```bash
npm install
```

Or run the setup script for automated checking:

```bash
node setup.js
```

---

### 3. Run the Chatbot

```bash
node chat.js
```

---

## 💬 Usage

### Basic Chat

Just type naturally and the chatbot will respond while learning about you:

```
👤 You: Hi, I'm working on a React project
🤖 Assistant: Hello! That's great that you're working on a React project...
```

---

### Special Commands

* `memories` – View recently stored memories with details
* `search: <query>` – Search memories using semantic similarity
* `help` – Show all available commands
* `quit` / `exit` / `bye` – End the conversation gracefully

---

## 🧠 Advanced Features

The chatbot automatically:

* Extracts memories – Identifies important facts from conversations
* Updates existing memories – Merges or updates related information
* Removes redundant data – Avoids storing duplicate information
* Maintains context – Uses recent conversation history for better responses

---

### Example Session

```
👤 You: I love playing Valorant, especially as Sage
🤖 Assistant: That's awesome! Sage is a great agent...

👤 You: memories
📚 Recent Memories:
- User enjoys playing Valorant and prefers playing as Sage agent

👤 You: search: gaming
🔍 Searching memories for: 'gaming'
1. Score: 0.892
   Content: User enjoys playing Valorant and prefers playing as Sage agent
```

---

## 🏗 Architecture

### Memory Management Pipeline

The system follows a **3-phase architecture**:

1. **Extraction Phase (`extraction.js`)** – Analyzes conversations and extracts important facts.
2. **Update Phase (`update.js`)** – Determines appropriate memory operations (`ADD` / `UPDATE` / `DELETE` / `NOOP`).
3. **Retrieval Phase (`retrieval.js`)** – Searches and retrieves relevant memories for context.

---

### Components

* **`database.js`** – Handles memory storage, vector operations, and FAISS indexing.
* **`extraction.js`** – LLM-powered extraction of important information from conversations.
* **`update.js`** – Intelligent memory management with conflict resolution.
* **`ollamaWrapper.js`** – LangChain.js-based wrapper for Ollama API integration.
* **`chat.js`** – Main orchestrator coordinating all components.
* **`prompts.js`** – Centralized prompt templates for consistency.

---

### Memory System

* **Storage** – JSON files for memories and conversation history with structured metadata.
* **Vector DB** – FAISS for high-performance semantic similarity search.
* **Embeddings** – Uses Ollama's embedding models (`nomic-embed-text`) for vector representations.
* **Updates** – Intelligent memory operations to prevent redundancy and maintain accuracy.
* **Conflict Resolution** – Automatic handling of contradictory or duplicate information.

---

## 📂 File Structure

```
mem0/
├── chat.js                # Main chatbot application with interactive loop
├── ollamaWrapper.js       # LangChain.js-based Ollama API wrapper
├── database.js            # Memory storage and FAISS vector operations
├── extraction.js          # Memory extraction logic with context assembly
├── update.js              # Memory update phase with intelligent operations
├── prompts.js             # Centralized prompt templates
├── memories.json          # Stored memories with metadata
├── message.json           # Conversation history and context
├── summary.txt            # Conversation summary for context
├── memory_embeddings.json # Memory embeddings cache
├── memory_index.faiss     # FAISS vector index for similarity search
├── package.json           # Project dependencies
├── setup.js               # Setup script with dependency checking
├── images/                # Architecture and demo images
│   ├── database.png
└── README.md
```

---

## ⚙️ Configuration

### Changing Models

Edit in `chat.js`:

```js
const chatbot = new MemoryAwareChatbot({ modelName: "mistral" });
```

### Adjusting Memory Settings

Inside `MemoryAwareChatbot` constructor:

* Modify similarity thresholds for memory retrieval
* Change context window sizes for conversation history
* Adjust memory extraction sensitivity and filtering
* Configure vector database parameters (dimensions, similarity metrics)

---

## 🛠 Memory Operations

The system supports:

* **ADD** – Store completely new information
* **UPDATE** – Enhance existing memories with additional details
* **DELETE** – Remove outdated or incorrect information
* **NOOP** – No operation needed (information already exists or irrelevant)

---

## 📜 License

MIT License – free to use and modify.

---

Do you want me to add that?

