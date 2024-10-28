import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");

  const handleToggle = () => {
    setIsMonitoring((isMonitoring) => {
      chrome.runtime.sendMessage({
        action: "toggleMonitoring",
        isMonitoring: !isMonitoring,
      });
      return !isMonitoring;
    });
  };

  useEffect(() => {
    // Clear the badge when the popup is opened
    chrome.action.setBadgeText({ text: "" });
  }, []);

  useEffect(() => {
    chrome.storage.sync.get(["isMonitoring", "redirectUrl"], (data) => {
      setIsMonitoring(data.isMonitoring || false);
      setRedirectUrl(data.redirectUrl || "");
    });
  }, []);

  return (
    <div style={{ color: "black" }}>
      <button onClick={handleToggle}>
        Monitoring: {isMonitoring ? "ON" : "OFF"}
      </button>
      {redirectUrl && <p>{redirectUrl}</p>}
    </div>
  );
}

export default App;
