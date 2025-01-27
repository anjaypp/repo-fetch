import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import styles from "./RepositorySearchResults.module.css";
import { IoMdArrowBack } from "react-icons/io";
import UserInfoCard from "../../components/UserInfoCard/UserInfoCard";
import UserRepositories from "../../components/UserRepositories/UserRepositories";

const RepositorySearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state?.userData) {
      setUserData(location.state.userData);
      setLoading(false);
    } else {
      const fetchUserData = async () => {
        try {
          const response = await fetch(
            `https://repo-fetch.onrender.com/api/v1/users/${username}`
          );
          if (!response.ok) {
            throw new Error("User not found");
          }
          const data = await response.json();
          setUserData(data); // Set the fetched user data
        } catch (err) {
          console.error("Error fetching user data:", err.message);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [username, location.state]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  function goBack() {
    navigate(-1);
  }

  return (
    <div className={styles.container}>
      <IoMdArrowBack className={styles.back_button} onClick={goBack} />
      <h1 className={styles.repository_search_title}>
        Search Result for {userData.username}:
      </h1>
      <div className={styles.repository_search_results}>
        <UserInfoCard userData={userData} />
        <h2 className={styles.repository_search_title}>Repositories:</h2>
        <div className={styles.repository_list}>
          <UserRepositories
            reposUrl={`https://api.github.com/users/${userData.username}/repos`}
          />
        </div>
      </div>
    </div>
  );
};

export default RepositorySearchResults;
