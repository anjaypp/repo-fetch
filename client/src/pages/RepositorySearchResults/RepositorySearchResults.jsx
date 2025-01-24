import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styles from './RepositorySearchResults.module.css';
import UserInfoCard from '../../components/UserInfoCard/UserInfoCard';
import UserRepositories from '../../components/UserRepositories/UserRepositories';

const RepositorySearchResults = () => {
  const location = useLocation();
  const { username } = useParams(); // Get the username from the URL params
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (location.state?.userData) {
          setUserData(location.state.userData);
        } else {
          // Fetch user data based on the username from the URL params
          const userResponse = await fetch(`http://localhost:4000/api/v1/users/${username}`);
          if (!userResponse.ok) {
            throw new Error('User not found');
          }
          const userData = await userResponse.json();
          setUserData(userData);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username, location.state]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <h1 className={styles.repository_search_title}>Search Result:</h1>
      <div className={styles.repository_search_results}>
        <UserInfoCard userData={userData} />
        <h1 className={styles.repository_search_title}>Repositories:</h1>
        <div className={styles.repository_list}>
          <UserRepositories reposUrl={userData.repos_url} />
        </div>
      </div>
    </>
  );
};

export default RepositorySearchResults;
