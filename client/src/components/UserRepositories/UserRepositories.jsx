import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './UserRepositories.module.css';

const UserRepositories = ({ reposUrl }) => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!reposUrl) {
      setError('No repository URL provided.');
      setLoading(false);
      return;
    }

    const fetchRepositories = async () => {
      try {
        const response = await fetch(reposUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }
        const data = await response.json();
        setRepositories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, [reposUrl]);

  if (loading) return <div>Loading repositories...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!repositories.length) return <div>No repositories found.</div>;

  return (
    <div className={styles.repositories_container}>
      <div className={styles.repository_list}>
        {repositories.map(repo => (
          <Link
            key={repo.id}
            to={`/users/${repo.owner.login}/repo/${repo.name}`}
            state={{ repo }}
            className={styles.container}
          >
            <div className={styles.logo}>
              <img src={repo.owner.avatar_url} alt={repo.owner.login} />
            </div>
            <div className={styles.text_container}>
              <div className={styles.repo_name}>{repo.name}</div>
              <div className={styles.repo_description}>
                {repo.description || 'No description'}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserRepositories;
