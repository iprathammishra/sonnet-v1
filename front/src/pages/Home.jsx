import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import NoteCard from "../components/NoteCard";
import ReadCard from "../components/ReadCard";
import { useRef, useState, useEffect } from "react";
import "../components/styles/Home.css";

const UploadModal = ({ file, onClose, onUpload, isLoading }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="up-title">Upload file</h2>
        <p className="filename">{file.name}</p>
        <div className="modal-buttons">
          <button
            className="process-btn"
            onClick={() => onUpload(file)}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Start Processing File"}
          </button>
          <button className="cancel-btn" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
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
  const [uploadLoading, setUploadLoading] = useState(false); 
  const [selectedNote, setSelectedNote] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`https://sonnet-backend-dep.onrender.com/api/users/${user._id}/notes`);
        if (!response.ok) throw new Error("Failed to fetch notes");

        const data = await response.json();
        setNotes(data.length ? data : []);
        if (data.length) setSelectedNote(data[0]);
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

  const handleUpload = async (file) => {
    if (!file) return;

    setUploadLoading(true); 

    const formData = new FormData();
    formData.append("file", file); 

    try {
      const response = await fetch("https://sonnet-backend-dep.onrender.com/api/gem/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to transcribe audio.");
      }

      const data = await response.json();
      const userId = JSON.parse(localStorage.getItem("user"))._id;

      const addNoteResponse = await fetch(`https://sonnet-backend-dep.onrender.com/api/users/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: file.name.replace(/\.[^/.]+$/, ""),
          summary: data.summary,
        }),
      });

      if (!addNoteResponse.ok) {
        throw new Error("Failed to save note in the database.");
      }
      navigate("/");
    } catch (error) {
      console.error("Error during transcription or note creation:", error);
      alert("Error processing the audio or saving the note. Please try again.");
    } finally {
      setUploadLoading(false); 
      setSelectedFile(null);
    }
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
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading notes...</p>
              </div>
            ) : notes.length > 0 ? (
              notes.map((note) => (
                <NoteCard
                  key={note._id}
                  title={note.title}
                  date={formatDate(note.date)}
                  description={note.summary}
                  onClick={() => {
                    setSelectedNote(note);
                  }}
                />
              ))
            ) : (
              <p className="no-notes-para">No notes available.</p>
            )}
          </div>
        </div>

        <div className="right-section">
          <button className="logout-button" onClick={handleLogout}>Logout</button>

          {selectedNote && (
            <ReadCard
              title={selectedNote.title}
              date={formatDate(selectedNote.date)}
              description={selectedNote.summary}
              noteId={selectedNote._id}
              userId={user._id}
            />
          )}

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

      {selectedFile && (
        <UploadModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onUpload={handleUpload}
          isLoading={uploadLoading}
        />
      )}
    </>
  );
};

export default Home;
