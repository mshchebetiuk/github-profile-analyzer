"use client";

import { useState } from "react";
import { fetchGitHubProfile } from "@/services/githubService";

import type { GitHubRepository, GitHubUser } from "@/types/github";

export const useGitHubComparison = () => {
  const [compareUsername, setCompareUsername] = useState("");
  const [compareUser, setCompareUser] = useState<GitHubUser | null>(null);
  const [compareRepositories, setCompareRepositories] = useState<
    GitHubRepository[]
  >([]);

  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState("");

  const handleCompare = async () => {
    if (!compareUsername.trim()) {
      setCompareError("Please enter a GitHub username.");
      return;
    }

    try {
      setCompareLoading(true);
      setCompareError("");

      const data = await fetchGitHubProfile(compareUsername);

      setCompareUser(data.user);
      setCompareRepositories(data.repositories);
    } catch (error) {
      setCompareUser(null);
      setCompareRepositories([]);

      setCompareError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setCompareLoading(false);
    }
  };

  return {
    compareUsername,
    setCompareUsername,
    compareUser,
    compareRepositories,
    compareLoading,
    compareError,
    handleCompare,
  };
};
