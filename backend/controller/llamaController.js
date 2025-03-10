require("dotenv").config();
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const llamaController = {
    createPrompt: (userInput, elements) => {
        return `
            You are a web agent. You will receive some html elements as json objects. Analyze them and select only the actions along with the id that takes you closer to fullfilling the user request. Sometimes the user request cannot be completed in one iteration so only select actions that take you closer. Donot do unneccessary actions. Response should strictly follow the format with no extra detail at all:
            - Click [id] 
            - Type [id]; [Content] 
            - Done
            
            replace [id] with the actual number and [Content] with actual text. dont use brackets.
            return action Done if the task completed
    
            Observation:
            - User Request: "${userInput}"
            - HTML Elements: ${JSON.stringify(elements)}
        `;
    },
    parseCommands(inputString) {
        // Split the input string into lines and trim unnecessary whitespace
        const lines = inputString.split('\n').map(line => line.trim());
    
        const commands = [];
    
        // Regular expression to match commands like "Click 17", "Type 7; laptop", etc.
        const commandRegex = /(click|type)\s+(\d+)(?:;\s*([^\n]+))?/i;

        const doneRegex = /[-\s]*done/i;
    
        lines.forEach(line => {
            // Attempt to match the command on each line
            const match = line.match(commandRegex);
    
            if (match) {
                const type = match[1].toLowerCase(); // Extract command type (e.g., 'click', 'type')
                const id = parseInt(match[2], 10);  // Extract the ID number
                const value = match[3]?.trim();    // Extract the value (if present)
    
                // Push the parsed command into the array
                const commandObject = { type, id };
                if (value) {
                    commandObject.value = value; // Add the value property only if it's present
                }
                commands.push(commandObject);
            } else if (doneRegex.test(line)) {
                // If the line matches "Done" with or without leading characters
                commands.push({ type: "done" });
            }
        });
    
        return commands;
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
                    model: "llama-3.3-70b-versatile",
                })
                .then((chatCompletion) => {
                    response = chatCompletion.choices[0]?.message?.content || "";
                });
            
            console.log(response)
            console.log("-----------------------------")
            const parsedResponse = llamaController.parseCommands(response);

            res.status(200).json({ parsedResponse });

        } catch (error) {
            console.error("Error interacting with Llama:", error.message);
            res.status(500).json({ error: "Failed to interact with Llama." });
        }

    },
};

module.exports = llamaController;
