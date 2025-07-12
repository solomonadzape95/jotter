import {
  ArrowDownOnSquareStackIcon,
  CheckBadgeIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { geminiService } from "../services/geminiService";
import tubeSpinner from "../assets/tube-spinner.svg";
import { type Result } from "../App";

interface InputProps {
  setResult: Dispatch<SetStateAction<Result | null>>;
}
export const InputComponent: React.FC<InputProps> = ({ setResult }) => {
  const [file, setFile] = useState<File | null>(null);
  const [over, setOver] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>("");

  useEffect(() => {
    if (!file) return;
    const fetchGemini = async () => {
      setLoading(true);
      setProgressMsg("Analyzing audio and generating notes & assessment...");
      try {
        const res = await geminiService(file);
        if (res) {
          setResult({
            json: JSON.parse(res),
            topic: file.name.replace(".mp3", ""),
          });
        }
      } catch (err: any) {
        setProgressMsg("An error occurred. Please try again.");
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGemini();
  }, [file]);

  const handleOver = () => {
    setOver((prev) => !prev);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setFile(e.dataTransfer.files?.[0]);
    handleOver();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  return (
    <section className="bg-black/40 backdrop-blur-2xl p-6 rounded-2xl shadow-2xl min-w-11/12 sm:min-w-[600px] text-white min-h-[300px] flex flex-col gap-4 items-center border border-gray-700">
      {/* File uploaded state */}
      {file ? (
        <div className="flex flex-col gap-4 w-full h-[200px] border-[1px] rounded-xl border-gray-600 bg-black/60 shadow-lg items-center justify-center">
          <div className="flex flex-col items-center justify-center w-full h-full">
            <CheckBadgeIcon className="w-14 h-14 text-white my-2 animate-bounce" />
            <span className="text-2xl font-semibold">File Uploaded</span>
            <p className="flex items-center justify-center mt-4">
              <span>
                <MusicalNoteIcon className="w-6 h-6" />
              </span>{" "}
              {file.name}
            </p>
          </div>
        </div>
      ) : (
        <>
          <section className="text-center max-w-3/4">
            <h2 className="text-2xl font-bold mb-2">Upload File</h2>
            <p
              className="text-md font-medium bg-gradient-to-r from-gray-50 via-gray-700 to-gray-50 bg-clip-text text-transparent animate-gradient-x"
              style={{
                backgroundSize: '200% 200%',
                animation: 'gradient-x 2.5s ease-in-out infinite',
              }}
            >
              Accepted files: all audio formats. Drag and drop or click below.
            </p>
          </section>
          <div className={`flex flex-col gap-4 w-full h-[200px] border-2 rounded-xl border-gray-600 transition-colors duration-200 ${over ? "bg-gray-800/40 border-gray-400" : "bg-black/60"} shadow-lg items-center justify-center` }>
            <input
              onChange={handleChange}
              id="file"
              type="file"
              accept="audio/*"
              className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hidden"
            />
            <label
              htmlFor="file"
              className={`cursor-pointer w-full h-full flex flex-col items-center justify-center rounded-lg select-none`}
              onDragOver={(e: React.DragEvent<HTMLLabelElement>) => e.preventDefault()}
              onDragEnter={handleOver}
              onDragLeave={handleOver}
              onDrop={handleDrop}
            >
              <ArrowDownOnSquareStackIcon className="w-16 h-16 text-white my-4 animate-pulse" />
              <span className="text-xl font-semibold">Drag and Drop</span>
              <p>
                or <span className="underline cursor-pointer">choose a file</span>
              </p>
            </label>
          </div>
        </>
      )}
      {/* Processing state */}
      {loading && (
        <span className="flex flex-col items-center justify-center mt-2">
          <img src={tubeSpinner} alt="Processing..." className="w-14 h-14 animate-spin duration-300 infinite" />
          <span className="mt-2 text-lg font-semibold animate-gradient-x bg-gradient-to-r from-gray-50 via-gray-700 to-gray-50 bg-clip-text text-transparent" style={{backgroundSize: '200% 200%', animation: 'gradient-x 2.5s ease-in-out infinite'}}> {progressMsg || "Processing audio..."} </span>
        </span>
      )}
      <style>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
};
