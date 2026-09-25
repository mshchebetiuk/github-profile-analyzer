"use client";

import ProfileCard from "@/app/components/ProfileCard";
import Analytics from "@/app/components/Analytics";
import Technologies from "@/app/components/Technologies";
import LanguageStatistics from "@/app/components/LanguageStatistics";
import RepositoryInsights from "@/app/components/RepositoryInsights";
import RepositoryQuality from "@/app/components/RepositoryQuality";
import Activity from "@/app/components/Activity";
import BestProject from "@/app/components/BestProject";
import ProfileScore from "@/app/components/ProfileScore";
import Recommendations from "@/app/components/Recommendations";
import ProfileComparison from "@/app/components/ProfileComparison";
import Repositories from "@/app/components/Repositories";
import { useGitHubProfile } from "@/hooks/useGitHubProfile";
import { useGitHubComparison } from "@/hooks/useGitHubComparison";
import { useRepositoryFilters } from "@/hooks/useRepositoryFilters";
import { useGitHubAnalytics } from "@/hooks/useGitHubAnalytics";
import LoadingState from "@/app/components/LoadingState";
import ErrorState from "@/app/components/ErrorState";
import InitialState from "@/app/components/InitialState";
import TopRepositories from "@/app/components/TopRepositories";
import RepositoryHealth from "@/app/components/RepositoryHealth";

export default function Home() {
  const {
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
  } = useGitHubProfile();

  const {
    totalStars,
    totalForks,
    topLanguage,
    languagesCount,
    repositoriesWithReadme,
    readmePercentage,
    daysSinceLastActivity,
    recentlyActiveRepositories,
    activityStatus,
    profileScore,
    recommendations,
    bestRepository,
    bestRepositoryScore,
    bestRepositoryQuality,
    topRepositories,
    languageStatistics,
    repositoryInsights,
    repositoryHealth,
  } = useGitHubAnalytics({
    user,
    repositories,
    technologies,
    repositoryQuality,
  });

  const {
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
  } = useGitHubComparison({
    primaryRepositories: repositories,
    primaryFollowers: user?.followers ?? 0,
    primaryTotalStars: totalStars,
    primaryTotalForks: totalForks,
    primaryLanguagesCount: languagesCount,
  });

  const {
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
  } = useRepositoryFilters(repositories);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-5xl">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">GitHub Profile Analyzer</h1>

          <p className="mb-8 text-gray-600">
            Analyze GitHub profiles, repositories, technologies and activity.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter GitHub username..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />

            <button
              type="submit"
              disabled={!username.trim() || loading}
              className="rounded-lg bg-black px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>

            {(user || error) && (
              <button
                type="button"
                onClick={resetProfile}
                disabled={loading}
                className="rounded-xl border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear
              </button>
            )}
          </form>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={compareUsername}
              onChange={(event) => {
                setCompareUsername(event.target.value);
              }}
              placeholder="Compare with GitHub username..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />

            <button
              type="button"
              onClick={handleCompare}
              disabled={!compareUsername.trim() || compareLoading}
              className="rounded-lg border border-black px-6 py-3 font-medium disabled:cursor-not-allowed disabled:opacity-50"
            >
              {compareLoading ? "Comparing..." : "Compare"}
            </button>

            {compareError && (
              <p className="mt-4 text-center text-red-600">{compareError}</p>
            )}
          </div>
        </div>

        {!user && !loading && !error && <InitialState />}
        {error && <ErrorState message={error} />}
        {loading && <LoadingState />}

        {user && !loading && (
          <>
            <ProfileCard user={user} />

            <ProfileComparison
              user={user}
              compareUser={compareUser}
              repositoriesCount={repositories.length}
              compareRepositoriesCount={compareRepositories.length}
              totalStars={totalStars}
              compareTotalStars={compareTotalStars}
              totalForks={totalForks}
              compareTotalForks={compareTotalForks}
              languagesCount={languagesCount}
              compareLanguagesCount={compareLanguagesCount}
              primaryWins={primaryWins}
              compareWins={compareWins}
            />

            <Analytics
              totalStars={totalStars}
              totalForks={totalForks}
              topLanguage={topLanguage}
              languagesCount={languagesCount}
            />

            <Technologies technologies={technologies} />

            <LanguageStatistics statistics={languageStatistics} />

            <RepositoryInsights
              averageStars={repositoryInsights.averageStars}
              averageForks={repositoryInsights.averageForks}
              repositoriesWithoutDescription={
                repositoryInsights.repositoriesWithoutDescription
              }
              inactiveRepositories={repositoryInsights.inactiveRepositories}
            />

            <RepositoryHealth
              healthScore={repositoryHealth.healthScore}
              activeRepositories={repositoryHealth.activeRepositories}
              staleRepositories={repositoryHealth.staleRepositories}
              repositoriesWithoutReadme={
                repositoryHealth.repositoriesWithoutReadme
              }
              repositoriesWithoutDescription={
                repositoryHealth.repositoriesWithoutDescription
              }
            />

            <RepositoryQuality
              repositoriesWithReadme={repositoriesWithReadme}
              totalRepositories={repositoryQuality.length}
              readmePercentage={readmePercentage}
            />

            <Activity
              activityStatus={activityStatus}
              daysSinceLastActivity={daysSinceLastActivity}
              recentlyActiveRepositories={recentlyActiveRepositories}
            />

            <BestProject
              repository={bestRepository}
              score={bestRepositoryScore}
              hasReadme={bestRepositoryQuality?.hasReadme ?? false}
            />

            <TopRepositories repositories={topRepositories} />

            <ProfileScore score={profileScore} />

            <Recommendations recommendations={recommendations} />

            <Repositories
              repositories={repositories}
              filteredRepositories={filteredRepositories}
              displayedRepositories={displayedRepositories}
              availableLanguages={availableLanguages}
              repositorySearch={repositorySearch}
              languageFilter={languageFilter}
              sortBy={sortBy}
              hasMoreRepositories={hasMoreRepositories}
              visibleRepositories={visibleRepositories}
              onSearchChange={setRepositorySearch}
              onLanguageChange={setLanguageFilter}
              onSortChange={setSortBy}
              onReset={resetRepositoryFilters}
              onShowMore={showMoreRepositories}
              onShowLess={showLessRepositories}
            />
          </>
        )}
      </section>
    </main>
  );
}
