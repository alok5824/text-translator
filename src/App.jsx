import { useState } from "react";
import { ArrowRightLeft, Loader2 } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "ja", label: "Japanese" },
  { code: "zh", label: "Chinese" },
];

function App() {
  const [inputText, setInputText] = useState("");
  const [targetLang, setTargetLang] = useState("hi");
  const [translated, setTranslated] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTranslate = async () => {
  if (!inputText.trim()) return;
  setLoading(true);
  setError("");
  setTranslated("");

  try {
    const response = await fetch(
      "https://google-translate113.p.rapidapi.com/api/v1/translator/json",
      {
        method: "POST",
        headers: {
          "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
          "x-rapidapi-host": "google-translate113.p.rapidapi.com",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "auto",
          to: targetLang,
          protected_paths: [],
          common_protected_paths: [],
          json: { text: inputText },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    // The API returns the same JSON shape back, with values translated
    const result = data.trans?.text || data.data?.text || data.text;
    setTranslated(result || "No translation returned");
  } catch (err) {
    setError("Translation failed. Check your API key or try again.");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-1">Text Translator</h1>
        <p className="text-slate-400 text-sm mb-6">
          Powered by Google Translate via RapidAPI
        </p>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type text in English..."
          rows={4}
          className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 text-slate-100 placeholder-slate-500 mb-4 focus:outline-none focus:border-cyan-500"
        />

        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-slate-400">Translate to:</span>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleTranslate}
          disabled={loading || !inputText.trim()}
          className="w-full flex items-center justify-center gap-2 bg-cyan-500 text-slate-950 px-4 py-2.5 rounded-md font-medium hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors mb-4"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <ArrowRightLeft size={16} />
          )}
          {loading ? "Translating..." : "Translate"}
        </button>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {translated && (
          <div className="bg-slate-800 border border-slate-700 rounded-md p-4">
            <p className="text-xs text-slate-500 mb-1">Translated:</p>
            <p className="text-emerald-400">{translated}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;