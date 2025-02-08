import fetchOpenAI from "./api/fetchOpenAI.ts"

chrome.runtime.onInstalled.addListener(details => {
    console.log("onInstalled reason: ", details.reason)
    console.log(fetchOpenAI("Hello, OpenAI!"));
})
