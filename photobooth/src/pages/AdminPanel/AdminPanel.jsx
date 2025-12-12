import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import styles from "./AdminPanel.module.css";

const API_URL = "https://photobooth-lx7n9.ondigitalocean.app";

export default function AdminPanel() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [photos, setPhotos] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [deletingPhotoId, setDeletingPhotoId] = useState(null);

  const [error, setError] = useState("");
  const [photoMessage, setPhotoMessage] = useState("");

  const navigate = useNavigate();

  // Toast helpers
  const notifySuccess = (msg) =>
    toast.success(msg, { position: "top-center", theme: "colored" });

  const notifyError = (msg) =>
    toast.error(msg, { position: "top-center", theme: "colored" });

  const notifyInfo = (msg) =>
    toast.info(msg, { position: "top-center", theme: "dark" });

  // HENT EVENTS
  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      setError("");
      try {
        const res = await fetch(`${API_URL}/events`);
        const data = await res.json();
        if (res.ok) {
          const eventsArray = data.data || data;
          setEvents(eventsArray);
        } else {
          const msg = data.message || "Kunne ikke hente events.";
          setError(msg);
          notifyError("❌ " + msg);
        }
      } catch (err) {
        console.error(err);
        setError("Netværksfejl ved hentning af events.");
        notifyError("❌ Netværksfejl ved hentning af events.");
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  // load photos when selectedEventId changes
  useEffect(() => {
    if (!selectedEventId) {
      setSelectedEvent(null);
      setPhotos([]);
      return;
    }

    const eventObj = events.find((e) => (e._id || e.id) === selectedEventId);
    if (!eventObj) {
      setSelectedEvent(null);
      setPhotos([]);
      return;
    }

    setSelectedEvent(eventObj);
    fetchPhotosForEvent(eventObj);
  }, [selectedEventId]);

  // Fetch photos for selected event
  const fetchPhotosForEvent = async (eventObj) => {
    setLoadingPhotos(true);
    setPhotoMessage("");
    setError("");

    try {
      const res = await fetch(
        `${API_URL}/photos?eventSlug=${encodeURIComponent(eventObj.slug)}`
      );
      const data = await res.json();

      if (res.ok) {
        const photosArray = data.data || data;
        // sort newest → oldest (if createdAt exists)
        const sorted = [...photosArray].sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setPhotos(sorted);
        if (sorted.length === 0) {
          const msg = "Ingen billeder for dette event endnu.";
          setPhotoMessage(msg);
          notifyInfo("ℹ️ " + msg);
        }
      } else {
        const msg = data.message || "Kunne ikke hente billeder.";
        setError(msg);
        setPhotos([]);
        notifyError("❌ " + msg);
      }
    } catch (err) {
      console.error(err);
      setError("Netværksfejl ved hentning af billeder.");
      setPhotos([]);
      notifyError("❌ Netværksfejl ved hentning af billeder.");
    } finally {
      setLoadingPhotos(false);
    }
  };

  // Delete photo
  const handleDeletePhoto = async (photoId) => {
    if (!selectedEvent) return;
    if (!window.confirm("Slet dette billede?")) return;

    setDeletingPhotoId(photoId);
    setError("");
    setPhotoMessage("");

    try {
      const formData = new FormData();
      formData.append("eventSlug", selectedEvent.slug);
      formData.append("eventId", selectedEvent._id || selectedEvent.id);

      const res = await fetch(`${API_URL}/photo/${photoId}`, {
        method: "DELETE",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        const msg = "Billede slettet.";
        setPhotoMessage(msg);
        notifySuccess("✅ " + msg);
        setPhotos((prev) => prev.filter((p) => (p._id || p.id) !== photoId));
      } else {
        const msg = data.message || "Kunne ikke slette billede.";
        setError(msg);
        notifyError("❌ " + msg);
      }
    } catch (err) {
      console.error(err);
      setError("Netværksfejl ved sletning af billede.");
      notifyError("❌ Netværksfejl ved sletning af billede.");
    } finally {
      setDeletingPhotoId(null);
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <h1 className={styles.heading}>🎄 Nissens Foto-Kontrolrum 📷</h1>

      {/* SELECT EVENT */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Vælg event</h2>

        {loadingEvents ? (
          <p className={styles.info}>Indlæser events…</p>
        ) : events.length === 0 ? (
          <p className={styles.info}>
            Ingen events fundet. Opret et event først.
          </p>
        ) : (
          <select
            className={styles.styledSelect}
            value={selectedEventId}
            onChange={(e) => {
              const id = e.target.value;
              setSelectedEventId(id);

              const eventObj = events.find((ev) => (ev._id || ev.id) === id);
              if (eventObj) {
                toast.info(`🎄 Event valgt: ${eventObj.title}`, {
                  position: "top-right",
                  theme: "colored",
                });
              }
            }}
          >
            <option value="">— Vælg et event —</option>
            {events.map((event) => {
              const id = event._id || event.id;
              return (
                <option key={id} value={id}>
                  {event.title} ({event.slug})
                </option>
              );
            })}
          </select>
        )}
      </section>

      {/* CAROUSEL BUTTON */}
      {selectedEvent && (
        <section className={styles.section}>
          <button
            className={styles.carouselBtn}
            onClick={() =>
              navigate(
                `/carousel?eventSlug=${encodeURIComponent(selectedEvent.slug)}`
              )
            }
          >
            🎁 Galleri: Hvem var uartig i år?
          </button>
        </section>
      )}

      {/* FEEDBACK */}
      {error && <p className={styles.error}>{error}</p>}
      {photoMessage && <p className={styles.success}>{photoMessage}</p>}

      {/* PHOTOS GRID – Billede nr + Oprettet + Slet billede */}
      {selectedEvent && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Billeder for: {selectedEvent.title}
          </h2>

          {loadingPhotos ? (
            <p className={styles.info}>Henter billeder…</p>
          ) : photos.length === 0 ? (
            <p className={styles.info}>Ingen billeder for dette event.</p>
          ) : (
            <div className={styles.photoGrid}>
              {photos.map((photo, index) => {
                const photoId = photo._id || photo.id;
                return (
                  <div key={photoId} className={styles.photoCard}>
                    <div className={styles.thumbWrapper}>
                      <img
                        src={photo.url}
                        alt={`Billede ${index + 1}`}
                        className={styles.photoThumb}
                      />
                      <div className={styles.photoOverlay}>
                        Billede nr: {index + 1}
                      </div>
                    </div>
                    {photo.createdAt && (
                      <p className={styles.photoMeta}>
                        Oprettet:{" "}
                        {new Date(photo.createdAt).toLocaleString("da-DK")}
                      </p>
                    )}
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeletePhoto(photoId)}
                      disabled={deletingPhotoId === photoId}
                    >
                      {deletingPhotoId === photoId
                        ? "Sletter…"
                        : "Slet billede"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
