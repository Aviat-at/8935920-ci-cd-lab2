import React, { useState, useEffect } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import "./App.css";

/*
  COMPLETE SINGLE-PAGE WEBSITE (WITHOUT TAILWIND)
  -----------------------------------------------
  - Sticky navbar at top
  - Hero section with background image + search
  - "Latest News" section (NewsAPI)
  - "About Us" section
  - Footer with social icons
  - Dark mode toggle (toggles 'dark' class on root container)
*/

function App() {
  // --------------------------
  // 1) State Hooks
  // --------------------------
  const [articles, setArticles] = useState([]);         // All fetched articles
  const [searchTerm, setSearchTerm] = useState("");     // Search input
  const [filteredArticles, setFilteredArticles] = useState([]); // Filtered articles
  const [darkMode, setDarkMode] = useState(false);      // Toggles dark mode
  const [loading, setLoading] = useState(true);         // Shows spinner during fetch
  const [error, setError] = useState(null);             // Error message

  // ------------------------------------------------
  // 2) NewsAPI Key & URL (Replace with your own key)
  // ------------------------------------------------
  const API_KEY = "74dd577c9ca646d4939e0f6c3baeeaf3"; // <-- Put your real NewsAPI key here
  const API_URL = `https://newsapi.org/v2/everything?q=latest&apiKey=${API_KEY}`;

  // --------------------------
  // 3) Fetch Articles on Mount
  // --------------------------
  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch news (HTTP ${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.articles && data.articles.length > 0) {
          setArticles(data.articles);
          setFilteredArticles(data.articles);
        } else {
          throw new Error("No news articles found.");
        }
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // --------------------------
  // 4) Filter Articles by Title
  // --------------------------
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter((article) =>
        article.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredArticles(filtered);
    }
  }, [searchTerm, articles]);

  // --------------------------
  // 5) Render the Complete Page
  // --------------------------
  return (
    // Toggle "dark" class to switch dark/light mode
    <div className={`App ${darkMode ? "dark" : ""}`}>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          NAVBAR (sticky)
         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <nav className="navbar">
        <div className="container navbar-content">
          {/* Logo / Branding */}
          <div className="branding">
            <img
              src="https://placehold.co/40x40?text=N"
              alt="Logo"
              className="logo"
            />
            <span className="brand-name">NewsApp</span>
          </div>
          {/* Nav Links (for demonstration) */}
          <ul className="nav-links">
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#news">Latest News</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
          </ul>
          {/* Dark Mode Toggle */}
          <Button variant="contained" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun className="icon" /> : <Moon className="icon" />}
          </Button>
        </div>
      </nav>

      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          HERO SECTION
         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <header id="home" className="hero-section">
        {/* Overlay to darken the background image */}
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <h1>Stay Informed, Stay Ahead</h1>
          <p>Explore the latest headlines from around the world.</p>
          {/* Hero Search */}
          <div className="hero-search">
            <TextField
              type="text"
              label="Search News"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
          </div>
        </div>
      </header>

      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          MAIN CONTENT
         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <main className="main-content container">
        {/* LATEST NEWS SECTION */}
        <section id="news" className="section">
          <h2>Latest News</h2>

          {/* Loading Spinner */}
          {loading && (
            <div className="loading-spinner">
              <CircularProgress />
            </div>
          )}

          {/* Error Message */}
          {error && <p className="error-message">{error}</p>}

          {/* News Cards Grid */}
          <div className="grid">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article, index) => (
                <motion.article
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="card"
                >
                  {/* Card Image
                     - You can adjust the height in App.css. 
                     - For example, .card-img { height: 200px; } 
                  */}
                  <motion.img
                    src={
                      article.urlToImage ||
                      "https://via.placeholder.com/400x200.png?text=No+Image"
                    }
                    alt={article.title}
                    className="card-img"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  {/* Card Body */}
                  <div className="card-body">
                    <h3>{article.title}</h3>
                    <p>
                      {article.description || "No description available."}
                    </p>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-link"
                    >
                      Read More →
                    </a>
                  </div>
                </motion.article>
              ))
            ) : (
              !loading && (
                <p className="no-articles">No news articles found.</p>
              )
            )}
          </div>
        </section>

        {/* ABOUT US SECTION */}
        <section id="about" className="section about-section">
          <h2>About Us</h2>
          <div className="about-content">
            <img
              src="https://placehold.co/400x200?text=Our+Team"
              alt="Our Team"
              className="about-img"
            />
            <div className="about-text">
              <p>
                We are a dedicated group of individuals who believe that
                staying informed is vital in today's fast-paced world. Our
                mission is to deliver the latest news headlines from reputable
                sources, giving you real-time insights into what's happening
                globally.
              </p>
              <p>
                From politics and technology to sports and entertainment, our
                platform is designed to be your one-stop resource for daily
                happenings. Our team curates news articles to provide a
                comprehensive view of events from around the globe.
              </p>
              <Button variant="outlined">Learn More</Button>
            </div>
          </div>
        </section>
      </main>

      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          FOOTER
         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <footer className="footer">
        <div className="container footer-content">
          <span className="footer-brand">
            NewsApp &copy; {new Date().getFullYear()} - All Rights Reserved
          </span>
          <div className="footer-social">
            <a href="#twitter" aria-label="Twitter">
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                className="social-icon"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M22.46 6..."></path>
              </svg>
            </a>
            <a href="#facebook" aria-label="Facebook">
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                className="social-icon"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18 2h-3c-2.21 0-4..."></path>
              </svg>
            </a>
            <a href="#instagram" aria-label="Instagram">
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                className="social-icon"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2.2c3.2 0..."></path>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
