import { useState, useEffect } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { toolInference } from "../../../api/fetchOpenAI";

const Chat = ({ setGeneImg }: { setGeneImg: () => void }) => {
  const [messages, setMessages] = useState([
    { message: "Hi! What can I help you address today?", sender: "Gene" },
  ]);

  useEffect(() => {
    setGeneImg(); // Trigger gene image change when chat opens
  }, [setGeneImg]);

  const sendMessage = async (text: string) => {
    setMessages((prev) => [...prev, { message: text, sender: "user" }]);

    try {
        const response = await toolInference(text);
        console.log("AI Response:", response.message);
    
        if(response){
            setMessages((prev) => [
                ...prev,
                { message: response.message, sender: "Gene" },
              ]);
        }

    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [...prev, { message: "Oops! Something went wrong.", sender: "Gene" }]);
    }
  };

  return (
    <MainContainer>
      <ChatContainer>
        <MessageList>
          {messages.map((msg, i) => (
            <Message
              key={i}
              model={{
                message: msg.message,
                direction: msg.sender === "user" ? "outgoing" : "incoming",
                position: "single",
              }}
            />
          ))}
        </MessageList>
        <MessageInput placeholder="Type here..." onSend={sendMessage} />
      </ChatContainer>
    </MainContainer>
  );
};

export default Chat;