import { useState } from "react";

function WhisperTranscription() {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an audio file.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("audio", file);

    try {
      const response = await fetch("http://localhost:5000/api/hf/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.text) {
        setTranscription(data.text);
      } else {
        setTranscription("Failed to transcribe the audio.");
      }
    } catch (error) {
      setTranscription("Error: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Upload an Audio File for Transcription</h2>
      <input type="file" accept="audio/*,video/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing..." : "Transcribe"}
      </button>
      {transcription && (
        <div>
          <h3>Transcription:</h3>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
}

export default WhisperTranscription;
