import type { Source } from "../types/chat";

interface SourceListProps {
  sources: Source[];
}

export default function SourceList({ sources }: SourceListProps) {
  return (
    <div className="sources">
      <strong>Sources</strong>
      <ul>
        {sources.map((src, idx) => (
          <li key={idx}>
            {src.source} (pages {src.start_page}-{src.end_page})
          </li>
        ))}
      </ul>
    </div>
  );
}