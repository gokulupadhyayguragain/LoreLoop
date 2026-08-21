export function LoadingState({ count = 3 }: { count?: number }) {
  return <div className="loading-grid" aria-label="Loading archive"><span className="skeleton" /><span className="skeleton" /><span className="skeleton" />{count > 3 ? <span className="skeleton" /> : null}</div>;
}

