require("dotenv").config();
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const llamaController = {
    createPrompt: (userInput, elements) => {
        return `
            You are a web agent. You will receive some html elements. Analyze them and select one of the following actions 
            along with the id that fulfills User Request. Correspondingly, Action should STRICTLY follow the format:
            - Click [Numerical_Label] 
            - Type [Numerical_Label]; [Content] 
            - Scroll [Numerical_Label or WINDOW]; [up or down] 
            - Wait 
            - GoBack
            - Bing
            - ANSWER; [content]
    
            Observation:
            - User Request: "${userInput}"
            - HTML Elements: ${JSON.stringify(elements)}
        `;
    },

    parseCommands: (text) => {
        if (!text) {
            return [{ Wait: null }];
        }

        const commandPatterns = {
            Click: /Click \[?(\d+)\]?/g,
            Type: /Type \[?(\d+)\]?; (.*)/g,
            Scroll: /Scroll \[?(\d+|WINDOW)\]?; \[?(up|down)\]?/g,
            Scroll1: /Scroll \[?(up|down)\]?; \[?(\d+|WINDOW)\]?/g,
            Wait: /Wait/g,
            GoBack: /GoBack/g,
            Bing: /Bing/g,
            Google: /Google/g,
            ANSWER: /ANSWER; (.*)/g,
            FINISHED: /FINISHED/g,
        };

        const parsedCommands = [];

        for (const [command, pattern] of Object.entries(commandPatterns)) {
            const matches = [...text.matchAll(pattern)];
            if (matches.length) {
                matches.forEach((match) => {
                    if (['Click', 'Type', 'Scroll', 'Scroll1', 'ANSWER'].includes(command)) {
                        if (command === 'Scroll1') {
                            parsedCommands.push({ Scroll: [...match.slice(1).reverse()] });
                        } else {
                            parsedCommands.push({ [command]: match.slice(1) });
                        }
                    } else {
                        parsedCommands.push({ [command]: null });
                    }
                });
            }
        }

        if (!parsedCommands.length) {
            return [{ Wait: null }];
        }

        return parsedCommands;
    },

    sendRequest: async (req, res) => {
        const { userInput, elements } = req.body;

        if (!userInput || !elements) {
            return res.status(400).json({ error: "userInput and HTML elements are required." });
        }

        try {
            const prompt = llamaController.createPrompt(userInput, elements);
            let response = "";

            await groq.chat.completions
                .create({
                    messages: [
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],
                    model: "llama-3.1-70b-versatile",
                })
                .then((chatCompletion) => {
                    response = chatCompletion.choices[0]?.message?.content || "";
                });

            // Parse the response
            const parsedResponse = llamaController.parseCommands(response);
            

            res.status(200).json({ response });

        } catch (error) {
            console.error("Error interacting with Llama:", error.message);
            res.status(500).json({ error: "Failed to interact with Llama." });
        }
    },
};

module.exports = llamaController;
