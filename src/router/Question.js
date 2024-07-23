

import {ChatOllama} from "@langchain/community/chat_models/ollama";
import {StringOutputParser} from "@langchain/core/output_parsers";
import {PromptTemplate} from "@langchain/core/prompts";
import {RunnableSequence,RunnablePassthrough} from "@langchain/core/runnables";
import {formatDocumentsAsString} from "langchain/util/document";
import embedding from "../controller/embedding.js";
import config from "../../config.json" assert { type: "json" }

export default async(prompt, l=3, modelSelected=config.LLM_MODEL) => {

    const model = new ChatOllama({
        baseUrl: config.OLLAMA_API_URL,
        model: modelSelected,
    });

    try {
        //const { /*result,*/vectorStore } = await embedding.search(prompt, l);
        const vectorStore = await embedding.getVectorStore()

        const vectorStoreRetriever = vectorStore.asRetriever();

        const textTemplate = `Vous êtes une api pour un robot hexapode qui sait répondre aux questions d'un humain. Répond à la question posé en utilisant le context comme donnée externe. Utilisez strictement le contexte et répondez de manière claire et point à point en utilisant le format JSON imposé dans ton modèle.
<context>
    {context}
</context>
question : {question}`;

        const PROMPT_TEMPLATE = PromptTemplate.fromTemplate(textTemplate);

        const chain = RunnableSequence.from([{
                context: vectorStoreRetriever.pipe(formatDocumentsAsString),
                question: new RunnablePassthrough()
            },
            PROMPT_TEMPLATE,
            model,
            new StringOutputParser()
        ]);

        const finalResult = await chain.invoke({
            context: prompt,
            question: prompt
        });

        return finalResult
    } catch (error) {
        console.error('Error:', error);
    }
}