import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Use an environment variable
  });
  
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === "queryOpenAI") {
      handleQuery(message.prompt)
        .then((response) => sendResponse({ success: true, data: response }))
        .catch((error) => sendResponse({ success: false, error: error.message }));
      return true; // Required for async response
    }
  });
  
  async function handleQuery(prompt: string) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      });
      return response.choices[0].message?.content;
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw error;
    }
  }
  