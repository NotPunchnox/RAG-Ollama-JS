
import InitLogic from "./src/controller/InitLogic.js";
import Question from "./src/router/Question.js";

//Affichage du Logiciel
InitLogic()

const prompt = 'Quels sont les avantages des robots hexapodes ?';

Question(prompt, 5)
