let actions
chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
    if (message.type === "process_prompt"){
        const elements = extractInteractableElements()
        const userInput = message.prompt
        const payload = {
            userInput,
            elements
        }
        chrome.runtime.sendMessage({ type: 'call_api', payload },(response)=>{
            if (!response.error){
                chrome.runtime.sendMessage({ type: 'actions_ready' })
                actions = response
            }else{
                alert('An Error Occurred')
                console.log(response.error)
            }
        });
    } else if (message.type === "perform_actions"){
        console.log(actions)
        performActions(actions)
        chrome.runtime.sendMessage({ type: 'actions_done' })
    }

})


function extractInteractableElements() {
    const interactableSelectors = 'a, button, input, select, textarea, [role="button"], [role="link"]';
    const elements = document.querySelectorAll(interactableSelectors);

    const elementsData = [];
    elements.forEach((element, index) => {
        element.removeAttribute('id');
        const elementId = (index + 1).toString();
        element.setAttribute('id', elementId);

        const textContent = element.textContent.trim();

        const elementData = {
            id: elementId,
            type: element.tagName,
            ...(textContent && { text: textContent }),
            ...(element.getAttribute('name') && { name: element.getAttribute('name') }),
            ...(element.getAttribute('aria-label') && { ariaLabel: element.getAttribute('aria-label') }),
            ...(element.getAttribute('placeholder') && { placeholder: element.getAttribute('placeholder') }),
            ...(element.value && { value: element.value }),
        };

        elementsData.push(elementData);
    });

    return elementsData;
}

function performActions(actions) {
    actions.forEach(action => {


        const element = document.getElementById(action.id);
        if (!element) {
            console.warn(`Element with ID ${action.id} not found.`);
            return;
        }

        switch (action.type) {
            case 'click':
                element.click();
                break;
            case 'type':
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.value = action.value;
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                } else {
                    console.warn(`Element with ID ${action.id} is not an input or textarea.`);
                }
                break;
            default:
                console.warn(`Unknown action type: ${action.type}`);
        }
    });
}