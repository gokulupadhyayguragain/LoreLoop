export function logEvent(event: string, details: Record<string, unknown> = {}): void {
  console.log(JSON.stringify({ event, timestamp: new Date().toISOString(), ...details }));
}

export function publicError(message: string): { message: string } {
  return { message };
}

