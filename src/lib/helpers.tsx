import type { JSX } from "react";

export function downloadXML(content: string, filename: string) {
  const blob = new Blob([content], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.download = filename;
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
}

export function renderXML(content: string): JSX.Element {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: content }}
      style={{ whiteSpace: "pre-wrap" }}
    />
  );
}
