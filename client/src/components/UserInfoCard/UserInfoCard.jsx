import React from "react";
import { Link } from "react-router-dom";
import styles from "./UserInfoCard.module.css";

const UserInfoCard = ({ userData }) => {
  if (!userData) return null;

  return (
    <div className={styles.user_info}>
      <div className={styles.user_avatar}>
        <img src={userData.avatar_url} alt={`${userData.name}'s avatar`} />
      </div>
      <div className={styles.user_details}>
        <h2>{userData.name}</h2>
        <p>{userData.username}</p>
        <p>{userData.location}</p>
        <p>{userData.bio}</p>
        <div className={styles.user_stats}>
          <span>Followers: {userData.followers}</span>
          <span>Following: {userData.following}</span>
          <span>Public Repos: {userData.public_repos}</span>
          <Link
            to={`/users/${userData.username}/friends`}
            className={styles.view_friends_button}
          >
            View Friends
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
