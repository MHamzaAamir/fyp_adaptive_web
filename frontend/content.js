chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "process_prompt") {

        let url = window.location.href
        url = url.split("?")[0]
        
        const elements = extractInteractableElements()
        const userInput = message.prompt
        const payload = {
            userInput: userInput + ". Current website is: " + url,
            elements
        }

        sendResponse(payload)

    }
    if (message.action === "do_actions") {
        let done
        done = performActions(message.actions);
        sendResponse(done);
        
    }
    
  });




// function extractInteractableElements() {
//     const interactableSelectors = 'li, a, button, input, select, textarea, [role="button"], [role="link"]';
//     const elements = document.querySelectorAll(interactableSelectors);

//     const elementsData = [];
//     elements.forEach((element, index) => {
//         element.removeAttribute('id');
//         const elementId = (index + 1).toString();
//         element.setAttribute('id', elementId);

//         const textContent = element.textContent.trim();

//         const elementData = {
//             id: elementId,
//             type: element.tagName,
//             ...(textContent && { text: textContent }),
//             ...(element.getAttribute('name') && { name: element.getAttribute('name') }),
//             ...(element.getAttribute('aria-label') && { ariaLabel: element.getAttribute('aria-label') }),
//             ...(element.getAttribute('placeholder') && { placeholder: element.getAttribute('placeholder') }),
//             ...(element.value && { value: element.value }),
//         };

//         elementsData.push(elementData);
//     });

//     return elementsData;
// }

function extractInteractableElements() {
    const interactableSelectors = 'li, a, button, input, select, textarea, [role="button"], [role="link"]';
    const elements = document.querySelectorAll(interactableSelectors);

    const elementsData = [];
    let elementIndex = 1;

    elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const inViewport =
            rect.top < window.innerHeight &&
            rect.bottom > 0 &&
            rect.left < window.innerWidth &&
            rect.right > 0;

        if (!inViewport) return;

        element.removeAttribute('id');
        const elementId = (elementIndex++).toString();
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

function highlightElement(element, duration = 500) {
    if (!element) return;
    const originalOutline = element.style.outline;
    element.style.outline = '1px solid red';
    setTimeout(() => {
        element.style.outline = originalOutline;
    }, duration);
}

function performActions(actions) {
    let done = false;
    actions.forEach(action => {
        let element = document.getElementById(action.id);
        if (!element) {
            console.warn(`Element with ID ${action.id} not found.`);
            return;
        }

        highlightElement(element); 
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
            case 'done':
                done = true;
                break;
            default:
                console.warn(`Unknown action type: ${action.type}`);
        }
    });
    return done;
}

// function performActions(actions) {
//     let done = false
//     actions.forEach(action => {
//         let element
//         switch (action.type) {
//             case 'click':
//                 element = document.getElementById(action.id);
//                 element.click();
//                 break;
//             case 'type':
//                 element = document.getElementById(action.id);
//                 if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
//                     element.value = action.value;
//                     element.dispatchEvent(new Event('input', { bubbles: true }));
//                 } else {
//                     console.warn(`Element with ID ${action.id} is not an input or textarea.`);
//                 }
//                 break;
//             case 'done':
//                 done = true
//                 break;
//             default:
//                 console.warn(`Unknown action type: ${action.type}`);
//         }
//     });
//     return done
// }