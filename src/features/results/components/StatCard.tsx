type StatCardProps = {
  label: string;
  value: React.ReactNode;
};

export const StatCard = ({ label, value }: StatCardProps) => {
  return (
    <div className="flex flex-col items-start justify-center w-full border border-neutral-700 rounded-xl p-6 py-3">
      <p className="text-xs text-neutral-400 text-preset-3-regular">{label}</p>

      <div className="mt-3 flex gap-2 items-center justify-center">{value}</div>
    </div>
  );
};
