import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import fs from "fs";
import path from "path";

const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  baseUrl: "http://localhost:11434"
});

export default async () => {
  try {
    const text = fs.readFileSync(path.resolve('./src/Training Data/hexapod.md'), 'utf8');

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 150,
      chunkOverlap: 87.5,
      separators: ["|", "##", ">", "-"],
    });

    const documents = await splitter.createDocuments([text]);

    // Log documents to debug
    console.log('\x1b[32mDocuments created\x1b[0m');

    // Initialize MemoryVectorStore directly from documents and embeddings
    const vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);

    console.log('\x1b[32mVector store initialized successfully.\x1b[0m');
    return vectorStore;
  } catch (error) {
    console.error('\x1b[31mError initializing vector store:', error, '\x1b[0m');
    throw error;
  }
};
