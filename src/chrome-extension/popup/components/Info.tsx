import { useState, useEffect } from "react";

const Info = ({ onBackClick }: { onBackClick: () => void }) => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [preference, setPreference] = useState<number | null>(null);

  // Load data from content.js

  useEffect(() => {
    // Get data from chrome.storage when the component mounts
    chrome.storage.local.get(["userData"], (result) => {
      if (result !== undefined) {
        console.log("Received user data:", result.userData);
        setFirstname(result.userData.firstname || "");
        setLastname(result.userData.lastname || "");
        setEmail(result.userData.email || "");
        setNumber(result.userData.number || "");
        setZipCode(result.userData.zipCode || "");
        setPreference(result.userData.preference ?? null);
      }
    });
  }, []);

  return (
    <div id="info-view-container">
      <div id="basic-info-left">
        <p>Update information</p>
        <div className="input-container">
          <label>First name</label>
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </div>
        <div className="input-container">
          <label>Last name</label>
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
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
        <div className="input-container">
          <label>ZIP Code</label>
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
        </div>

        <div className="radio-group">
          <label>Appointment preference:</label>
          <label>
            <input
              type="radio"
              name="appointment"
              value="1"
              checked={preference === 1}
              onChange={() => setPreference(1)}
            />
            In-person
          </label>
          <label>
            <input
              type="radio"
              name="appointment"
              value="2"
              checked={preference === 2}
              onChange={() => setPreference(2)}
            />
            Telehealth
          </label>
          <label>
            <input
              type="radio"
              name="appointment"
              value="3"
              checked={preference === 3}
              onChange={() => setPreference(3)}
            />
            I don’t mind
          </label>
        </div>

        <button className="action-btn" onClick={() => onBackClick()}>
          Save changes
        </button>
      </div>
    </div>
  );
};

export default Info;
