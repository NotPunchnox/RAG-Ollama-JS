import InitEmbedding from "./initEmbedding.js"

var vectorStore;

const InitVector = async() => {
  vectorStore = await InitEmbedding();
}
const getVectorStore = async() => {
  return vectorStore
}

const search = async (prompt, l=3) => {
  try {

    const result = await vectorStore.similaritySearch(prompt, l);
    return {result, vectorStore}
  } catch (error) {
    console.error('\x1b[31mError during similarity search:', error, '\x1b[0m');
  }
};

export default {
    InitEmbedding,
    search,
    InitVector,
    vectorStore,
    getVectorStore
};