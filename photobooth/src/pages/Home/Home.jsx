import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import Baubles from "../../components/baubles/Baubles";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        "https://photobooth-lx7n9.ondigitalocean.app/events"
      );
      const data = await response.json();

      console.log("API Response:", data);
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (response.ok) {
        // Check if data is nested in a 'data' property
        const eventsArray = data.data || data;
        console.log("Events array:", eventsArray);
        setEvents(eventsArray);
      } else {
        setError("Failed to load events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEventSelect = (id) => {
    // Navigate to photobooth with selected event
    navigate(`/photobooth/${id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("da-DK", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.container}>
      <Baubles />
    
      <div className={styles.contentContainer}>
        <h1 className={styles.header}>&#123; Photobooth &#125;</h1>
  
        <div className={styles.eventsSection}>
          <h2>Vælg et event</h2>
  
          {loading && <p>Loading events...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
  
          {events.length > 0 && (
            <div className={styles.eventsList}>
              <p>Found {events.length} events</p>
              {events
                .filter((event) => event.isPublic)
                .map((event) => (
                  <div key={event.slug} className={styles.eventCard}>
                    <h3>{event.title}</h3>
                    <p className={styles.description}>{event.description}</p>
                    <p className={styles.dateTime}>
                      <strong>Start:</strong> {formatDate(event.startsAt)}
                    </p>
                    <p className={styles.dateTime}>
                      <strong>Slut:</strong> {formatDate(event.endsAt)}
                    </p>
                    <button
                      className={styles.selectButton}
                      onClick={() => handleEventSelect(event._id)}
                    >
                      Vælg dette event
                    </button>
                  </div>
                ))}
            </div>
          )}
  
          {events.length === 0 && !loading && !error && (
            <p>Ingen events tilgængelige</p>
          )}
        </div>
      </div>
    </div>
  );
}
