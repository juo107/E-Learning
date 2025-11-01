type Props = {
  topics: string[];
  onClick?: (t: string) => void;
};

export default function TopicChips({ topics, onClick }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {topics.map((t) => (
        <a
          key={t}
          href={`/search?q=${encodeURIComponent(t)}`}
          onClick={(e) => { if (onClick) { e.preventDefault(); onClick(t); } }}
          className="px-3 py-1 rounded-full border border-gray-300 dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
          role="button"
        >
          {t}
        </a>
      ))}
    </div>
  );
}









