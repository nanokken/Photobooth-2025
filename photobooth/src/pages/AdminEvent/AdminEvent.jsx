import React, { useEffect, useState } from "react";
import styles from "./AdminEvent.module.css";

const API_URL = "https://photobooth-lx7n9.ondigitalocean.app";

export default function AdminEvent() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    startsAt: "",
    endsAt: "",
    isPublic: false,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/events`);
      const data = await res.json();
      setEvents(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch events");
    }
    setLoading(false);
  }

  async function handleCreateEvent(e) {
    e.preventDefault();

    // Basic validation
    if (
      !form.title ||
      !form.slug ||
      !form.description ||
      !form.startsAt ||
      !form.endsAt
    ) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to create event");
      }

      const newEvent = await res.json();
      setEvents([...events, newEvent]);
      setForm({
        title: "",
        slug: "",
        description: "",
        startsAt: "",
        endsAt: "",
        isPublic: false,
      });
      setError("");
    } catch (err) {
      setError("Failed to create event");
    }
  }

  async function handleDeleteEvent(id) {
    if (!window.confirm("Delete this event?")) return;

    try {
      const res = await fetch(`${API_URL}/event/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete event");
      }

      setEvents(events.filter((ev) => ev._id !== id));
      setError("");
    } catch (err) {
      setError("Delete failed");
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  return (
    <div className={styles.container}>
      <h1>Admin Event Page</h1>

      <form onSubmit={handleCreateEvent} className={styles.form}>
        <h2>Create New Event</h2>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />
        <input
          name="slug"
          placeholder="Slug"
          value={form.slug}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="startsAt"
          placeholder="Starts At (ISO)"
          value={form.startsAt}
          onChange={handleChange}
        />
        <input
          name="endsAt"
          placeholder="Ends At (ISO)"
          value={form.endsAt}
          onChange={handleChange}
        />
        <label>
          <input
            type="checkbox"
            name="isPublic"
            checked={form.isPublic}
            onChange={handleChange}
          />
          Public?
        </label>
        <button type="submit">Create Event</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Existing Events</h2>
      {loading ? (
        <p>Loading events...</p>
      ) : (
        <ul>
          {events.map((ev) => (
            <li key={ev._id}>
              <strong>{ev.title}</strong> — {ev.slug} <br />
              <em>
                {ev.startsAt} → {ev.endsAt}
              </em>
              <br />
              {ev.description}
              <br />
              <button onClick={() => handleDeleteEvent(ev._id)}>Delete</button>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
