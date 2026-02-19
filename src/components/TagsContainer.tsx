export const TagsContainer = () => {
  return (
    <div className="flex items-center mt-18 justify-center gap-3">
      <span className="px-4 bg-neutral-800 text-preset-6 text-neutral-400 p-1 rounded-md">
        General
      </span>
      <span className="text-neutral-500">•</span>
      <span className="px-4 bg-neutral-800 text-preset-6 text-neutral-400 p-1 rounded-md">
        Hard
      </span>
      <span className="text-neutral-500">•</span>
      <span className="px-4 bg-neutral-800 text-preset-6 text-neutral-400 p-1 rounded-md">
        Timed (60s)
      </span>
    </div>
  );
};
