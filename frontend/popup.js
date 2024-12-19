// document.getElementById("sendButton").addEventListener("click", async () => {
//     const userInput = document.getElementById("userInput").value;

//      document.getElementById("userInput").value = ""

//     const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//     chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         function: execute,
//         args: [userInput], 
//     });
// });



// function execute(userInput) {

    // function performActions(actions) {
    //     actions.forEach(action => {
    //         if (action.type === 'google') {
    //             // Navigate to google.com if the action type is "google"
    //             window.location.href = "https://www.google.com";
    //             return; // Stop further processing since this action redirects
    //         }
    
    //         const element = document.getElementById(action.id);
    //         if (!element) {
    //             console.warn(`Element with ID ${action.id} not found.`);
    //             return;
    //         }
    
    //         switch (action.type) {
    //             case 'click':
    //                 element.click();
    //                 break;
    //             case 'type':
    //                 if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
    //                     element.value = action.value;
    //                     element.dispatchEvent(new Event('input', { bubbles: true }));
    //                 } else {
    //                     console.warn(`Element with ID ${action.id} is not an input or textarea.`);
    //                 }
    //                 break;
    //             default:
    //                 console.warn(`Unknown action type: ${action.type}`);
    //         }
    //     });
    // }
    

//     function extractInteractableElements() {
//         const interactableSelectors = 'a, button, input, select, textarea, [role="button"], [role="link"]';
//         const elements = document.querySelectorAll(interactableSelectors);
    
//         const elementsData = [];
//         elements.forEach((element, index) => {
//             element.removeAttribute('id');
//             const elementId = (index + 1).toString();
//             element.setAttribute('id', elementId);
    
//             const textContent = element.textContent.trim();
    
//             const elementData = {
//                 id: elementId,
//                 type: element.tagName,
//                 ...(textContent && { text: textContent }),
//                 ...(element.getAttribute('name') && { name: element.getAttribute('name') }),
//                 ...(element.getAttribute('aria-label') && { ariaLabel: element.getAttribute('aria-label') }),
//                 ...(element.getAttribute('placeholder') && { placeholder: element.getAttribute('placeholder') }),
//                 ...(element.value && { value: element.value }),
//             };
    
//             elementsData.push(elementData);
//         });
    
//         return elementsData;
//     }


//     const extractedData = extractInteractableElements();

//     const payload = {
//         userInput: userInput,
//         elements: extractedData,
//     };

//     fetch("http://localhost:3000/api/sendRequest", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//     })
//         .then(response => {
//             if (response.ok) {
//                 return response.json()
                
//             } else {
//                 console.error("An error occurred");
//                 alert("An error occurred");
//             }
//         })
//         .then(data => {
//             console.log(data.parsedResponse)
//             performActions(data.parsedResponse);
//         })
//         .catch(error => {
//             console.error("Error:", error);
//             alert("An error occurred");
//         });
// }

const sendButton = document.getElementById('sendButton');
const actionButton = document.getElementById('actionButton');
actionButton.disabled = true;
const promptInput = document.getElementById('promptInput');

let actions;

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

// Send the prompt when the send button is clicked
sendButton.addEventListener('click', () => {
    const prompt = promptInput.value;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'process_prompt', prompt });
    });

});

// Perform actions when the action button is clicked
actionButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'perform_actions', actions });
    });
});

// Listen for messages from the background script or content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type == "actions_ready") {
        actionButton.disabled = false;
    } else if (message.type == "actions_done") {
        actionButton.disabled = true;
    }
});



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