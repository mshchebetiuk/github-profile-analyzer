import type { GitHubUser } from "@/types/github";

type ProfileComparisonProps = {
  user: GitHubUser;
  compareUser: GitHubUser | null;

  repositoriesCount: number;
  compareRepositoriesCount: number;

  totalStars: number;
  compareTotalStars: number;

  totalForks: number;
  compareTotalForks: number;

  languagesCount: number;
  compareLanguagesCount: number;

  primaryWins: number;
  compareWins: number;
};

export default function ProfileComparison({
  user,
  compareUser,
  repositoriesCount,
  compareRepositoriesCount,
  totalStars,
  compareTotalStars,
  totalForks,
  compareTotalForks,
  languagesCount,
  compareLanguagesCount,
  primaryWins,
  compareWins,
}: ProfileComparisonProps) {
  if (!compareUser) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-5 text-2xl font-bold">Profile Comparison</h2>

      <div className="mb-5 rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-center gap-6 text-center">
          <div>
            <p className="font-medium">@{user.login}</p>
            <p className="mt-1 text-3xl font-bold">{primaryWins}</p>
          </div>

          <span className="text-xl text-gray-400">:</span>

          <div>
            <p className="font-medium">@{compareUser.login}</p>
            <p className="mt-1 text-3xl font-bold">{compareWins}</p>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          {primaryWins > compareWins
            ? `@${user.login} wins`
            : compareWins > primaryWins
              ? `@${compareUser.login} wins`
              : "Draw"}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <div className="grid grid-cols-3 border-b border-gray-200 p-4 font-bold">
          <span>Metric</span>
          <span className="text-center">@{user.login}</span>
          <span className="text-center">@{compareUser.login}</span>
        </div>

        <div className="grid grid-cols-3 border-b border-gray-200 p-4">
          <span>Repositories</span>

          <span className="text-center">
            {repositoriesCount}
            {repositoriesCount > compareRepositoriesCount && " ✓"}
          </span>

          <span className="text-center">
            {compareRepositoriesCount}
            {compareRepositoriesCount > repositoriesCount && " ✓"}
          </span>
        </div>

        <div className="grid grid-cols-3 border-b border-gray-200 p-4">
          <span>Followers</span>

          <span className="text-center">
            {user.followers}
            {user.followers > compareUser.followers && " ✓"}
          </span>

          <span className="text-center">
            {compareUser.followers}
            {compareUser.followers > user.followers && " ✓"}
          </span>
        </div>

        <div className="grid grid-cols-3 border-b border-gray-200 p-4">
          <span>Total Stars</span>

          <span className="text-center">
            {totalStars}
            {totalStars > compareTotalStars && " ✓"}
          </span>

          <span className="text-center">
            {compareTotalStars}
            {compareTotalStars > totalStars && " ✓"}
          </span>
        </div>

        <div className="grid grid-cols-3 border-b border-gray-200 p-4">
          <span>Total Forks</span>

          <span className="text-center">
            {totalForks}
            {totalForks > compareTotalForks && " ✓"}
          </span>

          <span className="text-center">
            {compareTotalForks}
            {compareTotalForks > totalForks && " ✓"}
          </span>
        </div>

        <div className="grid grid-cols-3 border-b border-gray-200 p-4">
          <span>Languages</span>

          <span className="text-center">
            {languagesCount}
            {languagesCount > compareLanguagesCount && " ✓"}
          </span>

          <span className="text-center">
            {compareLanguagesCount}
            {compareLanguagesCount > languagesCount && " ✓"}
          </span>
        </div>
      </div>
    </section>
  );
}
