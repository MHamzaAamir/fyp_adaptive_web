let actions
let prompt
let workingTab
let sendResponseToPopup
let started = false
let restartTimeout

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "start") {
        started = true
        sendResponseToPopup = sendResponse
        prompt = message.prompt  
        executeWorkflow()
    }
    return true
  });

function executeWorkflow(){
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        workingTab = tabs[0].id
        if (tabs.length === 0) return;
        chrome.scripting.executeScript({
          target: { tabId: workingTab },
          files: ["content.js"]
        }, () => {
          chrome.tabs.sendMessage(workingTab, { action: "process_prompt",prompt },async (response) => {
            actions = await call_api(response)
            chrome.tabs.sendMessage(workingTab, { action: "do_actions" ,actions}, (response) => {

             if (response){
                started = false
                sendResponseToPopup(response)
             }else{
                restartTimeout = setTimeout(() => {
                    executeWorkflow();
                }, 1500);
             }
            });
          });

        });
      });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (started && tabId === workingTab && changeInfo.status === "loading") {
        clearTimeout(restartTimeout)
    }

    if (started && tabId == workingTab && changeInfo.status === "complete") {
        clearTimeout(restartTimeout)
        executeWorkflow()
    }
})


call_api = async (payload) => {
    let response;
    try {
        response = await fetch("http://localhost:3000/api/sendRequest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });


        if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse.parsedResponse
        } else {
            throw error("API Failed")
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

