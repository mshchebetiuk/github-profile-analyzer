"use client";

import { useState } from "react";

import { fetchGitHubProfile } from "@/services/githubService";
import { calculateProfileComparison } from "@/utils/githubAnalytics";

import type { GitHubRepository, GitHubUser } from "@/types/github";

type UseGitHubComparisonParams = {
  primaryRepositories: GitHubRepository[];
  primaryFollowers: number;
  primaryTotalStars: number;
  primaryTotalForks: number;
  primaryLanguagesCount: number;
};

export const useGitHubComparison = ({
  primaryRepositories,
  primaryFollowers,
  primaryTotalStars,
  primaryTotalForks,
  primaryLanguagesCount,
}: UseGitHubComparisonParams) => {
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

  const {
    compareTotalStars,
    compareTotalForks,
    compareLanguagesCount,
    primaryWins,
    compareWins,
  } = calculateProfileComparison({
    primaryRepositories,
    compareRepositories,
    primaryFollowers,
    compareFollowers: compareUser?.followers ?? 0,
    primaryTotalStars,
    primaryTotalForks,
    primaryLanguagesCount,
  });

  return {
    compareUsername,
    setCompareUsername,
    compareUser,
    compareRepositories,
    compareLoading,
    compareError,
    handleCompare,
    compareTotalStars,
    compareTotalForks,
    compareLanguagesCount,
    primaryWins,
    compareWins,
  };
};
