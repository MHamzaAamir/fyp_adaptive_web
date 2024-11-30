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
    function extractInteractableElements() {
        const interactableSelectors = 'a, button, input, select, textarea, [role="button"], [role="link"]';
        const elements = document.querySelectorAll(interactableSelectors);

        const elementsData = [];
        elements.forEach((element, index) => {
            let elementId = element.id || `el-${index + 1}`;
            if (!element.id) {
                element.setAttribute('id', elementId);
            }

            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const textContent = element.textContent.trim() || null;

            elementsData.push({
                id: elementId,
                tagName: element.tagName,
                centerX: centerX,
                centerY: centerY,
                text: textContent,
            });
        });

        return elementsData;
    }

    const extractedData = extractInteractableElements();

    const payload = {
        userInput: userInput,
        elements: extractedData,
    };

    fetch("http://localhost:3000/api/endpoint", {
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
