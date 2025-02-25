import React, { useState } from "react";
import "../components/styles/ReadCard.css";

const EditModal = ({ initialTitle, onCancel, onSave }) => {
  const [newTitle, setNewTitle] = useState(initialTitle);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="edit-input"
        />
        <div className="modal-buttons">
          <button className="save-btn" onClick={() => onSave(newTitle)}>Save</button>
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const DeleteModal = ({ onCancel, onDelete }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>Are you sure you want to delete this note?<br />This action is irreversible.</p>
        <div className="modal-buttons">
          <button className="delete-btn" onClick={onDelete}>Delete</button>
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const ReadCard = ({ title, date, description }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);

  return (
    <div className="readcard-container">
      {showEditModal && (
        <EditModal
          initialTitle={currentTitle}
          onCancel={() => setShowEditModal(false)}
          onSave={(newTitle) => {
            setCurrentTitle(newTitle);
            setShowEditModal(false);
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          onCancel={() => setShowDeleteModal(false)}
          onDelete={() => {
            alert("Note has been deleted.");
            setShowDeleteModal(false);
          }}
        />
      )}

      <div className="icon-tray">
        <img src="./logo-edit.svg" alt="Edit" className="icon" onClick={() => setShowEditModal(true)} />
        <img src="./logo-delete.svg" alt="Delete" className="icon" onClick={() => setShowDeleteModal(true)} />
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
