import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import NoteCard from "../components/NoteCard";
import ReadCard from "../components/ReadCard";
import { useRef, useState, useEffect } from "react";
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
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${user._id}/notes`);
        if (!response.ok) throw new Error("Failed to fetch notes");

        const data = await response.json();
        console.log(data);
        setNotes(data.length ? data : []);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [user._id]);

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

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
  
    const options = { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    };
  
    const formattedDate = date.toLocaleDateString("en-US", options);

    const day = date.getDate();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";
  
    return formattedDate.replace(/(\d{1,2})/, `$1${suffix}`);
  };

  return (
    <>
      <div className="container">
        <div className="left-section">
          <div className="user-box">{user.name} {user.email}</div>
          <h2 className="feed-title">Feed.</h2>
          <div className="scrollable-container">
            {loading ? (
              <p>Loading notes...</p>
            ) : notes.length > 0 ? (
              notes.map((note) => (
                <NoteCard
                  key={note._id}
                  title={note.title}
                  date={formatDate(note.date)}
                  description={note.summary}
                />
              ))
            ) : (
              <p className="no-notes-para">No notes available.</p>
            )}
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