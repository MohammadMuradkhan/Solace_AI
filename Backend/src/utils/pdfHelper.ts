import fs from "fs";
import pdfParse from "pdf-parse";
import path from "path";

let cachedChunks: string[] = [];

// Load + chunk PDF only once
export const loadPDFChunks = async () => {
  if (cachedChunks.length > 0) return cachedChunks;

  const pdfPath = path.join(
    process.cwd(),
    "src",
    "controllers",
    "MentalSupport.pdf"
  );

  const buffer = fs.readFileSync(pdfPath);
  const pdfData = await pdfParse(buffer);

  const text = pdfData.text;

  // Chunking
  const chunkSize = 500;
  const chunks: string[] = [];

  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }

  cachedChunks = chunks;
  return chunks;
};

// Basic keyword matching (fast + simple)
export const getRelevantChunks = (
  chunks: string[],
  query: string
) => {
  const lowerQuery = query.toLowerCase();

  return chunks
    .filter((chunk) =>
      chunk.toLowerCase().includes(lowerQuery)
    )
    .slice(0, 3); // top 3 chunks
};