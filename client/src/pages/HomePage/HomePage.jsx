import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState(''); // State to store error message
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error messages

    if (username.trim()) {
      try {
        // Changed to GET method as per backend route
        const response = await fetch(`http://localhost:4000/api/v1/users/${username}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('User not found or failed to fetch data'); // Handle errors properly
        }

        const userData = await response.json();
        // Pass userData to the next page (RepositorySearchResults)
        navigate(`/users/${username}`, { state: { userData } });
      } catch (error) {
        console.error('Error fetching user:', error);
        setError(error.message); // Set the error message to display to the user
      }
    } else {
      setError('Please enter a valid username'); // Handle empty username case
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
        {error && <p className={styles.error_message}>{error}</p>} {/* Display error message */}
      </div>
    </div>
  );
};

export default HomePage;
