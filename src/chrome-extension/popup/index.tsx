import "../global.css";

export const Popup = () => {
  const handleClick = () => {
    if (chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage(
        { action: "queryOpenAI", prompt: "Hello, OpenAI!" },
        (response) => {
          if (response.success) {
            console.log("Response:", response.data);
          } else {
            console.error("Error:", response.error);
          }
        }
      );
    } else {
      console.error(
        "chrome.runtime or chrome.runtime.sendMessage is undefined"
      );
    }
  };

  const startAutofill = () => {
    if (chrome.tabs && chrome.tabs.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: "startAutofillAction",
          });
        }
      });
    } else {
      console.error("chrome.tabs or chrome.tabs.query is undefined");
    }
  };

  return (
    <div className="text-5xl p-10 font-extrabold">
      <div>This is your popup.</div>
      <button onClick={handleClick}>Send Message</button>
      <button onClick={startAutofill}>Start Autofill</button>
    </div>
  );
};
