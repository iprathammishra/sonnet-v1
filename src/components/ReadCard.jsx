import React, { useState, useEffect } from "react";
import "../components/styles/ReadCard.css";

const EditModal = ({ initialTitle, noteId, userId, onCancel }) => {
  const [newTitle, setNewTitle] = useState(initialTitle);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}/notes/${noteId}/title`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTitle }),
        }
      );

      if (response.ok) {
        window.location.reload(); 
      } else {
        setError("Failed to update the title. Please try again.");
      }
    } catch (err) {
      setError("Error updating the title. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="edit-input"
        />
        {error && <p className="error-message">{error}</p>}
        <div className="modal-buttons">
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
          <button className="cancel-btn" onClick={onCancel} disabled={isLoading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteModal = ({ noteId, userId, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}/notes/${noteId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        window.location.reload(); 
      } else {
        setError("Failed to delete the note. Please try again.");
      }
    } catch (err) {
      setError("Error deleting the note. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>
          Are you sure you want to delete this note?
          <br />
          This action is irreversible.
        </p>
        {error && <p className="error-message">{error}</p>}
        <div className="modal-buttons">
          <button
            className="delete-btn"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
          <button
            className="cancel-btn"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};


const ReadCard = ({ title, date, description, noteId, userId }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);

  useEffect(() => {
    setCurrentTitle(title);
  }, [title]);

  return (
    <div className="readcard-container">
      {showEditModal && (
        <EditModal
          initialTitle={currentTitle}
          noteId={noteId}
          userId={userId}
          onCancel={() => setShowEditModal(false)}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          noteId={noteId}
          userId={userId}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      <div className="icon-tray">
        <img
          src="./logo-edit.svg"
          alt="Edit"
          className="icon"
          onClick={() => setShowEditModal(true)}
        />
        <img
          src="./logo-delete.svg"
          alt="Delete"
          className="icon"
          onClick={() => setShowDeleteModal(true)}
        />
      </div>

      <div className="title-date-container">
        <div className="title">{currentTitle}</div>
        <div className="date">{date}</div>
      </div>

      <hr className="hr-line" />

      <div className="description">{description}</div>
    </div>
  );
};

export default ReadCard;
