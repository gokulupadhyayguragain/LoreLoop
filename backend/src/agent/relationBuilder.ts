import type { LoreConnection, LoreEntity } from "../shared/types";

export function resolveConnections(
  connections: LoreConnection[],
  recentLore: LoreEntity[],
): LoreConnection[] {
  return connections.map((connection) => {
    const target = recentLore.find((item) => item.title.toLowerCase() === connection.targetTitle.toLowerCase());
    return { ...connection, targetId: target?.id };
  });
}

