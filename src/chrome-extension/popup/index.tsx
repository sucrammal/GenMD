import "./index.css";
import { useState, useEffect } from "react";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import Info from "./components/Info";
import Upload from "./components/Upload";
import Chat from "./components/Chat";
import Header from "./components/Header";

export const Popup = () => {
  const regularGene = "https://i.imgur.com/sg1LGH6.png";
  const typingGene = "https://i.imgur.com/sKwmAEL.png";

  // state: onboarding, dashboard: info, upload, chat
  const [state, setState] = useState("onboarding");
  const [dialogueText, setDialogueText] = useState("");
  const [gene, setGene] = useState(regularGene);

  const bounceGene = () => {
    const image = document.querySelector(".gene-overlay") as HTMLElement | null;
    if (image) {
      image.classList.remove("bounce"); // Remove class first
      void image.offsetWidth;
      image.classList.add("bounce");

      setTimeout(() => {
        image.classList.remove("bounce"); // Remove after 2 seconds
      }, 1500);
    }
  };

  let renderedComponent;

  useEffect(() => {
    // Get data from chrome.storage when the component mounts
    chrome.storage.local.get(["userData"], (result) => {
      if (result.userData.state !== undefined) {
        console.log("state: " + result.userData.state);
        if (result.userData.state == 1) {
          setState("dashboard");
        }
      }
    });
  }, []); // Empty dependency array to run only once
  useEffect(() => {
    bounceGene();
  }, [state]);

  useEffect(() => {
    switch (state) {
      case "onboarding":
        setDialogueText(
          "Hi, I’m Gene! I’m here to guide you in finding medical services covered by your plan or help you explore other available options."
        );
        break;
      case "dashboard":
        setDialogueText(
          "Welcome to your dashboard! Here, you can edit your basic info and upload medical documents to refine my assistance. You can also start a conversation with me any time!"
        );
        break;
      case "info":
        setDialogueText(
          "This is the basic information I have about you. Feel free to update it if any of your preferences change."
        );
        break;
      case "upload":
        setDialogueText(
          "I use insurance cards, medical reports, and prescriptions to fine-tune my assistance. When possible, I will use this information to pre-fill form fields, but it will never be involuntarily shared with any third parties."
        );
        break;
      case "chat":
        setDialogueText(""); // Clear the dialogue in chat if necessary
        break;
      default:
        setDialogueText(
          "Hi, I’m Gene! I’m here to guide you in finding medical services covered by your plan or help you explore other available options."
        );
    }
  }, [state]); // Runs whenever `state` changes

  switch (state) {
    case "onboarding":
      renderedComponent = (
        <Onboarding onStateUpdate={() => setState("dashboard")} />
      );
      break;
    case "dashboard":
      renderedComponent = (
        <Dashboard
          onChatClick={() => setState("chat")}
          onInfoClick={() => setState("info")}
          onUploadClick={() => setState("upload")}
        />
      );
      break;
    case "info":
      renderedComponent = <Info onBackClick={() => setState("dashboard")} />;
      break;
    case "upload":
      renderedComponent = <Upload />;
      break;
    case "chat":
      renderedComponent = <Chat setGeneImg={() => setGene(typingGene)} />;
      break;
    default:
      renderedComponent = (
        <Onboarding onStateUpdate={() => setState("dashboard")} />
      );
  }

  return (
    <div className="App">
      <div className="main-container">
        <Header onBackClick={() => setState("dashboard")} />
        {renderedComponent}
      </div>
      <div className="gene-container">
        {dialogueText && <div className="gene-dialogue">{dialogueText}</div>}
        <img src={gene} alt="Gene icon" className="gene-overlay" />
      </div>
    </div>
  );
};
