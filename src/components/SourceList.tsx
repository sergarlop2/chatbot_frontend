import type { Source } from "../types/chat";

interface SourceListProps {
  sources: Source[];
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SourceList({ sources }: SourceListProps) {
  return (
    <div className="sources">
      <strong>Sources</strong>
      <ul>
        {sources.map((src, idx) => (
          <li key={idx}>
            <a
              href={`${API_URL}/${encodeURIComponent(src.source)}`}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              {src.source}
            </a>{" "}
            (pages {src.start_page}-{src.end_page})
          </li>
        ))}
      </ul>
    </div>
  );
}