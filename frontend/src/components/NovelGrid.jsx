import NovelCard from "./NovelCard";

export default function NovelGrid({ items = [], showRank = false }) {
  return (
    <div className="grid">
      {items.map((n, i) => (
        <NovelCard key={n.id} item={n} rank={showRank ? i + 1 : null} />
      ))}
    </div>
  );
}
