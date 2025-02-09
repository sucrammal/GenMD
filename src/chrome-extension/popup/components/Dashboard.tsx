import Header from "./Header";

interface DashboardProps {
    onChatClick: () => void;
    onInfoClick: () => void;
    onUploadClick: () => void;
  }
  
  const Dashboard: React.FC<DashboardProps> = ({ onChatClick, onInfoClick, onUploadClick }) => {
    return (
        <>
        <Header />
        <div id="dashboard-container">
            <div id="dashboard-left">
                <img src="https://i.imgur.com/c4KLnYO.png" alt="chat image" />
                <button className="action-btn" onClick={onChatClick}>Get Gene's help</button>
            </div>
            <div id="dashboard-right">
                <div id="info-container" onClick={onInfoClick}>
                    <p>My information</p>
                    <img src="https://i.imgur.com/vuvWhRi.png" alt="information image" />
                </div>
                <div id="upload-container" onClick={onUploadClick}>
                    <p>Upload documents</p>
                    <img src="https://i.imgur.com/hRnQzqO.png" alt="upload image" />
                </div>
            </div>
      </div>
        </>
    );
  };
  
export default Dashboard;