import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./PhotoCarousel.module.css";

const API_URL = "https://photobooth-lx7n9.ondigitalocean.app";

export default function PhotoCarousel() {
  const [searchParams] = useSearchParams();
  const eventSlug = searchParams.get("eventSlug");

  const [photos, setPhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confetti, setConfetti] = useState([]);
  const [liked, setLiked] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());

  useEffect(() => {
    const stored = localStorage.getItem("liked") === "true";
    setLiked(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("liked", liked);
  }, [liked]);

  const triggerConfetti = () => {
    // generate confetti
    const pieces = Array.from({ length: 60 }).map(() => ({
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random(),
      dx: (Math.random() - 0.5) * 320,
      dy: -(Math.random() * 260 + 120),
      delay: Math.random() * 0.3, // delay
      color: ["#ff0040", "#ffd700", "#00aaff", "#39ff14", "#ff7f00"][
        Math.floor(Math.random() * 5)
      ],
    }));

    setConfetti(pieces);

    setTimeout(() => setConfetti([]), 4500);
  };

  // FETCH PHOTOS
  const fetchPhotos = async () => {
    if (!eventSlug) {
      setError("Missing eventSlug in URL.");
      setLoading(false);
      return;
    }

    setError("");

    try {
      console.log("Carousel – fetching photos for:", eventSlug);

      const res = await fetch(
        `${API_URL}/photos?eventSlug=${encodeURIComponent(eventSlug)}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Could not load photos.");
        return;
      }

      // Extract photos array
      let photosArray = [];
      if (Array.isArray(data)) {
        photosArray = data;
      } else if (Array.isArray(data.data)) {
        photosArray = data.data;
      } else if (data.data && Array.isArray(data.data.photos)) {
        photosArray = data.data.photos;
      } else if (Array.isArray(data.photos)) {
        photosArray = data.photos;
      }

      if (!Array.isArray(photosArray)) {
        photosArray = [];
      }

      // Sort by creation date
      const sorted = [...photosArray].sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      // Check if we got new photos
      const hasNewPhotos = sorted.length > photos.length;

      setPhotos(sorted);
      setLastFetchTime(Date.now());

      // If we have new photos and we're at the end of the old list, show newest
      if (hasNewPhotos && currentIndex >= photos.length - 1) {
        setCurrentIndex(0); // Start with newest photo
      }

      // If it's the first load, start at random index
      if (loading && sorted.length > 0) {
        const startIndex = Math.floor(Math.random() * sorted.length);
        setCurrentIndex(startIndex);
      }
    } catch (err) {
      console.error("Carousel – network error:", err);
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPhotos();
  }, [eventSlug]);

  // Auto-refetch every 30 seconds to check for new photos
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Auto-refetching photos...");
      fetchPhotos();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [eventSlug, photos.length]);

  // AUTO SLIDE 5 sec
  useEffect(() => {
    if (photos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % photos.length;

        // If we've cycled through all photos, fetch new ones
        if (nextIndex === 0) {
          console.log("Completed full cycle, checking for new photos...");
          fetchPhotos();
        }

        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [photos]);

  if (loading) {
    return <div className={styles.message}>🎅 Henter billeder…</div>;
  }

  if (error) {
    return <div className={styles.message}>{error}</div>;
  }

  if (photos.length === 0) {
    return (
      <div className={styles.message}>
        Ingen billeder endnu 🎁
        <br />
        (Event: {eventSlug})
      </div>
    );
  }

  const currentPhoto = photos[currentIndex];
  const url = currentPhoto?.url;
  const toggleLike = async () => {
    const response = await fetch(
      `https://photobooth-lx7n9.ondigitalocean.app/photo/${currentPhoto._id}/like`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ likes: +1 }),
      }
    );

    const data = await response.json();
    console.log(data);
  };
  // confetti from gift)
  const confettiElements = confetti.map((piece) => (
    <div
      key={piece.id}
      className={styles.confetti}
      style={{
        "--dx": `${piece.dx}px`,
        "--dy": `${piece.dy}px`,
        animationDelay: `${piece.delay}s`,
        background: piece.color,
      }}
    />
  ));

  return (
    <div className={styles.carousel}>
      {/* css decor */}
      <div className={styles.topDecor} />
      <div
        className={styles.bottomDecor}
        onClick={triggerConfetti}
        title="Klik her 🎁"
      />

      {/* LIKE BUTTON */}
      <button
        className={`${styles.likeButton} ${liked ? styles.liked : ""}`}
        onClick={toggleLike}
      >
        {liked ? "❤️ Liked" : "🤍 Like"}
      </button>

      {/* Confetti */}
      {confettiElements}

      <h1 className={styles.overlayTop}>
        🎄 Julefrokost Slideshow – {eventSlug} 🎄
      </h1>

      <div className={styles.frame}>
        {url ? (
          <>
            <img
              src={url}
              alt={`Billede ${currentIndex + 1}`}
              className={styles.image}
            />
            <p className={styles.label}>Billede nr: {currentIndex + 1}</p>
          </>
        ) : (
          <p className={styles.debugText}>
            Mangler <code>photo.url</code> til den element
          </p>
        )}
      </div>

      <p className={styles.counter}>
        {currentIndex + 1} / {photos.length}
      </p>
    </div>
  );
}
