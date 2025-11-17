import { useState } from "react";

function App() {
  const [videoLink, setVideoLink] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Function to extract YouTube ID
  const extractVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|shorts\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = extractVideoId(videoLink);

  const askAI = async () => {
    if (!videoLink || !question) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("http://localhost:4000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoLink, question }),
      });

      const data = await res.json();
      setAnswer(data.answer);
    } catch (error) {
      setAnswer("⚠️ Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050414] text-white flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">YouTube AI Assistant 🎥🤖</h1>

      <div className="w-full max-w-xl space-y-4">
        <input
          type="text"
          placeholder="Paste YouTube Video Link"
          className="w-full p-3 rounded bg-gray-800 outline-none"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
        />

        {/* ✅ Show video preview */}
        {videoId && (
          <div className="w-full aspect-video">
            <iframe
              className="rounded w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video"
              allowFullScreen
            ></iframe>
          </div>
        )}

        <textarea
          placeholder="Ask your question..."
          className="w-full p-3 rounded bg-gray-800 outline-none h-28"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button
          onClick={askAI}
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-bold"
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </div>

      {answer && (
        <div className="mt-6 max-w-xl w-full bg-gray-900 p-4 rounded">
          <h2 className="font-bold mb-2">Answer:</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default App;