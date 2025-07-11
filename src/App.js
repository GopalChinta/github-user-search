import React, { useState } from "react";
import "./App.css";

import SearchForm from "./components/SearchForm";
import UserProfile from "./components/UserProfile";
import Repositories from "./components/Repositories";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";

function App() {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchGitHubData = async () => {
    if (!username) return;
    setLoading(true);
    setError("");
    setProfile(null);
    setRepos([]);

    try {
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (!userRes.ok) throw new Error("User not found");
      const userData = await userRes.json();
      setProfile(userData);

      const repoRes = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100`
      );
      const repoData = await repoRes.json();

      const topRepos = repoData
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5);

      setRepos(topRepos);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="app">
      <h1>GitHub User Search</h1>
      <SearchForm
        username={username}
        setUsername={setUsername}
        onSearch={fetchGitHubData}
      />
      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {profile && <UserProfile profile={profile} />}
      {repos.length > 0 && <Repositories repos={repos} />}
    </div>
  );
}

export default App;

