import readline from "readline";
import InitLogic from "../src/controller/InitLogic.js";
import Question from "../src/router/Question.js";


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '\x1b[33m\x1b[1mQuestion:\x1b[0m '
});

const initClient = async () => {
  try {
    await InitLogic();
    console.log('\x1b[32mInterface initialisée avec succès.\x1b[0m\n');
  } catch (error) {
    console.error('\x1b[31mErreur lors de l\'initialisation de l\'interface:', error, '\x1b[0m');
    process.exit(1);
  }
};


const chatLoop = async () => {
  rl.prompt();

  rl.on('line', async (line) => {
    const prompt = line.trim();

    if (prompt.toLowerCase() === 'exit') {
      console.log('\x1b[32mSession terminée.\x1b[0m');
      rl.close();
      return;
    }

    try {
      const result = await Question(prompt, 5, "TestQwen");
      console.log('\n\x1b[1mRéponse:\x1b[0m\x1b[36m', result, '\x1b[0m\n');
    } catch (error) {
      console.error('\x1b[31mErreur lors de la récupération de la réponse:', error, '\x1b[0m');
    }

    rl.prompt();
  }).on('close', () => {
    console.log('\x1b[32mAu revoir!\x1b[0m');
    process.exit(0);
  });
};


const main = async () => {
  await initClient();
  chatLoop();
};

main().catch(error => {
  console.error('\x1b[31mErreur lors de l\'exécution du client:', error, '\x1b[0m');
});
