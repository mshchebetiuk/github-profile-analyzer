"use client";

import { useState, type FormEvent } from "react";
import { fetchGitHubProfile } from "@/services/githubService";

import type {
  GitHubRepository,
  GitHubUser,
  RepositoryQualityResult,
} from "@/types/github";

export const useGitHubProfile = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [repositoryQuality, setRepositoryQuality] = useState<
    RepositoryQualityResult[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username.trim()) {
      setError("Please enter a GitHub username.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      setUser(null);
      setRepositories([]);
      setTechnologies([]);
      setRepositoryQuality([]);

      const data = await fetchGitHubProfile(username);

      setUser(data.user);
      setRepositories(data.repositories);
      setTechnologies(data.technologies);
      setRepositoryQuality(data.repositoryQuality);
    } catch (error) {
      setUser(null);
      setRepositories([]);
      setTechnologies([]);
      setRepositoryQuality([]);

      setError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetProfile = () => {
    setUsername("");
    setUser(null);
    setRepositories([]);
    setTechnologies([]);
    setRepositoryQuality([]);
    setError("");
  };

  return {
    username,
    setUsername,
    user,
    repositories,
    technologies,
    repositoryQuality,
    loading,
    error,
    handleSubmit,
    resetProfile,
  };
};
