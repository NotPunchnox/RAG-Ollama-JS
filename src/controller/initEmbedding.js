import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import fs from "fs";
import path from "path";
import config from "../../config.json" assert { type: "json" }

const embeddings = new OllamaEmbeddings({
  model: config.EMBEDDING_MODEL,
  baseUrl: config.OLLAMA_API_URL
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

    console.log('\x1b[32mDocuments created\x1b[0m');

    
    const vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);

    console.log('\x1b[32mVector store initialized successfully.\x1b[0m');
    return vectorStore;
  } catch (error) {
    console.error('\x1b[31mError initializing vector store:', error, '\x1b[0m');
    throw error;
  }
};
