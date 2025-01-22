import React, { useState } from 'react';
import styles from './Homepage.module.css';

const HomePage = () => {
  return (
    <div id="homepage" className={styles.homepage}>
      <div className={styles.form_container}>
        <h1 className={styles.form_title}>Search GitHub User</h1>
        <form className={styles.form}>
          <label htmlFor="github-username" className={styles.form_label}>GitHub Username</label>
          <input
            id="github-username"
            type="text"
            className={styles.form_input}
            placeholder="Enter a GitHub username"
          />
          <button type="submit" className={styles.form_button}>Search</button>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
