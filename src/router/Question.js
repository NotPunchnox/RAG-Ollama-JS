

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
        const { result,vectorStore } = await embedding.search(prompt, l);

        const formattedResult = result.map(a => a.pageContent).join(' ').replace(/# |#|##|###|\r\n/g, '').replace(/,,|, ,/g, ', ');

        const vectorStoreRetriever = vectorStore.asRetriever();

        const textTemplate = `Répond à la question suivante en français utilisant le contexte fourni ci-dessous:
Contexte: {context}

Question: {question}`;

        const PROMPT_TEMPLATE = PromptTemplate.fromTemplate(textTemplate);


        const chain = RunnableSequence.from([{
                context: vectorStoreRetriever.pipe(formatDocumentsAsString),
                question: new RunnablePassthrough()
            },
            PROMPT_TEMPLATE,
            model,
            new StringOutputParser()
        ]);

        console.log(formattedResult)

        const finalResult = await chain.invoke({
            context: formattedResult,
            question: prompt
        });

        return finalResult
    } catch (error) {
        console.error('Error:', error);
    }
}