"use client";

import { useState } from "react";

import {
  filterAndSortRepositories,
  getAvailableLanguages,
} from "@/utils/repositoryFilters";
import { paginateRepositories } from "@/utils/repositoryPagination";

import type { GitHubRepository, RepositorySort } from "@/types/github";

export const useRepositoryFilters = (repositories: GitHubRepository[]) => {
  const [repositorySearch, setRepositorySearch] = useState("");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [sortBy, setSortBy] = useState<RepositorySort>("updated");
  const [visibleRepositories, setVisibleRepositories] = useState(6);

  const availableLanguages = getAvailableLanguages(repositories);
  const filteredRepositories = filterAndSortRepositories({
    repositories,
    search: repositorySearch,
    language: languageFilter,
    sortBy,
  });

  const { displayedRepositories, hasMoreRepositories } = paginateRepositories({
    repositories: filteredRepositories,
    visibleCount: visibleRepositories,
  });

  const resetRepositoryFilters = () => {
    setRepositorySearch("");
    setLanguageFilter("All");
    setSortBy("updated");
    setVisibleRepositories(6);
  };

  const showMoreRepositories = () => {
    setVisibleRepositories((current) => current + 6);
  };

  const showLessRepositories = () => {
    setVisibleRepositories(6);
  };

  return {
    repositorySearch,
    setRepositorySearch,
    languageFilter,
    setLanguageFilter,
    sortBy,
    setSortBy,
    visibleRepositories,
    availableLanguages,
    filteredRepositories,
    displayedRepositories,
    hasMoreRepositories,
    resetRepositoryFilters,
    showMoreRepositories,
    showLessRepositories,
  };
};
