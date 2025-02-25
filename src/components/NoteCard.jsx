import React from "react";
import "../components/styles/NoteCard.css";

const NoteCard = ({ title, date, description }) => {
  return (
    <div className="card">
      <h2 className="card-title">{title}</h2>
      <p className="card-date">{date}</p>
      <p className="card-description">{description}</p>
    </div>
  );
};

export default NoteCard;
