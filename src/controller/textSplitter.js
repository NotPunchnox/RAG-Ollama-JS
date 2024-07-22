import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import fs from "fs";
import path from "path";

const Dir = path.resolve("./src/Training Data/");

export default async () => {
  try {
    const Files = fs.readdirSync(Dir);

    let documents = [];
    for (const file of Files) {
      const filePath = path.join(Dir, file);
      const ext = path.extname(file).toLowerCase();

      if (ext === '.txt' || ext === '.md') {
        const text = fs.readFileSync(filePath, 'utf8');
        const splitter = new RecursiveCharacterTextSplitter({
          chunkSize: 150,
          chunkOverlap: 87.5,
          separators: ["|", "##", ">", "-"],
        });
        const doc = await splitter.createDocuments([text]);
        documents = documents.concat(doc);
      } else if (ext === '.json') {
        const loader = new JSONLoader(filePath, ["/output", "/input"]); // Ajuster les chemins selon vos besoins
        const docs = await loader.load();
        documents = documents.concat(docs);
      } else {
        console.warn(`Unsupported file type: ${file}`);
      }
    }

    console.log('\x1b[32mDocuments created\x1b[0m');
    console.log(`Total documents: ${documents.length}`);

    console.log('\x1b[32mVector store initialized successfully.\x1b[0m');

    return documents
  } catch (error) {
    console.error('\x1b[31mError initializing vector store:', error, '\x1b[0m');
    throw error;
  }
};
