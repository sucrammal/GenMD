import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Use an environment variable
  });

export default async function fetchOpenAI(prompt: string) {
    try 
    {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
        });
        return response.choices[0].message?.content;
    } 
    catch (error) 
    {
            console.error("OpenAI API error:", error);
            throw error;
    }

}