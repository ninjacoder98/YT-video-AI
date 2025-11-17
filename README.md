# YT-video-AI
<p><h1># 🎬 YT Video AI – Frontend</h1>

This is the frontend UI for the **YouTube Video AI Assistant**.  
Users can paste a YouTube link, preview the video instantly, and ask questions about it.

### ✨ Key Features
- 🎥 **Auto video preview** when YouTube link is pasted  
- ❓ Ask AI anything about the video topic  
- 🤖 Powered by Gemini Flash API  
- 📝 **No transcript required** — still works perfectly  
- ⚡ Fast, simple, and clean UI  
- 🔗 Connects directly to the backend `/ask` endpoint  

### 🧩 How it Works
1. Paste a YouTube link  
2. Video auto-loads on screen  
3. Enter your question  
4. AI gives a short, accurate explanation  

### 📦 Tech Stack
- React  
- Fetch API  
- Vite (optional)  
- Tailwind (if used)  

---

Perfect for making an AI-powered video assistant that helps users understand any YouTube content easily.
</p>


<p><h1># 📡 YT Video AI – Backend</h1>

This is the backend service for the **YouTube Video AI Assistant**.  
It accepts a YouTube link + user question and generates an AI-powered answer using **Gemini Flash**.  

### ✨ Key Features
- 🔗 **Paste any YouTube link** and ask questions
- 🤖 Works with **Gemini AI (gemini-flash-latest)**
- 📝 **Transcript NOT required** — works even without captions  
- 🧠 Automatically uses transcript *if available*  
- 🧩 Falls back to metadata + AI reasoning when transcript is missing  
- 🚀 Clean REST API for frontend integration  
- 🔐 Uses `.env` for API keys  
- 🎯 Built with Node.js + Express  

### 🔧 Endpoints
- `POST /ask` — Ask any question about the video

### 📦 Tech Stack
- Node.js  
- Express  
- Google Generative AI  
- YouTube Transcript API  
- CORS  

---

Backend is fully ready to be deployed and consumed by any frontend or mobile app.
</p>
