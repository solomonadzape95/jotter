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
   - Use no other elements apart from the ones listed above. Do not add any other elements.
   - When making lists, use the <bold> element to make the list items bold. Do not use any other elements not listed above.
   - Structure it like: 
   <?xml version='1.0' encoding='utf-8'?>
   <note>
   <heading1>...</heading1> \n
   ... \n
   </note>
   - Format the XML with **actual line breaks** (not escaped \n). Do not use \\n or \n in the output — use real new lines.
   - Use simple, clear explanations suitable for middle school level.

2. An "assessment" field containing XML of 5 questions and answer sets that matches the format below:
<?xml version='1.0' encoding='utf-8'?> \n
<assessmentList> \n
    <assessment answer='CORRECT_ANSWER_OPTION'> \n
        <question>...</question> \n
        <A>...</A> \n
        <B>...</B> \n
        <C>...</C> \n
        <D>...</D> \n
        <explanation>...</explanation> \n
    </assessment> \n
    ... \n
</assessmentList> \n

Return the content as a JSON object with the structure:
{
  "note": "<?xml version='1.0' encoding='utf-8'?>\n<note>\n...\n</note>",
  "assessment": "<?xml version='1.0' encoding='utf-8'?>\n<assessmentList>\n...\n</assessmentList>",
  
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
