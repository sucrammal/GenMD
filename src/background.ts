import { fetchOpenAI, toolInference } from "./api/fetchOpenAI.ts"

chrome.runtime.onInstalled.addListener(_details => {
    // console.log("onInstalled reason: ", details.reason)
    fetchOpenAI("Hello, OpenAI!");
    // console.log(toolInference("I need to find a cardiologist in New York who accepts BlueCross insurance."));
})

// var msg:string;
// var search_prompt:string;

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  // RECEIVE USER DATA
	// console.log("Message received in background:", message);
	if (message.action === "saveUserData") {
	  const userData = message.data;
	  console.log("Saving user data:", userData);

    // Inject LLM with data and call it. 
    toolInference("I need to find a cardiologist in New York who accepts BlueCross insurance.")
    .then(appointment => {
      const msg:string = appointment.message;
      console.log(msg);
      const search_prompt:string = appointment.search_prompt;
      // Send to content.js
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            {
              action: "sendMessageAndSearchPrompt",
              data: { msg, search_prompt },
            },
            (response) => {
              console.log("Response from content script:", response);
            }
          );
        }
      });
    })
    .catch(error => {
      console.error("Error fetching appointment:", error);
    });
	  // Process the user data or store it somewhere (e.g., in localStorage or sync storage)
	  // You can also send a response back to the sender if needed
	  sendResponse({ status: "success", message: "User data saved successfully!" });
	}
  
	// Return true to indicate you want to send a response asynchronously
	return true;
  });
