document.getElementById("sendButton").addEventListener("click", async () => {
    const userInput = document.getElementById("userInput").value;

     document.getElementById("userInput").value = ""

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: extractAndSendElements,
        args: [userInput], 
    });
});


function extractAndSendElements(userInput) {
    // function extractInteractableElements() {
    //     const interactableSelectors = 'a, button, input, select, textarea, [role="button"], [role="link"]';
    //     const elements = document.querySelectorAll(interactableSelectors);
    
    //     const elementsData = [];
    //     elements.forEach((element, index) => {
    //         element.removeAttribute('id');
    
    //         const elementId = (index + 1).toString();
    //         element.setAttribute('id', elementId);
    
    //         const textContent = element.textContent.trim();
    
    //         elementsData.push({
    //             id: elementId,
    //             type: element.tagName,
    //             ...(textContent && { text: textContent })
    //         });
    //     });
    
    //     return elementsData;
    // }

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
                ...(element.getAttribute('href') && { href: element.getAttribute('href') }),
                ...(element.value && { value: element.value }),
            };
    
            elementsData.push(elementData);
        });
    
        return elementsData;
    }

    const extractedData = extractInteractableElements();

    const payload = {
        userInput: userInput,
        elements: extractedData,
    };

    fetch("http://localhost:3000/api/sendRequest", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
        .then(response => {
            if (response.ok) {
                console.log("Data Sent Successfully")
            } else {
                console.log("Failed to send data.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred while sending data.");
        });
}
