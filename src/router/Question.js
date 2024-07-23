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
        let { resultActions, resultConversations, resultGlobal } = await embedding.search(prompt, l);
        resultActions = formatDocumentsAsString(resultActions);
        resultConversations = formatDocumentsAsString(resultConversations);
        resultGlobal = formatDocumentsAsString(resultGlobal);
        console.log(resultActions)

        const textTemplate = `Vous êtes une api pour un robot hexapode qui sait répondre aux questions d'un humain. Répond à la question posé en utilisant le context comme donnée externe. Utilisez strictement le contexte et répondez de manière claire et point à point en utilisant le format JSON imposé dans ton modèle.
<context>
    {context}
</context>
<conversation>
    {conversation}
</conversation>
<SyntaxAction>
    {syntaxAction}
</SyntaxAction>

question : {question}`;

        const PROMPT_TEMPLATE = PromptTemplate.fromTemplate(textTemplate);

        const chain = RunnableSequence.from([
            async (input) => ({
                context: resultGlobal,
                conversation: resultConversations,
                syntaxAction: resultActions,
                question: input.question
            }),
            PROMPT_TEMPLATE,
            model,
            new StringOutputParser()
        ]);

        const finalResult = await chain.invoke({
            context: resultGlobal,
            conversation: resultConversations,
            syntaxAction: resultActions,
            question: prompt
        });

        return finalResult
    } catch (error) {
        console.error('Error:', error);
    }
}