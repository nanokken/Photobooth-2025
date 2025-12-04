import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./photobooth.module.css";
import Webcam from "react-webcam";
import Baubles from "../../components/baubles/Baubles";

export default function Photobooth() {
  const { id } = useParams();
  const [currentEvent, setCurrentEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);

  useEffect(() => {
    if (id) {
      console.log("Fetching event with ID:", id);
      fetchEvent();
    } else {
      setError("No event selected");
      setLoading(false);
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      console.log(
        "Fetching from:",
        `https://photobooth-lx7n9.ondigitalocean.app/event/${id}`
      );

      const response = await fetch(
        `https://photobooth-lx7n9.ondigitalocean.app/event/${id}`
      );

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Full API response:", data);

      if (response.ok) {
        // Try different possible response structures
        const eventData = data.data || data.event || data;
        console.log("Extracted event data:", eventData);
        setCurrentEvent(eventData);
      } else {
        console.log("API Error:", data);
        setError(data.message || "Failed to load event");
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    console.log("Photo captured:", imageSrc);
  };

  if (loading) {
    return (
      <div className={styles.photobooth}>
        <Baubles />
        <div className={styles.loading}>Loading event...</div>
      </div>
    );
  }

  if (error || !currentEvent) {
    return (
      <div className={styles.photobooth}>
        <Baubles />
        <div className={styles.error}>{error || "Event not found"}</div>
      </div>
    );
  }

  return (
    <div className={styles.photobooth}>
      <Baubles />
      <h1 className={styles.heading}>{`{${currentEvent.title || "Event"}}`}</h1>
      <div className={styles.photoArea}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className={styles.webcam}
        />
      </div>
      <button className={styles.captureButton} onClick={capturePhoto}>
        📸 Tag et billede
      </button>

      {capturedImage && (
        <div className={styles.previewArea}>
          <h3>Dit billede:</h3>
          <img src={capturedImage} alt="Captured" className={styles.preview} />
        </div>
      )}
    </div>
  );
}
