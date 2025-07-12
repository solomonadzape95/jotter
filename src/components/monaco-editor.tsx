import Editor from "@monaco-editor/react";
import type { Dispatch, SetStateAction } from "react";
import React from "react";
interface EditorProps {
  handleChange: Dispatch<SetStateAction<string | null>>;
  content: string;
  handleDownload: () => void;
}
const TextEditor: React.FC<EditorProps> = ({
  content,
  handleChange,
  handleDownload,
}) => {
  return (
    <div>
      <button onClick={handleDownload}>Download File</button>
      <Editor
        height="60vh"
        width="50vw"
        defaultLanguage="xml"
        options={{
          formatOnPaste: true,
          formatOnType: true,
        }}
        value={content}
        onChange={(value) => handleChange(value ?? "")}
      />
    </div>
  );
};

export default TextEditor;
