# LoreLoop challenge evidence checklist

Capture these after deployment. Replace each placeholder with the real screenshot or URL.

## Screenshots

1. **Homepage** — LoreLoop title, Agent Online state, latest evolution, generation number, timestamp, and autonomous badge.
2. **Timeline** — at least three entries with different generated timestamps.
3. **Lore detail** — artwork, full lore, connections, world impact, run ID, and autonomous generation metadata.
4. **EventBridge Scheduler** — enabled schedule, `rate(15 minutes)` during evidence collection, and Lambda target.
5. **CloudWatch** — one complete run containing `AGENT_RUN_STARTED`, `WORLD_MEMORY_LOADED`, `LORE_GENERATED`, `CANON_VALIDATION_COMPLETE`, `ARTWORK_GENERATED` when enabled, `LORE_PUBLISHED`, and `AGENT_RUN_COMPLETED`.
6. **DynamoDB** — the state item plus multiple persisted lore records.
7. **Architecture page** — visible Scheduler → Lambda → Bedrock → DynamoDB/S3 flow.
8. **Agent activity page** — public run activity derived from stored records.

## Automatic-generation proof

- [ ] Stack deployed with an enabled scheduler.
- [ ] At least three generations occurred without a button or user prompt.
- [ ] Each generation has a unique run ID and timestamp.
- [ ] Later entries connect to or reference earlier canon where appropriate.
- [ ] World state generation count increases after each run.
- [ ] Artwork is stored in the private S3 bucket when image generation is enabled.
- [ ] Production schedule changed from `rate(15 minutes)` to `rate(3 hours)` after evidence collection.

## Submission links

```text
Live application: TODO
Public GitHub repository: TODO
Builder Center article: TODO
```

