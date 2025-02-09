import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAPI_KEY // Use an environment variable
  });

// SAMPLE DATA: 
const userAreasOfConcern = ["mental health", "sexual health", "dental health"];
const location = "02446"
const insurance = "Aetna"

const tools = [
    {
      type: "function", 
      name: "emergency_services",
      description: "Recommends emergency services or suicide hotlines based on the user's request.",
    },
    {
      type: "function", 
      name: "book_appointment",
      description: "Books a local medical appointment of some specialty with a healthcare provider covered under the user's insurance.",
      parameters: {
        type: "object",
        properties: {
          specialty: { type: "string", description: "The doctor's name or specialty." },
          areaOfConcern: {
            type: "string",
            enum: userAreasOfConcern, // Restrict the LLM to their selected userAreasOfConcern. 
            description: "The user's indicated health concerns or priorities in the prompt.",
          },
        },
        required: ["specialty", "areaOfConcern"], 
      },
    },
  ];
  

export async function fetchOpenAI(prompt: string) {
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

export async function toolInference(prompt: string) {
    try {
      // Get the response from GPT-4 with function call inference
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
        functions: tools, // Include the corrected function definitions here
        function_call: "auto", // Let GPT decide on function to call
      });
  
      // Get the top inferred tool call. 
      console.log("Response: " + JSON.stringify(response));
      const toolCall = response.choices[0]?.message.function_call?.name;
      const toolArgs = response.choices[0]?.message.function_call?.arguments;
      
      if (!toolCall || !toolArgs) {
        throw new Error("No valid tool call or arguments found in response.");
      }
      
      // Handle the response based on the function name returned by GPT
      if (toolCall === "emergency_services") {
        return await emergency_services(); // Async call to search for health services
      } else if (toolCall === "book_appointment") {
        const { specialty, areaOfConcern } = JSON.parse(toolArgs);
        return await bookAppointment(specialty, areaOfConcern, location, insurance); // Async call to book an appointment
      } else {
        throw new Error("Unrecognized function call.");
      }
    } catch (error) {
      console.error("Error during tool inference:", error);
      throw error; // Rethrow or handle accordingly
    }

}

// UPDATE: Params! 
async function emergency_services(): Promise<{ message: string; search_prompt: string }> {
    // Simulate a search for health services based on the provided parameters
    return {
        message: "If you are experiencing a mental health emergency, please call the National Suicide Prevention Lifeline at 1-800-273-8255. For health emergencies, please call 911 immediately.",
        search_prompt: "Emergency health and mental health resource."
    }
}

async function bookAppointment(specialty: string, areaOfConcern: string[], location: string, insurance: string): Promise<{ message: string; search_prompt: string }> {
    try {
      // Logic for booking an appointment, e.g., calling an API or querying a database to schedule the appointment
      // Example: A mock response for demonstration
      const appointmentConfirmation = {
        specialty: specialty,
        areaOfConcern: areaOfConcern,
        location: location,
        insurance: insurance,
        message: `Looking up your ${specialty} appointment near ${location} covered under ${insurance}!`,
        search_prompt: `${specialty} appointments ${areaOfConcern}` // fix later
      };
      
      // You can replace this mock response with an actual API request or database query.
      return {message: appointmentConfirmation.message, search_prompt: appointmentConfirmation.search_prompt};

    } catch (error) {
      console.error("Error finding appointment:", error);
      throw error; // Rethrow or handle as needed
    }
  }