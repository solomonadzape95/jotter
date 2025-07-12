import Editor from "@monaco-editor/react";
import type { Dispatch, SetStateAction } from "react";
import React from "react";
import { ArrowDownOnSquareStackIcon } from "@heroicons/react/24/outline";

interface EditorProps {
  handleChange: Dispatch<SetStateAction<string | null>>;
  content: string;
  handleDownload: () => void;
  fileName?: string;
}

const TextEditor: React.FC<EditorProps> = ({
  content,
  handleChange,
  handleDownload,
  fileName = "untitled.txt"
}) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center bg-black/40 backdrop-blur-2xl p-3 rounded-t-xl">
        <span className="text-white font-medium">{fileName}</span>
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <ArrowDownOnSquareStackIcon className="w-5 h-5" />
          Download
        </button>
      </div>
      <Editor
        height="50vh"
        width="100%"
        defaultLanguage="xml"
        theme="vs-dark"
        options={{
          formatOnPaste: true,
          formatOnType: true,
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 10 },
        }}
        value={content}
        onChange={(value) => handleChange(value ?? "")}
      />
    </div>
  );
};

export default TextEditor;
