import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import NoteCard from "../components/NoteCard";
import ReadCard from "../components/ReadCard";
import { useRef, useState } from "react";
import "../components/styles/Home.css";

const UploadModal = ({ file, onClose, onUpload }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="up-title">Upload file</h2>
        <p className="filename">{file.name}</p>
        <div className="modal-buttons">
          <button className="process-btn" onClick={() => onUpload(file)}>
            Start Processing File
          </button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  function handleLogout() {
    googleLogout();
    localStorage.removeItem("user");
    console.log("Logout.");
    navigate("/");
  }

  const handleAddClick = () => {
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = (file) => {
    alert(`Processing: ${file.name}`);
    setSelectedFile(null); 
  };

  return (
    <>
      <div className="container">
        <div className="left-section">
          <div className="user-box">Pratham pratham.mishra@s.amity.edu</div>
          <h2 className="feed-title">Feed.</h2>
          <div className="scrollable-container">
            <NoteCard title="Artificial Intelligence" date="Aug 23rd, 2024" description="Text here..." />
            <NoteCard title="DBMS" date="Aug 23rd, 2024" description="Text here..." />
            <NoteCard title="Operating System" date="Aug 23rd, 2024" description="Text here..." />
            <NoteCard title="Artificial Intelligence" date="Aug 23rd, 2024" description="Text here..." />
          </div>
        </div>
        <div className="right-section">
          <button className="logout-button" onClick={handleLogout}>Logout</button>
          <ReadCard title="Artificial Intelligence" date="Aug 23rd, 2024" description="Long text here...." />

          <input
            type="file"
            accept="audio/*,video/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <button className="add-button" onClick={handleAddClick}>
            <img src="./logo-add.svg" alt="" />
          </button>
        </div>
      </div>

      {selectedFile && <UploadModal file={selectedFile} onClose={() => setSelectedFile(null)} onUpload={handleUpload} />}
    </>
  );
};

export default Home;

