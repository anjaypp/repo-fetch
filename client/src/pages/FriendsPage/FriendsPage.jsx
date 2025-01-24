import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
        const response = await fetch(`http://localhost:4000/api/v1/users/${username}/friends`, {
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        const data = await response.json();
        if (response.ok) {
          setFriends(data.friends);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error("Error fetching mutual friends:", error.message);
        setError("Error fetching mutual friends");
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [username]);

  const handleFriendClick = async (friendUsername) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/users/${friendUsername}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create user");
      }
  
      navigate(`/users/${friendUsername}`);
    } catch (error) {
      console.error("Error creating user:", error);
      setError("Error creating user");
    }
  };
  

  if (loading) return <div>Loading friends...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>{username}'s Mutual Followers</h2>
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
