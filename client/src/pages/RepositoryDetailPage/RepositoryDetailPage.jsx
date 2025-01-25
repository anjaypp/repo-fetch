import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";
import styles from "./RepositoryDetail.module.css";

const RepositoryDetailPage = () => {
  const { owner, repo } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [repository, setRepository] = useState(location.state?.repo || null);
  const [loading, setLoading] = useState(!repository);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepositoryDetails = async () => {
      if (!repository) {
        try {
          const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch repository details");
          }
          const data = await response.json();
          setRepository(data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchRepositoryDetails();
  }, [owner, repo, repository]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  function goBack() {
    navigate(-1);
  }

  return (
    <div>
    <IoMdArrowBack className={styles.back_button} onClick={goBack} />
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.avatar_container}>
          <img
            className={styles.avatar}
            src={repository.owner.avatar_url}
            alt={repository.owner.login}
          />
           <p className={styles.verified}>
            <strong><MdVerified className={styles.verified_icon}/>Verified:</strong> {repository.private ? "No" : "Yes"}
          </p>
          <p className={styles.categories}>
            <strong>Categories:</strong>
            <div className={styles.topics}>
              {repository.topics && repository.topics.length > 0
                ? repository.topics.map((topic, index) => (
                    <span key={index} className={styles.topic}>
                      {topic}
                    </span>
                  ))
                : "None"}
            </div>
          </p>
        </div>
        <div className={styles.details}>
          <h1 className={styles.name}>{repository.name}</h1>
          <div className={styles.info}>
            <p className={styles.owner}>
              <strong>Owner:</strong> {repository.owner.login}
            </p>
          </div>
          <p className={styles.description}>
            <strong>Description:</strong>{" "}
            {repository.description || "No description provided"}
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default RepositoryDetailPage;
