import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";

export async function extractTextFromUpload(file: File): Promise<string> {
  if (
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  ) {
    const {PDFParse} = await import("pdf-parse");
    const buffer = Buffer.from(await file.arrayBuffer());

    const parser = new PDFParse({data: buffer});
    const parsed = await parser.getText();

    return parsed.text.trim();
  }

  return (await file.text()).trim();
}

export async function splitDocumentText(text: string): Promise<string[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1200,
    chunkOverlap: 200,
  });

  return splitter
    .splitText(text)
    .then((chunks) => chunks.map((chunk) => chunk.trim()).filter(Boolean));
}
