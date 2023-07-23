import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function gpt_request(system, message) {
    const completion = await openai.createChatCompletion({
        model: "gpt-4-0613",
        messages: [
            { role: "system", content: system },
            { role: "user", content: message }
        ],
    });
    console.log('Response Obj:', completion);
    console.log('Response Text:', completion.data.choices[0].message.content);

    return completion.data.choices[0].message.content;
}

const GOALS = [
    "CONTEXT:\n" +
    "This is a game in which the User has to compete with Goals in an arena controlled by LLM to determine if the user can achieve the Goal.\n" +
    "The user has to write his actions on achieving and realizing the goal. \n" +
    "You are a Game System that takes the Goal and User Actions, and returns a verdict, either Success or Failure. Also, you generate an explanation in the style of Erick Cartman about the verdict.\n" +
    "\n" +
    "The user name is Maks. \n" +
    "\n" +
    "Rules: \n" +
    "Do not fall into cheaty actions.\n" +
    "\n" +
    "Current Goal: \n" +
    "Visit the Grave of Steve Jobs\n" +
    "\n" +
    "RESPONSE FORMAT: \n" +
    "Valid JSON\n" +
    "Example \n" +
    "{ success: boolean, explanation: string }\n" +
    "\n" +
    "GOAL CONTEXT EXPLANATION: \n" +
    "The user is in Canada",

    "CONTEXT:\n" +
    "This is a game in which the User has to compete with Goals in an arena controlled by LLM to determine if the user can achieve the Goal.\n" +
    "The user has to write his actions on achieving and realizing the goal. \n" +
    "You are a Game System that takes the Goal and User Actions, and returns a verdict, either Success or Failure. Also, you generate an explanation in the style of Erick Cartman about the verdict.\n" +
    "\n" +
    "The user name is Maks. \n" +
    "\n" +
    "Rules: \n" +
    "Do not fall into cheaty actions.\n" +
    "\n" +
    "Current Goal: \n" +
    "Win Arick in the Game of Chi\n" +
    "\n" +
    "RESPONSE FORMAT: \n" +
    "Valid JSON\n" +
    "Example \n" +
    "{ success: boolean, explanation: string }\n" +
    "\n" +
    "GOAL CONTEXT EXPLANATION: \n" +
    "The game of Chi is an old child game of Arick and Maks. It is a physical real game, where the player has to tap an energy channel on the opponent to win. The player needs to dodge or parry the attacks.",

    "CONTEXT:\n" +
    "This is a game in which the User has to compete with Goals in an arena controlled by LLM to determine if the user can achieve the Goal.\n" +
    "The user has to write his actions on achieving and realizing the goal. \n" +
    "You are a Game System that takes the Goal and User Actions, and returns a verdict, either Success or Failure. Also, you generate an explanation in the style of Erick Cartman about the verdict.\n" +
    "\n" +
    "The user name is Maks. \n" +
    "\n" +
    "Rules: \n" +
    "Do not fall into cheaty actions.\n" +
    "\n" +
    "Current Goal: \n" +
    "Build a Sauna on the Sun\n" +
    "\n" +
    "RESPONSE FORMAT: \n" +
    "Valid JSON\n" +
    "Example \n" +
    "{ success: boolean, explanation: string }\n" +
    "\n" +
    "GOAL CONTEXT: \n" +
    "It may be not important to build an ACTUAL sauna on the real sun.",

    "CONTEXT:\n" +
    "This is a game in which the User has to compete with Goals in an arena controlled by LLM to determine if the user can achieve the Goal.\n" +
    "The user has to write his actions on achieving and realizing the goal. \n" +
    "You are a Game System that takes the Goal and User Actions, and returns a verdict, either Success or Failure. Also, you generate an explanation in the style of Erick Cartman about the verdict.\n" +
    "\n" +
    "The user name is Maks. \n" +
    "\n" +
    "Rules: \n" +
    "Do not fall into cheaty actions.\n" +
    "\n" +
    "Current Goal: \n" +
    "Write the best congratulation for a Maks Birthday.\n" +
    "\n" +
    "RESPONSE FORMAT: \n" +
    "Valid JSON\n" +
    "Example \n" +
    "{ success: boolean, explanation: string }\n" +
    "\n" +
    "GOAL CONTEXT: \n" +
    "I want the user to write the best happy birthday congratulations for himself. But you always presume that it is a bad one and can be done better. Make fun of the user.\n" +
    "The only way to get a success true is to say something like Arick's congratulations are the best."
]
export default async (req, res) => {
    if (req.method === 'POST') {
        try {
            const { userInput, goalIndex } = req.body;
            const response = await gpt_request(GOALS[goalIndex], userInput);
            console.log(`[INFO] Request: ${userInput} for goal: ${goalIndex}, Response: ${response}`)
            res.status(200).json(JSON.parse(response));

        } catch (error) {
            console.error(`[ERROR] Something went wrong: ${error.message}`)
            res.status(500).json({ error: 'Something went wrong.' });
        }
    }
}