import { useState } from "react";

interface UserData {
  firstname: string;
  lastname: string;
  email: string;
  number: string;
  zipCode: string;
  preference: number;
  concerns: string[];
  comments: string;
}

const Onboarding = ({ onStateUpdate }: { onStateUpdate: () => void }) => {
  const [screen, setScreen] = useState("start");
  const [userData, setUserData] = useState<UserData>({
    firstname: "",
    lastname: "",
    email: "",
    number: "",
    zipCode: "",
    preference: 1,
    concerns: [],
    comments: "",
  });

  const handleUserDataUpdate = (newData: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...newData }));
  };

  let renderedComponent;

  switch (screen) {
    case "start":
      renderedComponent = <StartScreen onNext={() => setScreen("basicInfo")} />;
      break;
    case "basicInfo":
      renderedComponent = (
        <BasicInfo
          userData={userData}
          onDataChange={handleUserDataUpdate}
          onNext={() => setScreen("healthInfo")}
        />
      );
      break;
    case "healthInfo":
      renderedComponent = (
        <HealthInfo
          userData={userData}
          onDataChange={handleUserDataUpdate}
          updateAppState={() => onStateUpdate()}
        />
      );
      break;
    default:
      return <StartScreen onNext={() => setScreen("basicInfo")} />;
  }

  return (
    <>
        { renderedComponent }
    </>
  );
};

const StartScreen = ({ onNext }: { onNext: () => void }) => {
  const largeLogo = "https://i.imgur.com/beh78fY.png";

  return (
    <div id="start-container">
      <img src={largeLogo} alt="gen md logo" id="logo-large" />
      <button className="action-btn" id="get-started-btn" onClick={onNext}>
        Get Started
      </button>
    </div>
  );
};

const BasicInfo = ({
  userData,
  onDataChange,
  onNext,
}: {
  userData: UserData;
  onDataChange: (newData: Partial<UserData>) => void;
  onNext: () => void;
}) => {
  const { firstname, lastname, email, number, zipCode, preference } = userData;

  return (
    <div id="basic-info-container">
      <div id="basic-info-left">
        <div className="input-container">
          <label>First name</label>
          <input
            type="text"
            value={firstname}
            onChange={(e) => onDataChange({ firstname: e.target.value })}
          />
        </div>

        <div className="input-container">
          <label>Last name</label>
          <input
            type="text"
            value={lastname}
            onChange={(e) => onDataChange({ lastname: e.target.value })}
          />
        </div>

        <div className="input-container">
          <label>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => onDataChange({ email: e.target.value })}
          />
        </div>

        <div className="input-container">
          <label>Phone number</label>
          <input
            type="text"
            value={number}
            onChange={(e) => onDataChange({ number: e.target.value })}
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
              onChange={(e) => onDataChange({ zipCode: e.target.value })}
            />
          </div>
          <p>Appointment preference:</p>
          <label>
            <input
              type="radio"
              name="appointment"
              value="1"
              checked={preference === 1}
              onChange={(e) =>
                onDataChange({ preference: Number(e.target.value) })
              }
            />
            In-person
          </label>
          <label>
            <input
              type="radio"
              name="appointment"
              value="2"
              checked={preference === 2}
              onChange={(e) =>
                onDataChange({ preference: Number(e.target.value) })
              }
            />
            Telehealth
          </label>
          <label>
            <input
              type="radio"
              name="appointment"
              value="3"
              checked={preference === 3}
              onChange={(e) =>
                onDataChange({ preference: Number(e.target.value) })
              }
            />
            I don’t mind
          </label>
        </div>
        <button className="action-btn" onClick={onNext}>
          Continue
        </button>
      </div>
    </div>
  );
};

const HealthInfo = ({
  userData,
  onDataChange,
  updateAppState,
}: {
  userData: UserData;
  onDataChange: (newData: Partial<UserData>) => void;
  updateAppState: () => void;
}) => {
  const { comments, concerns } = userData;

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
    "I need help understanding",
  ];

  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(concerns);

  const toggleConcern = (concern: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(concern)
        ? prev.filter((item) => item !== concern)
        : [...prev, concern]
    );
  };

  const handleSaveData = () => {
    console.log("User data saved:", userData);

    // Send a message to the content script to save the data in localStorage
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id!, {
        action: "saveUserData",
        userData: userData,
      });
    });

    // Send a message to the background script with the user data
    chrome.runtime.sendMessage(
      { action: "saveUserData", data: userData },
      (response) => {
        console.log("Response from background:", response);
      }
    );

    updateAppState();
  };

  return (
    <div id="health-info-container">
      <div id="health-info-left">
        <p>Areas of concern:</p>
        <div className="concerns-grid">
          {concernsList.map((concern) => (
            <button
              key={concern}
              className={`concern-btn ${
                selectedConcerns.includes(concern) ? "selected" : ""
              }`}
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
          onChange={(e) => onDataChange({ comments: e.target.value })}
          rows={6}
        />
        <button className="action-btn" onClick={handleSaveData}>
          Create Profile
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
