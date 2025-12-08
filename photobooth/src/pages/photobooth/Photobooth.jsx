import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./photobooth.module.css";
import Webcam from "react-webcam";
import Baubles from "../../components/baubles/Baubles";
import Button from "../../components/button/Button";


/* IMPORT AF FILTERS */
import filter1 from "../../assets/Filter/filter1.png";
import filter2 from "../../assets/Filter/filter2.png";
import filter3 from "../../assets/Filter/filter3.png";
import filter4 from "../../assets/Filter/filter4.png";
import filter5 from "../../assets/Filter/filter5.png";
import filter6 from "../../assets/Filter/filter6.png";
import filter7 from "../../assets/Filter/filter7.png";
import filter8 from "../../assets/Filter/filter8.png";
import filter9 from "../../assets/Filter/filter9.png";
import filter10 from "../../assets/Filter/filter10.png";

const filters = [
    filter1,
    filter2,
    filter3,
    filter4,
    filter5,
    filter6,
    filter7,
    filter8,
    filter9,
    filter10,
]

export default function Photobooth() {
  /* bruger useParams() til at finde værdien af ID i URL */
  const { id } = useParams();
  /* useState hooks gemmer state der skal bruges til at opdatere UI */
  const [currentEvent, setCurrentEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);
  const [filterIndex, setFilterIndex] = useState(0)
  const timerRef = useRef(null);
  const [countdown, setCountdown] = useState(null);


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
    setCountdown(3);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timerRef.current);
          const imageSrc = webcamRef.current.getScreenshot();
          const img = new Image();
          img.src = imageSrc;

          const filter = new Image();
          filter.src = filters[filterIndex];

          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");

            ctx.drawImage(img, 0, 0, img.width, img.height);

            ctx.drawImage(filter, 0, 0, img.width, img.height);

            const finalImage = canvas.toDataURL("image/jpeg");

            setCapturedImage(finalImage);
          };

          return null;
        }

        return prev - 1;
      });
    }, 1000);
  };


  if (loading) {
    return (
      <div className={styles.photobooth}>
        <Baubles />
        <h1 className={styles.heading}>{`{Photo Booth}`}</h1>
        <div className={styles.photoArea}></div>
        <img
          src="images/photoboothDecor.png"
          alt="Christmas decoration"
          className={styles.decor}
        />
        <Button type="manageFilter" />
        <Button type="submit" />
        <div className={styles.loading}>Loading event...</div>
      </div>
    );
  }

  /* viser fejl hvis der er fejl */
  if (error || !currentEvent) {
    return (
      <div className={styles.photobooth}>
        <Baubles />
        <div className={styles.error}>{error || "Event not found"}</div>
      </div>
    );
  }

  /* hvis alt er gået godt indsættes dette i photobooth */
  return (
    <div className={styles.photobooth}>
      <Baubles />
      <h1 className={styles.heading}>{`{${currentEvent.title || "Event"}}`}</h1>
      <div className={styles.photoArea}>
        <Webcam
          audio={false}
          ref={webcamRef}
          mirrored={true}
          screenshotFormat="image/jpeg"
          className={styles.webcam}
        />
        <img
          src={filters[filterIndex]}
          alt={`Filter ${filterIndex}`}
          className={styles.filter}
        />
        {countdown && (
            <div className={styles.countdown}>{countdown}</div>
        )}
        {capturedImage && (
          <img src={capturedImage} alt="Captured" className={styles.preview} />
        )}
      </div>
      <img
        src="/images/photoboothDecor.png"
        alt="Christmas decoration"
        className={styles.decor}
      />
      <Button
        type="manageFilter"
        onClick1={() => {
          setFilterIndex((prev) => (prev + 1) % filters.length);
        }}
        onClick2={() => {
          setFilterIndex(
            (prev) => (prev - 1 + filters.length) % filters.length
          );
        }}
      />
      {!capturedImage && (
          <Button type="submit" onClick={capturePhoto} />
      )}

      {/* load slet eller send knapperne når der er et preview image */}
      {capturedImage && (
        <Button type="confirmOrDelete" />
      )}
    </div>
  );
}
