import Image from "next/image";

type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
};

type ProfileCardProps = {
  user: GitHubUser;
};

export default function ProfileCard({ user }: ProfileCardProps) {
  return (
    <div className="mt-10 rounded-xl borde border-gray-200 p-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <Image
          src={user.avatar_url}
          alt={user.login}
          width={112}
          height={112}
          className="rounded-full"
        />
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-2xl font-bold">{user.name ?? user.login}</h2>

          <p className="text-gray-500">@{user.login}</p>

          {user.bio && <p className="mt-3 text-gray-700">{user.bio}</p>}

          <div className="mt-5 flex flex-wrap justify-center gap-5 sm:justify-start">
            <div>
              <span className="font-bold">{user.public_repos}</span>{" "}
              Repositories
            </div>

            <div>
              <span className="font-bold">{user.followers}</span> Followers
            </div>

            <div>
              <span className="font-bold">{user.following}</span> Following
            </div>
          </div>

          <a
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-block font-medium underline"
          >
            Open GitHub profile
          </a>
        </div>
      </div>
    </div>
  );
}
