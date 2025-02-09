import "./index.css";
import { useState, useEffect } from 'react';
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
  const [state, setState] = useState("upload"); 
  const [dialogueText, setDialogueText] = useState("Hi, I’m Gene! I’m here to guide you in finding medical services covered by your plan or help you explore other available options.");
  const [gene, setGene] = useState(regularGene);

  let renderedComponent;

  switch(state){
    case 'onboarding': renderedComponent = <Onboarding onStateUpdate={() => setState("dashboard")}/>
    break;
    case 'dashboard': renderedComponent = (
      <Dashboard 
        onChatClick={() => setState("chat")} 
        onInfoClick={() => setState("info")} 
        onUploadClick={() => setState("upload")}
      />
      ); 
      break;
    case 'info': renderedComponent = <Info onBackClick={() => setState("dashboard")}/>
      break;
    case 'upload': renderedComponent = <Upload />
      break;
    case 'chat': renderedComponent = <Chat setGeneImg={() => setGene(typingGene)} />
      break;
    default: renderedComponent = <Onboarding onStateUpdate={() => setState("dashboard")}/>
  }

  // TEMP USEEFFECT
  useEffect(() => {
    setDialogueText("Hi, I’m Gene! I’m here to guide you in finding medical services covered by your plan or help you explore other available options."); 
  }, [])

  return (
    <div className="App">
      <div className="main-container">
      <Header onBackClick={() => setState("dashboard")}/>
        { renderedComponent }
      </div>
      <div className="gene-container">
        <div className="gene-dialogue">
            { dialogueText }
         </div>
         <img src={gene} alt="Gene icon" className="gene-overlay" />
      </div>
    </div>
  );
};
