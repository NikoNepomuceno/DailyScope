'use client';

interface BreakingTickerProps {
  headlines: string[];
}

export default function BreakingTicker({ headlines }: BreakingTickerProps) {
  if (headlines.length === 0) return null;

  return (
    <div className="breaking-ticker">
      <div className="breaking-header">
        <div className="breaking-label">
          <div className="live-indicator"></div>
          BREAKING
        </div>
      </div>
      <div className="breaking-content">
        {headlines.map((title, i) => (
          <span key={i} className="breaking-item">
            {title}
          </span>
        ))}
      </div>
    </div>
  );
}
