<<<<<<< Updated upstream
=======
import React, { useEffect, useState } from "react";
import styles from "./AdminEvent.module.css";

const API_URL = "https://photobooth-lx7n9.ondigitalocean.app";

export default function AdminEvent() {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [newEvent, setNewEvent] = useState({
    title: "",
    slug: "",
    description: "",
    startsAt: "",
    endsAt: "",
    isPublic: true,
  });

  // Load all events
  useEffect(() => {
    fetchEvents();
  }, []);

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
        setError(data.message || "Kunne ikke hente events.");
      }
    } catch (err) {
      console.error(err);
      setError("Netværksfejl ved hentning af events.");
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEvent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // validation
    if (
      !newEvent.title.trim() ||
      !newEvent.slug.trim() ||
      !newEvent.description.trim() ||
      !newEvent.startsAt ||
      !newEvent.endsAt
    ) {
      setError("Alle felter (undtagen public) skal udfyldes.");
      return;
    }

    setFormLoading(true);
    try {
      const res = await fetch(`${API_URL}/event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess("Event oprettet succesfuldt!");
        setNewEvent({
          title: "",
          slug: "",
          description: "",
          startsAt: "",
          endsAt: "",
          isPublic: true,
        });
        fetchEvents(); // reload list
      } else {
        setError(data.message || "Kunne ikke oprette event.");
      }
    } catch (err) {
      console.error(err);
      setError("Netværksfejl ved oprettelse af event.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Er du sikker på, at du vil slette dette event?"))
      return;

    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/event/${id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSuccess("Event slettet.");
        // Remove locally without re-fetch, ellers fetchEvents()
        setEvents((prev) => prev.filter((e) => (e._id || e.id) !== id));
      } else {
        setError(data.message || "Kunne ikke slette event.");
      }
    } catch (err) {
      console.error(err);
      setError("Netværksfejl ved sletning af event.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Admin – Events</h1>

      {/* CREATE EVENT FORM */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Opret nyt event</h2>

        <form className={styles.form} onSubmit={handleCreateEvent}>
          <label className={styles.label}>
            Titel
            <input
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Julefrokost 2025"
            />
          </label>

          <label className={styles.label}>
            Slug
            <input
              type="text"
              name="slug"
              value={newEvent.slug}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="julefrokost-2025"
            />
          </label>

          <label className={styles.label}>
            Beskrivelse
            <textarea
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
              className={styles.textarea}
              placeholder="Fotobooth til skolens julefrokost"
            />
          </label>

          <div className={styles.row}>
            <label className={styles.label}>
              Start
              <input
                type="datetime-local"
                name="startsAt"
                value={newEvent.startsAt}
                onChange={handleInputChange}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
              Slut
              <input
                type="datetime-local"
                name="endsAt"
                value={newEvent.endsAt}
                onChange={handleInputChange}
                className={styles.input}
              />
            </label>
          </div>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="isPublic"
              checked={newEvent.isPublic}
              onChange={handleInputChange}
            />
            Offentlig event (vises på forsiden)
          </label>

          <button
            type="submit"
            className={styles.button}
            disabled={formLoading}
          >
            {formLoading ? "Opretter…" : "Opret event"}
          </button>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
        </form>
      </section>

      {/* EVENT LIST */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Eksisterende events</h2>

        {loadingEvents ? (
          <p className={styles.info}>Indlæser events…</p>
        ) : events.length === 0 ? (
          <p className={styles.info}>Ingen events oprettet endnu.</p>
        ) : (
          <ul className={styles.eventList}>
            {events.map((event) => {
              const id = event._id || event.id;
              return (
                <li key={id} className={styles.eventItem}>
                  <h3 className={styles.eventTitle}>{event.title}</h3>
                  <p className={styles.eventSlug}>
                    Slug: <code>{event.slug}</code>
                  </p>
                  <p className={styles.eventDesc}>{event.description}</p>
                  <p className={styles.eventDates}>
                    Start:{" "}
                    {event.startsAt
                      ? new Date(event.startsAt).toLocaleString("da-DK")
                      : "–"}
                    <br />
                    Slut:{" "}
                    {event.endsAt
                      ? new Date(event.endsAt).toLocaleString("da-DK")
                      : "–"}
                  </p>
                  <p className={styles.eventStatus}>
                    Status: {event.isPublic ? "Offentlig" : "Privat"}
                  </p>
                  <p className={styles.eventMeta}>
                    ID: <code>{id}</code>
                  </p>

                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteEvent(id)}
                  >
                    Slet event
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
>>>>>>> Stashed changes
