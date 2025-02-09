import { fetchOpenAI, toolInference } from "./api/fetchOpenAI.ts"

chrome.runtime.onInstalled.addListener(details => {
    console.log("onInstalled reason: ", details.reason)
    console.log(fetchOpenAI("Hello, OpenAI!"));
    console.log(toolInference("I need to find a cardiologist in New York who accepts BlueCross insurance."));
})