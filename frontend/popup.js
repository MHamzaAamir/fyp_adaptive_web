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


sendButton.addEventListener("click", () => {
    const prompt = promptInput.value;
    sendButton.disabled = true
    chrome.runtime.sendMessage({ action: "start",prompt },(response)=>{
        if (response){
            sendButton.disabled = false
        }
    });
});