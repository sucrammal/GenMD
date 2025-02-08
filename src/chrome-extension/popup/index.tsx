import "../global.css";

export const Popup = () => {
  
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


  return (
    <div className="text-5xl p-10 font-extrabold">
      <div>This is your popup.</div>
    </div>
  );
};
