import "./index.css";
import { useState, useEffect } from 'react';
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import Info from "./components/Info";
import Upload from "./components/Upload";
import Chat from "./components/Chat";

export const Popup = () => {
  // state: onboarding, dashboard: info, upload, chat
  const [state, setState] = useState("onboarding"); 
  const [dialogueText, setDialogueText] = useState("Hi, I’m Gene! I’m here to guide you in finding medical services covered by your plan or help you explore other available options.");
  
  let renderedComponent;

  switch(state){
    case 'onboarding': renderedComponent = <Onboarding onStateUpdate={() => setState("dashboard")}/>
    break;
    case 'dashboard': renderedComponent = <Dashboard />
    break;
    case 'info': renderedComponent = <Info />
    break;
    case 'upload': renderedComponent = <Upload />
    break;
    case 'chat': renderedComponent = <Chat />
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
        { renderedComponent }
      </div>
      <div className="gene-container">
        <div className="gene-dialogue">
            { dialogueText }
         </div>

         <img src="/assets/gene_icon.png" alt="Gene icon" className="gene-overlay" />
      </div>
    </div>
  );
};
