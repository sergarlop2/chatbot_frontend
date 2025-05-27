import type { Source } from "../types/chat";

interface SourceListProps {
  sources: Source[];
}

export default function SourceList({ sources }: SourceListProps) {
  return (
    <div className="sources">
      <h4>Sources:</h4>
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