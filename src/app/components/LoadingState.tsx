export default function LoadingState() {
  return (
    <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-gray-200 p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

      <p className="mt-4 font-medium">Anaylyzing GitHub profile...</p>

      <p className="mt-1 text-sm text-gray-500">
        Loading repositories, technologies and statistics.
      </p>
    </div>
  );
}
