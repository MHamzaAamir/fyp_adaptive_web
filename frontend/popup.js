const sendButton = document.getElementById('sendButton');
const promptInput = document.getElementById('promptInput');

// Load the saved prompt from chrome.storage when the popup is opened
chrome.storage.local.get(['prompt'], (result) => {
    if (result.prompt) {
        promptInput.value = result.prompt;
    }
});
chrome.storage.local.get(['disabled'], (result) => {
    if (result.disabled) {
        sendButton.disabled = result.disabled;
    }
});

// Save the prompt to chrome.storage whenever the input changes
promptInput.addEventListener('input', () => {
    const prompt = promptInput.value;
    chrome.storage.local.set({ prompt });
});

sendButton.addEventListener("click", () => {
    const prompt = promptInput.value;
    chrome.storage.local.set({ disabled:true });
    let workingTab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        workingTab = tabs[0].id
        chrome.runtime.sendMessage({ action: "start",prompt,workingTab });
    })
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "local" && changes.disabled) {
        sendButton.disabled = changes.disabled.newValue
    }
});