import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage/HomePage";
import RepositorySearchResults from "./pages/RepositorySearchResults/RepositorySearchResults";
import RepositoryDetailPage from "./pages/RepositoryDetailPage/RepositoryDetailPage";
import FriendsPage from "./pages/FriendsPage/FriendsPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page for searching users */}
        <Route path="/" element={<HomePage />} />

        {/* Route to see the results */}
        <Route path="/users/:username" element={<RepositorySearchResults />} />

        {/* Route to know more about a repository */}
        <Route path="/users/:username/repo/:reponame" element={<RepositoryDetailPage />} />

        {/* Route to see user's friends */}
        <Route path="/users/:username/friends" element={<FriendsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
