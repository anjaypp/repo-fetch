import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const RepositoryDetailPage = () => {
  const { owner, repo } = useParams();
  const location = useLocation();
  const [repository, setRepository] = useState(location.state?.repo || null);
  const [loading, setLoading] = useState(!repository);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepositoryDetails = async () => {
      if (!repository) {
        try {
          const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
          if (!response.ok) {
            throw new Error('Failed to fetch repository details');
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{repository.name}</h1>
      <img src={repository.owner.avatar_url} alt={repository.owner.login} width="100" />
      <p><strong>Owner:</strong> {repository.owner.login}</p>
      <p><strong>Description:</strong> {repository.description || 'No description provided'}</p>
      <p><strong>Categories:</strong> {repository.topics.join(', ') || 'None'}</p>
      <p><strong>Verified:</strong> {repository.private ? 'No' : 'Yes'}</p>
    </div>
  );
};

export default RepositoryDetailPage;
