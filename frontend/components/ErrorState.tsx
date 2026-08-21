export function ErrorState({ message }: { message: string }) {
  return <div className="error-state"><h3>The archive is quiet.</h3><p>{message}</p></div>;
}

