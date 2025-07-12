import { useState, useEffect } from "react";
import { backgrounds } from "./lib/constants";
import { InputComponent } from "./components/InputComponent";
import TextEditor from "./components/monaco-editor";
import { downloadXML } from "./lib/helpers";

export interface Result {
  json: { note: string; assessment: string };
  topic: string;
}

function App() {
  const [result, setResult] = useState<Result | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<string | null>(null);
  const [bgIndex, setBgIndex] = useState<number>(0);
  const [showEditors, setShowEditors] = useState(true);

  // Load background index from localStorage on mount
  useEffect(() => {
    const storedBg = localStorage.getItem("jotter_bgIndex");
    if (storedBg) {
      setBgIndex(Number(storedBg));
    } else {
      setBgIndex(Math.floor(Math.random() * backgrounds.length));
    }
  }, []);

  // Store background index in localStorage when changed
  useEffect(() => {
    localStorage.setItem("jotter_bgIndex", String(bgIndex));
  }, [bgIndex]);

  // On mount, load result from localStorage if present
  useEffect(() => {
    const stored = localStorage.getItem('jotter_results');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setResult(parsed);
        setNote(parsed.json.note);
        setAssessment(parsed.json.assessment);
      } catch {}
    }
  }, []);

  // Store generated notes/assessments in localStorage (single record)
  useEffect(() => {
    if (result && result.topic && result.json) {
      setNote(result.json.note);
      setAssessment(result.json.assessment);
      localStorage.setItem(
        'jotter_results',
        JSON.stringify(result)
      );
    }
  }, [result]);

  // Switch background handler
  const handleSwitchBg = () => {
    setBgIndex((prev) => (prev + 1) % backgrounds.length);
  };

  // Generate another set handler
  const handleGenerateAnother = () => {
    if (window.confirm("Are you sure? You will lose your current results and cannot get them back.")) {
      setResult(null);
      setNote(null);
      setAssessment(null);
      setShowEditors(true);
      localStorage.removeItem('jotter_results');
    }
  };

  return (
    <div
      style={{ backgroundImage: `url('${backgrounds[bgIndex]}')` }}
      className="bg-cover bg-center min-h-screen w-screen flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/50 w-full h-full" />
      
      <button
        className="cursor-pointer fixed top-4 right-4 z-20 px-4 py-2 rounded-lg bg-black/60 hover:bg-gray-800 text-white font-semibold shadow transition-colors border border-gray-700"
        onClick={handleSwitchBg}
        title="Switch background"
      >
        Switch Background
      </button>
      <div className="z-10 flex flex-col items-center justify-center gap-4 w-full max-w-[95vw]">
        <span className="text-5xl md:text-3xl text-white my-10">Hey There</span>
       
        {!result && <InputComponent setResult={setResult} />}
       
        {result && (
          <button
            className="cursor-pointer mb-2 px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow transition-colors"
            onClick={handleGenerateAnother}
          >
            Generate Another Set
          </button>
        )}
        {result && (
           <button
        className="cursor-pointer mb-2 px-4 py-2 rounded-lg bg-black/60 hover:bg-gray-800 text-white font-semibold shadow transition-colors border border-gray-700"
            onClick={() => setShowEditors((prev) => !prev)}
          >
            {showEditors ? "Hide Notes & Assessment" : "Show Notes & Assessment"}
          </button>
        )}
       
        {result && showEditors && (
          <div className="flex items-stretch justify-center gap-6 flex-col md:flex-row w-full">
            <TextEditor
              content={result.json.note}
              handleChange={setNote}
              handleDownload={() => {
                if (note) downloadXML(note, `${result.topic}_notes.xml`);
              }}
              fileName={`${result.topic}_notes.xml`}
            />
            <TextEditor
              content={result.json.assessment}
              handleChange={setAssessment}
              handleDownload={() => {
                if (assessment) downloadXML(assessment, `${result.topic}_assessment.xml`);
              }}
              fileName={`${result.topic}_assessment.xml`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
