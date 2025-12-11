import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./photobooth.module.css";
import Webcam from "react-webcam";
import Baubles from "../../components/baubles/Baubles";
import StartBtn from "../../components/button/StartBtn";
import SendOrDelBtn from "../../components/button/SendOrDelBtn";


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
import filter11 from "../../assets/Filter/filter11.png";
import filter12 from "../../assets/Filter/filter12.png";
import filter13 from "../../assets/filter/filter13.png";
import filter14 from "../../assets/Filter/filter14.png";
import filter15 from "../../assets/Filter/filter15.png";
import filter16 from "../../assets/Filter/filter16.png";
import filter17 from "../../assets/Filter/filter17.png";
import filter18 from "../../assets/Filter/filter18.png";
import PrevBtn from "../../components/button/PrevBtn";
import NextBtn from "../../components/button/NextBtn";

/* henter filtre ned i et array */
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
    filter11,
    filter12,
    filter13,
    filter14,
    filter15,
    filter16,
    filter17,
    filter18,
]

export default function Photobooth() {
  /* bruger useParams() til at finde værdien af ID i URL */
  const { id } = useParams();
  /* useState hooks gemmer state der skal bruges til at opdatere UI */
  const [currentEvent, setCurrentEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [filterIndex, setFilterIndex] = useState(0)
  const [countdown, setCountdown] = useState(null);

  /* useref hooks gemmer data eller domreferencer uden at re-render siden */
  const webcamRef = useRef(null);
  const timerRef = useRef(null);


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
          /* henter billedet fra webcam */
          const imageSrc = webcamRef.current.getScreenshot();
          /* Image() laver et html billede element  */
          const img = new Image();
          /* sætter src af billede elementet til at være webcambilledet */
          img.src = imageSrc;

          /* opretter img element til filteret  */
          const filter = new Image();
          /* sætter filter src til at være det samme filter som der er over webcam */
          filter.src = filters[filterIndex];

          img.onload = () => {
            /* laver nyt element "canvas" */
            const canvas = document.createElement("canvas");
            /* erklærer canvas dimensioner 60vw virker ikke i JS kode så laver variabel for det*/
            const vw = window.innerWidth 
            canvas.width = vw * 0.6;
            canvas.height = (vw * 0.6) * 9 / 16;
            
            /* tegner billede og filter på canvas */
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, vw * 0.6, (vw * 0.6 * 9) / 16);
            ctx.drawImage(filter, 0, 0, (vw * 0.6), (vw * 0.6) * 9 / 16);

            /* returnere billede som dataURL (en streng der indeholder billedet) */
            const finalImage = canvas.toDataURL("image/jpeg");

            setCapturedImage(finalImage);

          };

          return null;
        }

        return prev - 1;
      });
    }, 1000);

  };

  /* CLICK EVENT TIL DELETE KNAP */
  const deletePreview = () => {

    /* fjerner potentielle image or countdown */
    setCapturedImage(null)
    setCountdown(null)

  }

  /* CLICK EVENT TIL CONFIRM KNAP */
  const confirmPreview = async () => {
    /* react webcam giver base64 data-URL, men backend forventer en fil, så strengen konverteres til blob "Binary large object" før den sendes til API - tldr: base64-billede => normal billedefil */
    const blob = await (await fetch(capturedImage)).blob();

    /* opretter formData */
    const formData = new FormData()
    /* tilføjer felter til formDtaa */
    formData.append("file", blob, "photo.jpg")
    formData.append("eventSlug", currentEvent.slug)
    formData.append("eventId", currentEvent._id)
    formData.append("isApproved", true)

    try {
      const uploadResponse = await fetch(
        `https://photobooth-lx7n9.ondigitalocean.app/photo`,
        {
          method: "POST",
          body: formData
        });

        const uploadData = await uploadResponse.json()

        if (!uploadResponse.ok) {
          console.error("Upload fejlede", uploadData)
          return;
        }

          console.log("Image uploaded successfully:", uploadData)

          const photoId = uploadData.data._id

          if (!photoId) {
            console.error("Kunne ikke finde id for billedet", error)
            return;
          }

          const patchResponse = await fetch(
            `https://photobooth-lx7n9.ondigitalocean.app/photo/${photoId}`,
            {
              method: "PATCH", 
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                isApproved: true
              })
            }
          );

          const patchData = await patchResponse.json()

          if(!patchResponse.ok) {
            console.error("PATCH fejlede:", patchData)
            return;
          }

          console.log("Photo approved successfully:", patchData)
      
          setCapturedImage(null)
    

    } catch (error) {
      console.error("fejl i at sende til API: ", error)
    }

  }

  /* viser indhold hvis eventet er ved at blive hentet */
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
      <div className={styles.contentContainer}>
        
        <h1 className={styles.heading}>{`{${currentEvent.title || "Event"}}`}</h1>
        <div className={styles.photoAreaContainer}>
          {!capturedImage && !countdown && (
            <PrevBtn
              onClick={() => {
                setFilterIndex((prev) => (prev - 1 + filters.length) % filters.length);
              }}
            />
          )}
          <div className={styles.photoArea}>
            {/* fjerner webcamkomponent hvis der er er et preview image */}
            {!capturedImage && (
              <Webcam
                audio={false}
                ref={webcamRef}
                mirrored={true}
                screenshotFormat="image/jpeg"
                className={styles.webcam}
              />
            )}
            {/* filter-billedet */}
            <img
              src={filters[filterIndex]}
              alt={`Filter ${filterIndex}`}
              className={styles.filter}
            />
            {/* viser countdown hvis countdown ikke er null eller false */}
            {countdown && <div className={styles.countdown}>{countdown}</div>}
            {/* hvis der er et preview image skal det vises */}
            {capturedImage && (
              <img
                src={capturedImage}
                alt="Captured"
                className={styles.preview}
              />
            )}
            {/* dekorationen i venstre øvre hjørne af webcammet */}
            <img
              src="/images/photoboothDecor.png"
              alt="Christmas decoration"
              className={styles.decor}
            />
          </div>
          {!capturedImage && !countdown && (
            <NextBtn onClick={() => {
              setFilterIndex((prev) => (prev + 1) % filters.length)
            }}/>
          )}
        </div>
        {/* load knappen til at tage billede når der ikke er preview image */}
        {!capturedImage && <StartBtn onClick={capturePhoto} />}
  
        {/* load slet eller send knapperne når der er et preview image */}
        {capturedImage && (
          <SendOrDelBtn onClick1={confirmPreview} onClick2={deletePreview} />
        )}
      </div>
      </div>
  );
}
