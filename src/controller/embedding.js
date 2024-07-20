import InitEmbedding from "./initEmbedding.js"

const search = async (prompt, l=3) => {
  try {

    const vectorStore = await InitEmbedding();
    const result = await vectorStore.similaritySearch(prompt, l);
    return {result, vectorStore}
  } catch (error) {
    console.error('\x1b[31mError during similarity search:', error, '\x1b[0m');
  }
};

export default {
    InitEmbedding,
    search
};