const sendButton = document.getElementById('sendButton');
const promptInput = document.getElementById('promptInput');

// Load the saved prompt from chrome.storage when the popup is opened
chrome.storage.local.get(['prompt'], (result) => {
    if (result.prompt) {
        promptInput.value = result.prompt;
    }
});

// Save the prompt to chrome.storage whenever the input changes
promptInput.addEventListener('input', () => {
    const prompt = promptInput.value;
    chrome.storage.local.set({ prompt });
});


sendButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: "start", prompt});
});

// Send the prompt when the send button is clicked
// sendButton.addEventListener('click', () => {
//     const prompt = promptInput.value;

//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.tabs.sendMessage(tabs[0].id, { type: 'process_prompt', prompt });
//     });

// });

// Perform actions when the action button is clicked
// actionButton.addEventListener('click', () => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.tabs.sendMessage(tabs[0].id, { type: 'perform_actions', actions });
//     });
// });

// Listen for messages from the background script or content script
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.type == "actions_ready") {
//         actionButton.disabled = false;
//     } else if (message.type == "actions_done") {
//         actionButton.disabled = true;
//     }
// });



// chrome.runtime.onMessage.addListener((message) => {
//     if (message.type === 'actions_ready') {
//         actionButton.disabled = false;

//         actionButton.addEventListener('click', () => {
//             chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//                 chrome.tabs.sendMessage(tabs[0].id, { type: 'perform_actions' });
//             });
//         });
//     }
// });