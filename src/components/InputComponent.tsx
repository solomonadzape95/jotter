import {
  ArrowDownOnSquareStackIcon,
  CheckBadgeIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { geminiService } from "../services/geminiService";
import { Loader } from "../icons";
import { type Result } from "../App";

interface InputProps {
  setResult: Dispatch<SetStateAction<Result | null>>;
}
export const InputComponent: React.FC<InputProps> = ({ setResult }) => {
  const [file, setFile] = useState<File | null>(null);
  const [over, setOver] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!file) return;
    const fetchGemini = async () => {
      setLoading(true);
      try {
        const res = await geminiService(file);
        if (res) {
          setResult({
            json: JSON.parse(res),
            topic: file.name.replace(".mp3", ""),
          });
        }
      } catch (err: any) {
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
    <section className="bg-black/40 backdrop-blur-2xl p-6 rounded-2xl shadow-lg min-w-11/12 sm:min-w-[600px] text-white min-h-[300px] flex flex-col gap-4 items-center">
      {file ? (
        <div className="flex flex-col gap-4 w-full h-[200px] border-[1px] rounded-xl border-gray-500 ">
          <div
            className={`cursor-pointer w-full h-full flex flex-col items-center justify-center rounded-lg ${
              over ? "bg-gray-50/20" : ""
            }`}
          >
            <CheckBadgeIcon className="w-14 h-14 text-white my-2" />

            <span className="text-2xl">File Uploaded</span>
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
            <h2 className="text-2xl">Upload File</h2>
            <p className="text-md">
              Accepted files are any audio or text files
            </p>
          </section>
          <div className="flex flex-col gap-4 w-full h-[200px] border-[1px] rounded-xl border-gray-500 ">
            <input
              onChange={handleChange}
              id="file"
              type="file"
              accept="audio/*"
              className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hidden"
            />
            <label
              htmlFor="file"
              className={`cursor-pointer w-full h-full flex flex-col items-center justify-center rounded-lg ${
                over ? "bg-gray-50/20" : ""
              }`}
              onDragOver={(e: React.DragEvent<HTMLLabelElement>) =>
                e.preventDefault()
              }
              onDragEnter={handleOver}
              onDragLeave={handleOver}
              onDrop={handleDrop}
            >
              <ArrowDownOnSquareStackIcon className="w-14 h-14 text-white my-4" />

              <span className="text-2xl">Drag and Drop</span>
              <p>
                or{" "}
                <span className="underline cursor-pointer">choose a file</span>
              </p>
            </label>
          </div>
        </>
      )}
      {loading && (
        <span className="flex items-center justify-center">
          Processing... <Loader />
        </span>
      )}
    </section>
  );
};
