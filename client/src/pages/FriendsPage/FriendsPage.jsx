import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import styles from "./FriendsPage.module.css";

const FriendsPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(
          `https://repo-fetch.onrender.com/api/v1/users/${username}/friends`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch mutual friends");
        }
        const data = await response.json();
        setFriends(data.friends || []);
      } catch (error) {
        console.error("Error fetching mutual friends:", error.message);
        setError(error.message || "Error fetching mutual friends");
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [username]);

  const handleFriendClick = async (friendUsername) => {
    try {
      const response = await fetch(
        `https://repo-fetch.onrender.com/api/v1/users/${friendUsername}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch friend data");
      }

      const userData = await response.json();
      navigate(`/users/${friendUsername}`, { state: { userData } });
    } catch (error) {
      console.error("Error fetching friend data:", error.message);
      alert("Failed to fetch friend details. Please try again.");
    }
  };

  if (loading) return <div>Loading friends...</div>;
  if (error) return <div>Error: {error}</div>;

  function goBack() {
    navigate(-1);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header_container}>
        <IoMdArrowBack className={styles.back_button} onClick={goBack} />
        <h2 className={styles.pageHeading}>{username}'s Mutual Followers</h2>
      </div>
      {friends.length === 0 ? (
        <p>No mutual friends found.</p>
      ) : (
        friends.map((friend) => (
          <div
            key={friend.username}
            className={styles.friendCard}
            onClick={() => handleFriendClick(friend.username)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={friend.profilePicture}
              alt={`${friend.username}'s profile`}
              className={styles.profilePicture}
            />
            {friend.username}
          </div>
        ))
      )}
    </div>
  );
};

export default FriendsPage;
