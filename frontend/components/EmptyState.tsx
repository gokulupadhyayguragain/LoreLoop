export function EmptyState({ title = "The world has not begun yet.", message = "LoreLoop is waiting for its first autonomous awakening." }: { title?: string; message?: string }) {
  return <div className="empty-state"><h3>{title}</h3><p>{message}</p></div>;
}

