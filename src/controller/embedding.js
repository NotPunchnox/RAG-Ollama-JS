import InitEmbedding from "./initEmbedding.js"

var vectorStore

const InitVector = async() => {
  vectorStore = await InitEmbedding();
}
const getVectorStore = async() => {
  return vectorStore
}

const search = async (prompt, l=3) => {
  try {

    const resultActions = await vectorStore.vectorStoreActions.similaritySearch(prompt, l);
    const resultConversations = await vectorStore.vectorStoreConversations.similaritySearch(prompt, l);
    const resultGlobal = await vectorStore.vectorStoreGlobal.similaritySearch(prompt, l);

    return {resultActions, resultConversations, resultGlobal}
  } catch (error) {
    console.error('\x1b[31mError during similarity search:', error, '\x1b[0m');
  }
};

export default {
    InitEmbedding,
    search,
    InitVector,
    getVectorStore
};