let actions
let prompt
let started = false
let restartTimeout
let pastActions = []
let workingTab 

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "start") {
        pastActions = []
        started = true
        prompt = message.prompt  
        workingTab = message.workingTab
        executeWorkflow()
    }
  });

function executeWorkflow(){

    chrome.scripting.executeScript({
        target: { tabId: workingTab },
        files: ["content.js"]
    }, () => {
        chrome.tabs.sendMessage(workingTab, { action: "process_prompt",prompt },async (response) => {
        let {parsedResponse,success} = await call_api(response)
        actions = parsedResponse
        if (success){
            chrome.tabs.sendMessage(workingTab, { action: "do_actions" ,actions}, (response) => {
        
                if (response){
                    console.log("ended")
                    started = false
                    chrome.storage.local.set({disabled:false})
                }else{
                    console.log("restarted")
                    restartTimeout = setTimeout(() => {
                        if (started){
                            executeWorkflow();
                        }
                    }, 2500);
                }
                });
        }else{
            restartTimeout = setTimeout(() => {
                if (started){
                    executeWorkflow();
                }
            }, 3000);
        }
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


async function call_api (payload) {
    let response;
    let success
    let parsedResponse
    try {
        payload.pastActions = pastActions
        response = await fetch("http://localhost:3000/api/sendRequest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });


        if (response.ok) {
            const jsonResponse = await response.json();
            parsedResponse = jsonResponse.parsedResponse
            if(jsonResponse.description){
                pastActions.push(jsonResponse.description)
            }
            success = true
            return {parsedResponse,success}
        } else {
            throw new Error("API Failed")
        }
    } catch (error) {
        success = false
        return {parsedResponse,success}
    }
}

