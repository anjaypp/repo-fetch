import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";

const HomePage = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (username.trim()) {
      try {
        const response = await fetch(
          `https://repo-fetch.onrender.com/api/v1/users/${username}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

        if (!response.ok) {
          throw new Error("User not found or failed to fetch data");
        }

        const userData = await response.json();
        navigate(`/users/${username}`, { state: { userData } });
      } catch (error) {
        console.error("Error fetching user:", error);
        setError(error.message);
      }
    } else {
      setError("Please enter a valid username");
    }
  };

  return (
    <div className={styles.homepage}>
      <div className={styles.form_container}>
        <h1 className={styles.form_title}>Search GitHub User</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter GitHub username"
            className={styles.form_input}
          />
          <button type="submit" className={styles.form_button}>
            Search
          </button>
        </form>
        {error && <p className={styles.error_message}>{error}</p>}
      </div>
    </div>
  );
};

export default HomePage;
