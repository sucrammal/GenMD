import { OpenAI } from "openai";
import { config } from 'dotenv'; config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Use an environment variable
  });

const functions = [
    {
      type: "function", 
      name: "find_health_services",
      description: "Recommends emergency services or suicide hotlines based on the user's request.",
      parameters: {
        type: "object",
        properties: {
          location: { type: "string", description: "The user's location to help find local services." },
          insurance: { type: "string", description: "The user's insurance information." },
          specialty: { type: "string", description: "The medical specialty or emergency service needed." },
        },
        required: ["location", "specialty"], 
      },
    },
    {
      type: "function", 
      name: "book_appointment",
      description: "Books a local appointment with a healthcare provider.",
      parameters: {
        type: "object",
        properties: {
          location: { type: "string", description: "The location where the appointment should be booked." },
          doctor: { type: "string", description: "The doctor's name or specialty." },
          date: { type: "string", description: "The desired appointment date." },
          time: { type: "string", description: "The desired appointment time." },
        },
        required: ["location", "doctor", "date", "time"], 
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
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
        functions: functions, // Include the corrected function definitions here
        function_call: "auto", // Let GPT decide on function to call
      });
  
      // Get the top inferred tool call. 
      const toolCall = response.choices[0]?.message.tool_calls?.[0];
  
      if (!toolCall) {
        throw new Error("No valid tool call or arguments found in response.");
      }
  
      // Handle the response based on the function name returned by GPT
      if (toolCall.function.name === "find_health_services") {
        const { location, insurance, specialty } = JSON.parse(toolCall.function.arguments);
        return await searchHealthServices(location, insurance, specialty); // Async call to search for health services
      } else if (toolCall.function.name === "book_appointment") {
        const { location, doctor, date, time } = JSON.parse(toolCall.function.arguments);
        return await bookAppointment(location, doctor, date, time); // Async call to book an appointment
      } else {
        throw new Error("Unrecognized function call.");
      }
    } catch (error) {
      console.error("Error during tool inference:", error);
      throw error; // Rethrow or handle accordingly
    }

}


// UPDATE: Params! 
async function searchHealthServices(location: string, insurance: string, specialty: string) {
    // Simulate a search for health services based on the provided parameters
    console.log(`Searching for health services in ${location} with insurance ${insurance} and specialty ${specialty}`);
    
    // Mocked response
    return {
        services: [
            {
                name: "General Hospital",
                address: "123 Main St, Anytown, USA",
                phone: "555-1234",
                specialty: specialty,
                acceptsInsurance: insurance ? true : false,
            },
            {
                name: "Specialty Clinic",
                address: "456 Elm St, Othertown, USA",
                phone: "555-5678",
                specialty: specialty,
                acceptsInsurance: insurance ? true : false,
            },
        ],
    };
}

async function bookAppointment(location: string, doctor: string, date: string, time: string) {
    try {
      // Logic for booking an appointment, e.g., calling an API or querying a database to schedule the appointment
      // Example: A mock response for demonstration
      const appointmentConfirmation = {
        appointmentId: "12345",
        location: location,
        doctor: doctor,
        date: date,
        time: time,
        message: `Your appointment with Dr. ${doctor} at ${location} has been booked for ${date} at ${time}.`,
      };
  
      // You can replace this mock response with an actual API request or database query.
      return appointmentConfirmation;
    } catch (error) {
      console.error("Error booking appointment:", error);
      throw error; // Rethrow or handle as needed
    }
  }
