import { useState } from 'react';
import Header from './Header';

const Onboarding = ({ onStateUpdate }: { onStateUpdate: () => void }) => {
   const [screen, setScreen] = useState("start");
    let renderedComponent; 

    switch(screen) {
        case 'start': renderedComponent = <StartScreen onNext={() => setScreen("basicInfo")} />
        break;
        case 'basicInfo': renderedComponent = <BasicInfo onNext={() => setScreen("healthInfo")} />
        break;
        case 'healthInfo': renderedComponent = <HealthInfo updateAppState={() => onStateUpdate()} />
        break;
        default: renderedComponent = <StartScreen onNext={() => setScreen("basicInfo")} />;
    }

    return (
        <>
            <Header />
            { renderedComponent}
        </>
    )
    
}

const StartScreen = ({ onNext }: { onNext: () => void }) => {

    const largeLogo = "https://i.imgur.com/beh78fY.png"

    return (
        <div id="start-container">
        <img src={largeLogo} alt="gen md logo" id="logo-large" />
        <button className="action-btn" id="get-started-btn" onClick={onNext}>Get Started</button>
     </div>
    )
};

const BasicInfo = ({ onNext }: { onNext: () => void }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [preference, setPreference] = useState(1);

    return (
        <div id="basic-info-container">
            <div id="basic-info-left">
                <div className="input-container">
                    <label>First name</label>
                    <input 
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>

                <div className="input-container">
                    <label>Last name</label>
                    <input 
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>

                <div className="input-container">
                    <label>Email</label>
                    <input 
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="input-container">
                    <label>Phone number</label>
                    <input 
                        type="text"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                    />
                </div>
            </div>
            
            <div id="basic-info-right">
                <div className="radio-group">
                    <div className="input-container">
                        <label>ZIP Code</label>
                        <input 
                            type="text"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                        />
                    </div>
                    <p>Appointment preference:</p>
                    <label>
                        <input 
                            type="radio" 
                            name="appointment" 
                            value="1" 
                            checked={preference === 1} 
                            onChange={(e) => setPreference(Number(e.target.value))}
                        />
                        In-person
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="appointment" 
                            value="2" 
                            checked={preference === 2} 
                            onChange={(e) => setPreference(Number(e.target.value))}
                        />
                        Telehealth
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="appointment" 
                            value="3" 
                            checked={preference === 3} 
                            onChange={(e) => setPreference(Number(e.target.value))}
                        />
                        I don’t mind
                    </label>
                </div>
                <button className="action-btn" onClick={() => onNext()}>Continue</button>
            </div>
        </div>
    )
}

const HealthInfo = ({ updateAppState }: { updateAppState: () => void }) => {
    const [comments, setComments] = useState("");

    const concernsList = [
        "Mental health",
        "Sexual health",
        "Dental care",
        "Vision",
        "Chronic condition(s)",
        "Allergy",
        "Virus or Infection",
        "Urgent care",
        "Substance abuse",
        "I need help understanding"
    ];

    const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);

    const toggleConcern = (concern:string) => {
        setSelectedConcerns((prev) => (
            prev.includes(concern)
                ? prev.filter((item) => item !== concern) // Remove if already selected
                : [...prev, concern] // Add if not selected
        ));
    };

    return (
        <div id="health-info-container">
            <div id="health-info-left">
                <p>Areas of concern:</p>
                <div className="concerns-grid">
                    {concernsList.map((concern) => (
                        <button
                            key={concern}
                            className={`concern-btn ${selectedConcerns.includes(concern) ? "selected" : ""}`}
                            onClick={() => toggleConcern(concern)}
                        >
                            {concern}
                        </button>
                    ))}
                </div>
            </div>
            <div id="health-info-right">
                <p>Provide any additional comments on your selected health concerns:</p>
                <textarea
                    id="comments-input"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={6} 
                />

                <button className="action-btn" onClick={(() => updateAppState())}>Create Profile</button>
            </div>
        </div>
    )
}

export default Onboarding;