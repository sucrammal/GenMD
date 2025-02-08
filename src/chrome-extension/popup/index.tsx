import "./index.css";
import { useState, useEffect } from 'react';
import Onboarding from "./components/Onboarding";

export const Popup = () => {
  const [dialogueText, setDialogueText] = useState("Hi, I’m Gene! I’m here to guide you in finding medical services covered by your plan or help you explore other available options.");

  // TEMP USEEFFECT
  useEffect(() => {
    setDialogueText("Hi, I’m Gene! I’m here to guide you in finding medical services covered by your plan or help you explore other available options."); 
  }, [])

  return (
    <div className="App">
      <div className="main-container">
        <Onboarding />
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
