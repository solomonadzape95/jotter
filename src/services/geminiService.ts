import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
  Type,
} from "@google/genai";
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });
export async function geminiService(file: File) {
  const myfile = await ai.files.upload({
    file,
    config: { mimeType: file.type },
  });
  if (myfile.uri && myfile.mimeType) {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: createUserContent([
        createPartFromUri(myfile.uri, myfile.mimeType),
        `You are a lesson authoring assistant for a learning platform called "Accave".

Generate educational content in JSON with two parts:
1. A "note" field containing lesson content as XML. Follow this simplified schema:
   - Elements: heading1, heading2, heading3, heading4, heading5, bold, picture (as string), sub, sup
   - Structure it like: <note><heading1>...</heading1>...</note>
   - Use simple, clear explanations suitable for middle school level.

2. An "assessment" field containing XML of 5 questions and answer sets that matches the format below:
<?xml version='1.0' encoding='utf-8'?>
<assessmentList>
    <assessment answer='CORRECT_ANSWER_OPTION'>
        <question>...</question>
        <A>...</A>
        <B>...</B>
        <C>...</C>
        <D>...</D>
        <explanation>...</explanation>
    </assessment>
    ...
</assessmentList>

Return the content as a JSON object with the structure:
{
  "note": "<note>...</note>",
  "assessment": "<?xml version='1.0'?><assessmentList>...</assessmentList>",
  
}

The topic is: gotten from the audio.
`,
      ]),
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            note: { type: Type.STRING },
            assessment: { type: Type.STRING },
          },
          propertyOrdering: ["note", "assessment"],
        },
      },
    });
    return response.text || "";
  } else {
    return "No valid file uploaded";
  }
}
