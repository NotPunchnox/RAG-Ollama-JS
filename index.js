
/* Modules */
import InitLogic from "./src/controller/InitLogic.js";
import Question from "./src/router/Question.js";

/* Affichage de l'interface */
InitLogic()

/* Question à poser */
const prompt = 'Quels sont les avantages des robots hexapodes ?';

/* Fonction Question */
const result = await Question(prompt, 5)

/* Afficher la réponse */
console.log('\n\x1b[1mRéponse:\x1b[0m\x1b[36m', result, '\x1b[0m');