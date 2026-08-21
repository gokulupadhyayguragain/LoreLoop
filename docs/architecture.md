# LoreLoop architecture notes

## Autonomous sequence

1. EventBridge Scheduler invokes `LoreLoopAgentFunction` with an `AUTONOMOUS_SCHEDULE` trigger.
2. The Lambda derives a deterministic run ID from the scheduler event ID when available and records `AGENT_RUN_STARTED`.
3. It loads `WORLD#MAIN / STATE` and the latest canon entities from DynamoDB.
4. A small local world analyzer selects development guidance based on generation count, recent entity types, and open mysteries.
5. Amazon Bedrock Nova returns strict JSON. Zod validates it; a single repair pass is allowed.
6. A second Bedrock call performs lightweight canon validation. A major conflict gets one correction-generation retry.
7. Stable Image Core artwork is attempted twice when enabled. Artwork failure marks the lore `PARTIAL` without losing successful text.
8. Lore is published to DynamoDB, the world state is updated, and the run is completed.
9. Structured logs and public activity entries leave evidence of each step.

## DynamoDB keys

The `LoreLoopWorld` table uses `PK` and `SK` plus `GSI1` for public activity and run queries.

```text
PK = WORLD#MAIN, SK = STATE
PK = WORLD#MAIN, SK = LORE#{timestamp}#{id}
PK = LORE#ID#{id}, SK = META
PK = RUN#{runId}, SK = META, GSI1PK = WORLD#MAIN, GSI1SK = RUN#{startedAt}#{runId}
PK = RUN#{runId}, SK = ACTIVITY#{timestamp}#{id}, GSI1PK = WORLD#MAIN, GSI1SK = ACTIVITY#{timestamp}#{id}
```

The S3 bucket is private. Artwork keys use `lore/YYYY/MM/DD/{loreId}.png`. A controlled delivery URL can be configured with `ARTWORK_URL_BASE`.

## IAM boundary

The agent can read and write its DynamoDB table, write objects to its artwork bucket, invoke Bedrock models, and emit CloudWatch logs. The API function only reads DynamoDB. The frontend has no AWS credentials.
