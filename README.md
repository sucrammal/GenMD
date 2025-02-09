## Inspiration
Healthcare is hard: especially here in America. As international students living away from home, we’re experiencing the challenges of navigating the complex healthcare system in the U.S. for the first time. The vast range of medical services in a place like NYC can make it incredibly difficult to find the best providers for our specific needs, especially those covered by our insurance plans. And so, we made GenMD to guide you through the process—helping you understand your health concerns, identify the right providers based on your info, and make appointments at trusted clinics.

## What it does
Gene – the health assistant behind GenMD – is a browser extension that harnesses the power of LLMs to extract your insurance info from uploaded documents, speak with you to understand your needs, and make tool inferences to execute the right services, all while developing a context on your top areas of concern. Additionally, Gene recommends resources in cases of emergency, and acts as your go-to knowledge base, answering any general healthcare queries you have and providing recommendations. 

## How we built it
We started out by mapping out GenMD as a UX block diagram, before creating a higher fidelity mockup on Figma.

We then used React and Typescript to build the frontend and “backend” components, and used Vite to compile the files to prepare it for the Chrome Extensions environment. We stored all our Chrome and OpenAI API calls between two client-side event handlers, which interacted with a user’s Chrome web session and modified DOM elements of the user’s current browser tab. 

## Challenges we ran into
One of the biggest constraints was working within the limitations of a Chrome extension. Within this environment, there were inherently more complications with tracing stack calls, debugging our code, and fixing imports and packages after they was abstracted by the Vite compiler. We also ran into issues with persistently storing the user data, given Chrome Extensions temporary local storage. 

## Accomplishments that we're proud of
We were happy with the completeness of GenMD: we managed to explore and build out a ton of diverse features, especially given that this was our first time building an extension. 

## What we learned
LLM tuning and tooling, agentic feedback loops, and Typescript (Linh and Marcus’s first time). 

## What's next for GenMD
Fine-tuning or RAG to give Gene a dedicated and efficient healthcare knowledge base, more tooling to capture advanced user requests, persistent user data storage, integration with insurance provider APIs to keep provider network up-to-date, finish file and photo OCR parsing for healthcare documents. 

