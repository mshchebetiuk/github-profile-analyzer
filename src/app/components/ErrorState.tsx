type ErrorStateProps = {
  message: string;
};

export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <h2 className="text-lg font-semibold text-red-700">
        Unable to analyze profile
      </h2>

      <p className="mt-2 text-sm text-red-600">{message}</p>

      <p className="mt-2 text-sm text-gray-500">
        Check the GitHub user and try again.
      </p>
    </div>
  );
}
