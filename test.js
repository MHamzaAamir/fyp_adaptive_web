function parseCommands(inputString) {
    // Split the input string into lines and trim unnecessary whitespace
    const lines = inputString.split('\n').map(line => line.trim());

    const commands = [];

    // Regular expression to match commands like "Click 17", "Type 7; laptop", etc.
    const commandRegex = /(click|type)\s+(\d+)(?:;\s*([^\n]+))?/i;

    // Regular expression to match "Google" with optional leading characters
    const googleRegex = /[-\s]*google/i;

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
        } else if (googleRegex.test(line)) {
            // If the line matches "Google" with or without leading characters
            commands.push({ type: "google" });
        }
    });

    return commands;
}

const p = parseCommands(`
Click 17
Type 7; laptop
Google
Google
Click 23; keyboard
`)

console.log(p)