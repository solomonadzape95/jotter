import { useState } from "react";
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
  const [bg, setBG] = useState<string>(
    backgrounds[Math.floor(Math.random() * backgrounds.length)]
  );
  if (result) console.log(result, typeof result.json);
  return (
    <div
      style={{ backgroundImage: `url('${bg}')` }}
      className={`bg-cover bg-center h-screen w-screen flex items-center justify-center`}
    >
      <div className="absolute inset-0 bg-black/50 w-full h-full" />
      <div className="z-10 flex flex-col items-center justify-center gap-4">
        <span className="text-5xl md:text-3xl text-white my-10">Hey There</span>
        <InputComponent setResult={setResult} />
        {result && (
          <div className="flex items-center justify-between w-screen">
            <TextEditor
              content={JSON.stringify(result.json.note)}
              handleChange={setNote}
              handleDownload={() => {
                if (note) downloadXML(note, result.topic);
              }}
            />
            <TextEditor
              content={JSON.stringify(result.json.assessment)}
              handleChange={setAssessment}
              handleDownload={() => {
                if (assessment) downloadXML(assessment, result.topic);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
