import { fetchOpenAI, toolInference } from "./api/fetchOpenAI.ts"

chrome.runtime.onInstalled.addListener(details => {
    console.log("onInstalled reason: ", details.reason)
    console.log(fetchOpenAI("Hello, OpenAI!"));
    console.log(toolInference("I need to find a cardiologist in New York who accepts BlueCross insurance."));
})

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
	console.log("Message received in background:", message);
  
	if (message.action === "saveUserData") {
	  const userData = message.data;
	  console.log("Saving user data:", userData);
	  
	  // Process the user data or store it somewhere (e.g., in localStorage or sync storage)
	  // You can also send a response back to the sender if needed
	  sendResponse({ status: "success", message: "User data saved successfully!" });
	}
  
	// Return true to indicate you want to send a response asynchronously
	return true;
  });
  