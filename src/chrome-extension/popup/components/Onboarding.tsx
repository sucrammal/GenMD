import { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Onboarding = () => {
   const [screen, setScreen] = useState("healthInfo");

    switch(screen) {
        case 'start': return <StartScreen onNext={() => setScreen("basicInfo")} />;
            
        case 'basicInfo': return <BasicInfo onNext={() => setScreen("healthInfo")} />;
        
        case 'healthInfo': return <HealthInfo />;
            
        default: return <StartScreen onNext={() => setScreen("basicInfo")} />;
    }
}

const StartScreen = ({ onNext }: { onNext: () => void }) => (
    <div id="start-container">
       <img src="/assets/logo-large.png" alt="gen md logo" id="logo-large" />
       <button className="action-btn" id="get-started-btn" onClick={onNext}>Get Started</button>
    </div>
);

const BasicInfo = ({ onNext }: { onNext: () => void }) => {
    const [fullName, setFullName] = useState("");
    const [birthdate, setBirthdate] = useState<Date | null>(null);
    const [zipCode, setZipCode] = useState("");
    const [preference, setPreference] = useState(1);

    return (
        <div id="basic-info-container">
            <div id="basic-info-left">
                <div className="input-container">
                    <label>Full Name</label>
                    <input 
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>

                <div className="input-container">
                    <label>Birthdate:</label>
                        <DatePicker
                            selected={birthdate}
                            onChange={(date: Date | null) => setBirthdate(date)}
                            dateFormat="yyyy-MM-dd" // Customize date format
                            showYearDropdown // Allow selecting year from a dropdown
                            scrollableYearDropdown // Make year dropdown scrollable
                            maxDate={new Date()} // Prevent selecting future dates
                            className="custom-datepicker" // Add your own CSS
                        />
                </div>

                <div className="input-container">
                    <label>ZIP Code</label>
                    <input 
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                    />
                </div>
            </div>
            
            <div id="basic-info-right">
                <div className="radio-group">
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
                <button className="action-btn" onClick={onNext}>Continue</button>
            </div>
        </div>
    )
}

const HealthInfo = () => {
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

                <button className="action-btn" onClick={(() => console.log("todo"))}>Create Profile</button>
            </div>
        </div>
    )
}

export default Onboarding;