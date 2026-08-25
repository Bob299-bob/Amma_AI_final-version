# 🤖 Ammaa AI

### AI-Powered Personal Health & Voice Assistant for Android ❤️

**Ammaa AI** is an AI-powered Android application designed to help users manage everyday health-related activities through **AI chat, voice interaction, medicine reminders, schedules, health profiles, exercise tracking, and medical report analysis**.

The goal of this project is to build a simple, friendly, and personalized assistant that can understand users naturally and provide context-aware assistance.

---

## 📱 Project Preview

> 🚧 Screenshots and demo video coming soon.

---

## ✨ Features

### 🤖 AI Assistant

* AI-powered conversational assistant
* Supports **Hindi, Hinglish, and English**
* Context-aware responses
* Uses application data to provide personalized assistance

### 🎙️ Voice Assistant

* Speech recognition
* Voice-based interaction
* Text-to-speech responses
* Hindi and English voice support

### 💊 Medicine Reminders

* Add medicines
* Set reminder schedules
* Track daily medicine activities

### 📅 Daily Schedule

* Manage daily activities
* Schedule important tasks
* View today's activities

### ❤️ Health Profile

* Personal health information
* Medical history
* Allergies
* Blood group
* Doctor and emergency contact information

### 📄 Medical Reports

* Upload and analyze medical reports
* AI-assisted report understanding
* Simple explanations of report information

### 🏃 Exercise

* Maintain exercise routines
* Track daily exercise activities

### 🧠 Personalized AI Context

Ammaa AI can use relevant information stored in the application to make conversations more personalized and useful.

---

# 🛠️ Tech Stack

## Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Capacitor

## Backend

* Python
* FastAPI
* REST APIs

## Database

* MongoDB

## AI

* Groq API
* Large Language Models
* NLP
* RAG concepts
* Sentence Transformers

## Voice

* Web Speech Recognition
* Text-to-Speech

## Deployment

* Render
* Android APK

---

# 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │      Android App     │
                    │   React + Capacitor  │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │      FastAPI         │
                    │       Backend        │
                    └──────────┬───────────┘
                               │
                  ┌────────────┼────────────┐
                  │            │            │
                  ▼            ▼            ▼
             ┌─────────┐  ┌─────────┐  ┌─────────┐
             │ MongoDB │  │ AI/LLM  │  │  Voice  │
             │         │  │  Groq   │  │ Services│
             └─────────┘  └─────────┘  └─────────┘
```

---

# 📂 Project Structure

```text
Amma_AI/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── main.py
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── database/
│   └── requirements.txt
│
├── android/
│   └── ...
│
├── apk/
│   └── Ammaa-AI.apk
│
├── screenshots/
│   └── ...
│
├── README.md
└── .gitignore
```

---

# 📲 Download Android App

The Android APK is available for testing.

### 👉 Download APK

**[Download Ammaa AI APK](./apk/Ammaa-AI.apk)**

> ⚠️ This is a development/testing build. Make sure Android allows installation from the appropriate source before installing.

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/Bob299-bob/Amma_AI-.git
```

```bash
cd Amma_AI-
```

---

# 🎨 Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

# ⚙️ Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run FastAPI:

```bash
uvicorn main:app --reload
```

Backend will normally run at:

```text
http://127.0.0.1:8000
```

---

# 🔐 Environment Variables

Create a `.env` file in the backend and configure your environment variables.

Example:

```env
MONGO_URI=your_mongodb_connection_string
DATABASE_NAME=ammaa_ai
GROQ_API_KEY=your_groq_api_key
```

### ⚠️ Important

**Never commit your `.env` file or API keys to GitHub.**

Make sure `.gitignore` contains:

```text
.env
venv/
__pycache__/
node_modules/
```

---

# 🗄️ MongoDB

Ammaa AI uses MongoDB for storing application data such as:

* Health profiles
* Medicines
* Reminders
* Schedules
* Exercises
* Reports
* Chat-related information

For production deployment, use a cloud MongoDB instance such as MongoDB Atlas.

---

# 🤖 AI Integration

Ammaa AI integrates an LLM through the Groq API.

The AI assistant is designed to:

* Understand natural language
* Respond in Hindi/Hinglish/English
* Use relevant application context
* Provide simple and understandable responses
* Assist with health-related information

> ⚠️ Ammaa AI is an informational assistant and should not replace a qualified medical professional.

---

# 📱 Android Build

The Android application is built using **Capacitor**.

After configuring the frontend:

```bash
npm run build
```

Then sync the Android project:

```bash
npx cap sync android
```

Open the Android project:

```bash
npx cap open android
```

From Android Studio, you can build the APK.

---

# 🔮 Future Improvements

Planned improvements include:

* 🎙️ More advanced voice commands
* 🧠 Long-term personalized memory
* 🏠 Smart home integration
* 🔔 Advanced notification system
* 📊 Health analytics dashboard
* 👨‍👩‍👧 Family member profiles
* 🌐 Better multilingual support
* 🤖 More JARVIS-like interaction
* 📱 Improved Android UI/UX

---

# 🎯 Vision

The long-term vision of **Ammaa AI** is to create a personal AI assistant that feels more natural and useful in everyday life.

Instead of being just a chatbot, Ammaa AI aims to become an assistant that can:

**Listen → Understand → Remember → Respond → Assist**

---

# 👨‍💻 Developer

**Boby Gupta**

AI/ML & Software Developer
MCA Graduate

Interested in:

* Artificial Intelligence
* Machine Learning
* Full-Stack Development
* Generative AI
* Voice Assistants
* Android Development

---

# ⭐ Support

If you find this project interesting, consider giving the repository a ⭐.

Feedback and suggestions are always welcome.

---

## 📜 License

This project is currently intended for educational and development purposes
