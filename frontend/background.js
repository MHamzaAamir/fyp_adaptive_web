chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'call_api') {
        (async () => {
            let response;
            try {
                response = await fetch("http://localhost:3000/api/sendRequest", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(message.payload),
                });


                if (response.ok) {
                    const jsonResponse = await response.json();
                    sendResponse(jsonResponse.parsedResponse);
                } else {
                    sendResponse({ error: "Request failed with status " + response.status });
                }
            } catch (error) {
                console.error("Error:", error);
                sendResponse({ error: error.message });
            }
        })();

        return true; 
    }
});
