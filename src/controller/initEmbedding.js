import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import config from "../../config.json" assert { type: "json" }
import textSplitter from "./textSplitter.js";

const embeddings = new OllamaEmbeddings({
  model: config.EMBEDDING_MODEL,
  baseUrl: config.OLLAMA_API_URL
});

export default async () => {
  try {
    const documents = await textSplitter()

    
    const vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);

    console.log('\x1b[32mVector store initialized successfully.\x1b[0m');
    return vectorStore;
  } catch (error) {
    console.error('\x1b[31mError initializing vector store:', error, '\x1b[0m');
    throw error;
  }
};
