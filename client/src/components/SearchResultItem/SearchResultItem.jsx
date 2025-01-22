import React, { useState, useEffect }from 'react'
import styles from './SearchResultItem.module.css';

const SearchResultItem = () => {
  return (
    <div className={styles.container}>
        <div className={styles.logo}></div>
        <div className={styles.text_container}>
        <div className={styles.repo_name}>gitpod.io</div>
        <div className={styles.repo_subtitle}>One-click online IDE for GitHub</div>
        </div>

    </div>
  )
}

export default SearchResultItem